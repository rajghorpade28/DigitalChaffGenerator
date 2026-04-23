import React from 'react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__glow hero__glow--1" />
      <div className="hero__glow hero__glow--2" />

      <div className="container hero__inner">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Privacy Defense Tool · Chrome Extension
        </div>

        <h1 className="hero__title">
          Fight Tracking.<br />
          <span className="hero__title-grad">Generate Noise.</span>
        </h1>

        <p className="hero__subtitle">
          Digital Chaff Generator floods trackers with realistic fake browsing data — making it
          impossible to build an accurate profile of <em>you</em>.
        </p>

        <div className="hero__actions">
          <a href="#install" className="btn btn--primary">
            ⚡ Install Extension
          </a>
          <a href="https://github.com/rajghorpade28/DigitalChaffGenerator" target="_blank" rel="noreferrer" className="btn btn--ghost">
            ★ View on GitHub
          </a>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-value">98.86%</span>
            <span className="hero__stat-label">ML Accuracy</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-value">5</span>
            <span className="hero__stat-label">Personas</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-value">70s</span>
            <span className="hero__stat-label">Per Session</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-value">0</span>
            <span className="hero__stat-label">Data Sent</span>
          </div>
        </div>
      </div>
    </section>
  );
}
