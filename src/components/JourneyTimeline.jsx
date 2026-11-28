import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateWithReveal } from '../utils/transitionNavigate';

const CHAPTERS = [
  {
    num: '01',
    topic: 'Networking & Protocols',
    dates: null,
    summary: 'Learned TCP vs UDP, Nmap scripting engine (NSE), and foundational service audits: FTP, SSH, and DNS.',
    targetId: 'net',
    targetRoute: '/notes',
    badge: 'FOUNDATIONS'
  },
  {
    num: '02',
    topic: 'First Machines & Walkthroughs',
    dates: null,
    summary: 'Initial access and Linux privilege escalation across lab targets: HTB Meow, Fawn, Dancing; THM Basic Pentesting, RootMe, Kenobi.',
    targetId: 'wr',
    targetRoute: '/project/wr',
    badge: 'SYSTEMS'
  },
  {
    num: '03',
    topic: 'Defense Simulation (DRDO)',
    dates: 'Jun\u2013Jul 2025',
    summary: 'Project internship: Built MATLAB UAV flight-path simulations with boundary monitoring logic flagging routes entering restricted zones.',
    targetId: 'drdo',
    targetRoute: '/project/drdo',
    badge: 'RESEARCH'
  },
  {
    num: '04',
    topic: 'Web Application Security',
    dates: null,
    summary: 'OWASP testing methodology and hands-on vulnerability analysis across PortSwigger Academy labs (SQLi, IDOR, XSS, CSRF, race conditions).',
    targetId: 'ps',
    targetRoute: '/project/ps',
    badge: 'LAB PROOF'
  },
  {
    num: '05',
    topic: 'VAPT Internship (TechDefence)',
    dates: 'Jun\u2013Jul 2026',
    summary: 'Conducted network VAPT using Nessus and Nmap, firewall rule reviews, CIS configuration audits, and web testing.',
    targetId: 'td',
    targetRoute: '/project/td',
    badge: 'FIELD AUDIT'
  },
  {
    num: '06',
    topic: 'AI Security Certification',
    dates: 'Sep 2026',
    summary: 'Certified in Introduction to AI Security (AI Security University): prompt injection defenses, LLM guardrails, and excessive agency limits.',
    targetId: 'ctf',
    targetRoute: '/project/ctf',
    badge: 'CERTIFIED'
  },
  {
    num: '07',
    topic: 'Sea of Secrets CTF & Tool Building',
    dates: 'Oct 2026',
    summary: 'Sea of Secrets CTF solo rank under 150 of 2,500. Built AegisAgent: a 9-gate defense gateway tested on real ESP32 hardware.',
    targetId: 'aegis',
    targetRoute: '/project/aegis',
    badge: 'COMPETITION & BUILD'
  }
];

export default function JourneyTimeline() {
  const navigate = useNavigate();

  const handleNavigate = (route, e) => {
    navigateWithReveal(navigate, route, e);
  };

  return (
    <section id="journey" className="journey-timeline-section" aria-label="Journey timeline by topic">
      <div className="journey-header">
        <span className="mono tag" style={{ borderColor: 'var(--ac)', color: 'var(--ac)' }}>
          GROWTH &middot; CHAPTERS BY TOPIC
        </span>
        <h2 className="section-heading" style={{ margin: '8px 0 6px' }}>
          The Journey
        </h2>
        <p className="lead" style={{ margin: 0, maxWidth: '640px' }}>
          Told in chapters by topic and verified real dates. Click any milestone to jump directly into that window.
        </p>
      </div>

      <div className="timeline-track" role="list">
        {CHAPTERS.map((ch, idx) => (
          <div key={ch.num} className="timeline-item" role="listitem">
            {/* Timeline Left Node / Number Marker */}
            <div className="timeline-marker-col">
              <span className="timeline-num mono">{ch.num}</span>
              {idx < CHAPTERS.length - 1 && <div className="timeline-line" />}
            </div>

            {/* Timeline Card */}
            <div className="timeline-card">
              <div className="timeline-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="mono chapter-badge">{ch.badge}</span>
                  {ch.dates && (
                    <span className="mono chapter-date-pill">
                      &#128197; {ch.dates}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="timeline-window-link mono"
                  onClick={(e) => handleNavigate(ch.targetRoute, e)}
                  aria-label={`Open window for chapter ${ch.num}: ${ch.topic}`}
                >
                  Inspect window &rarr;
                </button>
              </div>

              <h3 className="timeline-title">{ch.topic}</h3>
              <p className="timeline-summary">{ch.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

