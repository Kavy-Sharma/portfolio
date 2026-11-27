import React, { useState, useEffect } from 'react';
import siteData from '../../content/site.json';

export default function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const person = siteData.person || {};
  const email = person.email || 'kavysharma196@gmail.com';

  useEffect(() => {
    // Check if /resume.pdf exists and is actually a PDF (not Vite's index.html fallback)
    fetch('/resume.pdf', { method: 'HEAD' })
      .then((res) => {
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('pdf')) {
          setHasResume(true);
        } else {
          setHasResume(false);
        }
      })
      .catch(() => setHasResume(false));
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="contact" className="section-wrapper" style={{ borderBottom: 'none' }}>
      <div className="site-container">
        <div className="section-label">
          <span>Get In Touch</span>
        </div>
        <h2 className="section-title">Direct Contact</h2>
        <p className="section-desc">
          Available for technical security research internships and full-time VAPT / AI security roles. Let's discuss defensive architecture, exploit mechanics, or practical testing.
        </p>

        <div className="surface-card" style={{
          padding: 'clamp(28px, 4vw, 48px)',
          border: 'var(--hairline)',
          marginTop: 'var(--space-xl)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <div>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                PRIMARY EMAIL
              </span>
              <div style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: 600,
                color: 'var(--color-text)',
                margin: '6px 0 16px',
                wordBreak: 'break-all'
              }}>
                {email}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="mono"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    backgroundColor: 'var(--color-text)',
                    color: 'var(--color-bg)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    borderRadius: '2px',
                    cursor: 'pointer',
                    transition: 'opacity var(--transition-ui)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <span>{copiedEmail ? 'Email Copied to Clipboard' : 'Copy Email Address'}</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>

                {hasResume ? (
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      border: 'var(--hairline)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      borderRadius: '2px'
                    }}
                  >
                    <span>Download Resume</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="mono"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      border: 'var(--hairline)',
                      backgroundColor: 'var(--color-bg)',
                      color: 'var(--color-muted)',
                      fontSize: '0.8125rem',
                      borderRadius: '2px',
                      cursor: 'not-allowed',
                      opacity: 0.7
                    }}
                  >
                    <span>Resume (coming soon)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Social channels */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              borderLeft: 'var(--hairline)',
              paddingLeft: 'clamp(16px, 3vw, 32px)'
            }} className="contact-social-col">
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                NETWORK &amp; PLATFORMS
              </span>

              <a
                href={person.linkedin || 'https://linkedin.com/in/kavysharma'}
                target="_blank"
                rel="noopener noreferrer"
                className="mono"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>LinkedIn</span>
                <span aria-hidden="true">&rarr;</span>
              </a>

              <a
                href={person.github || 'https://github.com/Kavy-Sharma'}
                target="_blank"
                rel="noopener noreferrer"
                className="mono"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>GitHub</span>
                <span aria-hidden="true">&rarr;</span>
              </a>

              <a
                href={person.tryhackme || 'https://tryhackme.com/p/kavysharma196'}
                target="_blank"
                rel="noopener noreferrer"
                className="mono"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>TryHackMe Profile</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .contact-social-col {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: var(--hairline);
            padding-top: 20px;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
