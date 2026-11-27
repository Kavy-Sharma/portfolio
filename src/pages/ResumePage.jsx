import React from 'react';
import { useNavigate } from 'react-router-dom';
import resumeData from '../../data/resume.json';
import statsData from '../../data/stats.json';
import { navigateWithReveal } from '../utils/transitionNavigate';

export default function ResumePage() {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    navigateWithReveal(navigate, '/', e);
  };

  const handlePrint = (e) => {
    e.preventDefault();
    window.print();
  };

  // Sync PortSwigger lab count dynamically from stats.json
  const labsCount = statsData?.portswiggerLabs || 105;

  return (
    <div className="resume-page-wrap">
      {/* Action Toolbar (Screen only, hidden on print) */}
      <div className="resume-toolbar no-print">
        <a href="/" onClick={handleBack} className="resume-back-link">
          &larr; Back to building
        </a>
        <div className="resume-actions">
          <button type="button" onClick={handlePrint} className="resume-btn resume-btn-outline">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print
          </button>
          <a href="/resume.pdf" download="Kavy_Sharma_Resume.pdf" className="resume-btn resume-btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </a>
        </div>
      </div>

      {/* Single-Column A4 Resume Sheet */}
      <main className="resume-sheet" id="resume-document">
        {/* Header: Name, Tagline & Contact info */}
        <header className="resume-header">
          <h1 className="resume-name">{resumeData.name}</h1>
          <p className="resume-tagline">{resumeData.tagline}</p>
          <div className="resume-contact-bar">
            <span>{resumeData.contact.location}</span>
            <span className="sep">&bull;</span>
            <a href={`tel:${resumeData.contact.phone.replace(/\s+/g, '')}`}>{resumeData.contact.phone}</a>
            <span className="sep">&bull;</span>
            <a href={`mailto:${resumeData.contact.email}`}>{resumeData.contact.email}</a>
            <span className="sep">&bull;</span>
            <a href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer">
              {resumeData.contact.linkedinLabel}
            </a>
            <span className="sep">&bull;</span>
            <a href={resumeData.contact.github} target="_blank" rel="noopener noreferrer">
              {resumeData.contact.githubLabel}
            </a>
          </div>
        </header>

        {/* 1. Summary */}
        <section className="resume-section" aria-labelledby="sec-summary">
          <h2 id="sec-summary" className="resume-sec-title">Summary</h2>
          <p className="resume-summary-text">{resumeData.summary}</p>
        </section>

        {/* 2. Experience */}
        <section className="resume-section" aria-labelledby="sec-experience">
          <h2 id="sec-experience" className="resume-sec-title">Experience</h2>
          <div className="resume-items-list">
            {resumeData.experience.map((exp, idx) => (
              <article key={idx} className="resume-item">
                <div className="resume-item-header">
                  <div>
                    <h3 className="resume-item-title">{exp.company}</h3>
                    <span className="resume-item-role">{exp.role}</span>
                  </div>
                  <div className="resume-item-meta">
                    <span className="resume-item-period">{exp.period}</span>
                    <span className="resume-item-loc">{exp.location}</span>
                  </div>
                </div>
                <ul className="resume-bullets">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* 3. Projects */}
        <section className="resume-section" aria-labelledby="sec-projects">
          <h2 id="sec-projects" className="resume-sec-title">Projects</h2>
          <div className="resume-items-list">
            {resumeData.projects.map((proj, idx) => (
              <article key={idx} className="resume-item">
                <div className="resume-item-header">
                  <div className="resume-proj-title-wrap">
                    <h3 className="resume-item-title">
                      {proj.name}
                      {proj.badge && (
                        <a href={proj.url} target="_blank" rel="noopener noreferrer" className="resume-proj-link">
                          &middot; {proj.badge}
                        </a>
                      )}
                    </h3>
                  </div>
                  <div className="resume-item-meta">
                    <span className="resume-item-tech">{proj.tech}</span>
                  </div>
                </div>
                <ul className="resume-bullets">
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Skills */}
        <section className="resume-section" aria-labelledby="sec-skills">
          <h2 id="sec-skills" className="resume-sec-title">Technical Skills</h2>
          <div className="resume-skills-grid">
            {Object.entries(resumeData.skills).map(([category, list]) => (
              <div key={category} className="resume-skill-line">
                <strong className="resume-skill-cat">{category}:</strong>{' '}
                <span className="resume-skill-val">{list}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Achievements & Certification */}
        <section className="resume-section" aria-labelledby="sec-achievements">
          <h2 id="sec-achievements" className="resume-sec-title">Achievements &amp; Certification</h2>
          <ul className="resume-bullets resume-achieve-list">
            <li>
              <strong>Sea of Secrets CTF (HackItUp, Oct 2026):</strong> Solo rank under 150 of 2,500 participants.
            </li>
            <li>
              <strong>TryHackMe:</strong> Top 7% worldwide.
            </li>
            <li>
              <strong>PortSwigger Web Security Academy:</strong> {labsCount}+ labs solved.
            </li>
            <li>
              <strong>Introduction to AI Security &ndash; AI Security University:</strong> Certified Sep 2026.
            </li>
          </ul>
        </section>

        {/* 6. Education */}
        <section className="resume-section" aria-labelledby="sec-education">
          <h2 id="sec-education" className="resume-sec-title">Education</h2>
          {resumeData.education.map((edu, idx) => (
            <article key={idx} className="resume-item resume-edu-item">
              <div className="resume-item-header">
                <div>
                  <h3 className="resume-item-title">{edu.institution}</h3>
                  <div className="resume-item-degree">{edu.degree}</div>
                </div>
                <div className="resume-item-meta">
                  <span className="resume-item-period">{edu.period}</span>
                  <span className="resume-item-loc">{edu.location}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
