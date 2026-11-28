import React, { useState, useEffect } from 'react';

const FLOORS = [
  { id: 'building', key: 'rf', label: 'RF', title: 'Roof: 52-Week Activity' },
  { id: 'floor-4', key: '4', label: '4', title: 'Floor 4: BUILD (AegisAgent & PhishSim)' },
  { id: 'floor-3', key: '3', label: '3', title: 'Floor 3: LEARN (SentinelFlow & SafeLine)' },
  { id: 'floor-2', key: '2', label: '2', title: 'Floor 2: PROVE (PortSwigger & TryHackMe)' },
  { id: 'floor-1', key: '1', label: '1', title: 'Floor 1: WORK (TechDefence & DRDO)' },
  { id: 'ground', key: 'g', label: 'G', title: 'Ground Floor: CONTACT (Knock Door)' }
];

export default function FloorElevator() {
  const [activeFloor, setActiveFloor] = useState('rf');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show elevator when building is somewhat near or on screen
    const handleScroll = () => {
      const bld = document.getElementById('building');
      if (!bld) return;

      const rect = bld.getBoundingClientRect();
      const topOffset = rect.top;
      const bottomOffset = rect.bottom;

      // Show elevator once hero is scrolled past
      if (topOffset < window.innerHeight * 0.8 && bottomOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Check which floor is closest to viewport center
      const viewportCenter = window.innerHeight / 2;
      let currentActive = 'rf';
      let minDistance = Infinity;

      FLOORS.forEach((floor) => {
        const el = document.getElementById(floor.id);
        if (el) {
          const r = el.getBoundingClientRect();
          const elementCenter = r.top + r.height / 2;
          const distance = Math.abs(elementCenter - viewportCenter);
          if (distance < minDistance) {
            minDistance = distance;
            currentActive = floor.key;
          }
        }
      });

      setActiveFloor(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJumpToFloor = (floorId, floorKey) => {
    const el = document.getElementById(floorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveFloor(floorKey);
    }
  };

  return (
    <nav
      className={`floor-elevator-nav ${isVisible ? 'is-visible' : ''}`}
      aria-label="Floor elevator navigation"
      role="navigation"
      aria-hidden={!isVisible}
    >
      <div className="elevator-track-outer">
        <div className="elevator-header">
          <span className="elevator-title mono">FLOOR</span>
        </div>

        <div className="elevator-rail" role="list">
          {FLOORS.map((f) => {
            const isActive = activeFloor === f.key;
            return (
              <div key={f.key} className="elevator-stop-wrap" role="listitem">
                <button
                  type="button"
                  className={`elevator-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleJumpToFloor(f.id, f.key)}
                  aria-label={`Jump to ${f.title}`}
                  aria-current={isActive ? 'true' : undefined}
                  title={f.title}
                >
                  <span className="elevator-btn-label">{f.label}</span>
                </button>
                <span className="elevator-hover-tip" aria-hidden="true">
                  {f.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
