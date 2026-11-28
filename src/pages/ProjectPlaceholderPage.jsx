import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import projectsData from '../../data/projects.json';
import Header from '../components/Header';
import { navigateWithReveal } from '../utils/transitionNavigate';

export default function ProjectPlaceholderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectsData.find((p) => p.id === id);

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
        <span className="tag">{project?.status || 'Project Story'}</span>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', margin: '12px 0 16px' }}>
          {project?.title || id}
        </h1>
        <p className="lead">{project?.['one-line'] || 'Project story placeholder.'}</p>

        <div className="beat" style={{ marginTop: '32px' }}>
          <b>Story coming soon</b>
          <div style={{ color: 'var(--mu)', marginTop: '6px' }}>
            This page will tell the complete story: problem, idea, what I built, limits, and live demo.
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
