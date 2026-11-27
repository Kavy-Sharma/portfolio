import React from 'react';
import siteData from '../../content/site.json';

export default function Journey() {
  const chapters = siteData.journey || [];

  return (
    <section id="journey" className="section-wrapper">
      <div className="site-container">
        <div className="section-label">
          <span>Evolution</span>
        </div>
        <h2 className="section-title">Technical Journey</h2>
        <p className="section-desc">
          Growth structured around deliberate concepts and problem domains rather than arbitrary milestones.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(16px, 2vw, 24px)',
          marginTop: 'var(--space-xl)'
        }}>
          {chapters.map((ch) => (
            <div
              key={ch.chapter}
              className="surface-card journey-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '200px',
                transition: 'border-color var(--transition-ui)'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-md)'
                }}>
                  <span className="mono" style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-accent)',
                    fontWeight: 600
                  }}>
                    CHAPTER {String(ch.chapter).padStart(2, '0')}
                  </span>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-line)'
                  }} />
                </div>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: 'var(--space-xs)',
                  color: 'var(--color-text)'
                }}>
                  {ch.title}
                </h3>

                <p style={{
                  fontSize: '0.9375rem',
                  color: 'var(--color-muted)',
                  lineHeight: 1.55
                }}>
                  {ch.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
