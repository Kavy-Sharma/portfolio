import React, { useState, useMemo } from 'react';
import { getAllNotes } from '../utils/notesLoader';
import OwaspTopicMap from './OwaspTopicMap';
import NoteReaderModal from './NoteReaderModal';

export default function FieldNotes() {
  const allNotes = useMemo(() => getAllNotes(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwasp, setSelectedOwasp] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [hoveredNoteSlug, setHoveredNoteSlug] = useState(null);

  // Filter notes based on search query and OWASP topic
  const filteredNotes = useMemo(() => {
    return allNotes.filter((note) => {
      // OWASP filter
      if (selectedOwasp) {
        const matchesOwasp = note.owasp && note.owasp.includes(selectedOwasp);
        if (!matchesOwasp) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = note.title?.toLowerCase().includes(q);
        const matchesSummary = note.summary?.toLowerCase().includes(q);
        const matchesCategory = note.category?.toLowerCase().includes(q);
        const matchesTags = note.tags?.some((t) => t.toLowerCase().includes(q));
        const matchesContent = note.content?.toLowerCase().includes(q);
        return matchesTitle || matchesSummary || matchesCategory || matchesTags || matchesContent;
      }

      return true;
    });
  }, [allNotes, searchQuery, selectedOwasp]);

  const hoveredNote = useMemo(() => {
    return allNotes.find((n) => n.slug === hoveredNoteSlug) || null;
  }, [allNotes, hoveredNoteSlug]);

  return (
    <section id="notes" className="section-wrapper">
      <div className="site-container">
        <div className="section-label">
          <span>Field Research</span>
        </div>
        <h2 className="section-title">Field Notes &amp; Walkthroughs</h2>
        <p className="section-desc">
          Technical post-mortems, penetration testing walkthroughs, and vulnerability breakdowns from hands-on laboratory experiments.
        </p>

        {/* OWASP Topic Map */}
        <OwaspTopicMap
          selectedCategory={selectedOwasp}
          onSelectCategory={setSelectedOwasp}
        />

        {/* Search & Filter Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          marginBottom: 'var(--space-lg)',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', minWidth: '280px', flex: '1 1 320px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes by keyword, technique, or CVE concept..."
              aria-label="Search field notes"
              className="mono"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.8125rem',
                backgroundColor: 'var(--color-surface)',
                border: 'var(--hairline)',
                color: 'var(--color-text)',
                borderRadius: '2px',
                outline: 'none',
                transition: 'border-color var(--transition-ui)'
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-line)')}
            />
          </div>

          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
            Showing {filteredNotes.length} of {allNotes.length} notes
          </div>
        </div>

        {/* Typographic Index Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'clamp(20px, 3vw, 32px)'
        }}>
          {/* Notes Index List */}
          <div style={{ gridColumn: 'span 12' }} className="notes-list-col">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              borderTop: 'var(--hairline)'
            }}>
              {filteredNotes.length === 0 ? (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'var(--color-muted)',
                  borderBottom: 'var(--hairline)'
                }}>
                  No field notes matched your search criteria.
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.slug}
                    onClick={() => setActiveNote(note)}
                    onMouseEnter={() => setHoveredNoteSlug(note.slug)}
                    onMouseLeave={() => setHoveredNoteSlug(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      padding: '20px 12px',
                      borderBottom: 'var(--hairline)',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                      flexWrap: 'wrap',
                      gap: '12px',
                      backgroundColor: hoveredNoteSlug === note.slug ? 'var(--color-surface)' : 'transparent'
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveNote(note);
                      }
                    }}
                  >
                    <div style={{ flex: '1 1 360px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span className="mono" style={{
                          fontSize: '0.6875rem',
                          color: 'var(--color-accent)',
                          fontWeight: 600
                        }}>
                          {note.category}
                        </span>
                        <span style={{ color: 'var(--color-line)' }}>&bull;</span>
                        <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
                          {note.readingTimeMinutes} min read
                        </span>
                      </div>

                      <h3 style={{
                        fontSize: '1.1875rem',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        letterSpacing: '-0.015em'
                      }}>
                        {note.title}
                      </h3>

                      <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-muted)',
                        marginTop: '4px',
                        lineHeight: 1.45,
                        maxWidth: '680px'
                      }}>
                        {note.summary}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      flexShrink: 0
                    }}>
                      <span className="mono" style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-muted)'
                      }}>
                        {note.date}
                      </span>
                      <span
                        className="mono"
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-accent)',
                          fontWeight: 600
                        }}
                      >
                        Read &rarr;
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reader Modal */}
      {activeNote && (
        <NoteReaderModal
          note={activeNote}
          onClose={() => setActiveNote(null)}
        />
      )}
    </section>
  );
}
