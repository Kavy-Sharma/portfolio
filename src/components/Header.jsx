import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Header({ onOpenResume }) {
  const { theme, isAttack, setMode } = useTheme();

  const handleNavClick = (targetId) => (e) => {
    e.preventDefault();
    if (targetId === 'resume') {
      if (onOpenResume) onOpenResume(e);
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="prototype-header">
      <a href="#" className="logo">
        Kavy<span style={{ color: 'var(--ac)' }}>.</span>
      </a>

      <nav className="nav-links" aria-label="Main Navigation">
        <a href="#building" onClick={handleNavClick('building')}>
          Work
        </a>
        <a href="#table" onClick={handleNavClick('table')}>
          Vulnerability Table
        </a>
        <a href="#ground" onClick={handleNavClick('ground')}>
          Contact
        </a>
        <a href="#resume" id="rl" onClick={handleNavClick('resume')}>
          Resume
        </a>

        {/* Day / Night Toggle Pill */}
        <div className="tog" role="group" aria-label="Display Mode">
          <button
            type="button"
            data-m="defend"
            aria-pressed={!isAttack}
            onClick={(e) => setMode('defend', e)}
          >
            Defend &middot; day
          </button>
          <button
            type="button"
            data-m="attack"
            aria-pressed={isAttack}
            onClick={(e) => setMode('attack', e)}
          >
            Attack &middot; night
          </button>
        </div>
      </nav>
    </header>
  );
}
