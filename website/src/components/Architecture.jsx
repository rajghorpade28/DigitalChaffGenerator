import React from 'react';
import './Architecture.css';

export default function Architecture() {
  return (
    <section className="arch section" id="architecture">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">✦ System Design</span>
          <h2 className="section-title">Architecture &amp; Flow</h2>
          <p className="section-sub">A layered defense system with ML and cloud working in parallel.</p>
        </div>

        <div className="arch__images">
          <div className="arch__img-wrap glass-card">
            <p className="arch__img-caption">Full System Architecture</p>
            <img
              src="https://raw.githubusercontent.com/rajghorpade28/DigitalChaffGenerator/master/assets/architecture_detailed.jpg"
              alt="Detailed Architecture Diagram"
              className="arch__img"
              onError={e => e.target.style.display='none'}
            />
          </div>
          <div className="arch__img-wrap glass-card">
            <p className="arch__img-caption">Client-Side Security Flow</p>
            <img
              src="https://raw.githubusercontent.com/rajghorpade28/DigitalChaffGenerator/master/assets/architecture_flow.jpg"
              alt="System Flow Diagram"
              className="arch__img"
              onError={e => e.target.style.display='none'}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
