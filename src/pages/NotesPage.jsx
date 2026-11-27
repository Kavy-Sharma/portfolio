import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getAllNotes, getCategories } from '../utils/notesLoader';
import { navigateWithReveal } from '../utils/transitionNavigate';

export default function NotesPage() {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const pageRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Automatically loaded notes from content/notes/*.md
  const allNotes = useMemo(() => getAllNotes(), []);
  const categories = useMemo(() => getCategories(), []);

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
  }, []);

  // Esc key listener returns to home
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

  const handleBack = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    navigateWithReveal(navigate, '/', e);
  };

  const handleSelectNote = (slug, e) => {
    navigateWithReveal(navigate, `/notes/${slug}`, e);
  };

  const cleanQuery = searchQuery.trim().toLowerCase();

  return (
    <div
      ref={pageRef}
      className="notes-page-wrap"
      tabIndex={-1}
      aria-label="The Vulnerability Table"
    >
      <div className="wrap">
        <Header />

        <main className="notes-container">
          {/* Close button */}
          <button
            type="button"
            className="x"
            onClick={handleBack}
            aria-label="Close and return to building"
          >
            Close &#x2715;
          </button>

          {/* Header block */}
          <header className="notes-header">
            <span className="tag">Floor 3 &middot; Field Research &middot; {allNotes.length} Topics</span>
            <h1 className="notes-title">The Vulnerability Table</h1>
            <p className="lead notes-lead">
              One short post per topic. Pick a block, read it in two minutes. Built automatically from <code>content/notes/*.md</code>.
            </p>
          </header>

          {/* Category Chips and Search Box */}
          <div className="chips-bar">
            <div className="chips-group" role="tablist" aria-label="Filter by vulnerability category">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`chip-btn ${selectedCat === cat ? 'on' : ''}`}
                  onClick={() => setSelectedCat(cat)}
                  aria-selected={selectedCat === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="search-wrap">
              <input
                type="text"
                className="srch"
                placeholder="Search topics (e.g. SQL, SUID)..."
                aria-label="Search topics"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  &#x2715;
                </button>
              )}
            </div>
          </div>

          {/* Periodic Table Grid */}
          <div className="grid-vt" role="region" aria-label="Vulnerability tiles grid">
            {allNotes.map((note) => {
              const matchesCat = selectedCat === 'All' || note.category === selectedCat;
              const matchesSearch =
                !cleanQuery ||
                note.title.toLowerCase().includes(cleanQuery) ||
                note.symbol.toLowerCase().includes(cleanQuery) ||
                note.category.toLowerCase().includes(cleanQuery) ||
                (note.tldr && note.tldr.toLowerCase().includes(cleanQuery));

              const isVisible = matchesCat && matchesSearch;

              return (
                <button
                  key={note.slug}
                  type="button"
                  className={`el ${isVisible ? '' : 'off'}`}
                  style={{ '--c': note.color }}
                  onClick={(e) => handleSelectNote(note.slug, e)}
                  aria-label={`${note.number} ${note.category}: ${note.title}`}
                  tabIndex={isVisible ? 0 : -1}
                >
                  <span className="n">{note.number} &middot; {note.category}</span>
                  <span className="s">{note.symbol}</span>
                  <span className="t">{note.title}</span>
                  <span className="vt-time">{note.readTime}m read</span>
                </button>
              );
            })}
          </div>

          {/* Bottom navigation */}
          <div className="notes-footer-nav">
            <a href="/" onClick={handleBack} className="notes-back-link">
              &larr; Back to building
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
