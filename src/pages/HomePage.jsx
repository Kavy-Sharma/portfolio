import React, { useState } from 'react';
import LockIntro from '../components/LockIntro';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProofStrip from '../components/ProofStrip';
import SkillsGlance from '../components/SkillsGlance';
import Building from '../components/Building';
import AboutMeBlock from '../components/AboutMeBlock';
import JourneyTimeline from '../components/JourneyTimeline';
import LatestNotesStrip from '../components/LatestNotesStrip';
import FloatingPreview from '../components/FloatingPreview';
import FloorElevator from '../components/FloorElevator';

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

      {/* 2. Desktop Vertical Floor Elevator */}
      <FloorElevator />

      <div className="wrap">
        {/* 3. Header */}
        <Header />

        {/* 4. Hero: Two big lines + 1 plain line + 3 small chips */}
        <Hero />

        {/* 5. Certifications and Achievements Strip */}
        <ProofStrip />

        {/* 6. Skills at a Glance (Grouped chips) */}
        <SkillsGlance />

        {/* 7. The Building (5 Floors + Ground Contact) */}
        <Building
          onHoverWindow={handleHoverWindow}
          onLeaveWindow={handleLeaveWindow}
        />

        {/* 8. About Me & Education Block */}
        <AboutMeBlock />

        {/* 9. Journey Timeline (Chapters by topic and real dates) */}
        <JourneyTimeline />

        {/* 10. Latest Field Notes Strip */}
        <LatestNotesStrip />

        {/* 11. Footer */}
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

      {/* Floating Cursor Preview Box */}
      <FloatingPreview target={hoveredWindow} position={cursorPos} />
    </div>
  );
}
