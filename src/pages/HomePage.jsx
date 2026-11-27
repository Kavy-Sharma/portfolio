import React, { useState } from 'react';
import LockIntro from '../components/LockIntro';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Building from '../components/Building';
import VulnerabilityTable from '../components/VulnerabilityTable';
import FloatingPreview from '../components/FloatingPreview';
import StoryOverlay from '../components/StoryOverlay';

export default function HomePage() {
  const [hoveredWindow, setHoveredWindow] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [selectedOverlayItem, setSelectedOverlayItem] = useState(null);
  const [overlayCoords, setOverlayCoords] = useState(null);

  const handlePointerMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  const handleHoverWindow = (win, e) => {
    setHoveredWindow(win);
    if (e) {
      setCursorPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleLeaveWindow = () => {
    setHoveredWindow(null);
  };

  const handleOpenWindow = (win, e) => {
    if (win.id === 'vt' || win.id === 'net') {
      const el = document.getElementById('table');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        el.classList.add('flash-table');
        setTimeout(() => el.classList.remove('flash-table'), 1200);
      }
      return;
    }
    const coords = e && e.clientX !== undefined
      ? { x: e.clientX, y: e.clientY }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setOverlayCoords(coords);
    setSelectedOverlayItem(win);
  };

  const handleSelectPost = (post, e) => {
    const coords = e && e.clientX !== undefined
      ? { x: e.clientX, y: e.clientY }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setOverlayCoords(coords);
    setSelectedOverlayItem(post);
  };

  const handleOpenResume = (e) => {
    const coords = e && e.clientX !== undefined
      ? { x: e.clientX, y: e.clientY }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setOverlayCoords(coords);
    setSelectedOverlayItem({ type: 'resume' });
  };

  const handleCloseOverlay = () => {
    setSelectedOverlayItem(null);
  };

  return (
    <div onPointerMove={handlePointerMove} style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 1. Interactive Lock Intro */}
      <LockIntro />

      <div className="wrap">
        {/* 2. Header */}
        <Header onOpenResume={handleOpenResume} />

        {/* 3. Hero */}
        <Hero />

        {/* 4. The Building (5 Floors + Ground Contact) */}
        <Building
          onOpenWindow={handleOpenWindow}
          onHoverWindow={handleHoverWindow}
          onLeaveWindow={handleLeaveWindow}
          onOpenResume={handleOpenResume}
        />

        {/* 5. The Vulnerability Table */}
        <VulnerabilityTable onSelectPost={handleSelectPost} />

        <p className="tag srcap" style={{ margin: '80px 0 30px' }}>
          Portfolio &middot; verified facts from notes &amp; stats
        </p>
      </div>

      {/* 6. Floating Cursor Preview Box */}
      <FloatingPreview target={hoveredWindow} position={cursorPos} />

      {/* 7. Story Overlay */}
      <StoryOverlay
        openItem={selectedOverlayItem}
        onClose={handleCloseOverlay}
        originCoords={overlayCoords}
      />
    </div>
  );
}
