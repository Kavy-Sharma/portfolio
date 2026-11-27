import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ContourBackground from '../components/ContourBackground';
import { navigateWithReveal } from '../utils/transitionNavigate';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    navigateWithReveal(navigate, '/', e);
  };

  return (
    <>
      <ContourBackground />
      <div className="wrap" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Header />
        
        <main
          id="main-content"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '60px 16px 100px'
          }}
        >
          {/* Elevator Display Box */}
          <div
            style={{
              width: '100px',
              height: '100px',
              border: '2px solid var(--ln)',
              borderRadius: '20px',
              background: 'var(--surf)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '28px',
              boxShadow: '0 12px 32px -8px var(--glow)'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '36px',
                lineHeight: 1,
                background: 'linear-gradient(135deg, var(--h1), var(--h2))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              404
            </span>
            <span
              className="mono"
              style={{
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'var(--mu)',
                marginTop: '4px',
                textTransform: 'uppercase'
              }}
            >
              NO FLOOR
            </span>
          </div>

          <span className="tag" style={{ marginBottom: '12px' }}>
            Elevator Out Of Range
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 6vw, 56px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              margin: '0 0 16px'
            }}
          >
            This floor does not exist.
          </h1>

          <p
            className="lead"
            style={{
              maxWidth: '520px',
              margin: '0 auto 36px',
              fontSize: '17px',
              color: 'var(--mu)',
              lineHeight: 1.55
            }}
          >
            You took the elevator past the roof or deep into the crawlspace. Kavy's building only has 5 floors:
            BUILD, LEARN, PROVE, WORK, and CONTACT.
          </p>

          <button
            type="button"
            onClick={handleBack}
            style={{
              background: 'var(--ink)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: '99px',
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: 'var(--font-text)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            &larr; Take elevator to Ground Floor
          </button>
        </main>
      </div>
    </>
  );
}
