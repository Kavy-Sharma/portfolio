import React from 'react';
import { useLocation } from 'wouter';
import siteData from '../../content/site.json';

export default function JourneyTeaser() {
  const [, navigate] = useLocation();
  const chapters = siteData.journey || [
    {
      chapter: 1,
      title: 'Networking & Port Foundations',
      description: 'Understanding TCP/UDP protocols, service handshakes, and network boundary enumeration.'
    },
    {
      chapter: 2,
      title: 'First Target Machines',
      description: 'Hands-on exploitation across HackTheBox Starting Point (Meow, Fawn, Dancing) and TryHackMe Linux targets.'
    },
    {
      chapter: 3,
      title: 'Web Vulnerabilities & PortSwigger Labs',
      description: 'Systematic study of OWASP Top 10 vulnerabilities and hands-on PortSwigger Web Security Academy labs.'
    },
    {
      chapter: 4,
      title: 'Building Defensive & Testing Tools',
      description: 'Developing PhishSim AI, SentinelFlow hybrid NIDS, and the AegisAgent hardware-backed security gateway.'
    },
    {
      chapter: 5,
      title: 'Field Verification & Real Assessments',
      description: 'Translating research into practical penetration tests, DRDO & TechDefence work, and verified certifications.'
    }
  ];

  const handleOpenJourney = (e) => {
    e.preventDefault();
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(() => {
        navigate('/journey');
        window.scrollTo(0, 0);
      });
    } else {
      navigate('/journey');
      window.scrollTo(0, 0);
    }
  };

  return (
    <section id="journey" className="section-wrapper">
      <div className="site-container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: 'var(--space-md)'
        }}>
          <div>
            <div className="section-label">
              <span>Evolution</span>
            </div>
            <h2 className="section-title">Technical Journey</h2>
          </div>

          <a
            href="/journey"
            onClick={handleOpenJourney}
            className="mono"
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-accent)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>5 Chapters &rarr;</span>
          </a>
        </div>

        <p className="section-desc">
          Structured around deliberate technical milestones and core security concepts rather than arbitrary chronologies.
        </p>

        {/* 5 Chapters Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 'clamp(12px, 1.5vw, 18px)',
          marginTop: 'var(--space-xl)'
        }}>
          {chapters.map((ch) => (
            <div
              key={ch.chapter}
              className="surface-card journey-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: 'var(--hairline)',
                minHeight: '190px'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <span className="mono" style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-accent)',
                    fontWeight: 700
                  }}>
                    CH {String(ch.chapter).padStart(2, '0')}
                  </span>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-line)'
                  }} />
                </div>

                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: 'var(--color-ink)',
                  lineHeight: 1.3
                }}>
                  {ch.title}
                </h3>

                <p style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-muted)',
                  lineHeight: 1.5
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
