import React, { useEffect, useRef, useState } from 'react';

export default function FloatingPreview({ target, position }) {
  const fpRef = useRef(null);
  const [cachedTarget, setCachedTarget] = useState(target);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const isShowingRef = useRef(false);
  const timeoutRef = useRef(null);

  const stateRef = useRef({
    fx: 0,
    fy: 0,
    tx: 0,
    ty: 0,
    raf: 0
  });

  // Track target updates and reset iframe state per window
  useEffect(() => {
    if (target) {
      setCachedTarget(target);
      setIframeLoaded(false);
      setIframeFailed(false);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // If live mode, set a 4-second timeout fallback to screenshot
      if (target.previewMode === 'live' || target.s === 'live') {
        timeoutRef.current = setTimeout(() => {
          setIframeFailed(true);
        }, 4000);
      }
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [target]);

  // Position and spring follow loop
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
      return;
    }

    if (!target || !position) {
      isShowingRef.current = false;
      return;
    }

    let x = position.x + 22;
    let y = position.y - 40;

    // Flip side near screen right edge (card width is 340px)
    if (x + 360 > window.innerWidth - 12) {
      x = position.x - 362;
    }
    y = Math.max(16, Math.min(window.innerHeight - 240, y));

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

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }

  const active = target || cachedTarget;
  if (!active) return null;

  const isLive = active.previewMode === 'live' || active.s === 'live';
  const hasPublicUrl = active.url && active.url.startsWith('http');
  const rawUrl = active.url || active.u || '';
  const urlLabel = rawUrl
    ? rawUrl.replace(/^https?:\/\//, '')
    : active.id === 'vt' || active.id === 'net'
    ? 'notes.kavy.dev'
    : 'verified-record';

  // Tag in browser top bar
  const tagLabel = isLive
    ? iframeFailed
      ? 'AUTO-SHOT (FALLBACK)'
      : 'LIVE'
    : hasPublicUrl
    ? 'AUTO-SHOT'
    : 'FACT SHEET';

  // Check if project has an automated screenshot available
  const screenshotIds = ['phish', 'aegis', 'sent', 'safe', 'wr', 'ps', 'thm'];
  const hasScreenshot = screenshotIds.includes(active.id);

  const renderContent = () => {
    // 1. Live iframe mode
    if (isLive && !iframeFailed) {
      return (
        <>
          {/* Skeleton shown while iframe loads */}
          {!iframeLoaded && (
            <div className="sk">
              <u className="a" />
              <u className="b" />
              <u className="c" />
              <div />
              <u className="b" />
              <p>{active.title || 'Live Demo'} &middot; loading cloud deployment...</p>
            </div>
          )}
          <iframe
            loading="lazy"
            src={active.url}
            tabIndex={-1}
            title={`${active.title} preview`}
            onLoad={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              setIframeLoaded(true);
            }}
            onError={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              setIframeFailed(true);
            }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '1280px',
              height: '800px',
              border: 0,
              transform: 'scale(0.265625)',
              transformOrigin: '0 0',
              background: '#fff',
              opacity: iframeLoaded ? 1 : 0,
              transition: 'opacity 0.25s ease'
            }}
          />
        </>
      );
    }

    // 2. Screenshot mode (or live mode fallback)
    if (hasScreenshot) {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--bg)' }}>
          <img
            src={`/previews/${active.id}.png`}
            alt={`${active.title} screenshot`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
              display: 'block'
            }}
            onError={(e) => {
              // Graceful fallback to skeleton if image is missing
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      );
    }

    // 3. Clean designed text card for projects with no public page (DRDO, TechDefence, CTF, Contact, Notes)
    switch (active.id) {
      case 'td':
        return (
          <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--surf)' }}>
            <div>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--ac)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                VAPT INTERNSHIP &middot; JUN&ndash;JUL 2026
              </span>
              <h4 style={{ margin: '6px 0 4px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                TechDefence Labs
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--mu)', lineHeight: 1.4 }}>
                Tested enterprise web applications for 20+ clients using Burp Suite, Nessus, Nmap, and Kali Linux.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--sky)', color: 'var(--ink)' }}>Burp Suite</span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--sky)', color: 'var(--ink)' }}>Nessus</span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--sky)', color: 'var(--ink)' }}>OWASP Top 10</span>
              <span className="mono" style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--mu)' }}>Internal client scope</span>
            </div>
          </div>
        );

      case 'drdo':
        return (
          <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--surf)' }}>
            <div>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--ac)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                DEFENSE RESEARCH &middot; JUN&ndash;JUL 2025
              </span>
              <h4 style={{ margin: '6px 0 4px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                Defence Research &amp; Dev Organisation
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--mu)', lineHeight: 1.4 }}>
                Developed Unmanned Aerial Vehicle (UAV) trajectory flight simulation models and sensor telemetry in MATLAB.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--sky)', color: 'var(--ink)' }}>MATLAB</span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--sky)', color: 'var(--ink)' }}>Telemetry</span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--sky)', color: 'var(--ink)' }}>Flight Sim</span>
              <span className="mono" style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--mu)' }}>Classified Defense Data</span>
            </div>
          </div>
        );

      case 'ctf':
        return (
          <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--surf)' }}>
            <div>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--ac)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                VERIFIED ACHIEVEMENTS &middot; 2024&ndash;2026
              </span>
              <h4 style={{ margin: '6px 0 4px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                Sea of Secrets CTF &amp; AI Security Cert
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--mu)', lineHeight: 1.4 }}>
                Solo rank under 150 worldwide in Sea of Secrets CTF. Certified in AI security fundamentals &amp; OWASP Top 10 for LLMs.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--sky)', color: 'var(--ink)' }}>Top 150 Solo</span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--sky)', color: 'var(--ink)' }}>LLM Security</span>
              <span className="mono" style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--mu)' }}>Observable Proof</span>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--surf)' }}>
            <div>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--ac)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                DIRECT CONTACT &middot; JODHPUR
              </span>
              <h4 style={{ margin: '6px 0 4px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                Open to Internships &amp; Jobs
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--mu)', lineHeight: 1.4 }}>
                Say hi, the door is open. Click the door below to copy email address.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--ac)', fontWeight: 600 }}>kavysharma196@gmail.com</span>
              <span className="mono" style={{ fontSize: '9px', color: 'var(--mu)' }}>One-click copy</span>
            </div>
          </div>
        );

      default:
        // Vulnerability Table / Notes
        return (
          <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--surf)' }}>
            <div>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--ac)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                FIELD RESEARCH &middot; 2-MIN READS
              </span>
              <h4 style={{ margin: '6px 0 4px', fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                {active.title}
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--mu)', lineHeight: 1.4 }}>
                {active.desc || active['one-line'] || 'Short, plain-language field notes cut from real lab exercises.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--sky)', color: 'var(--ink)' }}>Web Security</span>
              <span className="mono" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--sky)', color: 'var(--ink)' }}>Networks</span>
              <span className="mono" style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--mu)' }}>Interactive /notes</span>
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
        <span id="fpu">{urlLabel}</span>
        <em id="fpl">{tagLabel}</em>
      </div>

      <div className="scr" id="fps">
        {renderContent()}
      </div>
    </div>
  );
}
