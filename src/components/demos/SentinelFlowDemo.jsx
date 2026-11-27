import React, { useState, useEffect } from 'react';

const PACKET_SAMPLES = [
  { proto: 'TCP', flags: 'SYN', src: '192.168.1.45', dst: '10.0.0.5:443', len: 64, status: 'normal' },
  { proto: 'UDP', flags: '—', src: '10.0.0.5', dst: '1.1.1.1:53', len: 78, status: 'normal' },
  { proto: 'TCP', flags: 'ACK', src: '10.0.0.5:443', dst: '192.168.1.45', len: 1420, status: 'normal' },
  { proto: 'TCP', flags: 'SYN', src: '192.168.1.189', dst: '10.0.0.5:22', len: 64, status: 'alert' },
  { proto: 'TCP', flags: 'SYN', src: '192.168.1.189', dst: '10.0.0.5:23', len: 64, status: 'alert' },
  { proto: 'TCP', flags: 'SYN', src: '192.168.1.189', dst: '10.0.0.5:80', len: 64, status: 'alert' }
];

export default function SentinelFlowDemo() {
  const [activeMode, setActiveMode] = useState('hybrid');
  const [streamIndex, setStreamIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStreamIndex((prev) => (prev + 1) % PACKET_SAMPLES.length);
    }, 1600);
    return () => clearInterval(timer);
  }, []);

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
            SAMPLE DATA &bull; HYBRID DETECTION STREAM
          </span>
        </div>

        <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
          Mode: <strong style={{ color: 'var(--color-text)' }}>Rules + Isolation Forest</strong>
        </div>
      </div>

      {/* Packet Stream Monitor */}
      <div style={{
        backgroundColor: 'var(--color-bg)',
        border: 'var(--hairline)',
        padding: '12px',
        borderRadius: '2px',
        marginBottom: '16px',
        overflowX: 'auto'
      }}>
        <div className="mono" style={{
          fontSize: '0.6875rem',
          color: 'var(--color-muted)',
          marginBottom: '8px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>PACKET INGESTION BUFFER (5s WINDOW)</span>
          <span>SRC: 192.168.1.0/24</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {PACKET_SAMPLES.map((pkt, i) => {
            const isCurrent = i === streamIndex;
            return (
              <div
                key={i}
                className="mono"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  borderRadius: '2px',
                  backgroundColor: isCurrent ? 'var(--color-surface)' : 'transparent',
                  border: isCurrent ? '1px solid var(--color-line)' : '1px solid transparent',
                  color: pkt.status === 'alert' ? 'var(--color-accent)' : 'var(--color-text)'
                }}
              >
                <span>{pkt.proto} &bull; {pkt.flags}</span>
                <span>{pkt.src} &rarr; {pkt.dst}</span>
                <span>{pkt.len}B</span>
                <span>{pkt.status === 'alert' ? 'ANOMALOUS' : 'BENIGN'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert Card with MITRE ATT&CK Mapping */}
      <div style={{
        padding: '12px',
        border: '1px solid var(--color-accent)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: '2px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px'
        }}>
          <span className="mono" style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-accent)'
          }}>
            MITRE ATT&CK: T1046 (Network Service Discovery)
          </span>
          <span className="mono" style={{
            fontSize: '0.6875rem',
            padding: '1px 6px',
            backgroundColor: 'var(--color-bg)',
            border: 'var(--hairline)',
            color: 'var(--color-muted)'
          }}>
            High Confidence
          </span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: 1.45 }}>
          Rapid SYN dispersion detected across consecutive destination ports. Heuristic port scan threshold exceeded (count: 42). Isolation Forest anomaly z-score: +3.28.
        </p>
      </div>
    </div>
  );
}
