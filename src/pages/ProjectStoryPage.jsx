import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import StoryDiagram from '../components/StoryDiagram';
import { PROJECT_STORIES } from '../data/projectStories';
import projectsData from '../../data/projects.json';
import statsData from '../../data/stats.json';
import { useTheme } from '../context/ThemeContext';
import { navigateWithReveal } from '../utils/transitionNavigate';

export default function ProjectStoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAttack } = useTheme();

  // Find verified story or fallback to projects.json
  const story = PROJECT_STORIES[id] || (() => {
    const p = projectsData.find((x) => x.id === id);
    if (!p) return null;
    return {
      id: p.id,
      title: p.title,
      oneLine: p['one-line'] || '',
      status: p.status || 'Project',
      floorLabel: `Floor ${p.floor} \u00b7 Project`,
      url: p.url || '',
      diagramType: p.id,
      beats: [
        {
          title: 'The problem',
          text: 'Verified project details are being curated from documentation.'
        },
        {
          title: 'The idea',
          text: p['one-line'] || 'Documented security investigation.'
        },
        {
          title: 'What I built',
          text: 'System implementation and verifiable methodology.'
        }
      ],
      breakFix: null,
      limits: ['Details sourced strictly from verified project facts.']
    };
  })();

  // Default lens: attack when theme is attack/night, defend when defend/day
  const [activeLens, setActiveLens] = useState(isAttack ? 'attack' : 'defend');
  const [scrollProgress, setScrollProgress] = useState(0.2);

  const pageRef = useRef(null);
  const beatsRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Sync lens if theme changes externally unless manually toggled
  useEffect(() => {
    setActiveLens(isAttack ? 'attack' : 'defend');
  }, [isAttack]);

  // Focus management: store previous focus on mount, focus container, restore on unmount
  useEffect(() => {
    previousActiveElement.current = document.activeElement;
    if (pageRef.current) {
      pageRef.current.focus({ preventScroll: true });
    }

    return () => {
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        try {
          previousActiveElement.current.focus({ preventScroll: true });
        } catch {
          // ignore if disconnected
        }
      }
    };
  }, []);

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigateWithReveal(navigate, '/', e);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Scroll listener to drive step-by-step diagram gate lighting
  useEffect(() => {
    const handleScroll = () => {
      if (!beatsRef.current) return;
      const rect = beatsRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalDist = rect.height;
      if (totalDist <= 0) return;

      // Progress starts when top enters lower half, finishes when bottom passes mid screen
      const scrolled = windowH * 0.7 - rect.top;
      const ratio = Math.max(0.1, Math.min(1.0, scrolled / totalDist));
      setScrollProgress(ratio);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    navigateWithReveal(navigate, '/', e);
  };

  if (!story) {
    return (
      <div className="wrap" style={{ minHeight: '100vh', padding: '40px 0' }}>
        <Header />
        <div style={{ marginTop: '40px' }}>
          <h2>Project not found</h2>
          <p className="lead">The requested project ID does not exist.</p>
          <button type="button" className="cp" onClick={handleBack} style={{ marginTop: '20px' }}>
            &larr; Back to building
          </button>
        </div>
      </div>
    );
  }

  // Replace stats tokens with dynamic values from stats.json
  const totalLabs = statsData?.portswiggerLabs || 105;
  const thmRank = statsData?.thmRank || 'top 7%';
  const formattedOneLine = (story.oneLine || '')
    .replace('__LABS__', totalLabs)
    .replace('__THM__', thmRank);

  const hasRealLink = story.url && story.url.startsWith('http');

  return (
    <div
      ref={pageRef}
      className="story-page-wrap"
      tabIndex={-1}
      aria-label={`${story.title} story`}
    >
      <div className="wrap">
        <Header />

        <main className="story-container">
          {/* Top close button */}
          <button
            type="button"
            className="x story-close-btn"
            onClick={handleBack}
            aria-label="Close story and return to building"
          >
            Close &#x2715;
          </button>

          {/* Header block */}
          <header className="story-header">
            <div className="story-meta-row">
              <span className="tag story-floor-chip">{story.floorLabel}</span>
              <span className={`status-badge ${story.status === 'Live demo' ? 'live' : ''}`}>
                {story.status === 'Live demo' && <i className="live-dot" />}
                {story.status}
              </span>
            </div>

            <h1 className="story-title">{story.title}</h1>
            <p className="story-lead lead">{formattedOneLine}</p>

            {hasRealLink && (
              <div className="story-real-link-wrap">
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="story-real-link"
                >
                  Open the real thing &rarr;
                </a>
              </div>
            )}
          </header>

          {/* 2-column layout on desktop: Story beats + sticky diagram */}
          <div className="story-grid">
            {/* Left Column: Break/Fix switch + Beats + Limits */}
            <div className="story-left-col">
              {/* 1. Break it / Fix it switch (if threat info is present) */}
              {story.breakFix && (
                <section className="break-fix-section" aria-label="Attacker vs Defender perspective">
                  <div className="break-fix-header">
                    <span className="mono bf-label">BREAK IT / FIX IT PERSPECTIVE</span>
                    <div className="break-fix-toggle" role="group">
                      <button
                        type="button"
                        className={`bf-btn ${activeLens === 'attack' ? 'active-attack' : ''}`}
                        onClick={() => setActiveLens('attack')}
                        aria-pressed={activeLens === 'attack'}
                      >
                        <span className="bf-indicator red" />
                        Break it (Attacker)
                      </button>
                      <button
                        type="button"
                        className={`bf-btn ${activeLens === 'defend' ? 'active-defend' : ''}`}
                        onClick={() => setActiveLens('defend')}
                        aria-pressed={activeLens === 'defend'}
                      >
                        <span className="bf-indicator blue" />
                        Fix it (Defender)
                      </button>
                    </div>
                  </div>

                  <div className={`break-fix-card ${activeLens}`}>
                    {activeLens === 'attack' ? (
                      <div className="bf-card-inner attack">
                        <span className="mono bf-role-tag red">ATTACKER VIEW</span>
                        <h4 className="bf-card-title">{story.breakFix.redTitle}</h4>
                        <p className="bf-card-text">{story.breakFix.redText}</p>
                      </div>
                    ) : (
                      <div className="bf-card-inner defend">
                        <span className="mono bf-role-tag blue">DEFENDER VIEW</span>
                        <h4 className="bf-card-title">{story.breakFix.blueTitle}</h4>
                        <p className="bf-card-text">{story.breakFix.blueText}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* 2. Story Beats (3 to 5 beats with vertical line & dots) */}
              <section className="story-beats" ref={beatsRef} aria-label="Story progression">
                {story.beats.map((beat, idx) => (
                  <article key={idx} className="beat">
                    <b>{beat.title}</b>
                    <div className="beat-text">{beat.text}</div>
                  </article>
                ))}
              </section>

              {/* 3. Limitations box (honest boundaries from README) */}
              {story.limits && story.limits.length > 0 && (
                <section className="limits-box" aria-label="Honest boundaries and limitations">
                  <div className="limits-header">
                    <span className="mono limits-tag">HONEST BOUNDARIES &amp; LIMITS</span>
                  </div>
                  <ul className="limits-list">
                    {story.limits.map((limit, idx) => (
                      <li key={idx}>{limit}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Bottom navigation link */}
              <div className="story-footer-nav">
                <a
                  href="/"
                  onClick={handleBack}
                  className="story-back-link"
                >
                  &larr; Back to building
                </a>
              </div>
            </div>

            {/* Right Column: Sticky diagram */}
            <aside className="story-right-col" aria-label="Interactive architecture diagram">
              <div className="sticky-diagram-wrapper">
                <StoryDiagram
                  type={story.diagramType}
                  scrollProgress={scrollProgress}
                  lens={activeLens}
                />
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
