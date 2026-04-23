import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__left">
          <span className="footer__logo">🛡️ DCG</span>
          <p className="footer__tagline">Fighting trackers with noise. One session at a time.</p>
        </div>
        <div className="footer__links">
          <a href="#features">Features</a>
          <a href="#architecture">Architecture</a>
          <a href="#tech">Tech Stack</a>
          <a href="#install">Install</a>
          <a href="#contact">Contact</a>
        </div>
        <p className="footer__copy">© 2026 Digital Chaff Generator. Built for the privacy-conscious.</p>
      </div>
    </footer>
  );
}
