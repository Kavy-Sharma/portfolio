import React from 'react';
import siteData from '../../content/site.json';
import PhishSimDemo from './demos/PhishSimDemo';
import AegisDemo from './demos/AegisDemo';
import SentinelFlowDemo from './demos/SentinelFlowDemo';
import SafeLineDemo from './demos/SafeLineDemo';

export default function Projects() {
  const projects = siteData.projects || [];

  const renderDemo = (demoType) => {
    switch (demoType) {
      case 'attack_replay':
        return <PhishSimDemo />;
      case 'prompt_pipeline':
        return <AegisDemo />;
      case 'packet_stream':
        return <SentinelFlowDemo />;
      case 'lab_diagram':
        return <SafeLineDemo />;
      default:
        return null;
    }
  };

  return (
    <section id="projects" className="section-wrapper">
      <div className="site-container">
        <div className="section-label">
          <span>Engineered Tools</span>
        </div>
        <h2 className="section-title">Projects &amp; Systems</h2>
        <p className="section-desc">
          Defensive gateways, detection engines, and security simulators built to dissect real attack behaviors and establish empirical verification.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(48px, 6vw, 80px)',
          marginTop: 'var(--space-xl)'
        }}>
          {projects.map((proj, idx) => (
            <article
              key={proj.id}
              className="project-spread surface-card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: 'clamp(20px, 3vw, 40px)',
                padding: 'clamp(24px, 4vw, 44px)'
              }}
            >
              {/* Left Column: Context & Red/Blue perspective */}
              <div style={{
                gridColumn: 'span 12',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }} className="project-editorial-info">
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: 'var(--space-xs)',
                    flexWrap: 'wrap'
                  }}>
                    <span className="mono" style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-accent)',
                      fontWeight: 600
                    }}>
                      PROJECT {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span style={{ color: 'var(--color-line)' }}>&bull;</span>
                    <span className="mono" style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-muted)'
                    }}>
                      {proj.status}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: 'clamp(1.5rem, 2.5vw, 2.125rem)',
                    fontWeight: 700,
                    marginBottom: '6px',
                    color: 'var(--color-text)',
                    letterSpacing: '-0.025em'
                  }}>
                    {proj.name}
                  </h3>

                  <p style={{
                    fontSize: '1rem',
                    color: 'var(--color-muted)',
                    lineHeight: 1.5,
                    marginBottom: 'var(--space-md)'
                  }}>
                    {proj.subtitle}
                  </p>

                  {/* Red & Blue lines */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    margin: 'var(--space-md) 0',
                    padding: '16px',
                    backgroundColor: 'var(--color-bg)',
                    border: 'var(--hairline)',
                    borderRadius: '2px'
                  }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span className="mono" style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color: 'var(--color-accent)',
                        minWidth: '45px',
                        paddingTop: '2px'
                      }}>
                        RED:
                      </span>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.45 }}>
                        {proj.red}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span className="mono" style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color: 'var(--color-accent2)',
                        minWidth: '45px',
                        paddingTop: '2px'
                      }}>
                        BLUE:
                      </span>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.45 }}>
                        {proj.blue}
                      </p>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.9375rem',
                    color: 'var(--color-muted)',
                    lineHeight: 1.6,
                    marginBottom: 'var(--space-md)'
                  }}>
                    {proj.description}
                  </p>

                  {/* Honest Limits Callout */}
                  {proj.limits && (
                    <div style={{
                      padding: '10px 14px',
                      borderLeft: '2px solid var(--color-line)',
                      marginBottom: 'var(--space-md)',
                      backgroundColor: 'var(--color-surface)'
                    }}>
                      <span className="mono" style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: 'var(--color-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'block',
                        marginBottom: '2px'
                      }}>
                        Limits &amp; Operational Scope:
                      </span>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
                        {proj.limits}
                      </p>
                    </div>
                  )}

                  {/* Tech stack badges */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginBottom: 'var(--space-md)'
                  }}>
                    {proj.stack.map((tech) => (
                      <span
                        key={tech}
                        className="mono"
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          border: 'var(--hairline)',
                          borderRadius: '2px',
                          color: 'var(--color-muted)',
                          backgroundColor: 'var(--color-bg)'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* External links */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  paddingTop: 'var(--space-sm)',
                  borderTop: 'var(--hairline)'
                }}>
                  {proj.live_url && (
                    <a
                      href={proj.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
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
                      <span>Live Demo</span>
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  )}

                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono"
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Repository</span>
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Animated Canvas / SVG Interactive Demo */}
              <div style={{ gridColumn: 'span 12' }} className="project-editorial-demo">
                {renderDemo(proj.demo_type)}
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .project-editorial-info {
            grid-column: span 6 !important;
          }
          .project-editorial-demo {
            grid-column: span 6 !important;
          }
        }
      `}</style>
    </section>
  );
}
