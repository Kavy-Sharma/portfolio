import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: 'var(--hairline)',
      padding: '36px 0',
      backgroundColor: 'var(--color-bg)',
      transition: 'var(--transition-theme)'
    }}>
      <div className="site-container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--color-text)'
          }}>
            Kavy Sharma
          </span>
          <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
            B.E. Electronics &amp; Computer Engineering &bull; MBM University (2023&ndash;2027)
          </span>
        </div>

        <div className="mono" style={{
          fontSize: '0.75rem',
          color: 'var(--color-muted)',
          textAlign: 'right'
        }}>
          <span>Jodhpur, India &bull; VAPT &amp; AI Security</span>
        </div>
      </div>
    </footer>
  );
}
