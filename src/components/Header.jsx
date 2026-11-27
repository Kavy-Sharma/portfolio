import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { navigateWithReveal } from '../utils/transitionNavigate';

export default function Header({ onOpenResume }) {
  const { theme, isAttack, setMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (targetId) => (e) => {
    e.preventDefault();
    if (targetId === 'resume') {
      if (onOpenResume) {
        onOpenResume(e);
        return;
      }
      navigateWithReveal(navigate, '/resume', e);
      return;
    }

    if (targetId === 'table') {
      if (location.pathname === '/') {
        const el = document.getElementById('table');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      navigateWithReveal(navigate, '/notes', e);
      return;
    }

    if (location.pathname !== '/') {
      navigateWithReveal(navigate, `/#${targetId}`, e);
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigateWithReveal(navigate, '/', e);
    }
  };

  return (
    <header className="prototype-header">
      <Link to="/" className="logo" onClick={handleLogoClick}>
        Kavy<span style={{ color: 'var(--ac)' }}>.</span>
      </Link>

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
        <a href="/resume" id="rl" onClick={handleNavClick('resume')}>
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
