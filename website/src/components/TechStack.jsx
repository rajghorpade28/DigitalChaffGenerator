import React from 'react';
import './TechStack.css';

const STACK = [
  {
    category: '🔧 Extension Core',
    items: [
      { name: 'JavaScript ES6+', desc: 'Service Workers, Manifest V3, async logic' },
      { name: 'Webpack 5', desc: 'Bundling, minification, obfuscation' },
      { name: 'Dotenv', desc: 'Secure API key injection at build time' },
      { name: 'Chrome APIs', desc: 'Tabs, Scripting, Storage, Alarms, Idle' },
    ]
  },
  {
    category: '🧠 Machine Learning',
    items: [
      { name: 'XGBoost', desc: 'Gradient boosting — 98.86% phishing accuracy' },
      { name: 'Python 3.10', desc: 'Training pipeline and dataset processing' },
      { name: 'Pandas', desc: '235k+ URL dataset classification' },
      { name: 'Scikit-learn', desc: 'Feature engineering and evaluation' },
    ]
  },
  {
    category: '🌐 APIs & Services',
    items: [
      { name: 'Google Safe Browsing v4', desc: 'Live cloud URL threat lookup' },
      { name: 'FormSubmit', desc: 'Serverless contact form submission' },
      { name: 'Tranco Top-1M', desc: 'Legitimate domain allowlist' },
    ]
  },
];

export default function TechStack() {
  return (
    <section className="tech section" id="tech">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">✦ Tech Stack</span>
          <h2 className="section-title">Built with precision</h2>
          <p className="section-sub">A carefully assembled stack spanning browser extension engineering and applied machine learning.</p>
        </div>

        <div className="tech__grid">
          {STACK.map(group => (
            <div key={group.category} className="tech-group glass-card">
              <h3 className="tech-group__title">{group.category}</h3>
              <ul className="tech-group__list">
                {group.items.map(item => (
                  <li key={item.name} className="tech-group__item">
                    <span className="tech-group__name">{item.name}</span>
                    <span className="tech-group__desc">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
