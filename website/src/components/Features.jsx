import React from 'react';
import './Features.css';

const FEATURES = [
  {
    icon: '🎭',
    title: 'Persona-Driven Noise',
    desc: 'Rotates between 5 browsing personas — Tech, Health, Finance, Travel, News — every 2 hours for diverse, realistic footprints.',
    color: '#4f8ef7',
  },
  {
    icon: '🤖',
    title: 'Human Simulation',
    desc: 'Advanced behavior engine simulates scrolling, mouse movements, text selection, and internal link clicks for 70 seconds per session.',
    color: '#a78bfa',
  },
  {
    icon: '🧬',
    title: 'Fingerprint Spoofing',
    desc: 'Disrupts Canvas and WebGL fingerprinting scripts with active noise injection directly into browser rendering APIs.',
    color: '#34d399',
  },
  {
    icon: '🔍',
    title: 'Dual Phishing Detection',
    desc: 'Every URL is analyzed by a local XGBoost ML model (98.86% acc) AND live Google Safe Browsing API simultaneously.',
    color: '#fb923c',
  },
  {
    icon: '🧹',
    title: 'Smart Cookie Cleanup',
    desc: 'Three-level risk-based cookie management — Safe, Balanced, and Aggressive — to purge trackers on demand.',
    color: '#f472b6',
  },
  {
    icon: '☠️',
    title: 'Dead URL Blacklist',
    desc: 'Failing URLs are permanently blacklisted in local storage, keeping noise sessions fast and error-free over time.',
    color: '#60a5fa',
  },
];

export default function Features() {
  return (
    <section className="features section" id="features">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">✦ Core Capabilities</span>
          <h2 className="section-title">Everything you need to disappear</h2>
          <p className="section-sub">A full privacy stack running silently in the background — no configuration needed.</p>
        </div>

        <div className="features__grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card glass-card">
              <div className="feature-card__icon" style={{ background: `${f.color}22`, borderColor: `${f.color}44` }}>
                <span>{f.icon}</span>
              </div>
              <h3 className="feature-card__title" style={{ color: f.color }}>{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
