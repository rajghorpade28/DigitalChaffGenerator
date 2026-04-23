# Digital Chaff Generator (DCG)

> A privacy-focused Chrome extension that fights browser fingerprinting by generating realistic background browsing "noise" when you're idle — making it impossible for trackers to build an accurate profile of your online behaviour.

---

## What It Does

Digital Chaff Generator (DCG) runs silently in the background. When your system is idle, it:

1. **Selects a persona** (Tech Curious, Health Conscious, Finance Planner, Travel Dreamer) and opens a persona-appropriate website in a background tab — invisible to you.
2. **Simulates realistic human behaviour** — scrolling at human reading speed, occasional back-scrolls, and frequent internal link clicks to dig deep into sites.
3. **Injects Fingerprint Spoofing** — Disrupts tracking scripts by injecting noise into Canvas rendering APIs and spoofing WebGL vendor/renderer strings.
4. **Closes the tab automatically** the moment the simulation finishes.
5. **Checks every URL for phishing** using two independent engines:
   - **Google Safe Browsing API** (live, cloud-based — requires a free API key)
   - **Local XGBoost ML model** (offline, highly accurate 98.86%, no external calls)
6. **Learns from dead links** — failing URLs are permanently blacklisted, ensuring noise generation stays efficient.

---

## Architecture

```
malicious_phish.csv
      │
      ▼
classify_dataset_urls.py  ──► site_selector.js   (80 URLs × 5 personas)
train_models.py           ──► best_model.json    (XGBoost model)
best_model.json           ──► phishing_detector.js (embedded ML inference)
```

```
Chrome Extension (Manifest V3)
├── background.js          Service worker — orchestrates everything
├── scheduler.js           Alarm-based passive wave timer (1-minute intervals)
├── session_manager.js     Tab lifecycle: open → simulate → close
├── site_selector.js       Dataset URL pool + dead-URL blacklist
├── persona_engine.js      Persona rotation
├── behavior_simulator.js  Human-like scroll/click simulation 
├── content_script.js      Fingerprint spoofing injection + message listener
├── phishing_detector.js   Dual ML + Safe Browsing engine + URL History
├── metrics_engine.js      Entropy / profile certainty scoring
├── cookie_classifier.js   Cookie analysis and cleanup
├── warning_ui.js          In-page phishing warning overlay
├── popup.html / popup.js  Extension dashboard UI
└── styles.css             Dashboard styling
```

---

## Features

| Feature | Details |
|---------|---------|
| 🎭 **Persona-based browsing** | 5 personas (tech, health, finance, travel, news), auto-rotates every 2 hrs |
| 🛡️ **Fingerprint Protection** | Spoofs Canvas rendering (noise injection) and WebGL identifiers |
| 🌐 **Dataset-driven URLs** | Benign URLs from `malicious_phish.csv`, 80 per persona |
| 🔁 **Aggressive Noise** | Sessions trigger every minute to rapidly generate tracking noise |
| ☠️ **Dead URL blacklist** | Failing URLs are permanently removed from the pool |
| 🛡️ **Dual phishing detection** | Google Safe Browsing + Local ML XGBoost run on every URL |
| 📜 **URL history** | Last 50 checked URLs shown in dashboard |
| ⏹️ **Stop Generator button** | Instantly halts all noise generation and closes open noise tabs |
| 🍪 **Cookie manager** | Three cleanup modes: Safe, Balanced, Aggressive |

---

## Installation (Developer Mode)

1. Clone or download this repository.
2. Open Chrome → navigate to `chrome://extensions/`
3. Toggle **Developer mode** ON (top-right).
4. Click **Load unpacked** → select the project folder.
5. The DCG icon will appear in your Chrome toolbar.

---

## Setup: Google Safe Browsing API (Optional)

Without an API key, the dashboard falls back to Local ML only.  
1. Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Create a project → enable the **Safe Browsing API**
3. Generate an **API key**
4. Open `phishing_detector.js` and paste it into `SAFE_BROWSING_API_KEY`.
5. Reload the extension.

---

## Retraining the ML Model

The XGBoost phishing model (`best_model.json`) was trained on a combination of:
1. PhiUSIIL Phishing URL Dataset (235,795 URLs)
2. Legacy `malicious_phish.csv`
3. Tranco Top-1M legitimate domains (auto-downloaded)

To retrain:

```bash
pip install pandas scikit-learn xgboost lightgbm requests
python train_models.py
```

This compares XGBoost and LightGBM — then automatically exports the best compact model to `best_model.json` and embeds it directly into `phishing_detector.js`.

---

## Privacy Notes

- **No data leaves your device** (except optional Google Safe Browsing API calls).
- The extension does not track, log, or transmit any of your real browsing activity.
- Fingerprint spoofing occurs locally inside your browser tabs.
