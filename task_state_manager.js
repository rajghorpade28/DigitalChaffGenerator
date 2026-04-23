/**
 * task_state_manager.js
 *
 * Tracks the current background task lifecycle phase and broadcasts
 * it to chrome.storage.local so the popup can render a live status panel.
 *
 * States (in lifecycle order):
 *   IDLE       — no active noise session
 *   OPENING    — creating a new background tab
 *   INJECTING  — executing content + behavior scripts
 *   SIMULATING — scripts running, browsing behaviour active
 *   FALLBACK   — dataset URL failed, loading Wikipedia fallback
 *   CLOSING    — simulation done, removing the tab
 *   STOPPED    — generator manually stopped
 */

export const TaskStateManager = {
    _lastState: null,

    /**
     * Set and broadcast a new task state.
     * @param {string} state  - one of the 7 states above
     * @param {Object} meta   - optional extra context (url, category, failedUrl …)
     */
    async set(state, meta = {}) {
        // Skip purely redundant writes (but always write if meta has a URL
        // so the popup can see which specific URL is being visited)
        if (this._lastState === state && !meta.url && !meta.failedUrl) return;
        this._lastState = state;

        const payload = { state, meta, ts: Date.now() };

        // Persist — the popup reads this on open even when no message arrives
        await chrome.storage.local.set({ taskState: payload });

        // Best-effort broadcast to popup (popup may be closed — that's fine)
        chrome.runtime.sendMessage({ type: 'TASK_STATE_CHANGED', ...payload })
            .catch(() => { /* popup not open */ });
    },

    /** Read the last persisted state (used by popup on open). */
    async get() {
        const { taskState } = await chrome.storage.local.get('taskState');
        return taskState || { state: 'IDLE', meta: {}, ts: 0 };
    },
};
