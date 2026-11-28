import React from 'react';
import SpotThePhishGame from './SpotThePhishGame';

export default function PhishSimShowcase() {
  return (
    <div className="phishsim-showcase-wrapper">
      {/* Live Demo Link Bar + Sandbox Truthful Note */}
      <div className="phish-live-action-bar" role="region" aria-label="Live Demo Link">
        <div className="live-demo-cta-row">
          <a
            href="https://phishsim-ai.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="phish-live-link-btn"
          >
            Open the live demo &rarr;
          </a>
          <span className="mono phish-sandbox-notice">
            &#9679; Sandbox mode, sample data, no real email is sent
          </span>
        </div>
        <p className="phish-sandbox-subtext">
          Free cloud instance hosted on Render (may take up to 60s to wake from sleep). Operates in safe sandbox mode with simulated SMTP delivery and mock recipients.
        </p>
      </div>

      {/* Simple Device Frames: Landing Page + Campaign Dashboard */}
      <section className="phish-device-frames-section" aria-label="PhishSim Interface Screenshots">
        <div className="phish-section-header">
          <span className="mono tag" style={{ borderColor: 'var(--ac)', color: 'var(--ac)' }}>
            APPLICATION SCREENS
          </span>
          <h3 style={{ margin: '8px 0 4px', font: '800 22px var(--font-display)', color: 'var(--ink)' }}>
            Landing Page &amp; Readiness Dashboard
          </h3>
          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--mu)', lineHeight: 1.45 }}>
            Simple device frames showing the public reconnaissance scanner and the executive awareness dashboard.
          </p>
        </div>

        <div className="phish-frames-grid">
          {/* Frame 1: Landing Page */}
          <div className="device-screen-card">
            <div className="screen-card-header">
              <div className="browser-dots" aria-hidden="true">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
              <span className="mono screen-card-url">phishsim-ai.onrender.com · home</span>
              <span className="mono screen-card-tag real">REAL SCREENSHOT</span>
            </div>
            <div className="screen-img-wrap">
              <img
                src="/screens/phishsim-landing.webp"
                alt="PhishSim AI landing page with Attack Lab and public reconnaissance scanner"
                className="screen-img"
                loading="lazy"
                width="720"
                height="420"
              />
            </div>
            <div className="screen-card-caption">
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>Landing &amp; Attack Surface Scanner</strong>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--mu)', lineHeight: 1.4 }}>
                Public portal featuring mascot "Lure", PhishRecon DNS checks, and the Attack Lab for previewing tailored email lures.
              </p>
            </div>
          </div>

          {/* Frame 2: Readiness Dashboard */}
          <div className="device-screen-card">
            <div className="screen-card-header">
              <div className="browser-dots" aria-hidden="true">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
              <span className="mono screen-card-url">phishsim-ai.onrender.com · dashboard</span>
              <span className="mono screen-card-tag real">REAL SCREENSHOT</span>
            </div>
            <div className="screen-img-wrap">
              <img
                src="/screens/phishsim-dashboard.webp"
                alt="PhishSim AI security readiness dashboard showing team vulnerability trends and risk score"
                className="screen-img"
                loading="lazy"
                width="720"
                height="420"
              />
            </div>
            <div className="screen-card-caption">
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>Team Readiness &amp; Risk Dashboard</strong>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--mu)', lineHeight: 1.4 }}>
                Real-time tracking of simulated campaigns, employee reporting rates, weekly risk briefings, and automated AI prevention advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights from facts.md */}
      <section className="phish-features-ledger" aria-label="Key Built Capabilities">
        <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
          Platform Architecture &amp; Capabilities
        </h4>
        <div className="phish-feature-grid">
          <div className="phish-feature-item">
            <span className="feature-icon" aria-hidden="true">&#x1F41F;</span>
            <div>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>Mascot "Lure"</strong>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--mu)', lineHeight: 1.4 }}>
                Companion guide who stays with the defender across every view, providing context and tips.
              </p>
            </div>
          </div>

          <div className="phish-feature-item">
            <span className="feature-icon" aria-hidden="true">&#x2697;</span>
            <div>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>Attack Lab</strong>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--mu)', lineHeight: 1.4 }}>
                Edit and test realistic email lures in an isolated sandbox to see how they render across clients.
              </p>
            </div>
          </div>

          <div className="phish-feature-item">
            <span className="feature-icon" aria-hidden="true">&#x1F6E1;</span>
            <div>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>Integrated Toolkit</strong>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--mu)', lineHeight: 1.4 }}>
                PhishRecon (SPF/DMARC/look-alikes), Threat Analyser, Header Analyser, URL Decoder, Breach Check.
              </p>
            </div>
          </div>

          <div className="phish-feature-item">
            <span className="feature-icon" aria-hidden="true">&#x1F4DA;</span>
            <div>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>"You Clicked a Phish" Page</strong>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--mu)', lineHeight: 1.4 }}>
                Constructive educational landing page explaining the exact red flags and safe reporting habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Card Spot the Phish Mini Game */}
      <SpotThePhishGame />
    </div>
  );
}
