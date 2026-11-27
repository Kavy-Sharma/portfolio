import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { navigateWithReveal } from '../utils/transitionNavigate';

export default function NotesPlaceholderPage() {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    navigateWithReveal(navigate, '/', e);
  };

  return (
    <div className="wrap" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <Header />
      <div style={{ marginTop: '40px', maxWidth: '720px', position: 'relative' }}>
        <button
          type="button"
          className="x"
          onClick={handleBack}
          aria-label="Close"
        >
          Close ✕
        </button>
        <span className="tag">Notes &middot; Field Research</span>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', margin: '12px 0 16px' }}>
          Field Notes
        </h1>
        <p className="lead">
          Short, plain-language vulnerability notes and machine write-ups.
        </p>

        <div className="beat" style={{ marginTop: '32px' }}>
          <b>Notes index placeholder</b>
          <div style={{ color: 'var(--mu)', marginTop: '6px' }}>
            Full interactive table and topic browser will be loaded here.
          </div>
        </div>

        <p style={{ marginTop: '32px' }}>
          <a
            href="/"
            onClick={handleBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--ac)',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            &larr; Back to building
          </a>
        </p>
      </div>
    </div>
  );
}
