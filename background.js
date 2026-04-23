import { Scheduler } from './scheduler.js';
import { StorageManager } from './storage.js';
import { SessionManager } from './session_manager.js';
import { PhishingDetector } from './phishing_detector.js';
import { TaskStateManager } from './task_state_manager.js';

const PASSIVE_ALARM_NAME = 'passiveWave';
const PERSONA_ALARM_NAME = 'personaRotation';
const PASSIVE_INTERVAL_MINUTES = 30; // 30 minutes
const PERSONA_INTERVAL_MINUTES = 120; // 2 hours

function scheduleNextWave() {
    const nextWaveTime = Date.now() + PASSIVE_INTERVAL_MINUTES * 60 * 1000;
    StorageManager.set('nextWaveTime', nextWaveTime);
    chrome.alarms.create(PASSIVE_ALARM_NAME, { delayInMinutes: PASSIVE_INTERVAL_MINUTES });
    console.log('[DCG] Passive wave scheduled in 30 minutes.');
}

function scheduleNextPersonaRotation() {
    const nextRotationTime = Date.now() + PERSONA_INTERVAL_MINUTES * 60 * 1000;
    StorageManager.set('nextPersonaRotationTime', nextRotationTime);
    chrome.alarms.create(PERSONA_ALARM_NAME, { delayInMinutes: PERSONA_INTERVAL_MINUTES, periodInMinutes: PERSONA_INTERVAL_MINUTES });
    console.log(`[DCG] Persona rotation scheduled in ${PERSONA_INTERVAL_MINUTES} minutes.`);
}

chrome.runtime.onInstalled.addListener(async () => {
    const isEnabled = await StorageManager.get('isEnabled');
    if (isEnabled === undefined) {
        await StorageManager.setMultiple({
            isEnabled: false,
            sessionsCount: 0,
            entropy: 0,
            certainty: 100,
            categoryDistribution: {}
        });
    }
    // Schedule the first passive wave
    chrome.alarms.get(PASSIVE_ALARM_NAME, (existing) => {
        if (!existing) scheduleNextWave();
    });

    // Schedule the first persona rotation (2 hours)
    chrome.alarms.get(PERSONA_ALARM_NAME, (existing) => {
        if (!existing) {
            scheduleNextPersonaRotation();
        }
    });
    console.log("[DCG] Core Extension Installed and Pre-configured");
});

// Configure rapid idle detection (minimum 15 seconds)
chrome.idle.setDetectionInterval(30);
Scheduler.init();
SessionManager.init();          // async — loads dead-URL blacklist then registers listeners
PhishingDetector.init();        // ── Phishing URL detection (non-blocking)

// ── Passive waves and Persona Rotation alarm handler ────────────────────────
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === PASSIVE_ALARM_NAME) {
        console.log('[DCG] Passive wave alarm fired!');
        const isEnabled = await StorageManager.get('isEnabled', false);
        if (isEnabled) {
            console.log('[DCG] Running passive noise session.');
            SessionManager.startSession();
        } else {
            console.log('[DCG] Passive wave skipped — generator is disabled.');
        }
        scheduleNextWave();
    } else if (alarm.name === PERSONA_ALARM_NAME) {
        console.log('[DCG] Persona rotation alarm fired!');
        const { PersonaEngine } = await import('./persona_engine.js');
        await PersonaEngine.rotatePersona();
        scheduleNextPersonaRotation();
    }
});

// ── Message listener ──────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`[DCG] Message received: ${request.type || request.action}`);

    if (request.type === "PING") {
        sendResponse({ status: "ALIVE", version: "1.0.2" });
        return false; // return false for synchronous responses
    }

    if (request.action === "TOGGLE_ENABLED") {
        const enabledStatus = request.isEnabled;
        StorageManager.set('isEnabled', enabledStatus).then(() => {
            if (enabledStatus) {
                chrome.idle.queryState(30, (state) => {
                    Scheduler.handleState(state);
                });
            } else {
                Scheduler.stop();
            }
            sendResponse({ success: true });
        }).catch(err => sendResponse({ success: false, error: err.message }));
        return true; 
    }
    
    if (request.action === "FORCE_START") {
        Scheduler.start();
        sendResponse({ success: true });
        return false;
    }

    if (request.action === "STOP_GENERATOR") {
        console.log('[DCG] STOP_GENERATOR received — halting all noise generation.');
        StorageManager.set('isEnabled', false).then(async () => {
            Scheduler.stop();
            await SessionManager.endSession(/* isStopped */ true);
            sendResponse({ success: true });
        }).catch(err => sendResponse({ success: false, error: err.message }));
        return true;
    }

    if (request.action === "GET_NEXT_WAVE") {
        StorageManager.get('nextWaveTime').then(t => {
            sendResponse({ nextWaveTime: t || null });
        }).catch(() => sendResponse({ nextWaveTime: null }));
        return true;
    }

    if (request.action === "TRIGGER_PASSIVE_WAVE") {
        console.log('[DCG] Manual passive wave trigger received.');
        SessionManager.startSession();
        scheduleNextWave();
        sendResponse({ success: true });
        return false;
    }
    
    if (request.type === "SET_PERSONA") {
        chrome.storage.local.set({ currentPersona: request.persona }).then(() => {
            sendResponse({ success: true });
        });
        return true;
    }

    if (request.type === "CHECK_CURRENT_URL") {
        console.log('[DCG] Handling CHECK_CURRENT_URL...');
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            try {
                const tab = tabs[0];
                if (!tab || !tab.url || !tab.url.startsWith('http')) {
                    console.log('[DCG] CHECK_CURRENT_URL: No valid tab/URL');
                    sendResponse({ risk: 'UNKNOWN', reason: 'System page or blank', url: '' });
                    return;
                }
                const { tabRiskCache } = await chrome.storage.local.get('tabRiskCache');
                const cached = tabRiskCache?.[tab.id];
                if (cached && Date.now() - cached.ts < 30_000) {
                    console.log('[DCG] CHECK_CURRENT_URL: Returning cached result');
                    sendResponse(cached);
                    return;
                }
                console.log('[DCG] CHECK_CURRENT_URL: Running new check...');
                const result = await PhishingDetector.checkUrl(tab.url, tab.id);
                
                // Save it to cache so it shows in history
                if (result) {
                    const cacheToSave = tabRiskCache || {};
                    cacheToSave[tab.id] = { url: tab.url, ...result, ts: Date.now() };
                    await chrome.storage.local.set({ tabRiskCache: cacheToSave });
                }

                sendResponse({ url: tab.url, ...(result || { risk: 'UNKNOWN', reason: 'Analysis failed' }) });
            } catch (err) {
                console.error('[DCG] Async URL check exception:', err);
                sendResponse({ risk: 'UNKNOWN', reason: `Internal crash: ${err.message}` });
            }
        });
        return true; // We ARE sending an async response
    }

    if (request.type === "CLOSE_NOISE_TABS") {
        console.log('[DCG] Manual request to close noise tabs.');
        SessionManager.endSession(true).then(() => {
            sendResponse({ success: true, message: "Noise session terminated." });
        }).catch(err => {
            sendResponse({ success: false, error: err.message });
        });
        return true;
    }

    if (request.type === "BLOCK_TAB") {
        if (sender.tab && sender.tab.id) {
            chrome.tabs.remove(sender.tab.id);
        }
        return false;
    }

    // Explicitly return false if the message type wasn't handled
    console.warn(`[DCG] Unhandled message type: ${request.type || request.action}`);
    return false; 
});
