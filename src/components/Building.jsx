import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projectsData from '../../data/projects.json';
import statsData from '../../data/stats.json';
import githubData from '../../data/github.json';
import { navigateWithReveal } from '../utils/transitionNavigate';
import { formatAsOfDate } from '../utils/timeFormat';
import DoorKnock from './DoorKnock';

// Hook for recent activity
export function useRecentActivity(projects) {
  return (projectId) => {
    const p = projects.find((x) => x.id === projectId);
    return Boolean(p?.hasRecentActivity || p?.status === 'Live demo');
  };
}

/**
 * Checks if a project's repository had a push in the last 30 days
 * using public repository telemetry from data/github.json.
 */
export function isWindowLit(project, ghData) {
  if (!project || !ghData?.repos) return false;

  let repoName = null;
  if (project.url) {
    const match = project.url.match(/github\.com\/Kavy-Sharma\/([^/]+)/i);
    if (match) repoName = match[1];
  }
  if (!repoName) {
    const mapping = {
      phish: 'phishsim-ai',
      aegis: 'AegisAgent',
      safe: 'safeline-dvwa-waf-lab',
      sent: 'SentinelFlow'
    };
    repoName = mapping[project.id];
  }
  if (!repoName) return false;

  const repoKey = Object.keys(ghData.repos).find(
    (k) => k.toLowerCase() === repoName.toLowerCase()
  );
  if (!repoKey) return false;

  const repo = ghData.repos[repoKey];
  if (!repo?.pushedAt) return false;

  const pushTime = new Date(repo.pushedAt).getTime();
  const refTime = ghData.fetchedAt ? new Date(ghData.fetchedAt).getTime() : Date.now();
  const diffDays = (refTime - pushTime) / (1000 * 60 * 60 * 24);

  return diffDays >= 0 && diffDays <= 30;
}

export default function Building({ onOpenWindow, onHoverWindow, onLeaveWindow, onOpenResume }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const isWindowActive = useRecentActivity(projectsData);

  const stats = statsData || {
    portswiggerLabs: 105,
    thmRank: 'top 8%',
    client_tests_plus: 20
  };

  const totalLabs = stats.portswiggerLabs || 105;
  const thmRank = stats.thmRank || 'top 8%';
  const clientsCount = `${stats.client_tests_plus || 20}+`;
  const asOfText = formatAsOfDate(stats.asOf);

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
        let status = p.status;
        desc = desc.replace('__LABS__', totalLabs).replace('__THM__', thmRank);
        if (p.id === 'td') {
          desc = `VAPT intern. Tested apps for ${clientsCount} clients.`;
        }
        // PROVE windows read dynamic stats and show "as of <date>"
        if (p.id === 'ps') {
          status = asOfText || 'Verified';
        } else if (p.id === 'thm') {
          status = asOfText || 'Verified';
        }
        return {
          ...p,
          desc,
          status
        };
      })
  }));

  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch') return;
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
    if (e.pointerType === 'touch') return;
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

    if (w.floor === 4 || w.floor === 2 || w.floor === 1 || w.id === 'wr') {
      navigateWithReveal(navigate, `/project/${w.id}`, e);
    } else if (w.id === 'vt' || w.id === 'net') {
      navigateWithReveal(navigate, '/notes', e);
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
        <div className="roof-left">
          <span className="tag">Kavy's building &middot; 5 floors</span>
          <span className="lit-legend" title="Windows with GitHub pushes in the last 30 days">
            <span className="lit-legend-dot" aria-hidden="true" />
            Lit = worked on recently
          </span>
        </div>

        <div className="rooftop-activity" aria-label="Rooftop 52-week activity map">
          <div className="rooftop-lights" role="img" aria-label="52-week activity map">
            {(githubData?.weeks || []).map((w, i) => (
              <span
                key={w.startDate || i}
                className={`roof-light level-${w.level}`}
                data-level={w.level}
                title={w.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floors 4 down to 1 */}
      <div id="floors">
        {FLOORS.map((floor) => (
          <div key={floor.n} id={`floor-${floor.n}`} className="floor">
            <div className="fl">
              <b>{floor.n}</b>
              <i>{floor.l}</i>
            </div>

            <div className="wins">
              {floor.windows.map((w) => {
                const isRecent = isWindowActive(w.id);
                const isLit = isWindowLit(w, githubData);
                return (
                  <button
                    key={w.id}
                    type="button"
                    className={`win ${isLit ? 'is-lit' : ''} ${isRecent ? 'on recent-activity' : ''}`}
                    data-id={w.id}
                    data-lit={isLit ? 'true' : 'false'}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={handlePointerLeave}
                    onPointerEnter={(e) => {
                      if (e.pointerType === 'touch') return;
                      if (onHoverWindow) onHoverWindow(w, e);
                    }}
                    onFocus={(e) => {
                      if (onHoverWindow) {
                        const r = e.currentTarget.getBoundingClientRect();
                        let x = r.right + 14;
                        if (x + 360 > window.innerWidth - 12) {
                          x = Math.max(16, r.left - 356);
                        }
                        const y = Math.max(16, Math.min(window.innerHeight - 240, r.top));
                        onHoverWindow(w, { clientX: x, clientY: y });
                      }
                    }}
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
          <DoorKnock onOpenResume={handleResumeNav} />
        </div>
      </div>
    </div>
  );
}
