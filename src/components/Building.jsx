import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projectsData from '../../data/projects.json';
import statsData from '../../data/stats.json';
import { navigateWithReveal } from '../utils/transitionNavigate';

// Hook for recent activity (hook for Prompt 5)
export function useRecentActivity(projects) {
  return (projectId) => {
    const p = projects.find((x) => x.id === projectId);
    return Boolean(p?.hasRecentActivity || p?.status === 'Live demo');
  };
}

export default function Building({ onOpenWindow, onHoverWindow, onLeaveWindow, onOpenResume }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const isWindowActive = useRecentActivity(projectsData);

  const stats = statsData || {
    portswiggerLabs: 105,
    thmRank: 'top 7%',
    client_tests_plus: 20
  };

  const totalLabs = stats.portswiggerLabs || 105;
  const thmRank = stats.thmRank || 'top 7%';
  const clientsCount = `${stats.client_tests_plus || 20}+`;

  // Group projects by floor
  const floorConfig = [
    { n: 4, l: 'BUILD' },
    { n: 3, l: 'LEARN' },
    { n: 2, l: 'PROVE' },
    { n: 1, l: 'WORK' }
  ];

  const FLOORS = floorConfig.map((fc) => ({
    ...fc,
    windows: projectsData
      .filter((p) => p.floor === fc.n)
      .map((p) => {
        let desc = p['one-line'] || '';
        desc = desc.replace('__LABS__', totalLabs).replace('__THM__', thmRank);
        if (p.id === 'td') {
          desc = `VAPT intern. Tested apps for ${clientsCount} clients.`;
        }
        return {
          ...p,
          desc
        };
      })
  }));

  const handlePointerMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
    el.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  };

  const handlePointerLeave = (e) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    if (onLeaveWindow) onLeaveWindow();
  };

  const handleWindowClick = (w, e) => {
    if (onOpenWindow) {
      onOpenWindow(w, e);
      return;
    }

    if (w.floor === 4) {
      navigateWithReveal(navigate, `/project/${w.id}`, e);
    } else if (w.id === 'vt' || w.id === 'net') {
      navigateWithReveal(navigate, '/notes', e);
    } else if (w.id === 'wr') {
      navigateWithReveal(navigate, '/notes/machine-write-ups', e);
    } else if (w.url && w.url.startsWith('/')) {
      navigateWithReveal(navigate, w.url, e);
    } else {
      navigateWithReveal(navigate, `/project/${w.id}`, e);
    }
  };

  const handleCopyEmail = () => {
    const email = 'kavysharma196@gmail.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleResumeNav = (e) => {
    e.preventDefault();
    if (onOpenResume) {
      onOpenResume(e);
      return;
    }
    navigateWithReveal(navigate, '/resume', e);
  };

  return (
    <div className="bld" id="building">
      <div className="roof">
        <span className="tag">Kavy's building &middot; 5 floors</span>
      </div>

      {/* Floors 4 down to 1 */}
      <div id="floors">
        {FLOORS.map((floor) => (
          <div key={floor.n} className="floor">
            <div className="fl">
              <b>{floor.n}</b>
              <i>{floor.l}</i>
            </div>

            <div className="wins">
              {floor.windows.map((w) => {
                const isRecent = isWindowActive(w.id);
                return (
                  <button
                    key={w.id}
                    type="button"
                    className={`win ${isRecent ? 'on recent-activity' : ''}`}
                    data-id={w.id}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={handlePointerLeave}
                    onPointerEnter={(e) => onHoverWindow && onHoverWindow(w, e)}
                    onFocus={(e) => onHoverWindow && onHoverWindow(w, e)}
                    onBlur={onLeaveWindow}
                    onClick={(e) => handleWindowClick(w, e)}
                  >
                    <div className="lit" />
                    <div className="cap">
                      <span className="st">
                        {w.previewMode === 'live' && <i className="dot" />}
                        {w.status}
                      </span>
                      <h3>{w.title}</h3>
                      <p>{w.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Ground Floor (Contact) */}
      <div className="ground" id="ground">
        <div className="fl">
          <b>G</b>
          <i>CONTACT</i>
        </div>

        <div className="door">
          <button
            type="button"
            className="dr"
            id="dr"
            title="Knock on door to copy email"
            aria-label="Knock on door to copy email"
            onClick={handleCopyEmail}
          />

          <div>
            <p>
              <b style={{ font: "700 20px 'Bricolage Grotesque', system-ui, sans-serif" }}>
                Open to internships and jobs.
              </b>
              <br />
              <span style={{ color: 'var(--mu)' }}>Say hi, the door is open.</span>
            </p>

            <p style={{ marginTop: '10px' }}>
              <span className="mail" id="mail">
                kavysharma196@gmail.com
              </span>{' '}
              <button type="button" className="cp" id="cp" onClick={handleCopyEmail}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </p>

            <p style={{ marginTop: '8px', fontSize: '14px' }}>
              <a
                style={{ color: 'var(--ac)' }}
                href="/resume"
                className="rl2"
                onClick={handleResumeNav}
              >
                Resume
              </a>{' '}
              &middot;{' '}
              <a style={{ color: 'var(--ac)' }} href="https://github.com/Kavy-Sharma" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>{' '}
              &middot;{' '}
              <a style={{ color: 'var(--ac)' }} href="https://linkedin.com/in/kavysharma" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>{' '}
              &middot;{' '}
              <a style={{ color: 'var(--ac)' }} href="https://tryhackme.com/p/kavysharma196" target="_blank" rel="noopener noreferrer">
                TryHackMe
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
