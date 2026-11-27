import React, { useState } from 'react';
import LockIntro from '../components/LockIntro';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Building from '../components/Building';
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

        <p className="tag srcap" style={{ margin: '80px 0 30px' }}>
          Portfolio &middot; verified facts from notes &amp; stats
        </p>
      </div>

      {/* 5. Floating Cursor Preview Box */}
      <FloatingPreview target={hoveredWindow} position={cursorPos} />
    </div>
  );
}
