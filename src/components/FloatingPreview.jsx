import React, { useEffect, useRef, useState } from 'react';
import statsData from '../../data/stats.json';
import CategoryArt from '../assets/art';

// Aegis rotating frames (overview -> setup -> hardware, 1.8s each)
const AEGIS_FRAMES = [
  {
    src: '/screens/aegis-overview.webp',
    alt: 'AegisAgent dashboard overview with 9 gates',
    label: 'overview \u00b7 9-gate pipeline',
    tag: 'REAL SCREENSHOT',
    bg: '#0e1726'
  },
  {
    src: '/screens/aegis-setup.webp',
    alt: 'AegisAgent setup with laptop and ESP32 hardware',
    label: 'setup \u00b7 laptop & real board',
    tag: 'REAL SCREENSHOT',
    bg: 'var(--bg)'
  },
  {
    src: '/screens/aegis-esp32-blocked.webp',
    alt: 'ESP32 hardware with red LED lit when attack is blocked',
    label: 'hardware blocked (red LED)',
    tag: 'REAL SCREENSHOT',
    bg: 'var(--bg)'
  }
];

// Helper component for blurred placeholder + lazy unclipped image
function PreviewImage({ src, alt, bg = 'var(--bg)', width = 360, height = 210 }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`preview-img-wrapper ${loaded ? 'is-loaded' : 'is-loading'}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="preview-blur-placeholder" aria-hidden="true" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className="preview-img"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          display: 'block',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </div>
  );
}

// Helper component for PortSwigger 3 rings SVG
function PortSwiggerRings() {
  const apprentice = statsData?.portswigger?.apprentice || [31, 64];
  const practitioner = statsData?.portswigger?.practitioner || [67, 175];
  const expert = statsData?.portswigger?.expert || [7, 40];
  const totalLabs = statsData?.portswiggerLabs || (apprentice[0] + practitioner[0] + expert[0]);

  const tiers = [
    { name: 'Apprentice', solved: apprentice[0], total: apprentice[1], color: '#2F9E6F', cx: 65 },
    { name: 'Practitioner', solved: practitioner[0], total: practitioner[1], color: '#2F7FD0', cx: 180 },
    { name: 'Expert', solved: expert[0], total: expert[1], color: '#E5533F', cx: 295 }
  ];

  const r = 27;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      className="ps-rings-card"
      style={{
        padding: '12px 16px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'var(--surf)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--ln)',
          paddingBottom: '6px'
        }}
      >
        <b style={{ font: "700 13px var(--font-display)", color: 'var(--ink)' }}>PortSwigger Academy</b>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--ac)', fontWeight: 600 }}>
          {totalLabs}+ labs solved
        </span>
      </div>

      <svg
        viewBox="0 0 360 105"
        width="360"
        height="105"
        style={{ display: 'block', margin: '4px auto 0' }}
        aria-label="PortSwigger progress rings"
      >
        {tiers.map((t) => {
          const pct = Math.min(100, Math.round((t.solved / t.total) * 100));
          const offset = circumference * (1 - t.solved / t.total);

          return (
            <g key={t.name}>
              {/* Background ring */}
              <circle
                cx={t.cx}
                cy={40}
                r={r}
                fill="none"
                stroke="var(--ln)"
                strokeWidth={5}
              />
              {/* Progress arc */}
              <circle
                cx={t.cx}
                cy={40}
                r={r}
                fill="none"
                stroke={t.color}
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${t.cx} 40)`}
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
              {/* Inside count */}
              <text
                x={t.cx}
                y={38}
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                {t.solved}
              </text>
              <text
                x={t.cx}
                y={50}
                textAnchor="middle"
                fill="var(--mu)"
                fontSize="8.5"
                fontFamily="var(--font-mono)"
              >
                /{t.total}
              </text>
              {/* Below label */}
              <text
                x={t.cx}
                y={80}
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="10"
                fontWeight="600"
                fontFamily="var(--font-body)"
              >
                {t.name}
              </text>
              <text
                x={t.cx}
                y={93}
                textAnchor="middle"
                fill="var(--mu)"
                fontSize="8.5"
                fontFamily="var(--font-mono)"
              >
                {pct}%
              </text>
            </g>
          );
        })}
      </svg>

      <div
        style={{
          fontSize: '10.5px',
          color: 'var(--mu)',
          textAlign: 'center',
          borderTop: '1px solid var(--ln)',
          paddingTop: '6px'
        }}
      >
        Burp Suite Pro &middot; SQLi, XSS, CSRF, SSRF, IDOR, Race Conditions
      </div>
    </div>
  );
}

export default function FloatingPreview({ target, position }) {
  const fpRef = useRef(null);
  const [cachedTarget, setCachedTarget] = useState(target);
  const [aegisIndex, setAegisIndex] = useState(0);
  const isShowingRef = useRef(false);

  const stateRef = useRef({
    fx: 0,
    fy: 0,
    tx: 0,
    ty: 0,
    raf: 0
  });

  // Track target updates
  useEffect(() => {
    if (target) {
      setCachedTarget(target);
    }
  }, [target]);

  // Aegis rotating frames (1.8s per frame)
  useEffect(() => {
    if (target?.id !== 'aegis') {
      setAegisIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setAegisIndex((prev) => (prev + 1) % AEGIS_FRAMES.length);
    }, 1800);

    return () => clearInterval(timer);
  }, [target?.id]);

  // Position and spring follow loop
  useEffect(() => {
    if (typeof window !== 'undefined' && ('ontouchstart' in window || window.matchMedia('(hover: none)').matches)) {
      return;
    }

    if (!target || !position) {
      isShowingRef.current = false;
      return;
    }

    let x = position.x + 22;
    let y = position.y - 40;

    // Flip side near screen right edge (card width is 360px)
    if (x + 380 > window.innerWidth - 12) {
      x = position.x - 382;
    }
    y = Math.max(16, Math.min(window.innerHeight - 250, y));

    // Instant snap on first entrance
    if (!isShowingRef.current) {
      stateRef.current.fx = x;
      stateRef.current.fy = y;
      stateRef.current.tx = x;
      stateRef.current.ty = y;
      isShowingRef.current = true;
      if (fpRef.current) {
        fpRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`;
      }
    } else {
      stateRef.current.tx = x;
      stateRef.current.ty = y;
    }

    const loop = () => {
      const s = stateRef.current;
      s.fx += (s.tx - s.fx) * 0.22;
      s.fy += (s.ty - s.fy) * 0.22;

      if (fpRef.current) {
        fpRef.current.style.transform = `translate3d(${s.fx}px, ${s.fy}px, 0) scale(1)`;
      }
      s.raf = requestAnimationFrame(loop);
    };

    if (!stateRef.current.raf) {
      stateRef.current.raf = requestAnimationFrame(loop);
    }

    return () => {
      if (stateRef.current.raf) {
        cancelAnimationFrame(stateRef.current.raf);
        stateRef.current.raf = 0;
      }
    };
  }, [position, target]);

  // Don't render on touch screens or devices without hover
  if (typeof window !== 'undefined' && ('ontouchstart' in window || window.matchMedia('(hover: none)').matches)) {
    return null;
  }

  const active = target || cachedTarget;
  if (!active) return null;

  // Determine top address-bar style label and tag
  let urlLabel = '';
  let tagLabel = 'FACT SHEET';

  switch (active.id) {
    case 'aegis':
      urlLabel = AEGIS_FRAMES[aegisIndex].label;
      tagLabel = AEGIS_FRAMES[aegisIndex].tag;
      break;
    case 'phish':
      urlLabel = 'phishsim-ai.onrender.com';
      tagLabel = 'REAL SCREENSHOT';
      break;
    case 'sent':
      urlLabel = 'terminal output';
      tagLabel = 'REAL SCREENSHOT';
      break;
    case 'safe':
      urlLabel = 'safeline-dvwa-waf-lab';
      tagLabel = 'IN PROGRESS';
      break;
    case 'ps':
      urlLabel = 'portswigger.net \u00b7 labs breakdown';
      tagLabel = 'VERIFIED STATS';
      break;
    case 'thm':
      urlLabel = 'tryhackme.com/p/kavysharma196';
      tagLabel = 'REAL SCREENSHOT';
      break;
    case 'td':
      urlLabel = 'techdefence.com \u00b7 internal audit';
      tagLabel = 'FACT SHEET';
      break;
    case 'drdo':
      urlLabel = 'drdo.gov.in \u00b7 defense simulation';
      tagLabel = 'FACT SHEET';
      break;
    case 'ctf':
      urlLabel = 'hackitup \u00b7 sea of secrets ctf';
      tagLabel = 'FACT SHEET';
      break;
    case 'wr':
      urlLabel = 'tryhackme.com \u00b7 machine walkthroughs';
      tagLabel = 'FACT SHEET';
      break;
    case 'vt':
    case 'net':
      urlLabel = 'notes.kavy.dev \u00b7 field research';
      tagLabel = 'FACT SHEET';
      break;
    case 'contact':
      urlLabel = 'kavysharma196@gmail.com';
      tagLabel = 'CONTACT';
      break;
    default:
      urlLabel = active.url ? active.url.replace(/^https?:\/\//, '') : 'verified-record';
      tagLabel = 'FACT SHEET';
  }

  const renderContent = () => {
    switch (active.id) {
      // 1. AegisAgent: overview -> setup -> hardware (unclipped, fully shown)
      case 'aegis': {
        const curFrame = AEGIS_FRAMES[aegisIndex];
        return (
          <div
            className="preview-slideshow"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              background: curFrame.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {AEGIS_FRAMES.map((frame, idx) => (
              <div
                key={frame.src}
                className="preview-slide"
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: aegisIndex === idx ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: frame.bg
                }}
              >
                <img
                  src={frame.src}
                  alt={frame.alt}
                  width={360}
                  height={210}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    display: 'block'
                  }}
                />
              </div>
            ))}
            <div
              className="slideshow-indicators"
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '10px',
                display: 'flex',
                gap: '5px',
                zIndex: 3,
                background: 'rgba(0,0,0,0.6)',
                padding: '3px 7px',
                borderRadius: '99px'
              }}
            >
              {AEGIS_FRAMES.map((_, idx) => (
                <span
                  key={idx}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: aegisIndex === idx ? 'var(--ac)' : 'rgba(255,255,255,0.4)',
                    transition: 'background 0.3s'
                  }}
                />
              ))}
            </div>
          </div>
        );
      }

      // 2. PhishSim: phishsim-landing photo (unclipped, fully shown)
      case 'phish':
        return (
          <PreviewImage
            src="/screens/phishsim-landing.webp"
            alt="PhishSim AI landing page"
            bg="#070b14"
            width={360}
            height={210}
          />
        );

      // 3. SentinelFlow: sentinelflow-terminal (unclipped, fully shown)
      case 'sent':
        return (
          <PreviewImage
            src="/screens/sentinelflow-terminal.webp"
            alt="SentinelFlow terminal intrusion detection"
            bg="#0c1017"
            width={360}
            height={210}
          />
        );

      // 4. SafeLine WAF Lab: designed card with architecture line
      case 'safe':
        return (
          <div
            style={{
              padding: '16px 18px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'var(--surf)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  className="mono"
                  style={{
                    fontSize: '10px',
                    color: '#B45309',
                    background: 'rgba(180,83,9,0.12)',
                    padding: '2px 7px',
                    borderRadius: '99px',
                    fontWeight: 700,
                    letterSpacing: '0.06em'
                  }}
                >
                  IN PROGRESS
                </span>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--mu)' }}>
                  VirtualBox NatNetwork
                </span>
              </div>
              <h4 style={{ margin: '4px 0 6px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                SafeLine WAF + DVWA Lab
              </h4>
              <div
                className="mono"
                style={{
                  fontSize: '10.5px',
                  padding: '7px 9px',
                  background: 'var(--bg)',
                  borderRadius: '6px',
                  border: '1px solid var(--ln)',
                  color: 'var(--ink)',
                  margin: '6px 0',
                  lineHeight: 1.4
                }}
              >
                Browser &rarr; HTTPS Reverse Proxy (SafeLine :443) &rarr; DVWA (:8080)
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--mu)', lineHeight: 1.4 }}>
                Reverse proxy and TLS termination verified; attack tests in progress.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                Kali (10.0.2.3)
              </span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                Ubuntu (10.0.2.4)
              </span>
              <span className="mono" style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--mu)' }}>
                dvwa.local
              </span>
            </div>
          </div>
        );

      // 5. PortSwigger Academy: 3 SVG Progress rings
      case 'ps':
        return <PortSwiggerRings />;

      // 6. TryHackMe: thm-profile (user photo crop: avatar, username & rank cards)
      case 'thm':
        return (
          <PreviewImage
            src="/screens/thm-profile.webp"
            alt="TryHackMe verified profile top 8%"
            bg="#171d2d"
            width={360}
            height={210}
          />
        );

      // 7. TechDefence: designed card with Access illustration
      case 'td':
        return (
          <div
            style={{
              padding: '16px 18px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'var(--surf)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <span
                    className="mono"
                    style={{
                      fontSize: '10px',
                      color: 'var(--ac)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600
                    }}
                  >
                    VAPT INTERNSHIP &middot; JUN&ndash;JUL 2026
                  </span>
                  <h4 style={{ margin: '4px 0 2px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                    TechDefence
                  </h4>
                </div>
                <div className="preview-card-art" style={{ flexShrink: 0, padding: '4px', background: 'var(--bg)', border: '1px solid var(--ln)', borderRadius: '8px' }}>
                  <CategoryArt category="Access" size={36} animated={false} />
                </div>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--mu)', lineHeight: 1.45 }}>
                Worked on network VAPT with Nessus and Nmap, firewall reviews, CIS configuration audits, and web testing.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                Burp Suite
              </span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                Nessus
              </span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                Nmap
              </span>
              <span className="mono" style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--mu)' }}>
                Confidential scope
              </span>
            </div>
          </div>
        );

      // 8. DRDO: designed card with Logic illustration
      case 'drdo':
        return (
          <div
            style={{
              padding: '16px 18px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'var(--surf)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <span
                    className="mono"
                    style={{
                      fontSize: '10px',
                      color: 'var(--ac)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600
                    }}
                  >
                    DEFENSE RESEARCH &middot; JUN&ndash;JUL 2025
                  </span>
                  <h4 style={{ margin: '4px 0 2px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                    Defence Research &amp; Development Organisation
                  </h4>
                </div>
                <div className="preview-card-art" style={{ flexShrink: 0, padding: '4px', background: 'var(--bg)', border: '1px solid var(--ln)', borderRadius: '8px' }}>
                  <CategoryArt category="Logic" size={36} animated={false} />
                </div>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--mu)', lineHeight: 1.45 }}>
                Built MATLAB UAV flight-path simulations with monitoring logic that flags routes entering restricted zones.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                MATLAB
              </span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                Flight Sim
              </span>
              <span className="mono" style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--mu)' }}>
                Confidential project
              </span>
            </div>
          </div>
        );

      // 9. CTF & AI Cert: designed card with Auth illustration
      case 'ctf':
        return (
          <div
            style={{
              padding: '16px 18px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'var(--surf)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <span
                    className="mono"
                    style={{
                      fontSize: '10px',
                      color: 'var(--ac)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600
                    }}
                  >
                    ACHIEVEMENTS &middot; OCT 2026 &amp; SEP 2026
                  </span>
                  <h4 style={{ margin: '4px 0 2px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                    Sea of Secrets CTF &amp; AI Security Cert
                  </h4>
                </div>
                <div className="preview-card-art" style={{ flexShrink: 0, padding: '4px', background: 'var(--bg)', border: '1px solid var(--ln)', borderRadius: '8px' }}>
                  <CategoryArt category="Auth" size={36} animated={false} />
                </div>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--mu)', lineHeight: 1.45 }}>
                Sea of Secrets CTF solo rank under 150 of 2,500. Introduction to AI Security certification (AI Security University).
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                Solo Rank &lt; 150
              </span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                AI Guardrails
              </span>
              <span className="mono" style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--mu)' }}>
                Verified
              </span>
            </div>
          </div>
        );

      // 10. Machine write-ups: designed card with Machines illustration
      case 'wr':
        return (
          <div
            style={{
              padding: '16px 18px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'var(--surf)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <span
                    className="mono"
                    style={{
                      fontSize: '10px',
                      color: 'var(--ac)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600
                    }}
                  >
                    TRYHACKME &middot; WALKTHROUGHS
                  </span>
                  <h4 style={{ margin: '4px 0 2px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                    Machine Write-ups
                  </h4>
                </div>
                <div className="preview-card-art" style={{ flexShrink: 0, padding: '4px', background: 'var(--bg)', border: '1px solid var(--ln)', borderRadius: '8px' }}>
                  <CategoryArt category="Machines" size={36} animated={false} />
                </div>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--mu)', lineHeight: 1.45 }}>
                Basic Pentesting, RootMe, Kenobi, Meow, Fawn, and Dancing. Port enumeration, service exploitation, and privilege escalation.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                Linux PrivEsc
              </span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                Nmap &amp; SUID
              </span>
              <span className="mono" style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--mu)' }}>
                Field Walkthroughs
              </span>
            </div>
          </div>
        );

      // Ports & networks: designed card with Network illustration
      case 'net':
        return (
          <div
            style={{
              padding: '16px 18px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'var(--surf)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <span
                    className="mono"
                    style={{
                      fontSize: '10px',
                      color: 'var(--ac)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600
                    }}
                  >
                    FIELD RESEARCH &middot; PROTOCOLS
                  </span>
                  <h4 style={{ margin: '4px 0 2px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                    Ports &amp; Networks
                  </h4>
                </div>
                <div className="preview-card-art" style={{ flexShrink: 0, padding: '4px', background: 'var(--bg)', border: '1px solid var(--ln)', borderRadius: '8px' }}>
                  <CategoryArt category="Network" size={36} animated={false} />
                </div>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--mu)', lineHeight: 1.45 }}>
                TCP, UDP, Nmap scripts, and network service inspection: FTP, SSH, DNS.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                Nmap NSE
              </span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                TCP vs UDP
              </span>
              <span className="mono" style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--mu)' }}>
                Interactive /notes
              </span>
            </div>
          </div>
        );

      // 11. Contact: designed card
      case 'contact':
        return (
          <div
            style={{
              padding: '16px 18px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'var(--surf)'
            }}
          >
            <div>
              <span
                className="mono"
                style={{
                  fontSize: '10px',
                  color: 'var(--ac)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 600
                }}
              >
                DIRECT CONTACT &middot; JODHPUR
              </span>
              <h4 style={{ margin: '6px 0 4px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                Open to Internships &amp; Jobs
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--mu)', lineHeight: 1.45 }}>
                Say hi, the door is open. Click the door below to copy email address.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--ac)', fontWeight: 600 }}>
                kavysharma196@gmail.com
              </span>
              <span className="mono" style={{ fontSize: '9px', color: 'var(--mu)' }}>
                One-click copy
              </span>
            </div>
          </div>
        );

      // Default: Vulnerability Table / Notes (with Files illustration)
      default:
        return (
          <div
            style={{
              padding: '16px 18px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'var(--surf)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <span
                    className="mono"
                    style={{
                      fontSize: '10px',
                      color: 'var(--ac)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600
                    }}
                  >
                    FIELD RESEARCH &middot; 2-MIN READS
                  </span>
                  <h4 style={{ margin: '4px 0 2px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                    {active.title || 'Vulnerability Table'}
                  </h4>
                </div>
                <div className="preview-card-art" style={{ flexShrink: 0, padding: '4px', background: 'var(--bg)', border: '1px solid var(--ln)', borderRadius: '8px' }}>
                  <CategoryArt category="Files" size={36} animated={false} />
                </div>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--mu)', lineHeight: 1.45 }}>
                {active.desc || active['one-line'] || 'Short, plain-language field notes cut from real lab exercises.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                Web Security
              </span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--ln)' }}>
                Networks
              </span>
              <span className="mono" style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--mu)' }}>
                Interactive /notes
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      id="fp"
      ref={fpRef}
      className={target ? 'show' : ''}
      aria-hidden="true"
    >
      <div className="bar">
        <s />
        <s />
        <s />
        <span id="fpu" className="mono" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {urlLabel}
        </span>
        <em id="fpl" className="mono">
          {tagLabel}
        </em>
      </div>

      <div className="scr" id="fps">
        {renderContent()}
      </div>
    </div>
  );
}
