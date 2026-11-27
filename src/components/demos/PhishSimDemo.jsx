import React, { useState, useEffect } from 'react';

const REPLAY_STEPS = [
  { stage: 'Reconnaissance', text: 'Passive DNS check on target domain. SPF: v=spf1 include:_spf.google.com ~all. DMARC: p=none.' },
  { stage: 'Target Profiling', text: 'Target role: Accounts Payable Specialist. Template selected: Urgent Invoice Verification.' },
  { stage: 'Synthetic Generation', text: 'AI engine crafts context-specific decoy lure with zero inbound spoofing flags.' },
  { stage: 'Simulation Dispatch', text: 'Simulated email routed to sandbox recipient with unique tracking token.' },
  { stage: 'Defensive Telemetry', text: 'User inspection: Recipient flagged suspicious sender header and clicked "Report Phish". Human Defense Score +15.' }
];

export default function PhishSimDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % REPLAY_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="demo-box surface-card" style={{
      border: 'var(--hairline)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
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
            SAMPLE DATA &bull; ATTACK REPLAY
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="mono"
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-muted)',
            cursor: 'pointer'
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      {/* Progress steps indicator */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${REPLAY_STEPS.length}, 1fr)`,
        gap: '4px',
        marginBottom: '16px'
      }}>
        {REPLAY_STEPS.map((step, idx) => (
          <div
            key={step.stage}
            onClick={() => setCurrentStep(idx)}
            style={{
              height: '3px',
              backgroundColor: idx <= currentStep ? 'var(--color-accent)' : 'var(--color-line)',
              cursor: 'pointer',
              transition: 'background-color 300ms ease'
            }}
          />
        ))}
      </div>

      <div style={{ minHeight: '90px' }}>
        <div className="mono" style={{
          fontSize: '0.75rem',
          color: 'var(--color-muted)',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        }}>
          Step {currentStep + 1} of {REPLAY_STEPS.length} &bull; {REPLAY_STEPS[currentStep].stage}
        </div>
        <p style={{
          fontSize: '0.9375rem',
          color: 'var(--color-text)',
          lineHeight: 1.5
        }}>
          {REPLAY_STEPS[currentStep].text}
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: 'var(--hairline)',
        fontSize: '0.75rem'
      }} className="mono">
        <span style={{ color: 'var(--color-muted)' }}>Status: {currentStep === 4 ? 'Simulated Incident Blocked' : 'Replay Active'}</span>
        <span style={{ color: 'var(--color-accent2)' }}>Safe Mode: No Live Emails</span>
      </div>
    </div>
  );
}
