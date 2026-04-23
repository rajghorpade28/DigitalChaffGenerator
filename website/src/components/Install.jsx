import React from 'react';
import './Install.css';

const STEPS = [
  { num: '01', title: 'Clone the Repository', code: 'git clone https://github.com/rajghorpade28/DigitalChaffGenerator.git' },
  { num: '02', title: 'Install & Build', code: 'cd DigitalChaffGenerator\nnpm install && npm run build' },
  { num: '03', title: 'Load in Chrome', code: 'chrome://extensions → Developer Mode → Load Unpacked → select /dist' },
];

export default function Install() {
  return (
    <section className="install section" id="install">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">✦ Get Started</span>
          <h2 className="section-title">Up and running in 3 steps</h2>
          <p className="section-sub">No accounts. No subscriptions. Developer mode only.</p>
        </div>

        <div className="install__steps">
          {STEPS.map(step => (
            <div key={step.num} className="install-step glass-card">
              <span className="install-step__num">{step.num}</span>
              <div>
                <h3 className="install-step__title">{step.title}</h3>
                <pre className="install-step__code"><code>{step.code}</code></pre>
              </div>
            </div>
          ))}
        </div>

        <div className="install__note">
          <span>🔑</span>
          <p>Optionally, add your <strong>Google Safe Browsing API key</strong> in a <code>.env</code> file for live cloud threat checking. Without it, the local ML model provides full protection.</p>
        </div>
      </div>
    </section>
  );
}
