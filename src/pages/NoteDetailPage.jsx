import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import Header from '../components/Header';
import { getNoteBySlug } from '../utils/notesLoader';
import { navigateWithReveal } from '../utils/transitionNavigate';

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true
});

export default function NoteDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const note = getNoteBySlug(slug);
  const nextNote = note?.next ? getNoteBySlug(note.next) : null;

  const [scrollPercent, setScrollPercent] = useState(0);
  const pageRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Parse markdown content to clean HTML
  const htmlContent = useMemo(() => {
    if (!note?.content) return '';
    return marked.parse(note.content);
  }, [note?.content]);

  // Focus management
  useEffect(() => {
    previousActiveElement.current = document.activeElement;
    if (pageRef.current) {
      pageRef.current.focus({ preventScroll: true });
    }
    return () => {
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        try {
          previousActiveElement.current.focus({ preventScroll: true });
        } catch {}
      }
    };
  }, [slug]);

  // Scroll progress listener
  useEffect(() => {
    const handleScroll = () => {
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      if (totalH > 0) {
        const current = (window.scrollY / totalH) * 100;
        setScrollPercent(Math.min(100, Math.max(0, current)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  // Esc key listener returns to /notes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigateWithReveal(navigate, '/notes', e);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleBack = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    navigateWithReveal(navigate, '/notes', e);
  };

  const handleNext = (nextSlug, e) => {
    if (e && e.preventDefault) e.preventDefault();
    navigateWithReveal(navigate, `/notes/${nextSlug}`, e);
  };

  if (!note) {
    return (
      <div className="wrap" style={{ minHeight: '100vh', padding: '40px 0' }}>
        <Header />
        <div style={{ marginTop: '40px' }}>
          <h2>Note not found</h2>
          <p className="lead">The requested field note does not exist.</p>
          <button type="button" className="cp" onClick={handleBack} style={{ marginTop: '20px' }}>
            &larr; Back to Vulnerability Table
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="note-detail-wrap"
      tabIndex={-1}
      aria-label={`${note.title} reader`}
    >
      {/* Scroll Progress Bar at very top */}
      <div
        className="scroll-progress-bar"
        style={{
          width: `${scrollPercent}%`,
          backgroundColor: note.color || 'var(--ac)'
        }}
        role="progressbar"
        aria-valuenow={Math.round(scrollPercent)}
        aria-valuemin="0"
        aria-valuemax="100"
      />

      <div className="wrap">
        <Header />

        <article className="note-article">
          {/* Close button */}
          <button
            type="button"
            className="x note-close-btn"
            onClick={handleBack}
            aria-label="Close and return to table"
          >
            Close &#x2715;
          </button>

          {/* Header */}
          <header className="note-reader-header">
            <div className="note-meta-row">
              <span className="tag" style={{ borderColor: note.color }}>
                <b style={{ color: note.color, marginRight: '4px' }}>{note.symbol}</b>
                &middot; {note.category} &middot; {note.readTime} min read
              </span>
            </div>

            <h1 className="note-reader-title">{note.title}</h1>
            <p className="lead note-tldr">{note.tldr}</p>
          </header>

          {/* Side-by-side Red / Blue Cards */}
          <div className="rb note-rb-grid">
            <div className="r note-rb-card attacker">
              <span className="mono rb-tag red">ATTACKER LENS</span>
              <p className="rb-desc">{note.red}</p>
            </div>
            <div className="bl note-rb-card defender">
              <span className="mono rb-tag blue">DEFENDER LENS</span>
              <p className="rb-desc">{note.blue}</p>
            </div>
          </div>

          {/* Body Content from marked */}
          <div
            className="note-body-content markdown-body"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Next note navigation card */}
          {nextNote && (
            <div className="next-post-section">
              <span className="mono next-note-label">NEXT IN SEQUENCE</span>
              <a
                href={`/notes/${nextNote.slug}`}
                onClick={(e) => handleNext(nextNote.slug, e)}
                className="next-note-card"
                style={{ '--c': nextNote.color }}
              >
                <div className="next-symbol-box" style={{ color: nextNote.color }}>
                  {nextNote.symbol}
                </div>
                <div className="next-text-box">
                  <span className="mono next-category">{nextNote.category} &middot; {nextNote.readTime}m read</span>
                  <h4 className="next-title">{nextNote.title}</h4>
                  <p className="next-tldr">{nextNote.tldr}</p>
                </div>
                <div className="next-arrow-box">&rarr;</div>
              </a>
            </div>
          )}

          {/* Bottom back to table link */}
          <div className="note-footer-nav">
            <a href="/notes" onClick={handleBack} className="note-back-link">
              &larr; Back to Vulnerability Table
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
