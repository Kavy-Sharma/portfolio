import React, { useEffect, useState, useRef } from 'react';

export default function SpareKeyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const keyPressesRef = useRef([]);
  const previousActiveElementRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is currently typing inside an input, textarea, or contentEditable
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) {
        return;
      }

      // Close on Escape if open
      if (isOpen && e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      if (e.key.toLowerCase() === 'k') {
        const now = Date.now();
        // Keep presses within the last 1500ms
        const recent = [...keyPressesRef.current.filter((t) => now - t < 1500), now];
        keyPressesRef.current = recent;

        if (recent.length >= 3) {
          keyPressesRef.current = [];
          previousActiveElementRef.current = document.activeElement;
          setIsOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Manage focus when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
      }
    }
  }, [isOpen]);

  const handleCopyEmail = () => {
    const email = 'kavysharma196@gmail.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="spare-key-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="spare-key-title"
      onClick={() => setIsOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(12, 42, 51, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="spare-key-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surf)',
          border: '1px solid var(--ln)',
          borderRadius: '20px',
          padding: '28px 32px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 24px 60px -12px var(--glow), 0 0 0 1px var(--ln)',
          position: 'relative',
          animation: 'fadeScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close spare key note"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--mu)',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '6px',
            lineHeight: 1
          }}
        >
          ✕
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--bg)',
              border: '1px solid var(--ln)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--h2)'
            }}
          >
            {/* Key Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-1.5 1.5L16 7l-1.5-1.5L13 7l-1.5-1.5L10 7M7 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
            </svg>
          </div>
          <span className="tag">Secret Entrance</span>
        </div>

        <h2
          id="spare-key-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
            marginBottom: '10px'
          }}
        >
          You found the spare key.
        </h2>

        <p style={{ fontSize: '14.5px', color: 'var(--mu)', lineHeight: 1.55, marginBottom: '22px' }}>
          Tucked under the mat on the ground floor. The building is always open for internships, security research, and honest technical discussions.
        </p>

        <div
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--ln)',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '20px'
          }}
        >
          <span className="mono" style={{ fontSize: '13px', color: 'var(--ink)' }}>
            kavysharma196@gmail.com
          </span>
          <button
            type="button"
            onClick={handleCopyEmail}
            style={{
              background: copied ? 'var(--ac)' : 'var(--surf)',
              color: copied ? 'var(--bg)' : 'var(--ink)',
              border: '1px solid var(--ln)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              background: 'var(--ink)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: '99px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Put key back (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
