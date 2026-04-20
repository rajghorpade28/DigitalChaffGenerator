# 🛡️ Digital Chaff Generator (DCG)

**Reclaiming Your Digital Privacy through Behavioral Obfuscation.**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Chrome Manifest V3](https://img.shields.io/badge/Chrome-MV3-orange.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Build: Webpack](https://img.shields.io/badge/Build-Webpack-blueviolet.svg)](https://webpack.js.org/)

---

## 📖 Overview

The **Digital Chaff Generator (DCG)** is a high-performance, privacy-centric Chrome extension designed to counteract intrusive behavioral profiling. By injecting realistic, client-side browsing "noise" during idle periods, DCG increases your local behavioral entropy and decreases the certainty of tracker profiling.

Unlike simple blockers, DCG uses a **Persona-Based Interaction Engine** to simulate diverse, human-like browsing patterns, effectively "drowning out" your true digital footprint with high-quality chaff.

---

## ✨ Core Features

### 🧠 Intelligent Persona Engine
Switch between randomized personas (e.g., *Tech Curious*, *Health Conscious*, *Finance Planner*) to generate realistic background traffic that misleads behavioral algorithms.

### 📊 Real-Time Metrics Dashboard
Track your impact with a custom local analytics suite:
- **Entropy Score**: A live measurement of your browsing unpredictability.
- **Tracking Certainty**: A calculated estimate of how accurately a profile can be built on your activity.

### 🛡️ Advanced Phishing Shield
A modular detection engine with two modes:
- **Accurate Mode**: Real-time validation via Google Safe Browsing API.
- **Privacy Mode**: 100% local analysis using ML scoring and a trusted domain allowlist.

### 🍪 Risk-Based Cookie Sanitizer
A categorical cleanup tool that protects essential session/auth cookies while surgically removing high-risk tracking and marketing cookies based on a custom classification engine.

---

## 🏗️ Technical Architecture

DCG is built with a custom **Hybrid Development Workflow**:

- **Modern Bundling**: Powered by **Webpack 5** for high-performance bundling and minification.
- **Production Hardening**: Integrated **JavaScript Obfuscation** to protect internal logic and prevent reverse engineering.
- **Manifest V3 Native**: Fully compliant with modern Chrome security standards, utilizing background service workers for resource efficiency.

---

## 🚀 Getting Started

### For Users (Production)
1.  Download or build the latest release.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode**.
4.  Click **Load unpacked** and select the **`dist/`** folder.

### For Developers
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Load the **root folder** in Chrome for instant testing (Developer Mode).
4.  To generate a production-ready build:
    ```bash
    npm run build
    ```

---

## 🔒 Privacy Commitment

DCG is designed with a **Zero-Data** philosophy:
- ❌ No data collection.
- ❌ No external tracking.
- ✅ 100% Client-side execution.
*All metrics and logs stay on your local machine.*

---

## 📜 License
This project is licensed under the **ISC License**. See the `package.json` for details.

---

> [!TIP]
> **Pro Tip**: Use "Active Sessions" to monitor the Chaff Generator in real-time as it opens and manages background tabs while you're away!
