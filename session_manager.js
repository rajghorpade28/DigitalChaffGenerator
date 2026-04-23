import { PersonaEngine } from './persona_engine.js';
import { SiteSelector } from './site_selector.js';
import { MetricsEngine } from './metrics_engine.js';
import { TaskStateManager } from './task_state_manager.js';

export const SessionManager = {
    activeTabId:   null,
    sessionTimer:  null,
    _startPending: false,
    _currentUrl:   null,   // track which URL is open so we can blacklist it on failure
    _currentCat:   null,   // track persona category for fallback URL selection

    async init() {
        // Load the persistent dead-URL list before anything else
        await SiteSelector.loadDeadUrls();

        // ── Close state if user manually closes the noise tab ─────────────
        chrome.tabs.onRemoved.addListener((tabId) => {
            if (tabId === this.activeTabId) {
                console.log('[DCG] Noise tab closed externally — clearing state.');
                this._clearTimer();
                this.activeTabId = null;
                this._currentUrl = null;
            }
        });

        // ── SIMULATION_DONE: close tab as soon as scrolling finishes ─────
        chrome.runtime.onMessage.addListener((msg, sender) => {
            if (msg.type === 'SIMULATION_DONE' && sender.tab?.id === this.activeTabId) {
                console.log(`[DCG] Simulation done in tab ${sender.tab.id} — closing.`);
                // 1 s grace so the final scroll animation completes
                setTimeout(() => this.endSession(), 1000);
            }
        });
    },

    // ── Start a new noise session ─────────────────────────────────────────
    async startSession() {
        if (this._startPending) return;

        // Close existing noise tab first
        if (this.activeTabId) {
            await this.endSession();
            await new Promise(r => setTimeout(r, 600));
        }

        this._startPending = true;
        try {
            const category = await PersonaEngine.getNextCategory();
            this._currentCat = category;
            const url = SiteSelector.getSiteForCategory(category);
            await TaskStateManager.set('OPENING', { category, url });
            await this._openTab(url, category, /* isFallback */ false);
        } finally {
            this._startPending = false;
        }
    },

    // ── Open a single noise tab ──────────────────────────────────────────
    async _openTab(url, category, isFallback) {
        console.log(`[DCG] Opening noise tab — persona: ${category} | fallback: ${isFallback} | url: ${url}`);
        this._currentUrl = url;

        const tab = await chrome.tabs.create({ url, active: false });
        this.activeTabId = tab.id;

        let loaded = false;

        const listener = (tabId, info) => {
            if (tabId === this.activeTabId && info.status === 'complete') {
                loaded = true;
                chrome.tabs.onUpdated.removeListener(listener);
                this._onTabLoaded(tabId, category, isFallback);
            }
        };
        chrome.tabs.onUpdated.addListener(listener);

        // 12-second hard timeout for loading the tab
        setTimeout(async () => {
            if (!loaded && this.activeTabId === tab.id) {
                console.warn(`[DCG] Tab ${tab.id} took too long to load (${url}). Closing and retrying instantly.`);
                chrome.tabs.onUpdated.removeListener(listener);
                SiteSelector.markAsDead(url);
                await this.endSession();
                
                // Immediately start a new session since this one failed to launch
                setTimeout(() => this.startSession(), 500);
            }
        }, 12000);
    },

    // ── Inject scripts once the tab has fully loaded ─────────────────────
    async _onTabLoaded(tabId, category, isFallback) {
        if (tabId !== this.activeTabId) return;  // already closed/replaced

        try {
            const resolve = (name) => {
                const manifest = chrome.runtime.getManifest();
                const isDist   = manifest.background?.service_worker?.includes('.bundle.js');
                return isDist
                    ? name.replace('.js', '.bundle.js').replace('content_script', 'content')
                    : name;
            };

            await TaskStateManager.set('INJECTING', { url: this._currentUrl, category });

            // 1. Inject fingerprint spoofing directly into the MAIN world to bypass CSP inline-script blocks
            await chrome.scripting.executeScript({
                target: { tabId },
                files: [resolve('inject.js')],
                world: 'MAIN'
            }).catch(e => console.warn('[DCG] Could not inject MAIN world script (CSP/permissions):', e.message));

            // 2. Inject the behavior simulator into the ISOLATED world (default)
            await chrome.scripting.executeScript({
                target: { tabId },
                files: [resolve('content_script.js'), resolve('behavior_simulator.js')]
            });

            console.log(`[DCG] Scripts injected into tab ${tabId} (${isFallback ? 'fallback' : 'dataset'} URL).`);
            await TaskStateManager.set('SIMULATING', { url: this._currentUrl, category, isFallback });
            MetricsEngine.updateMetrics(category);

            // Safety-net: close after 90 s if SIMULATION_DONE never arrives
            this._clearTimer();
            this.sessionTimer = setTimeout(() => {
                console.log('[DCG] Safety-net: closing noise tab after 90 s.');
                this.endSession();
            }, 90_000);

        } catch (error) {
            const msg = error?.message || '';
            const isErrorPage =
                msg.includes('error page') ||
                msg.includes('Cannot access') ||
                msg.includes('No frame with id') ||
                msg.includes('Receiving end does not exist');

            if (isErrorPage) {
                // ── Bad URL detected ─────────────────────────────────────
                const failedUrl = this._currentUrl;

                if (!isFallback && failedUrl) {
                    // 1. Permanently blacklist this dataset URL
                    SiteSelector.markDead(failedUrl);
                    console.warn(`[DCG] Dataset URL is dead — blacklisted: ${failedUrl}`);
                    await TaskStateManager.set('FALLBACK', { failedUrl, category });
                }

                // 2. Close the error tab silently
                this.activeTabId = null;
                this._currentUrl = null;
                await chrome.tabs.remove(tabId).catch(() => {});
                await new Promise(r => setTimeout(r, 400));

                if (!isFallback) {
                    // 3. Open a FALLBACK (guaranteed-safe Wikipedia) URL for THIS cycle
                    const fallbackUrl = SiteSelector.getFallback(category);
                    console.log(`[DCG] Opening fallback URL for this cycle: ${fallbackUrl}`);
                    await this._openTab(fallbackUrl, category, /* isFallback */ true);
                } else {
                    // Even the fallback failed (extremely rare) — skip this cycle entirely
                    console.error('[DCG] Fallback URL also failed — skipping this noise cycle.');
                    this.endSession();
                }
            } else {
                // Unexpected error — abort this cycle
                console.error('[DCG] Unexpected injection error:', msg);
                this.endSession();
            }
        }
    },

    // ── Close the noise tab cleanly ──────────────────────────────────────
    async endSession(isStopped = false) {
        this._clearTimer();

        if (this.activeTabId) {
            const idToClose  = this.activeTabId;
            this.activeTabId = null;
            this._currentUrl = null;

            await TaskStateManager.set('CLOSING');
            try {
                await chrome.tabs.sendMessage(idToClose, { action: 'STOP_SIMULATION' }).catch(() => {});
                await chrome.tabs.remove(idToClose).catch(() => {});
                console.log(`[DCG] Noise tab ${idToClose} closed.`);
            } catch (e) {
                console.log('[DCG] Tab already gone:', e?.message);
            }
        }

        // Transition back to the correct resting state
        if (isStopped) {
            await TaskStateManager.set('STOPPED');
        } else {
            // Small delay so UI shows CLOSING briefly before IDLE
            setTimeout(() => TaskStateManager.set('IDLE'), 1200);
        }
    },

    _clearTimer() {
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
            this.sessionTimer = null;
        }
    },
};