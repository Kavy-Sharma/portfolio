import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useTheme } from '../context/ThemeContext';

const PROJECTS_DATA = [
  {
    slug: 'phishsim',
    name: 'PhishSim AI',
    status: 'Live Demo (Sandbox Mode)',
    desc: 'Autonomous Agentic Phishing Simulator with passive attack-surface reconnaissance.',
    previewTitle: 'PhishSim Simulation Loop',
    previewType: 'phishsim'
  },
  {
    slug: 'aegis',
    name: 'AegisAgent',
    status: 'Working Hardware Integration',
    desc: 'Action-layer security gateway for local LLMs with physical attack-blocked LED.',
    previewTitle: '9-Gate Hardware Gateway',
    previewType: 'aegis'
  },
  {
    slug: 'sentinelflow',
    name: 'SentinelFlow',
    status: 'Completed Engine & Dashboard',
    desc: 'Explainable hybrid NIDS pairing heuristic rules with unsupervised Isolation Forest.',
    previewTitle: 'Packet Ingestion & Triage',
    previewType: 'sentinelflow'
  },
  {
    slug: 'safeline',
    name: 'SafeLine Lab',
    status: 'In progress',
    desc: 'Dual-VM web application firewall lab with TLS reverse proxy termination.',
    previewTitle: 'Reverse Proxy Topology',
    previewType: 'safeline'
  }
];

export default function ProjectsList() {
  const [, navigate] = useLocation();
  const { isAttack } = useTheme();
  const [hoveredProject, setHoveredProject] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [activeTouchSlug, setActiveTouchSlug] = useState(null);

  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  const handleProjectClick = (slug) => {
    // Stage 1 builds AegisAgent full story template at /projects/aegis
    const targetUrl = slug === 'aegis' ? '/projects/aegis' : `/projects/${slug}`;
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(() => {
        navigate(targetUrl);
        window.scrollTo(0, 0);
      });
    } else {
      navigate(targetUrl);
      window.scrollTo(0, 0);
    }
  };

  const renderMiniPreview = (type) => {
    switch (type) {
      case 'aegis':
        return (
          <svg viewBox="0 0 200 120" style={{ width: '100%', height: '100%' }}>
            <rect width="200" height="120" fill="var(--color-bg)" />
            {/* 3 stages */}
            <rect x="15" y="35" width="40" height="50" rx="2" fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth="1" />
            <text x="35" y="63" textAnchor="middle" fill="var(--color-ink)" fontSize="8" fontFamily="var(--font-mono)">LLM</text>
            <path d="M 55 60 L 80 60" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="2 2" />
            <rect x="80" y="30" width="45" height="60" rx="2" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="1.5" />
            <text x="102" y="58" textAnchor="middle" fill="var(--color-accent)" fontSize="8" fontWeight="700" fontFamily="var(--font-mono)">GATE</text>
            <text x="102" y="70" textAnchor="middle" fill="var(--color-alert)" fontSize="7" fontFamily="var(--font-mono)">BLOCKED</text>
            <path d="M 125 60 L 150 60" stroke="var(--color-line)" strokeWidth="1.5" />
            <rect x="150" y="35" width="38" height="50" rx="2" fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth="1" />
            <circle cx="169" cy="55" r="5" fill="var(--color-alert)" />
            <text x="169" y="72" textAnchor="middle" fill="var(--color-muted)" fontSize="7" fontFamily="var(--font-mono)">LED</text>
          </svg>
        );
      case 'phishsim':
        return (
          <svg viewBox="0 0 200 120" style={{ width: '100%', height: '100%' }}>
            <rect width="200" height="120" fill="var(--color-bg)" />
            <rect x="25" y="25" width="150" height="70" rx="2" fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth="1" />
            <path d="M 25 35 L 100 80 L 175 35" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
            <text x="100" y="105" textAnchor="middle" fill="var(--color-ink)" fontSize="8" fontFamily="var(--font-mono)">
              RECON &bull; DISPATCH &bull; REPORT
            </text>
          </svg>
        );
      case 'sentinelflow':
        return (
          <svg viewBox="0 0 200 120" style={{ width: '100%', height: '100%' }}>
            <rect width="200" height="120" fill="var(--color-bg)" />
            <line x1="20" y1="40" x2="180" y2="40" stroke="var(--color-line)" strokeWidth="1" />
            <line x1="20" y1="65" x2="180" y2="65" stroke="var(--color-line)" strokeWidth="1" />
            <circle cx="50" cy="40" r="4" fill="var(--color-ok)" />
            <circle cx="95" cy="40" r="4" fill="var(--color-ok)" />
            <circle cx="140" cy="40" r="5" fill="var(--color-alert)" />
            <text x="140" y="85" textAnchor="middle" fill="var(--color-alert)" fontSize="8" fontWeight="700" fontFamily="var(--font-mono)">
              T1046 DETECTED
            </text>
          </svg>
        );
      case 'safeline':
        return (
          <svg viewBox="0 0 200 120" style={{ width: '100%', height: '100%' }}>
            <rect width="200" height="120" fill="var(--color-bg)" />
            <rect x="20" y="45" width="40" height="30" rx="2" fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth="1" />
            <text x="40" y="63" textAnchor="middle" fill="var(--color-ink)" fontSize="7" fontFamily="var(--font-mono)">Kali</text>
            <path d="M 60 60 L 85 60" stroke="var(--color-line)" strokeWidth="1" />
            <rect x="85" y="40" width="45" height="40" rx="2" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="1.5" />
            <text x="107" y="63" textAnchor="middle" fill="var(--color-accent)" fontSize="8" fontWeight="700" fontFamily="var(--font-mono)">WAF</text>
            <path d="M 130 60 L 155 60" stroke="var(--color-line)" strokeWidth="1" />
            <rect x="155" y="45" width="35" height="30" rx="2" fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth="1" />
            <text x="172" y="63" textAnchor="middle" fill="var(--color-ink)" fontSize="7" fontFamily="var(--font-mono)">DVWA</text>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section id="projects" className="section-wrapper" onMouseMove={handleMouseMove}>
      <div className="site-container">
        <div className="section-label">
          <span>Engineered Systems</span>
        </div>
        <h2 className="section-title">Projects</h2>
        <p className="section-desc">
          Defensive gateways and security testing tools. Click any project to open its dedicated story.
        </p>

        {/* 4 Large Names List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          borderTop: 'var(--hairline)',
          marginTop: 'var(--space-lg)'
        }}>
          {PROJECTS_DATA.map((proj, idx) => {
            const isTouchActive = activeTouchSlug === proj.slug;

            return (
              <div
                key={proj.slug}
                style={{
                  borderBottom: 'var(--hairline)',
                  position: 'relative'
                }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    // Check if touch device
                    if (window.matchMedia('(hover: none)').matches) {
                      setActiveTouchSlug(isTouchActive ? null : proj.slug);
                    } else {
                      handleProjectClick(proj.slug);
                    }
                  }}
                  onMouseEnter={() => setHoveredProject(proj)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleProjectClick(proj.slug);
                    }
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: 'clamp(20px, 3.5vw, 36px) 12px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    flexWrap: 'wrap',
                    gap: '12px',
                    backgroundColor: hoveredProject?.slug === proj.slug ? 'var(--color-surface)' : 'transparent'
                  }}
                >
                  <div style={{ flex: '1 1 340px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                        0{idx + 1}
                      </span>
                      <span style={{ color: 'var(--color-line)' }}>&bull;</span>
                      <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                        {proj.status}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                      fontWeight: 800,
                      color: 'var(--color-ink)',
                      letterSpacing: '-0.03em',
                      lineHeight: 1.1
                    }}>
                      {proj.name}
                    </h3>

                    <p style={{
                      fontSize: '0.9375rem',
                      color: 'var(--color-muted)',
                      marginTop: '6px',
                      maxWidth: '640px'
                    }}>
                      {proj.desc}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    alignSelf: 'center'
                  }}>
                    <span className="mono" style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--color-accent)'
                    }}>
                      Open story &rarr;
                    </span>
                  </div>
                </div>

                {/* Touch Device Inline Expandable Preview */}
                {isTouchActive && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'var(--color-surface)',
                    borderTop: 'var(--hairline)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ width: '100%', height: '140px', border: 'var(--hairline)', borderRadius: '2px' }}>
                      {renderMiniPreview(proj.previewType)}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleProjectClick(proj.slug)}
                      className="mono"
                      style={{
                        padding: '10px 16px',
                        backgroundColor: 'var(--color-ink)',
                        color: 'var(--color-bg)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        borderRadius: '2px',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      Open {proj.name} Story &rarr;
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Mini-Preview Card on Desktop Hover */}
        {hoveredProject && (
          <div
            className="floating-card desktop-hover-preview"
            style={{
              position: 'fixed',
              top: cursorPos.y + 16,
              left: Math.min(cursorPos.x + 20, window.innerWidth - 260),
              width: '240px',
              height: '170px',
              padding: '12px',
              pointerEvents: 'none',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transform: 'rotate(-1.5deg)',
              transition: 'transform 100ms ease, opacity 200ms ease'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: 'var(--hairline)',
              paddingBottom: '6px'
            }}>
              <span className="mono" style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                {hoveredProject.name}
              </span>
              <span className="mono" style={{ fontSize: '0.625rem', color: 'var(--color-muted)' }}>
                PREVIEW
              </span>
            </div>

            <div style={{
              flex: 1,
              margin: '6px 0',
              overflow: 'hidden',
              border: 'var(--hairline)',
              borderRadius: '2px'
            }}>
              {renderMiniPreview(hoveredProject.previewType)}
            </div>

            <div className="mono" style={{ fontSize: '0.625rem', color: 'var(--color-accent)' }}>
              Click to open story &rarr;
            </div>
          </div>
        )}

        <style>{`
          @media (hover: none) {
            .desktop-hover-preview {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
