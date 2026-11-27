import React, { useEffect, useRef, useState } from 'react';

export default function LockIntro({ onUnlocked }) {
  const [hidden, setHidden] = useState(() => {
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('seen') === '1';
      const skipHash = window.location.hash === '#skip';
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (seen || skipHash || reducedMotion) {
        document.body.classList.add('in');
        return true;
      }
    }
    return false;
  });

  const [isHolding, setIsHolding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const introRef = useRef(null);
  const pinRefs = useRef([]);
  const stateRef = useRef({
    prog: 0,
    holding: false,
    fin: false,
    last: 0,
    raf: 0
  });

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const drawPins = (prog) => {
    pinRefs.current.forEach((pin, i) => {
      if (!pin) return;
      const f = clamp((prog - i * 0.15) / 0.15, 0, 1);
      pin.setAttribute('transform', `translate(0 ${-f * 26})`);
      if (f >= 1) {
        pin.classList.add('set');
      } else {
        pin.classList.remove('set');
      }
    });
  };

  const finish = (skip) => {
    if (stateRef.current.fin) return;
    stateRef.current.fin = true;
    document.body.style.overflow = '';
    document.body.classList.add('in');
    try {
      sessionStorage.setItem('seen', '1');
    } catch (e) {}

    const el = introRef.current;
    if (skip || !el) {
      setHidden(true);
      if (onUnlocked) onUnlocked();
      return;
    }

    stateRef.current.prog = 1;
    drawPins(1);
    setIsOpen(true);

    setTimeout(() => {
      const t0 = performance.now();
      const duration = 1000;
      const maxRadius = Math.hypot(window.innerWidth, window.innerHeight) / 1.5;

      function step(now) {
        const k = clamp((now - t0) / duration, 0, 1);
        const ease = 1 - Math.pow(1 - k, 3);
        const r = ease * maxRadius;
        const mask = `radial-gradient(circle at 50% 46%, transparent ${r}px, #000 ${r + 2}px)`;
        if (el) {
          el.style.webkitMaskImage = mask;
          el.style.maskImage = mask;
        }

        if (k < 1) {
          requestAnimationFrame(step);
        } else {
          setHidden(true);
          if (onUnlocked) onUnlocked();
        }
      }

      requestAnimationFrame(step);
    }, 700);
  };

  useEffect(() => {
    if (hidden) return;

    document.body.style.overflow = 'hidden';

    function tick(t) {
      if (stateRef.current.fin) return;
      const dt = Math.min(0.05, (t - stateRef.current.last) / 1000 || 0);
      stateRef.current.last = t;

      if (stateRef.current.holding) {
        stateRef.current.prog = Math.min(1, stateRef.current.prog + dt / 2.3);
      } else {
        const ledge = Math.floor(Math.min(stateRef.current.prog, 0.75) / 0.15) * 0.15;
        stateRef.current.prog = Math.max(ledge, stateRef.current.prog - dt / 1.6);
      }

      drawPins(stateRef.current.prog);

      if (stateRef.current.prog >= 1) {
        finish(false);
        return;
      }

      stateRef.current.raf = requestAnimationFrame(tick);
    }

    stateRef.current.raf = requestAnimationFrame((t) => {
      stateRef.current.last = t;
      requestAnimationFrame(tick);
    });

    const handleKeyDown = (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && !stateRef.current.fin) {
        e.preventDefault();
        startHold();
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        endHold();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerup', endHold);
    window.addEventListener('pointercancel', endHold);

    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerup', endHold);
      window.removeEventListener('pointercancel', endHold);
      document.body.style.overflow = '';
    };
  }, [hidden]);

  const startHold = () => {
    stateRef.current.holding = true;
    setIsHolding(true);
  };

  const endHold = () => {
    stateRef.current.holding = false;
    setIsHolding(false);
  };

  if (hidden) return null;

  return (
    <section id="intro" ref={introRef} aria-label="Interactive Intro Lock">
      <div id="introBox" className={isOpen ? 'open' : ''}>
        <svg viewBox="0 0 400 400" role="img" aria-label="A padlock whose pins rise as you hold the button">
          <defs>
            <linearGradient id="steel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--sa)" />
              <stop offset="55%" stopColor="var(--sb)" />
              <stop offset="100%" stopColor="var(--sc)" />
            </linearGradient>
          </defs>

          {/* Shackle */}
          <path
            className="shackle"
            d="M 120 190 V 120 a 80 80 0 0 1 160 0 V 190"
            fill="none"
            stroke="url(#steel)"
            strokeWidth="26"
            strokeLinecap="round"
          />

          {/* Lock Body */}
          <rect x="70" y="180" width="260" height="190" rx="34" fill="url(#steel)" stroke="var(--sc)" strokeWidth="2" />

          {/* Tumbler Chamber */}
          <rect x="105" y="204" width="190" height="84" rx="12" fill="var(--surf)" stroke="var(--sc)" />
          <line x1="112" x2="288" y1="232" y2="232" stroke="var(--mu)" strokeDasharray="4 5" opacity="0.7" />

          {/* 5 Pins */}
          <g id="pins">
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                ref={(el) => (pinRefs.current[i] = el)}
                x={123 + i * 35}
                y={242}
                width={22}
                height={40}
                rx={5}
                className="pn"
                fill="var(--sb)"
              />
            ))}
          </g>

          {/* Keyhole */}
          <circle cx="200" cy="326" r="13" fill="var(--ink)" />
          <path d="M 193 332 h 14 l 4 22 h -22 z" fill="var(--ink)" />
        </svg>

        <h2>Find the way in.</h2>
        <p>Hold the button to pick the lock.</p>

        <button
          id="hold"
          type="button"
          className={isHolding ? 'down' : ''}
          onPointerDown={(e) => {
            e.preventDefault();
            startHold();
          }}
          aria-label="Hold to pick the lock. You can also hold the space bar."
        >
          Hold to pick
        </button>

        <button id="skip" type="button" onClick={() => finish(true)}>
          Skip intro
        </button>
      </div>
    </section>
  );
}
