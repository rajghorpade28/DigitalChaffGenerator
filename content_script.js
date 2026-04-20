console.log("[DCG Content Script] Loaded.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "STOP_SIMULATION") {
        console.log("[DCG Content Script] Received STOP signal - halting simulation.");
        window.__dcg_stop = true;
        sendResponse({ ack: true });
    }
});