import { SessionManager } from './session_manager.js';
import { StorageManager } from './storage.js';

export const Scheduler = {
    isRunning: false,
    
    init() {
        chrome.idle.onStateChanged.addListener((newState) => {
            console.log(`[DCG] System activity state changed: ${newState}`);
            this.handleState(newState);
        });
    },
    
    async handleState(state) {
        const isEnabled = await StorageManager.get('isEnabled', false);
        if (!isEnabled) {
            this.stop();
            return;
        }
        
        if (state === 'idle' || state === 'locked') {
            this.start();
        } else if (state === 'active') {
            this.stop();
        }
    },
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log("[DCG Scheduler] Activated -> Bootstaping session loops.");
        this.loop();
    },
    
    async loop() {
        if (!this.isRunning) return;
        

        await SessionManager.startSession();
        
        // Wait to trigger the next session (after 4 mins guarantees max 1 session limit constraint isn't stacked)
        const nextStartDelayMs = 240000;
        setTimeout(() => {
            if (this.isRunning) {
                this.loop();
            }
        }, nextStartDelayMs);
    },
    
    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        console.log("[DCG Scheduler] Aborting -> User became active.");
        // SessionManager.endSession(); // Disabled so you can inspect the tab; it will close naturally after its session ends.
    }
};