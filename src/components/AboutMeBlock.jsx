import React, { useState } from 'react';

/**
 * AboutMeBlock Component
 * 1. Short block with photo (project-notes/me.jpg if it exists; clean avatar placeholder if not)
 * 2. 4 lines from project-notes/about.md verbatim
 * 3. Education line (MBM University, B.E. Electronics & Computer Engineering, 2023-2027)
 */
export default function AboutMeBlock() {
  const [photoError, setPhotoError] = useState(false);

  return (
    <section className="about-me-section" id="about" aria-label="About Kavy Sharma">
      <div className="section-head">
        <span className="mono" style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'var(--mu)', textTransform: 'uppercase' }}>
          ABOUT ME &middot; EDUCATION &amp; READINESS
        </span>
        <h2 className="section-title">Who I am</h2>
      </div>

      <div className="about-me-container">
        {/* Photo or Clean Architectural Monogram Fallback */}
        <div className="about-me-photo-wrap">
          {!photoError ? (
            <img
              src="/me.jpg"
              alt="Kavy Sharma"
              className="about-me-photo"
              onError={() => setPhotoError(true)}
            />
          ) : (
            <div className="about-me-avatar-fallback" aria-label="Kavy Sharma avatar placeholder">
              <div className="avatar-monogram">KS</div>
              <span className="avatar-caption mono">Kavy Sharma</span>
            </div>
          )}
        </div>

        {/* Content Block */}
        <div className="about-me-content">
          {/* Education Line */}
          <div className="about-education-badge">
            <span className="edu-icon" aria-hidden="true">&#x1F393;</span>
            <div className="edu-details">
              <strong>MBM University</strong>
              <span className="edu-sub">B.E. Electronics &amp; Computer Engineering &middot; 2023–2027</span>
            </div>
          </div>

          {/* 4 Lines Verbatim from project-notes/about.md */}
          <div className="about-verbatim-lines">
            <p className="about-line">
              <span className="about-line-bullet" aria-hidden="true">&bull;</span>
              <span>I am open for the roles in internships and entry level jobs for Cybersecurity, VAPT, AI security, Jr. Pentester etc.</span>
            </p>
            <p className="about-line">
              <span className="about-line-bullet" aria-hidden="true">&bull;</span>
              <span>Can locate anywhere.</span>
            </p>
            <p className="about-line">
              <span className="about-line-bullet" aria-hidden="true">&bull;</span>
              <span>I can start according to the situation like right now I can start from the first week of january 2027.</span>
            </p>
            <p className="about-line">
              <span className="about-line-bullet" aria-hidden="true">&bull;</span>
              <span>I can reply in less than a day.</span>
            </p>
          </div>

          {/* Contact Jump Button */}
          <div className="about-action-row">
            <a
              href="#ground"
              onClick={(e) => {
                e.preventDefault();
                const ground = document.getElementById('ground') || document.getElementById('contact');
                if (ground) {
                  ground.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="about-contact-btn"
            >
              Knock on the door &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
