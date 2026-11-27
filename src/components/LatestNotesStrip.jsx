import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllNotes } from '../utils/notesLoader';
import { navigateWithReveal } from '../utils/transitionNavigate';

export default function LatestNotesStrip() {
  const navigate = useNavigate();
  // Select first 4 notes across different categories
  const allNotes = getAllNotes();
  const latestNotes = allNotes.slice(0, 4);

  const handleOpenNote = (slug, e) => {
    navigateWithReveal(navigate, `/notes/${slug}`, e);
  };

  const handleOpenAllNotes = (e) => {
    navigateWithReveal(navigate, '/notes', e);
  };

  return (
    <section className="latest-notes-strip" aria-label="Latest field notes">
      <div className="latest-strip-header">
        <div>
          <span className="tag">Floor 3 &middot; Field Research &middot; Sample Posts</span>
          <h2 className="latest-strip-title">Latest from the Vulnerability Table</h2>
          <p className="latest-strip-desc">
            Short, 2-minute breakdowns of real vulnerabilities, exploitation techniques, and defensive fixes.
          </p>
        </div>
        <a
          href="/notes"
          onClick={handleOpenAllNotes}
          className="latest-view-all-link"
        >
          View all 25 topics &rarr;
        </a>
      </div>

      <div className="latest-grid">
        {latestNotes.map((note) => (
          <button
            key={note.slug}
            type="button"
            className="latest-note-card"
            style={{ '--c': note.color }}
            onClick={(e) => handleOpenNote(note.slug, e)}
          >
            <div className="card-top-row">
              <span className="card-symbol" style={{ color: note.color }}>
                {note.symbol}
              </span>
              <span className="card-cat-badge">{note.category}</span>
              <span className="card-read-time">{note.readTime}m read</span>
            </div>
            <h3 className="card-title">{note.title}</h3>
            <p className="card-tldr">{note.tldr}</p>
            <div className="card-footer-arrow">
              Read note &rarr;
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
