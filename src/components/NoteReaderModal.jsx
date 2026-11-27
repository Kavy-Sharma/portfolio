import React, { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';

export default function NoteReaderModal({ note, onClose }) {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  useEffect(() => {
    if (!contentRef.current) return;

    // Attach copy button logic to all code blocks
    const preBlocks = contentRef.current.querySelectorAll('pre');
    preBlocks.forEach((pre, idx) => {
      if (pre.querySelector('.copy-code-btn')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-code-btn mono';
      btn.innerText = 'Copy';
      btn.style.position = 'absolute';
      btn.style.top = '8px';
      btn.style.right = '8px';
      btn.style.padding = '3px 8px';
      btn.style.fontSize = '0.6875rem';
      btn.style.backgroundColor = 'var(--color-surface)';
      btn.style.border = 'var(--hairline)';
      btn.style.color = 'var(--color-text)';
      btn.style.borderRadius = '2px';
      btn.style.cursor = 'pointer';

      btn.addEventListener('click', () => {
        const codeText = pre.querySelector('code')?.innerText || pre.innerText;
        navigator.clipboard.writeText(codeText);
        btn.innerText = 'Copied!';
        setTimeout(() => {
          btn.innerText = 'Copy';
        }, 2000);
      });

      pre.style.position = 'relative';
      pre.appendChild(btn);
    });

    // Fix relative image sources to point to /content/notes/images/
    const images = contentRef.current.querySelectorAll('img');
    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('/')) {
        const cleanName = src.replace(/^\.\/images\//, '').replace(/^\/images\//, '');
        img.src = `/content/notes/images/${cleanName}`;
      }
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.border = 'var(--hairline)';
      img.style.margin = '16px 0';
      img.style.borderRadius = '2px';
      img.loading = 'lazy';
    });
  }, [note]);

  if (!note) return null;

  // Convert markdown content to HTML
  const htmlContent = marked.parse(note.content || note.rawContent || '');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={note.title}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(15, 28, 39, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        padding: 'clamp(16px, 3vw, 40px)',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="surface-card note-reader-card"
        style={{
          width: '100%',
          maxWidth: '920px',
          backgroundColor: 'var(--color-bg)',
          border: 'var(--hairline)',
          padding: 'clamp(24px, 4vw, 56px)',
          borderRadius: '2px',
          margin: 'auto 0',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close reader"
          className="mono"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '6px 12px',
            border: 'var(--hairline)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            borderRadius: '2px'
          }}
        >
          Close [Esc]
        </button>

        {/* Note Header */}
        <div style={{ marginBottom: 'var(--space-lg)', paddingRight: '90px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '8px'
          }}>
            <span className="mono" style={{
              fontSize: '0.75rem',
              color: 'var(--color-accent)',
              fontWeight: 600
            }}>
              {note.category}
            </span>
            <span style={{ color: 'var(--color-line)' }}>&bull;</span>
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
              {note.date}
            </span>
            <span style={{ color: 'var(--color-line)' }}>&bull;</span>
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
              {note.readingTimeMinutes} min read ({note.wordCount} words)
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: 'var(--color-text)',
            marginBottom: '16px'
          }}>
            {note.title}
          </h2>

          {/* Red and Blue lines */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '16px',
            backgroundColor: 'var(--color-surface)',
            border: 'var(--hairline)',
            borderRadius: '2px',
            marginTop: '16px'
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span className="mono" style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: 'var(--color-accent)',
                minWidth: '45px',
                paddingTop: '2px'
              }}>
                RED:
              </span>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.45 }}>
                {note.red}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span className="mono" style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: 'var(--color-accent2)',
                minWidth: '45px',
                paddingTop: '2px'
              }}>
                BLUE:
              </span>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.45 }}>
                {note.blue}
              </p>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: 'var(--hairline)', marginBottom: 'var(--space-lg)' }} />

        {/* Rendered Markdown Body */}
        <div
          ref={contentRef}
          className="markdown-reader-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      <style>{`
        .markdown-reader-content {
          color: var(--color-text);
          line-height: 1.7;
          font-size: 1rem;
        }
        .markdown-reader-content h1 {
          font-size: 1.75rem;
          margin-top: 36px;
          margin-bottom: 16px;
          border-bottom: var(--hairline);
          padding-bottom: 8px;
        }
        .markdown-reader-content h2 {
          font-size: 1.4rem;
          margin-top: 32px;
          margin-bottom: 14px;
        }
        .markdown-reader-content h3 {
          font-size: 1.15rem;
          margin-top: 24px;
          margin-bottom: 10px;
        }
        .markdown-reader-content p {
          margin-bottom: 16px;
        }
        .markdown-reader-content ul, .markdown-reader-content ol {
          margin-bottom: 16px;
          padding-left: 24px;
        }
        .markdown-reader-content li {
          margin-bottom: 6px;
        }
        .markdown-reader-content pre {
          background-color: var(--color-surface);
          border: var(--hairline);
          padding: 16px;
          border-radius: 2px;
          overflow-x: auto;
          margin: 20px 0;
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          line-height: 1.5;
        }
        .markdown-reader-content code {
          font-family: var(--font-mono);
          font-size: 0.875em;
          background-color: var(--color-surface);
          padding: 2px 5px;
          border-radius: 2px;
        }
        .markdown-reader-content pre code {
          background-color: transparent;
          padding: 0;
        }
        .markdown-reader-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 0.875rem;
        }
        .markdown-reader-content th, .markdown-reader-content td {
          border: var(--hairline);
          padding: 8px 12px;
          text-align: left;
        }
        .markdown-reader-content th {
          background-color: var(--color-surface);
          font-family: var(--font-mono);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
