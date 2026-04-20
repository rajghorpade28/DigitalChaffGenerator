import { StorageManager } from './storage.js';
import { classifyAll, getCleanupTargets, isEssentialCookie, isFirstParty } from './cookie_classifier.js';

document.addEventListener("DOMContentLoaded", async () => {
    const toggleBtn = document.getElementById("toggleBtn");
    const statusText = document.getElementById("statusText");
    const statusIndicator = document.getElementById("statusIndicator");
    const sessionCount = document.getElementById("sessionCount");
    const entropyScore = document.getElementById("entropyScore");
    const certaintyScore = document.getElementById("certaintyScore");
    const countdownContainer = document.getElementById("countdown-container");
    const countdownTimer = document.getElementById("countdownTimer");

    console.log("[DCG] Popup loaded");

    // Load initial persona
    chrome.storage.local.get("currentPersona", (data) => {
        console.log("[DCG] Loaded persona:", data);
        const persona = data.currentPersona || "tech_curious";
        document.getElementById("currentPersona").textContent = persona;
        document.getElementById("personaSelect").value = persona;
    });

    document.getElementById("personaSelect").addEventListener("change", (e) => {
        const newPersona = e.target.value;
        chrome.storage.local.set({ currentPersona: newPersona });
        document.getElementById("currentPersona").textContent = newPersona;
        
        chrome.runtime.sendMessage({
            type: "SET_PERSONA",
            persona: newPersona
        });
    });

    let idleSeconds = 30;
    let isCurrentlyEnabled = false;
    let timerRef = null;

    function updateTimerDisplay() {
        const secs = idleSeconds.toString().padStart(2, '0');
        countdownTimer.textContent = `00:${secs}`;
        if (idleSeconds <= 0) {
            countdownTimer.textContent = "ACTIVE";
            countdownTimer.style.color = "#2ecc71";
        } else {
            countdownTimer.style.color = "#e74c3c";
        }
    }

    function resetIdleTimer() {
        if (isCurrentlyEnabled && idleSeconds <= 0) {
            // It was active and we're now moving mouse, it will stop shortly. 
        }
        idleSeconds = 30;
        updateTimerDisplay();
    }

    // Add UI activity listeners
    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('keydown', resetIdleTimer);
    document.addEventListener('scroll', resetIdleTimer);
    document.addEventListener('click', resetIdleTimer);

    function updateView(data) {
        const isEnabled = data.isEnabled || false;
        isCurrentlyEnabled = isEnabled;
        
        toggleBtn.textContent = isEnabled ? "Stop Generator" : "Start Generator";
        toggleBtn.className = isEnabled ? "btn active" : "btn";
        
        countdownContainer.style.display = isEnabled ? "block" : "none";
        
        if (isEnabled) {
            async function updateStatus() {
                try {
                    // Helper for timeout-based messaging
                    const sendMessageWithTimeout = (message, timeout = 2500) => {
                        return Promise.race([
                            chrome.runtime.sendMessage(message),
                            new Promise((_, reject) => setTimeout(() => reject(new Error('Handshake timeout')), timeout))
                        ]);
                    };

                    const status = await sendMessageWithTimeout({ type: 'GET_STATUS' });
                    
                    if (status) {
                        statusText.innerText = status.isActive ? "🟢 Active" : "🔴 Idle";
                        statusIndicator.style.background = status.isActive ? "#27ae60" : "#e74c3c";
                        statusIndicator.classList.remove('pulse');
                        toggleBtn.innerText = status.isActive ? "Stop Generator" : "Start Generator";
                    }
                } catch (err) {
                    console.error('Handshake failed:', err);
                    statusText.innerText = "🔴 System Offline";
                    statusIndicator.style.background = "#95a5a6";
                }
            }
            updateStatus();
        } else {
            statusText.textContent = "System Disabled";
            statusIndicator.style.background = "#e74c3c";
            statusIndicator.style.boxShadow = "0 0 8px #e74c3c";
        }

        sessionCount.textContent = data.sessionsCount || 0;
        entropyScore.textContent = data.entropy !== undefined ? data.entropy.toFixed(2) : "0.00";
        certaintyScore.textContent = (data.certainty !== undefined ? data.certainty.toFixed(1) : "100.0") + "%";
    }

    const data = await StorageManager.getMultiple(null);
    updateView(data);

    const btn = document.getElementById("toggleBtn");
 
    btn.addEventListener("click", () => {
        const newState = !isCurrentlyEnabled;
        chrome.runtime.sendMessage(
            { action: "TOGGLE_ENABLED", isEnabled: newState }
        );
    });

    const closeNoiseBtn = document.getElementById('closeNoiseBtn');
    closeNoiseBtn.addEventListener('click', () => {
        const originalText = closeNoiseBtn.textContent;
        closeNoiseBtn.textContent = 'Closing...';
        closeNoiseBtn.disabled = true;

        chrome.runtime.sendMessage({ type: "CLOSE_NOISE_TABS" }, (response) => {
            setTimeout(() => {
                closeNoiseBtn.textContent = originalText;
                closeNoiseBtn.disabled = false;
            }, 1000);
        });
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local') {
            StorageManager.getMultiple(null).then(allData => updateView(allData));
        }
    });

    // ── Passive Wave Countdown ─────────────────────────────────────────────
    const waveTimerEl  = document.getElementById('waveTimerDisplay');
    const waveStatusEl = document.getElementById('waveStatus');
    const triggerBtn   = document.getElementById('triggerWaveBtn');

    function formatCountdown(msLeft) {
        if (msLeft <= 0) return '00:00:00';
        const totalSecs = Math.floor(msLeft / 1000);
        const h = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSecs % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    async function updateWaveCountdown() {
        const nextWaveTime = await StorageManager.get('nextWaveTime');
        if (!nextWaveTime) { waveTimerEl.textContent = '--:--:--'; return; }
        const msLeft = nextWaveTime - Date.now();
        waveTimerEl.textContent = formatCountdown(msLeft);
        // Turn yellow and pulse when under 5 minutes
        if (msLeft <= 5 * 60 * 1000 && msLeft > 0) {
            waveTimerEl.classList.add('imminent');
        } else {
            waveTimerEl.classList.remove('imminent');
        }
    }

    triggerBtn.addEventListener('click', async () => {
        triggerBtn.disabled = true;
        triggerBtn.textContent = 'Firing…';
        waveStatusEl.textContent = '〰 Launching passive noise session…';
        waveStatusEl.style.display = 'block';

        // Tell background to fire a session now
        chrome.runtime.sendMessage({ action: 'FORCE_START' });

        // Reschedule the alarm via storage so countdown resets
        const nextWaveTime = Date.now() + 120 * 60 * 1000;
        await StorageManager.set('nextWaveTime', nextWaveTime);
        await updateWaveCountdown();

        setTimeout(() => {
            waveStatusEl.style.display = 'none';
            triggerBtn.disabled = false;
            triggerBtn.textContent = 'Fire Now';
        }, 3500);
    });

    // Initial load + update every second inside the existing interval
    updateWaveCountdown();

    // ── Cookie Manager ─────────────────────────────────────────────────────
    const RISK_ICON = { safe: '🟢', medium: '🟡', high: '🔴' };
    const RISK_LABEL = { safe: 'Safe', medium: 'Medium Risk', high: 'High Risk' };

    // "Protect logged-in sites" toggle — loaded from storage, ON by default
    let protectLoggedIn = true;
    const savedProtect = await StorageManager.get('protectLoggedIn');
    if (savedProtect !== undefined) protectLoggedIn = savedProtect;

    const protectToggle = document.getElementById('protectLoggedInToggle');
    if (protectToggle) {
        protectToggle.checked = protectLoggedIn;
        protectToggle.addEventListener('change', async () => {
            protectLoggedIn = protectToggle.checked;
            await StorageManager.set('protectLoggedIn', protectLoggedIn);
            console.log('[DCG] Protect logged-in sites:', protectLoggedIn);
        });
    }

    /** Get the hostname of the active tab (used for first-party detection). */
    async function getCurrentDomain() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab || !tab.url) return null;
            return new URL(tab.url).hostname;
        } catch (e) {
            return null;
        }
    }

    /**
     * Safely delete a single cookie — skips essential / first-party cookies
     * unless the user has disabled protection.
     */
    async function deleteCookie(cookie, currentDomain) {
        // Always guard against essential (auth/session/httpOnly) cookies
        if (isEssentialCookie(cookie)) {
            console.log('[DCG] Skipping essential cookie:', cookie.name);
            return;
        }

        // Respect first-party protection when enabled
        if (protectLoggedIn && currentDomain && isFirstParty(cookie, currentDomain)) {
            console.log('[DCG] Skipping first-party cookie:', cookie.name);
            return;
        }

        console.log('[DCG] Deleting cookie:', cookie.name, '| domain:', cookie.domain);
        const protocol = cookie.secure ? 'https' : 'http';
        const url = `${protocol}://${cookie.domain}${cookie.path}`;
        await chrome.cookies.remove({ url, name: cookie.name }).catch(() => {});
    }

    async function refreshCookies() {
        if (!chrome.cookies) return;

        const rawCookies = await chrome.cookies.getAll({});
        const classified  = classifyAll(rawCookies);

        // Update summary counts
        const counts = { safe: 0, medium: 0, high: 0 };
        for (const item of classified) counts[item.risk]++;
        document.getElementById('cookieCount').textContent = rawCookies.length;
        document.getElementById('safeCount').textContent   = counts.safe;
        document.getElementById('medCount').textContent    = counts.medium;
        document.getElementById('highCount').textContent   = counts.high;

        // Build per-domain detail list
        const listEl = document.getElementById('cookieList');
        if (listEl.style.display === 'none') return; // don't rebuild if hidden

        // Group by domain, track worst risk per domain
        const domains = {};
        for (const item of classified) {
            if (!domains[item.domain]) domains[item.domain] = { items: [], worstRisk: 'safe' };
            domains[item.domain].items.push(item);
            if (item.risk === 'high') domains[item.domain].worstRisk = 'high';
            else if (item.risk === 'medium' && domains[item.domain].worstRisk !== 'high')
                domains[item.domain].worstRisk = 'medium';
        }

        // Sort domains: high → medium → safe
        const riskOrder = { high: 0, medium: 1, safe: 2 };
        const sortedDomains = Object.entries(domains).sort(
            ([, a], [, b]) => riskOrder[a.worstRisk] - riskOrder[b.worstRisk]
        );

        listEl.innerHTML = sortedDomains.map(([domain, { items, worstRisk }]) => `
            <div class="ck-domain-header">
                <span>🌐 ${domain} &nbsp;<span style="opacity:.6;font-weight:400">(${items.length})</span></span>
                <span class="ck-domain-risk ${worstRisk}">${RISK_ICON[worstRisk]} ${RISK_LABEL[worstRisk]}</span>
            </div>
            ${items.map(item => {
                const c = item.cookie;
                const url = (c.secure ? 'https' : 'http') + '://' + c.domain + c.path;
                const valPreview = c.value.length > 32 ? c.value.slice(0, 32) + '…' : c.value;
                const tagStr = item.tags.join(', ');
                return `<div class="ck-cookie-row">
                    <div class="ck-risk-dot ${item.risk}"></div>
                    <div style="flex:1;overflow:hidden">
                        <div class="ck-cookie-name">${c.name}</div>
                        <div class="ck-cookie-val">${valPreview || '<empty>'}</div>
                        ${tagStr ? `<div style="font-size:0.58rem;color:#58a6ff;margin-top:1px">${tagStr}</div>` : ''}
                    </div>
                    <button class="ck-del-btn" data-url="${url}" data-name="${c.name}">✕</button>
                </div>`;
            }).join('')}
        `).join('');

        // Attach individual delete handlers
        listEl.querySelectorAll('.ck-del-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const target = classified.find(i => i.cookie.name === btn.dataset.name &&
                    ((i.cookie.secure ? 'https' : 'http') + '://' + i.cookie.domain + i.cookie.path) === btn.dataset.url);
                if (target) {
                    const domain = await getCurrentDomain();
                    await deleteCookie(target.cookie, domain);
                }
                await refreshCookies();
            });
        });
    }

    async function runCleanup(mode) {
        if (!chrome.cookies) return;

        const messages = {
            'safe': 'Proceed with SAFE cleanup?\n\nThis removes known trackers while keeping your login sessions intact.',
            'balanced': 'Proceed with BALANCED cleanup?\n\nThis removes trackers and long-lived 3rd-party data. Most site sessions will be preserved.',
            'aggressive': 'Proceed with AGGRESSIVE cleanup?\n\nWARNING: This removes almost ALL cookies. You may be logged out of many websites.'
        };

        const confirmed = window.confirm(messages[mode] || `Proceed with ${mode} cookie cleanup?`);
        if (!confirmed) return;

        const statusEl  = document.getElementById('cleanupStatus');
        statusEl.textContent = `Running ${mode} cleanup…`;
        statusEl.style.display = 'block';

        const currentDomain = await getCurrentDomain();
        const rawCookies    = await chrome.cookies.getAll({});
        const classified    = classifyAll(rawCookies);
        const targets       = getCleanupTargets(classified, mode, protectLoggedIn, currentDomain);

        let removed = 0;
        for (const item of targets) {
            console.log('[DCG] Deleting cookie:', item.cookie.name, '| domain:', item.cookie.domain);
            const protocol = item.cookie.secure ? 'https' : 'http';
            const url = `${protocol}://${item.cookie.domain}${item.cookie.path}`;
            await chrome.cookies.remove({ url, name: item.cookie.name }).catch(() => {});
            removed++;
        }

        await refreshCookies();
        const kept = rawCookies.length - removed;
        statusEl.textContent = `✅ Removed ${removed} cookies — ${kept} kept safe.`;
        setTimeout(() => { statusEl.style.display = 'none'; }, 4000);
    }

    // ── Toggle detail list ──────────────────────────────────────────────────
    document.getElementById('toggleCookieListBtn').addEventListener('click', async () => {
        const listEl = document.getElementById('cookieList');
        const btn    = document.getElementById('toggleCookieListBtn');
        if (listEl.style.display === 'none') {
            listEl.style.display = 'block';
            btn.textContent = 'Hide Details';
            await refreshCookies(); // build list now
        } else {
            listEl.style.display = 'none';
            btn.textContent = 'Show Details';
        }
    });

    // ── Cleanup mode buttons ────────────────────────────────────────────────
    document.getElementById('cleanSafeBtn')      .addEventListener('click', () => runCleanup('safe'));
    document.getElementById('cleanBalancedBtn')  .addEventListener('click', () => runCleanup('balanced'));
    document.getElementById('cleanAggressiveBtn').addEventListener('click', () => runCleanup('aggressive'));

    refreshCookies();

    // Refresh idle state display every 1 second instead of 3
    timerRef = setInterval(async () => {
        const isEnabledObj = await StorageManager.getMultiple(['isEnabled']);
        isCurrentlyEnabled = isEnabledObj.isEnabled;
        if(isCurrentlyEnabled) {
            if (idleSeconds > 0) {
                idleSeconds--;
                updateTimerDisplay();
                
                if (idleSeconds === 0) {
                    // Trigger the background worker to start generating
                    chrome.runtime.sendMessage({ action: "FORCE_START" });
                }
            }

            chrome.idle.queryState(30, (state) => {
                if (state === 'active' && idleSeconds > 0) {
                    statusText.textContent = "Standby: Waiting for user to idle";
                    statusIndicator.style.background = "#f39c12";
                } else {
                    statusText.textContent = "Active: Injecting background chaff";
                    statusIndicator.style.background = "#2ecc71";
                }
            });
        }
        refreshCookies();
        updateWaveCountdown();
    }, 1000);

    // ── Phishing Detection UI ───────────────────────────────────────────────
    const phishAccurateBtn  = document.getElementById('phishModeAccurate');
    const phishPrivacyBtn   = document.getElementById('phishModePrivacy');
    const phishModeNote     = document.getElementById('phishModeNote');
    const phishAlertEl      = document.getElementById('phishAlert');
    const phishAlertUrl     = document.getElementById('phishAlertUrl');
    const phishAlertReason  = document.getElementById('phishAlertReason');
    const phishDismissBtn   = document.getElementById('phishAlertDismiss');
    const phishCurrentRisk  = document.getElementById('phishCurrentRisk');
    const phishCurrentUrl   = document.getElementById('phishCurrentUrl');
    const phishCurrentReason = document.getElementById('phishCurrentReason');

    const RISK_BADGE_CLASS = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high', UNKNOWN: 'unknown' };
    const RISK_BADGE_TEXT  = { LOW: '✓ Low Risk', MEDIUM: '⚡ Medium Risk', HIGH: '🚨 High Risk', UNKNOWN: '— Unknown' };

    /** Update the current-page risk badge in the popup. */
    function setCurrentRisk(risk, url, reason) {
        const level = risk || 'UNKNOWN';
        phishCurrentRisk.textContent = RISK_BADGE_TEXT[level] || level;
        phishCurrentRisk.className   = `phish-risk-badge ${RISK_BADGE_CLASS[level] || 'unknown'}`;
        
        // Show reason for unknown/errors
        if (level === 'UNKNOWN' && reason) {
            phishCurrentReason.textContent = reason;
        } else {
            phishCurrentReason.textContent = '';
        }

        if (url) {
            try {
                phishCurrentUrl.textContent = new URL(url).hostname;
            } catch {
                phishCurrentUrl.textContent = url.slice(0, 60);
            }
        }
    }

    /** Reflect the active mode in segmented buttons and footnote. */
    function applyPhishMode(mode) {
        const isAccurate = mode === 'accurate';
        phishAccurateBtn.classList.toggle('selected', isAccurate);
        phishPrivacyBtn.classList.toggle('selected', !isAccurate);
        phishModeNote.textContent = isAccurate
            ? 'Accurate mode: every URL checked via Google Safe Browsing API.'
            : 'Privacy mode: local checks only — no external calls.';
    }

    // Load saved mode on popup open
    const { phishingMode } = await chrome.storage.local.get('phishingMode');
    applyPhishMode(phishingMode || 'accurate');

    // Ask the background for the current tab's risk immediately (with timeout)
    let checkDone = false;
    const checkTimeout = setTimeout(() => {
        if (!checkDone) {
            setCurrentRisk('UNKNOWN', null, 'Analysis timed out — try reloading');
        }
    }, 3000);

    chrome.runtime.sendMessage({ type: 'CHECK_CURRENT_URL' }, (result) => {
        checkDone = true;
        clearTimeout(checkTimeout);
        if (chrome.runtime.lastError) {
            console.warn('[DCG] check URL message error:', chrome.runtime.lastError.message);
            setCurrentRisk('UNKNOWN', null, 'Connection error');
            return;
        }
        if (result) setCurrentRisk(result.risk, result.url, result.reason);
    });

    // Mode buttons
    phishAccurateBtn.addEventListener('click', async () => {
        await chrome.storage.local.set({ phishingMode: 'accurate' });
        applyPhishMode('accurate');
        console.log('[DCG] Phishing mode set: accurate');
        // Trigger a fresh check
        chrome.runtime.sendMessage({ type: 'CHECK_CURRENT_URL' }, (res) => {
            if (res) setCurrentRisk(res.risk, res.url, res.reason);
        });
    });
    phishPrivacyBtn.addEventListener('click', async () => {
        await chrome.storage.local.set({ phishingMode: 'privacy' });
        applyPhishMode('privacy');
        console.log('[DCG] Phishing mode set: privacy');
        // Trigger a fresh check
        chrome.runtime.sendMessage({ type: 'CHECK_CURRENT_URL' }, (res) => {
            if (res) setCurrentRisk(res.risk, res.url, res.reason);
        });
    });

    // Show stored threat alert if it fired while popup was closed (within 60 s)
    const { lastPhishingAlert } = await chrome.storage.local.get('lastPhishingAlert');
    if (lastPhishingAlert && Date.now() - lastPhishingAlert.ts < 60_000) {
        phishAlertUrl.textContent    = lastPhishingAlert.url;
        phishAlertReason.textContent = `${lastPhishingAlert.risk} \u2014 ${lastPhishingAlert.reason}`;
        phishAlertEl.style.display   = 'block';
    }

    // Listen for live HIGH-risk alerts pushed from the background
    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type === 'PHISHING_ALERT') {
            setCurrentRisk(msg.risk, msg.url, msg.reason);
            phishAlertUrl.textContent    = msg.url;
            phishAlertReason.textContent = `${msg.risk} \u2014 ${msg.reason}`;
            phishAlertEl.style.display   = 'block';
        }
    });

    // Dismiss button
    phishDismissBtn.addEventListener('click', () => {
        phishAlertEl.style.display = 'none';
        chrome.storage.local.remove('lastPhishingAlert');
    });

});
