import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function ResumePlaceholderPage() {
  return (
    <div className="wrap" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <Header />
      <div style={{ marginTop: '40px', maxWidth: '720px' }}>
        <span className="tag">/resume &middot; verified facts only</span>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', margin: '12px 0 16px' }}>
          Kavy Sharma
        </h1>
        <p className="lead">
          Cybersecurity (VAPT) and AI security researcher. B.E. Electronics &amp; Computer Engineering, MBM University (2023&ndash;2027).
        </p>

        <div className="beat" style={{ marginTop: '32px' }}>
          <b>Resume Page Placeholder</b>
          <div style={{ color: 'var(--mu)', marginTop: '6px' }}>
            Verified internships (TechDefence Jun&ndash;Jul 2026, DRDO Jun&ndash;Jul 2025), engineering projects, and observable proof. Direct PDF download coming soon.
          </div>
        </div>

        <p style={{ marginTop: '32px' }}>
          <Link
            to="/"
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
            &larr; Back to building
          </Link>
        </p>
      </div>
    </div>
  );
}
