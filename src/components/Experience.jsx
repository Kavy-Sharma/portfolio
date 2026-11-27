import React from 'react';
import siteData from '../../content/site.json';

export default function Experience() {
  const experiences = siteData.experience || [];
  const person = siteData.person || {};

  return (
    <section id="experience" className="section-wrapper">
      <div className="site-container">
        <div className="section-label">
          <span>Background</span>
        </div>
        <h2 className="section-title">Experience &amp; Education</h2>
        <p className="section-desc">
          Structured research and practical penetration testing engagements backed by verifiable institutional credentials.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'clamp(20px, 3vw, 32px)',
          marginTop: 'var(--space-xl)'
        }}>
          {/* Work Internships */}
          <div style={{ gridColumn: 'span 12' }} className="exp-col-work">
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 'var(--space-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span className="mono" style={{ fontSize: '0.8125rem', color: 'var(--color-accent)' }}>01</span>
              <span>Professional Internships</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {experiences.map((exp) => (
                <div
                  key={exp.organization}
                  className="surface-card"
                  style={{
                    padding: '24px',
                    border: 'var(--hairline)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text)' }}>
                        {exp.role} &bull; {exp.organization}
                      </h4>
                      <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-accent2)' }}>
                        {exp.type}
                      </span>
                    </div>

                    <span className="mono" style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      backgroundColor: 'var(--color-bg)',
                      border: 'var(--hairline)',
                      color: 'var(--color-muted)',
                      borderRadius: '2px'
                    }}>
                      {exp.period}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-muted)',
                    lineHeight: 1.5,
                    marginTop: '8px'
                  }}>
                    {exp.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Academic Rigor */}
          <div style={{ gridColumn: 'span 12' }} className="exp-col-edu">
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 'var(--space-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span className="mono" style={{ fontSize: '0.8125rem', color: 'var(--color-accent2)' }}>02</span>
              <span>Degree &amp; Academic Focus</span>
            </h3>

            <div
              className="surface-card"
              style={{
                padding: '24px',
                border: 'var(--hairline)',
                height: 'calc(100% - 44px)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    B.E. Electronics &amp; Computer Engineering
                  </h4>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                    MBM University &bull; Jodhpur, India
                  </span>
                </div>

                <span className="mono" style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  backgroundColor: 'var(--color-bg)',
                  border: 'var(--hairline)',
                  color: 'var(--color-muted)',
                  borderRadius: '2px'
                }}>
                  2023 &ndash; 2027
                </span>
              </div>

              <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-muted)',
                lineHeight: 1.5,
                marginTop: '12px'
              }}>
                Coursework integrates computer architecture, embedded microcontrollers, network protocols, digital communications, and distributed software systems. Hands-on laboratory projects include hardware interfacing on ESP32 microcontrollers and low-level packet analysis.
              </p>

              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: 'var(--hairline)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  Current Target:
                </span>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-text)', fontWeight: 600 }}>
                  {person.goal || 'Internship and full-time roles in VAPT and AI security'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .exp-col-work {
            grid-column: span 6 !important;
          }
          .exp-col-edu {
            grid-column: span 6 !important;
          }
        }
      `}</style>
    </section>
  );
}
