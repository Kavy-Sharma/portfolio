import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';

export default function NoteDetailPlaceholderPage() {
  const { slug } = useParams();

  return (
    <div className="wrap" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <Header />
      <div style={{ marginTop: '40px', maxWidth: '720px' }}>
        <span className="tag">Field Note &middot; {slug}</span>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', margin: '12px 0 16px' }}>
          {slug?.replace(/-/g, ' ')}
        </h1>
        <p className="lead">2-minute field note read.</p>

        <div className="beat" style={{ marginTop: '32px' }}>
          <b>Note content placeholder</b>
          <div style={{ color: 'var(--mu)', marginTop: '6px' }}>
            Detailed breakdown with attacker lens and defender lens.
          </div>
        </div>

        <p style={{ marginTop: '32px' }}>
          <Link
            to="/notes"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--ac)',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '15px'
            }}
          >
            &larr; Back to all notes
          </Link>
        </p>
      </div>
    </div>
  );
}
