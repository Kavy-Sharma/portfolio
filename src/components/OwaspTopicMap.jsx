import React from 'react';

const OWASP_CATEGORIES = [
  { id: 'A01', code: 'A01:2021-Broken Access Control', name: 'Broken Access Control', notes: ['owasp-top-10', 'thm-machines'] },
  { id: 'A02', code: 'A02:2021-Cryptographic Failures', name: 'Cryptographic Failures', notes: ['owasp-top-10'] },
  { id: 'A03', code: 'A03:2021-Injection', name: 'Injection (SQLi & CMDi)', notes: ['owasp-top-10'] },
  { id: 'A04', code: 'A04:2021-Insecure Design', name: 'Insecure Design', notes: ['owasp-top-10'] },
  { id: 'A05', code: 'A05:2021-Security Misconfiguration', name: 'Security Misconfiguration', notes: ['owasp-top-10', 'network-ports', 'htb-learnings', 'htb-walkthroughs', 'thm-machines'] },
  { id: 'A06', code: 'A06:2021-Vulnerable and Outdated Components', name: 'Vulnerable Components', notes: ['owasp-top-10'] },
  { id: 'A07', code: 'A07:2021-Identification and Authentication Failures', name: 'Auth Failures & Default Credentials', notes: ['owasp-top-10', 'htb-learnings', 'htb-walkthroughs'] },
  { id: 'A08', code: 'A08:2021-Software and Data Integrity Failures', name: 'Software & Data Integrity', notes: ['owasp-top-10'] },
  { id: 'A09', code: 'A09:2021-Security Logging and Monitoring Failures', name: 'Logging & Monitoring Failures', notes: ['owasp-top-10'] },
  { id: 'A10', code: 'A10:2021-Server-Side Request Forgery', name: 'Server-Side Request Forgery (SSRF)', notes: ['owasp-top-10'] }
];

export default function OwaspTopicMap({ selectedCategory, onSelectCategory }) {
  return (
    <div className="surface-card" style={{
      padding: '24px',
      border: 'var(--hairline)',
      marginBottom: 'var(--space-xl)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="mono" style={{
            fontSize: '0.6875rem',
            padding: '2px 8px',
            backgroundColor: 'var(--color-bg)',
            border: 'var(--hairline)',
            color: 'var(--color-accent)',
            borderRadius: '2px',
            fontWeight: 600
          }}>
            OWASP TOP 10 TOPIC MAP
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
            Select a vulnerability domain to filter relevant field notes
          </span>
        </div>

        {selectedCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className="mono"
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-accent)',
              cursor: 'pointer'
            }}
          >
            Clear Filter &times;
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '8px'
      }}>
        {OWASP_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.code;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(isSelected ? null : cat.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                border: isSelected ? '1px solid var(--color-accent)' : 'var(--hairline)',
                backgroundColor: isSelected ? 'var(--color-bg)' : 'var(--color-surface)',
                borderRadius: '2px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition-ui)'
              }}
            >
              <div>
                <span className="mono" style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-muted)',
                  display: 'block'
                }}>
                  {cat.id}
                </span>
                <span style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  lineHeight: 1.25
                }}>
                  {cat.name}
                </span>
              </div>

              <span className="mono" style={{
                fontSize: '0.6875rem',
                padding: '1px 6px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-bg)',
                border: 'var(--hairline)',
                color: 'var(--color-muted)'
              }}>
                {cat.notes.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
