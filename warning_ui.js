/**
 * This function is injected into the target tab to show the phishing warning.
 * It is completely self-contained and uses a Shadow DOM to avoid CSS conflicts.
 */
export function showWarningOverlay(url, reason) {
    // Prevent duplicate warnings on the same page
    if (document.getElementById('dcg-phish-warning-root')) return;

    const root = document.createElement('div');
    root.id = 'dcg-phish-warning-root';
    root.style.all = 'initial'; // Reset everything for the host element
    document.body.appendChild(root);

    const shadow = root.attachShadow({ mode: 'closed' });

    const overlay = document.createElement('div');
    overlay.className = 'dcg-overlay';
    overlay.innerHTML = `
        <div class="dc-card">
            <div class="dc-icon">⚠️</div>
            <h1 class="dc-title">Security Risk Detected</h1>
            <p class="dc-text">
                Digital Chaff Generator has flagged this site (<span class="dc-url">${url}</span>) as high risk.
            </p>
            <div class="dc-reason">${reason}</div>
            <p class="dc-subtext">
                This site matches known phishing or malware patterns. Entering sensitive data or continuing may compromise your security.
            </p>
            <div class="dc-actions">
                <button id="dc-block" class="dc-btn dc-btn-primary">Get Me Out of Here</button>
                <button id="dc-continue" class="dc-btn dc-btn-secondary">Continue Anyway</button>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .dcg-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: white;
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .dc-card {
            background: rgba(30, 30, 35, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 40px;
            max-width: 450px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .dc-icon {
            font-size: 64px;
            margin-bottom: 20px;
            filter: drop-shadow(0 0 10px rgba(231, 76, 60, 0.5));
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .dc-title {
            font-size: 24px;
            font-weight: 800;
            margin: 0 0 12px 0;
            letter-spacing: -0.5px;
        }

        .dc-text {
            font-size: 15px;
            line-height: 1.5;
            color: rgba(255, 255, 255, 0.8);
            margin: 0 0 10px 0;
        }

        .dc-url {
            font-family: monospace;
            color: #58a6ff;
            background: rgba(88, 166, 255, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            word-break: break-all;
        }

        .dc-reason {
            font-size: 13px;
            font-weight: 600;
            color: #e74c3c;
            background: rgba(231, 76, 60, 0.1);
            border: 1px solid rgba(231, 76, 60, 0.2);
            padding: 8px 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: inline-block;
        }

        .dc-subtext {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 30px;
        }

        .dc-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .dc-btn {
            border: none;
            border-radius: 12px;
            padding: 14px 20px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .dc-btn-primary {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
        }
        .dc-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
        }

        .dc-btn-secondary {
            background: transparent;
            color: rgba(255, 255, 255, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .dc-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.05);
            color: white;
        }
    `;

    shadow.appendChild(style);
    shadow.appendChild(overlay);

    shadow.getElementById('dc-block').onclick = () => {
        chrome.runtime.sendMessage({ type: 'BLOCK_TAB' });
    };

    shadow.getElementById('dc-continue').onclick = () => {
        root.remove();
    };
}
