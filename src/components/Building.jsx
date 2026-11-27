import React, { useState } from 'react';
import rawStats from '../../data/stats.json';

export default function Building({ onOpenWindow, onHoverWindow, onLeaveWindow, onOpenResume }) {
  const [copied, setCopied] = useState(false);

  const stats = rawStats || {
    portswigger: { apprentice: [31, 64], practitioner: [67, 175], expert: [7, 40] },
    tryhackme: { top_percent: 7, profile_url: 'https://tryhackme.com/p/kavysharma196' },
    client_tests_plus: 20
  };

  const totalLabs =
    (stats.portswigger?.apprentice?.[0] || 0) +
    (stats.portswigger?.practitioner?.[0] || 0) +
    (stats.portswigger?.expert?.[0] || 0);

  const thmRank = `top ${stats.tryhackme?.top_percent || 7}%`;
  const clientsCount = `${stats.client_tests_plus || 20}+`;

  const FLOORS = [
    {
      n: 4,
      l: 'BUILD',
      windows: [
        {
          id: 'phish',
          t: 'PhishSim AI',
          d: 'Phishing awareness trainer. Runs live for anyone.',
          s: 'live',
          u: 'phishsim-ai.onrender.com',
          st: 'Live demo'
        },
        {
          id: 'aegis',
          t: 'AegisAgent',
          d: 'A 9-gate shield between an AI and real hardware.',
          s: 'tested',
          u: 'github.com/Kavy-Sharma/AegisAgent',
          st: 'Hardware tested'
        },
        {
          id: 'sent',
          t: 'SentinelFlow',
          d: 'Early idea, still growing.',
          s: '',
          u: 'github.com/Kavy-Sharma/SentinelFlow',
          st: 'In progress'
        },
        {
          id: 'safe',
          t: 'SafeLine',
          d: 'Home lab: a vulnerable app behind a WAF.',
          s: '',
          u: 'github.com/Kavy-Sharma/safeline-dvwa-waf-lab',
          st: 'In progress'
        }
      ]
    },
    {
      n: 3,
      l: 'LEARN',
      windows: [
        {
          id: 'vt',
          t: 'Vulnerability Table',
          d: 'Small posts on one weakness each.',
          u: '#table',
          st: 'Notes'
        },
        {
          id: 'wr',
          t: 'Machine write-ups',
          d: 'Basic Pentesting, RootMe, Kenobi, Meow, Fawn, Dancing.',
          u: 'tryhackme.com',
          st: 'Write-ups'
        },
        {
          id: 'net',
          t: 'Ports & networks',
          d: 'TCP, UDP, Nmap scripts, the usual services.',
          u: '#table',
          st: 'Basics'
        }
      ]
    },
    {
      n: 2,
      l: 'PROVE',
      windows: [
        {
          id: 'ps',
          t: 'PortSwigger Academy',
          d: `${totalLabs} labs solved so far. Keeps growing.`,
          u: 'portswigger.net',
          st: 'Auto-ish stat'
        },
        {
          id: 'thm',
          t: 'TryHackMe',
          d: `Ranked ${thmRank} worldwide.`,
          u: 'tryhackme.com/p/kavysharma196',
          st: 'Profile'
        },
        {
          id: 'ctf',
          t: 'CTF + AI cert',
          d: 'Sea of Secrets CTF, solo, rank under 150. AI Security cert.',
          u: '',
          st: 'Achievements'
        }
      ]
    },
    {
      n: 1,
      l: 'WORK',
      windows: [
        {
          id: 'td',
          t: 'TechDefence',
          d: `VAPT intern. Tested apps for ${clientsCount} clients.`,
          u: '',
          st: 'Internship'
        },
        {
          id: 'drdo',
          t: 'DRDO',
          d: 'Project intern. UAV simulations in MATLAB.',
          u: '',
          st: 'Internship'
        }
      ]
    }
  ];

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
              {floor.windows.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className={`win ${w.s ? 'on' : ''}`}
                  data-id={w.id}
                  onPointerMove={handlePointerMove}
                  onPointerLeave={handlePointerLeave}
                  onPointerEnter={(e) => onHoverWindow && onHoverWindow(w, e)}
                  onFocus={(e) => onHoverWindow && onHoverWindow(w, e)}
                  onBlur={onLeaveWindow}
                  onClick={(e) => onOpenWindow && onOpenWindow(w, e)}
                >
                  <div className="lit" />
                  <div className="cap">
                    <span className="st">
                      {w.s === 'live' && <i className="dot" />}
                      {w.st}
                    </span>
                    <h3>{w.t}</h3>
                    <p>{w.d}</p>
                  </div>
                </button>
              ))}
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
                href="#resume"
                className="rl2"
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenResume) onOpenResume(e);
                }}
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
