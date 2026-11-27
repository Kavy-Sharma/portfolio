import React from 'react';
import { useParams, Link } from 'react-router-dom';
import projectsData from '../../data/projects.json';
import Header from '../components/Header';

export default function ProjectPlaceholderPage() {
  const { id } = useParams();
  const project = projectsData.find((p) => p.id === id);

  return (
    <div className="wrap" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <Header />
      <div style={{ marginTop: '40px', maxWidth: '720px' }}>
        <span className="tag">{project?.status || 'Project Story'}</span>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', margin: '12px 0 16px' }}>
          {project?.title || id}
        </h1>
        <p className="lead">{project?.['one-line'] || 'Project story placeholder.'}</p>

        <div className="beat" style={{ marginTop: '32px' }}>
          <b>Story coming soon</b>
          <div style={{ color: 'var(--mu)', marginTop: '6px' }}>
            This page will tell the complete story: problem, idea, what I built, limits, and live demo. Built from verified facts only.
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
