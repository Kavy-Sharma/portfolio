import React, { useState } from 'react';
import LockIntro from '../components/LockIntro';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Building from '../components/Building';
import LatestNotesStrip from '../components/LatestNotesStrip';
import FloatingPreview from '../components/FloatingPreview';

export default function HomePage() {
  const [hoveredWindow, setHoveredWindow] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  const handleHoverWindow = (win, e) => {
    setHoveredWindow(win);
    if (e && e.clientX !== undefined) {
      setCursorPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleLeaveWindow = () => {
    setHoveredWindow(null);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      style={{ position: 'relative', minHeight: '100vh', paddingBottom: '80px' }}
    >
      {/* 1. Interactive Lock Intro (shown once per session) */}
      <LockIntro />

      <div className="wrap">
        {/* 2. Header */}
        <Header />

        {/* 3. Hero */}
        <Hero />

        {/* 4. The Building (5 Floors + Ground Contact) */}
        <Building
          onHoverWindow={handleHoverWindow}
          onLeaveWindow={handleLeaveWindow}
        />

        {/* 5. Latest Field Notes Strip */}
        <LatestNotesStrip />

        {/* 5. Footer */}
        <footer
          className="home-footer"
          style={{
            marginTop: '80px',
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            borderTop: '1px solid var(--ln)',
            paddingTop: '24px'
          }}
        >
          <div className="mono" style={{ fontSize: '13px', color: 'var(--mu)' }}>
            &copy; Kavy Sharma &middot; Jodhpur
          </div>
          <div
            className="home-footer-links"
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px' }}
          >
            <a
              href="https://github.com/Kavy-Sharma"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink)', textDecoration: 'none' }}
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/kavysharma"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink)', textDecoration: 'none' }}
            >
              LinkedIn
            </a>
            <a
              href="https://tryhackme.com/p/kavysharma196"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink)', textDecoration: 'none' }}
            >
              TryHackMe
            </a>
            <a
              href="/resume"
              style={{ color: 'var(--ink)', textDecoration: 'none' }}
            >
              Resume
            </a>
          </div>
        </footer>
      </div>

      {/* 5. Floating Cursor Preview Box */}
      <FloatingPreview target={hoveredWindow} position={cursorPos} />
    </div>
  );
}
