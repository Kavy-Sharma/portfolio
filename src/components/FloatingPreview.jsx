import React, { useEffect, useRef, useState } from 'react';

export default function FloatingPreview({ target, position }) {
  const fpRef = useRef(null);
  const [cachedTarget, setCachedTarget] = useState(target);
  const isShowingRef = useRef(false);

  const stateRef = useRef({
    fx: 0,
    fy: 0,
    tx: 0,
    ty: 0,
    raf: 0
  });

  useEffect(() => {
    if (target) {
      setCachedTarget(target);
    }
  }, [target]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
      return;
    }

    if (!target || !position) {
      isShowingRef.current = false;
      return;
    }

    let x = position.x + 20;
    let y = position.y - 40;

    if (x + 350 > window.innerWidth - 12) {
      x = position.x - 362;
    }
    y = Math.max(16, Math.min(window.innerHeight - 262, y));

    // Snap instantly to cursor on first hover - eliminates any swoop from top
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
      s.fx += (s.tx - s.fx) * 0.2;
      s.fy += (s.ty - s.fy) * 0.2;

      if (fpRef.current) {
        fpRef.current.style.transform = `translate3d(${s.fx}px, ${s.fy}px, 0) scale(1)`;
      }
      s.raf = requestAnimationFrame(loop);
    };

    if (!stateRef.current.raf) {
      stateRef.current.raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      stateRef.current.raf = 0;
    };
  }, [position, target]);

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }

  const active = target || cachedTarget;
  if (!active) return null;

  const isLive = active.previewMode === 'live' || active.s === 'live';
  const rawUrl = active.url || active.u || 'private work';
  const urlLabel = rawUrl.replace(/^https?:\/\//, '');
  const tagLabel = isLive ? 'LIVE' : 'AUTO-SHOT';

  const renderVisual = () => {
    switch (active?.id) {
      case 'phish':
        return (
          <>
            <div className="sk">
              <u className="a" />
              <u className="b" />
              <u className="c" />
              <div />
              <u className="b" />
              <p>PhishSim AI &middot; live cloud deployment</p>
            </div>
            <iframe
              loading="lazy"
              src="https://phishsim-ai.onrender.com"
              tabIndex={-1}
              title="PhishSim AI preview"
            />
          </>
        );
      case 'aegis':
        return (
          <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <svg viewBox="0 0 200 90" style={{ width: '100%', height: 'auto' }}>
              <rect x="10" y="25" width="45" height="40" rx="3" fill="var(--surf)" stroke="var(--ln)" />
              <text x="32" y="48" textAnchor="middle" fill="var(--ink)" fontSize="8" fontFamily="var(--font-mono)">LLM</text>
              <path d="M 55 45 L 85 45" stroke="var(--ac)" strokeWidth="1.5" strokeDasharray="2 2" />
              <rect x="85" y="20" width="50" height="50" rx="3" fill="var(--surf)" stroke="var(--ac)" strokeWidth="1.5" />
              <text x="110" y="44" textAnchor="middle" fill="var(--ac)" fontSize="8" fontWeight="700" fontFamily="var(--font-mono)">9 GATES</text>
              <text x="110" y="56" textAnchor="middle" fill="#E5533F" fontSize="7" fontFamily="var(--font-mono)">BLOCKED</text>
              <path d="M 135 45 L 160 45" stroke="var(--ln)" strokeWidth="1.5" />
              <rect x="160" y="25" width="30" height="40" rx="3" fill="var(--surf)" stroke="var(--ln)" />
              <circle cx="175" cy="40" r="4" fill="#E5533F" />
              <text x="175" y="55" textAnchor="middle" fill="var(--mu)" fontSize="6" fontFamily="var(--font-mono)">LED</text>
            </svg>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--mu)', textAlign: 'center', marginTop: '6px' }}>
              AegisAgent &middot; Hardware tested gateway
            </span>
          </div>
        );
      case 'sent':
        return (
          <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <svg viewBox="0 0 200 90" style={{ width: '100%', height: 'auto' }}>
              <line x1="20" y1="30" x2="180" y2="30" stroke="var(--ln)" strokeWidth="1" />
              <line x1="20" y1="50" x2="180" y2="50" stroke="var(--ln)" strokeWidth="1" />
              <circle cx="45" cy="30" r="4" fill="#2fbf71" />
              <circle cx="95" cy="30" r="4" fill="#2fbf71" />
              <circle cx="145" cy="30" r="5" fill="#E5533F" />
              <text x="100" y="72" textAnchor="middle" fill="#E5533F" fontSize="8" fontWeight="700" fontFamily="var(--font-mono)">
                T1046 DETECTED &bull; ISOLATION FOREST
              </text>
            </svg>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--mu)', textAlign: 'center', marginTop: '6px' }}>
              SentinelFlow &middot; In progress
            </span>
          </div>
        );
      case 'safe':
        return (
          <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <svg viewBox="0 0 200 90" style={{ width: '100%', height: 'auto' }}>
              <rect x="15" y="30" width="35" height="30" rx="3" fill="var(--surf)" stroke="var(--ln)" />
              <text x="32" y="48" textAnchor="middle" fill="var(--ink)" fontSize="7" fontFamily="var(--font-mono)">Kali</text>
              <path d="M 50 45 L 75 45" stroke="var(--ln)" strokeWidth="1" />
              <rect x="75" y="25" width="50" height="40" rx="3" fill="var(--surf)" stroke="var(--ac)" strokeWidth="1.5" />
              <text x="100" y="48" textAnchor="middle" fill="var(--ac)" fontSize="8" fontWeight="700" fontFamily="var(--font-mono)">SafeLine WAF</text>
              <path d="M 125 45 L 150 45" stroke="var(--ln)" strokeWidth="1" />
              <rect x="150" y="30" width="35" height="30" rx="3" fill="var(--surf)" stroke="var(--ln)" />
              <text x="167" y="48" textAnchor="middle" fill="var(--ink)" fontSize="7" fontFamily="var(--font-mono)">DVWA</text>
            </svg>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--mu)', textAlign: 'center', marginTop: '6px' }}>
              SafeLine Lab &middot; In progress
            </span>
          </div>
        );
      default:
        return (
          <div className="sk">
            <u className="a" />
            <u className="b" />
            <u className="c" />
            <div />
            <u className="b" />
            <p>{active?.title || active?.t || 'Project'} &middot; snapshot refreshed daily</p>
          </div>
        );
    }
  };

  return (
    <div id="fp" ref={fpRef} className={target ? 'show' : ''} aria-hidden="true">
      <div className="bar">
        <s />
        <s />
        <s />
        <span id="fpu">{urlLabel}</span>
        <em id="fpl">{tagLabel}</em>
      </div>
      <div className="scr" id="fps">
        {renderVisual()}
      </div>
    </div>
  );
}
