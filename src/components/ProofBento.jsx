import React from 'react';
import rawStats from '../../data/stats.json';

export default function ProofBento() {
  const stats = rawStats || {
    updated: '2026-11-25',
    portswigger: { apprentice: [0, 64], practitioner: [0, 175], expert: [0, 40] },
    tryhackme: { top_percent: 10, profile_url: 'https://tryhackme.com' },
    htb_starting_point: [],
    ctf: [],
    certificates: [],
    client_tests_plus: 0
  };

  // Compute PortSwigger metrics
  const appSolved = stats.portswigger?.apprentice?.[0] || 0;
  const appTotal = stats.portswigger?.apprentice?.[1] || 64;
  const pracSolved = stats.portswigger?.practitioner?.[0] || 0;
  const pracTotal = stats.portswigger?.practitioner?.[1] || 175;
  const expSolved = stats.portswigger?.expert?.[0] || 0;
  const expTotal = stats.portswigger?.expert?.[1] || 40;

  const totalSolved = appSolved + pracSolved + expSolved;
  const totalLabs = appTotal + pracTotal + expTotal;
  const totalPercent = totalLabs > 0 ? Math.round((totalSolved / totalLabs) * 100) : 0;

  const renderRing = (solved, total, color, label) => {
    const radius = 28;
    const circ = 2 * Math.PI * radius;
    const pct = total > 0 ? Math.min(1, solved / total) : 0;
    const strokeDash = `${circ * pct} ${circ * (1 - pct)}`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <div style={{ position: 'relative', width: '68px', height: '68px' }}>
          <svg width="68" height="68" viewBox="0 0 68 68" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="34"
              cy="34"
              r={radius}
              stroke="var(--color-line)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="34"
              cy="34"
              r={radius}
              stroke={color}
              strokeWidth="4"
              fill="none"
              strokeDasharray={strokeDash}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 600ms ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700
          }} className="mono">
            {solved}
          </div>
        </div>
        <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
          {label} ({total})
        </span>
      </div>
    );
  };

  return (
    <section id="proof" className="section-wrapper">
      <div className="site-container">
        <div className="section-label">
          <span>Verifiable Evidence</span>
        </div>
        <h2 className="section-title">Observable Proof</h2>
        <p className="section-desc">
          Empirical lab completions, competitive CTF standings, industry assessments, and active platform metrics.
        </p>

        {/* The One Bento Block */}
        <div className="proof-bento-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'clamp(16px, 2vw, 24px)',
          marginTop: 'var(--space-xl)'
        }}>
          {/* Bento Item 1: PortSwigger Web Security Academy Labs */}
          <div
            className="surface-card"
            style={{
              gridColumn: 'span 12',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: 'var(--hairline)',
              padding: 'clamp(20px, 3vw, 32px)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                  PORTSWIGGER WEB SECURITY ACADEMY
                </span>
                <h3 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text)', marginTop: '2px' }}>
                  Web Security Lab Progression
                </h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="mono" style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--color-text)'
                }}>
                  {totalSolved}
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}> / {totalLabs}</span>
                </span>
                <span className="mono" style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-accent2)',
                  display: 'block'
                }}>
                  {totalPercent}% Completion
                </span>
              </div>
            </div>

            {/* Three Rings */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              padding: '16px 0',
              borderTop: 'var(--hairline)',
              borderBottom: 'var(--hairline)'
            }}>
              {renderRing(appSolved, appTotal, 'var(--color-accent2)', 'Apprentice')}
              {renderRing(pracSolved, pracTotal, 'var(--color-accent)', 'Practitioner')}
              {renderRing(expSolved, expTotal, '#FF7A66', 'Expert')}
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '14px', lineHeight: 1.45 }}>
              Hands-on mastery across server-side and client-side web vulnerabilities: SQLi, XSS, CSRF, SSRF, SSTI, authentication bypasses, and access control testing.
            </p>
          </div>

          {/* Bento Item 2: TryHackMe Top Percent */}
          <div
            className="surface-card thm-bento-card"
            style={{
              gridColumn: 'span 6',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: 'var(--hairline)',
              padding: '24px'
            }}
          >
            <div>
              <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--color-accent2)', fontWeight: 600 }}>
                TRYHACKME STANDING
              </span>
              <div style={{ margin: '14px 0' }}>
                <div className="mono" style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  lineHeight: 1
                }}>
                  Top {stats.tryhackme?.top_percent}%
                </div>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  Global Platform Rank
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: 1.45 }}>
                Hands-on challenges spanning Linux enumeration, privilege escalation, network exploitation, and offensive tool usage.
              </p>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: 'var(--hairline)' }}>
              <a
                href={stats.tryhackme?.profile_url || 'https://tryhackme.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="mono"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-accent)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Verify Profile</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Bento Item 3: HTB Starting Point */}
          <div
            className="surface-card htb-bento-card"
            style={{
              gridColumn: 'span 6',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: 'var(--hairline)',
              padding: '24px'
            }}
          >
            <div>
              <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                HACK THE BOX
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', margin: '8px 0 12px' }}>
                Starting Point Tier 0
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {(stats.htb_starting_point || []).map((m) => (
                  <span
                    key={m}
                    className="mono"
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      backgroundColor: 'var(--color-bg)',
                      border: 'var(--hairline)',
                      color: 'var(--color-text)',
                      borderRadius: '2px'
                    }}
                  >
                    &bull; {m} (Cleared)
                  </span>
                ))}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: 1.45 }}>
                Target enumeration across exposed Telnet services, anonymous FTP storage, and unauthenticated SMB shares.
              </p>
            </div>

            <div className="mono" style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: 'var(--hairline)',
              fontSize: '0.75rem',
              color: 'var(--color-accent2)'
            }}>
              Tier 0 Completed
            </div>
          </div>

          {/* Bento Item 4: CTF Achievements */}
          <div
            className="surface-card ctf-bento-card"
            style={{
              gridColumn: 'span 4',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: 'var(--hairline)',
              padding: '24px'
            }}
          >
            <div>
              <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                COMPETITIVE CTF
              </span>
              {stats.ctf && stats.ctf[0] ? (
                <>
                  <div className="mono" style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    margin: '10px 0 4px'
                  }}>
                    Top &lt;{stats.ctf[0].rank_under}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    {stats.ctf[0].name}
                  </div>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                    {stats.ctf[0].date} &bull; Mode: {stats.ctf[0].mode}
                  </span>
                </>
              ) : (
                <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '8px' }}>
                  Solo CTF Competitor
                </div>
              )}
            </div>
            <div className="mono" style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: 'var(--hairline)',
              fontSize: '0.75rem',
              color: 'var(--color-muted)'
            }}>
              Solo Rank
            </div>
          </div>

          {/* Bento Item 5: Professional Certifications */}
          <div
            className="surface-card cert-bento-card"
            style={{
              gridColumn: 'span 4',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: 'var(--hairline)',
              padding: '24px'
            }}
          >
            <div>
              <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--color-accent2)', fontWeight: 600 }}>
                CERTIFICATIONS
              </span>
              {stats.certificates && stats.certificates[0] ? (
                <>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', margin: '10px 0 4px' }}>
                    {stats.certificates[0].name}
                  </h4>
                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                    {stats.certificates[0].issuer}
                  </div>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                    Issued: {stats.certificates[0].date}
                  </span>
                </>
              ) : null}
            </div>
            <div className="mono" style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: 'var(--hairline)',
              fontSize: '0.75rem',
              color: 'var(--color-accent2)'
            }}>
              Verified Credential
            </div>
          </div>

          {/* Bento Item 6: Practical Security Assessments */}
          <div
            className="surface-card vapt-bento-card"
            style={{
              gridColumn: 'span 4',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: 'var(--hairline)',
              padding: '24px'
            }}
          >
            <div>
              <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                FIELD ASSESSMENTS
              </span>
              <div className="mono" style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--color-text)',
                margin: '10px 0 4px'
              }}>
                {stats.client_tests_plus}+
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                Target Security Audits
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                Vulnerability assessments across web apps, APIs, and network perimeters.
              </p>
            </div>
            <div className="mono" style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: 'var(--hairline)',
              fontSize: '0.75rem',
              color: 'var(--color-muted)'
            }}>
              Updated: {stats.updated}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .thm-bento-card, .htb-bento-card {
            grid-column: span 12 !important;
          }
          .ctf-bento-card, .cert-bento-card, .vapt-bento-card {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}
