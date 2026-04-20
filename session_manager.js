import { PersonaEngine } from './persona_engine.js';
import { SiteSelector } from './site_selector.js';
import { MetricsEngine } from './metrics_engine.js';

export const SessionManager = {
    activeTabId: null,
    sessionTimer: null,

    init() {
        chrome.tabs.onRemoved.addListener((tabId) => {
            if (tabId === this.activeTabId) {
                console.log(`[DCG] Active tab visually closed by user or system. Resetting activeTabId.`);
                this.activeTabId = null;
            }
        });
    },

    async startSession() {
        if (this.activeTabId) return; // Prevent multiple tabs per constraints

        const category = await PersonaEngine.getNextCategory();
        const url = SiteSelector.getSiteForCategory(category);
        
        console.log(`[DCG] Starting session - Category: ${category}, URL: ${url}`);
        
        const tab = await chrome.tabs.create({ url, active: false });
        this.activeTabId = tab.id;

        const listener = (tabId, info) => {
            if (tabId === this.activeTabId && info.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                this.onTabLoaded(tabId, category);
            }
        };
        chrome.tabs.onUpdated.addListener(listener);
    },

    async onTabLoaded(tabId, category) {
        try {
            // Determine if we are running in bundled mode (dist) or developer mode (root)
            // We'll use a helper to resolve names
            const resolve = (name) => {
                const manifest = chrome.runtime.getManifest();
                // If the background script is bundled, we assume we are in dist mode
                const isDist = manifest.background?.service_worker?.includes('.bundle.js');
                return isDist ? name.replace('.js', '.bundle.js').replace('content_script', 'content') : name;
            };

            await chrome.scripting.executeScript({
                target: { tabId },
                files: [resolve('content_script.js'), resolve('behavior_simulator.js')]
            });
            console.log(`[DCG Session] Scripts injected into tab ${tabId}`);
            
            MetricsEngine.updateMetrics(category);
            
            // Let the session live for 2 to 4 minutes (increased from 1-3 based on user feedback)
            const durationMs = Math.floor(Math.random() * (240000 - 120000 + 1)) + 120000;
            this.sessionTimer = setTimeout(() => {
                console.log(`[DCG Session] Reached duration limit (${durationMs/1000}s). Closing tab automatically.`);
                this.endSession();
            }, durationMs);
        } catch (error) {
            console.error("[DCG] Inject script failed, cleaning up session:", error);
            this.endSession();
        }
    },

    async endSession() {
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
            this.sessionTimer = null;
        }

        if (this.activeTabId) {
            const idToClose = this.activeTabId;
            this.activeTabId = null;
            
            try {
                await chrome.tabs.sendMessage(idToClose, { action: "STOP_SIMULATION" }).catch(() => {});
                await chrome.tabs.remove(idToClose).catch(() => {});
                console.log(`[DCG] Session fully ended. Tab id ${idToClose} removed.`);
            } catch (e) {
                console.log("[DCG] Warning: Tab close failed or already gone:", e);
            }
        }
    }
};