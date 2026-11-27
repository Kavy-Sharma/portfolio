import React, { useMemo } from 'react';
import { useLocation } from 'wouter';
import { getAllNotes } from '../utils/notesLoader';

export default function FieldNotesTeaser() {
  const [, navigate] = useLocation();
  const allNotes = useMemo(() => getAllNotes(), []);
  const latestNotes = useMemo(() => allNotes.slice(0, 3), [allNotes]);

  const handleOpenNotes = (e) => {
    e.preventDefault();
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(() => {
        navigate('/notes');
        window.scrollTo(0, 0);
      });
    } else {
      navigate('/notes');
      window.scrollTo(0, 0);
    }
  };

  return (
    <section id="notes" className="section-wrapper">
      <div className="site-container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: 'var(--space-md)'
        }}>
          <div>
            <div className="section-label">
              <span>Field Research</span>
            </div>
            <h2 className="section-title">Field Notes &amp; Walkthroughs</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="mono" style={{
              fontSize: '0.75rem',
              padding: '3px 8px',
              border: 'var(--hairline)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-muted)',
              borderRadius: '2px'
            }}>
              {allNotes.length} Notes Published
            </span>
            <a
              href="/notes"
              onClick={handleOpenNotes}
              className="mono"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-accent)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Explore All &rarr;</span>
            </a>
          </div>
        </div>

        <p className="section-desc">
          Hands-on writeups, vulnerability research, and penetration testing post-mortems from lab targets and CTFs.
        </p>

        {/* 3 Latest Notes Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(16px, 2vw, 24px)',
          marginTop: 'var(--space-xl)'
        }}>
          {latestNotes.map((note) => (
            <article
              key={note.slug}
              className="surface-card note-teaser-card"
              style={{
                padding: 'clamp(20px, 3vw, 28px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: 'var(--hairline)',
                minHeight: '220px'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span className="mono" style={{
                    fontSize: '0.6875rem',
                    color: 'var(--color-accent)',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {note.category || 'Security'}
                  </span>
                  <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
                    {note.date}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '1.1875rem',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  marginBottom: '8px',
                  lineHeight: 1.25
                }}>
                  {note.title}
                </h3>

                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-muted)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {note.summary}
                </p>
              </div>

              <div style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: 'var(--hairline)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
                  {note.readingTimeMinutes} min read
                </span>
                <a
                  href="/notes"
                  onClick={handleOpenNotes}
                  className="mono"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--color-accent)'
                  }}
                >
                  Read Walkthrough &rarr;
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
