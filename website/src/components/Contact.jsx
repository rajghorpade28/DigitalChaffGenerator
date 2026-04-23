import React, { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const form = e.target;
    const data = new FormData(form);

    try {
      const res = await fetch('https://formsubmit.co/ajax/sparemail101.11@gmail.com', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      const json = await res.json();
      if (json.success === 'true' || json.success === true) {
        setSent(true);
        form.reset();
      } else {
        // Fallback: submit form normally (causes page redirect)
        form.submit();
      }
    } catch {
      // Network error: submit form normally as fallback
      form.submit();
    }
    setSending(false);
  };

  return (
    <section className="contact section" id="contact">
      <div className="contact__glow" />
      <div className="container contact__inner">
        <div className="contact__left">
          <span className="section-tag">✦ Get In Touch</span>
          <h2 className="section-title" style={{ textAlign: 'left', marginTop: '12px' }}>
            Let's talk privacy
          </h2>
          <p className="section-sub" style={{ textAlign: 'left' }}>
            Have questions about DCG, want to report a bug, or just want to talk about digital privacy? Drop us a message and we'll get back to you.
          </p>

          <div className="contact__info">
            <div className="contact__info-item">
              <span className="contact__info-icon">📬</span>
              <div>
                <p className="contact__info-label">Email</p>
                <p className="contact__info-value">sparemail101.11@gmail.com</p>
              </div>
            </div>
            <div className="contact__info-item">
              <span className="contact__info-icon">💻</span>
              <div>
                <p className="contact__info-label">GitHub</p>
                <a
                  className="contact__info-value contact__info-link"
                  href="https://github.com/rajghorpade28/DigitalChaffGenerator"
                  target="_blank"
                  rel="noreferrer"
                >
                  rajghorpade28/DigitalChaffGenerator
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="contact__right">
          <div className="contact__form-wrap glass-card">
            {sent ? (
              <div className="contact__success">
                <span className="contact__success-icon">✅</span>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. We'll get back to you soon.</p>
                <button className="btn btn--ghost" onClick={() => setSent(false)}>Send another</button>
              </div>
            ) : (
              <form
                className="contact__form"
                onSubmit={handleSubmit}
                action="https://formsubmit.co/ajax/sparemail101.11@gmail.com"
                method="POST"
              >
                {/* FormSubmit config fields */}
                <input type="hidden" name="_subject" value="DCG Website — New Message" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="text" name="_honey" style={{ display: 'none' }} />

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Name</label>
                    <input
                      id="name"
                      className="form-input"
                      type="text"
                      name="name"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                      id="email"
                      className="form-input"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    className="form-input"
                    type="text"
                    name="subject"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    className="form-input form-textarea"
                    name="message"
                    placeholder="Tell us more..."
                    rows={5}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn--primary contact__submit"
                  disabled={sending}
                >
                  {sending ? '⏳ Sending...' : '🚀 Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

