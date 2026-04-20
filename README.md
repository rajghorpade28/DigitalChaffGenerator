# Digital Chaff Generator (DCG)

## Overview
A privacy-focused Google Chrome extension that generates human-like browsing "noise" during system idle periods to increase local behavioral entropy and decrease tracker profiling certainty. By generating realistic background web sessions across randomized personas, DCG obfuscates your true online footprint. 

## Build & Installation Instructions

### 1. Load the Extension in Chrome
1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. In the top right corner, toggle **Developer mode** to ON.
4. Click the **Load unpacked** button that appears in the top left.
5. Select the `digital_chaff_generator` folder (where these files reside).
6. Ensure the extension is enabled.

### 2. How to Test It
1. Click the DCG icon in your Chrome extensions menu.
2. The popup should open displaying "System Disabled" initially.
3. Click **Start Generator**.
4. The status will indicate "**Standby: Waiting for user to idle**".
5. Do not move your mouse or press any keys for at least **15 seconds** (the minimum time Chrome uses to declare an "idle" state).
6. **Watch carefully**: A new Chrome tab will open automatically in the background without stealing your focus. The tab will navigate to a Wiki article.
7. Switch back to your popup safely after a bit, and watch the Metrics increment! If you move your mouse, the extension detects you're active and immediately kills the session (closing the tab).
8. Track the growing **Entropy Score** and diminishing **Profile Certainty**.
