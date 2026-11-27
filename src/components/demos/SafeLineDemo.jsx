import React from 'react';

export default function SafeLineDemo() {
  return (
    <div className="demo-box surface-card" style={{
      border: 'var(--hairline)',
      padding: '20px',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: 'var(--hairline)'
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
            SAMPLE DATA &bull; LAB TOPOLOGY
          </span>
          <span className="mono" style={{
            fontSize: '0.6875rem',
            padding: '2px 8px',
            border: 'var(--hairline)',
            color: 'var(--color-accent2)',
            borderRadius: '2px'
          }}>
            IN PROGRESS
          </span>
        </div>

        <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
          Environment: VirtualBox NatNetwork
        </div>
      </div>

      {/* Lab Architecture Diagram */}
      <div style={{
        backgroundColor: 'var(--color-bg)',
        border: 'var(--hairline)',
        padding: '20px',
        borderRadius: '2px',
        marginBottom: '16px'
      }}>
        <svg viewBox="0 0 680 180" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Attacker node */}
          <rect x="20" y="50" width="140" height="80" rx="2" fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth="1" />
          <text x="90" y="80" textAnchor="middle" fill="var(--color-text)" fontFamily="var(--font-mono)" fontSize="11" fontWeight="600">Kali Linux VM</text>
          <text x="90" y="100" textAnchor="middle" fill="var(--color-muted)" fontFamily="var(--font-mono)" fontSize="10">10.0.2.3 (Testing)</text>
          <text x="90" y="116" textAnchor="middle" fill="var(--color-accent2)" fontFamily="var(--font-mono)" fontSize="9">VERIFIED</text>

          {/* Connection line 1 */}
          <path d="M 160 90 L 250 90" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="205" y="80" textAnchor="middle" fill="var(--color-muted)" fontFamily="var(--font-mono)" fontSize="9">HTTPS (443)</text>

          {/* WAF node */}
          <rect x="250" y="35" width="180" height="110" rx="2" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="1.5" />
          <text x="340" y="65" textAnchor="middle" fill="var(--color-text)" fontFamily="var(--font-mono)" fontSize="12" fontWeight="700">SafeLine WAF</text>
          <text x="340" y="85" textAnchor="middle" fill="var(--color-muted)" fontFamily="var(--font-mono)" fontSize="10">Reverse Proxy &amp; TLS</text>
          <text x="340" y="105" textAnchor="middle" fill="var(--color-muted)" fontFamily="var(--font-mono)" fontSize="9">dvwa.local &bull; 10.0.2.4</text>
          <rect x="290" y="118" width="100" height="18" rx="2" fill="var(--color-bg)" stroke="var(--color-line)" strokeWidth="1" />
          <text x="340" y="130" textAnchor="middle" fill="var(--color-accent2)" fontFamily="var(--font-mono)" fontSize="9">PROXY ACTIVE</text>

          {/* Connection line 2 */}
          <path d="M 430 90 L 510 90" stroke="var(--color-line)" strokeWidth="1.5" />
          <text x="470" y="80" textAnchor="middle" fill="var(--color-muted)" fontFamily="var(--font-mono)" fontSize="9">HTTP (8080)</text>

          {/* DVWA backend node */}
          <rect x="510" y="50" width="150" height="80" rx="2" fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth="1" />
          <text x="585" y="80" textAnchor="middle" fill="var(--color-text)" fontFamily="var(--font-mono)" fontSize="11" fontWeight="600">Ubuntu DVWA</text>
          <text x="585" y="100" textAnchor="middle" fill="var(--color-muted)" fontFamily="var(--font-mono)" fontSize="10">Apache &amp; MySQL</text>
          <text x="585" y="116" textAnchor="middle" fill="var(--color-accent2)" fontFamily="var(--font-mono)" fontSize="9">DATABASE RESET</text>
        </svg>
      </div>

      <div style={{
        padding: '12px',
        border: 'var(--hairline)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: '2px'
      }}>
        <div className="mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>
          Lab Status Note
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: 1.45 }}>
          Completed: Kali and Ubuntu VMs created on NatNetwork, DVWA database initialized, local hosts DNS configured, self-signed certificate deployed, SafeLine WAF reverse proxy path verified via curl. Security attack testing and blocking rule validation are pending; SafeLine has not blocked any traffic in this lab yet.
        </p>
      </div>
    </div>
  );
}
