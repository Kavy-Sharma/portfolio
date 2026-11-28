import React from 'react';

const SCENARIOS = [
  { id: 1, name: 'Benign baseline', type: 'Normal traffic', caught: 'False positive', note: 'Normal browsing / idle traffic flagged by statistical threshold' },
  { id: 2, name: 'Port scan', type: 'Reconnaissance', caught: 'Caught (True positive)', note: 'Rapid port probing detected by heuristic flow scanner' },
  { id: 3, name: 'Slow scan', type: 'Stealth recon', caught: 'Caught (True positive)', note: 'Low-frequency TCP SYN probes caught across time windows' },
  { id: 4, name: 'SYN flood', type: 'DoS / Volume', caught: 'Caught (True positive)', note: 'Incomplete TCP handshakes detected by signature engine' },
  { id: 5, name: 'Spoofed SYN flood', type: 'DoS / Evasion', caught: 'Caught (True positive)', note: 'Randomized source IP flood flagged by flow volume anomalies' },
  { id: 6, name: 'UDP flood', type: 'DoS / Volume', caught: 'Caught (True positive)', note: 'High-bandwidth UDP packet burst flagged by statistical deviation' },
  { id: 7, name: 'ARP spoof', type: 'Man-in-the-Middle', caught: 'Caught (True positive)', note: 'Gratuitous / conflicting ARP replies intercepted by protocol parser' },
  { id: 8, name: 'SSH brute force', type: 'Credential attack', caught: 'Caught (True positive)', note: 'Rapid failed authentication connection spikes caught by rate monitor' },
  { id: 9, name: 'Distributed slow scan', type: 'Multi-source recon', caught: 'Caught (True positive)', note: 'Multi-source coordinated recon detected by hybrid correlation' },
  { id: 10, name: 'Flash crowd', type: 'Benign surge', caught: 'False positive', note: 'Sudden legitimate traffic spike misclassified as anomalous burst' }
];

export default function SentinelFlowShowcase() {
  return (
    <section className="sentinelflow-showcase-container" aria-label="SentinelFlow Terminal Evaluation and Performance Breakdown">
      {/* 1. Terminal Output Display (Full, unclipped screenshot) */}
      <div className="terminal-window-card">
        <div className="terminal-header-bar">
          <div className="terminal-dots" aria-hidden="true">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <span className="mono terminal-command-title">
            sentinelflow.cli evaluate --pcap-dir ./captures --mode hybrid
          </span>
          <span className="mono terminal-tag">REAL SCREENSHOT · CLI OUTPUT</span>
        </div>
        <div className="terminal-screenshot-wrap">
          <img
            src="/screens/sentinelflow-terminal.webp"
            alt="SentinelFlow CLI evaluation terminal output showing scenario results and window-level metrics"
            className="terminal-full-img"
            loading="eager"
            width="1400"
            height="615"
          />
        </div>
        <div className="terminal-caption-bar">
          <span className="mono" style={{ fontSize: '11px', color: 'var(--mu)' }}>
            Unclipped terminal output from PCAP test suite evaluation. Window-level recall (0.43%) shown directly in raw output above.
          </span>
        </div>
      </div>

      {/* 2. Scenario-Level Results Scorecard */}
      <div className="sentinel-scorecard-section">
        <div className="scorecard-header">
          <span className="mono tag" style={{ borderColor: 'var(--ac)', color: 'var(--ac)' }}>
            VERIFIED TEST RESULTS · 10 PCAP SCENARIOS
          </span>
          <h3 style={{ margin: '8px 0 4px', font: '800 22px var(--font-display)', color: 'var(--ink)' }}>
            Scenario-Level Detection Accuracy
          </h3>
          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--mu)', lineHeight: 1.45 }}>
            Evaluated across 10 distinct network traffic captures. Every attack was successfully detected at the scenario level.
          </p>
        </div>

        <div className="sentinel-metrics-strip">
          <div className="sentinel-metric-box highlight">
            <span className="mono metric-label">ATTACKS CAUGHT</span>
            <strong className="metric-val">8 of 8</strong>
            <span className="mono metric-sub">100% scenario recall</span>
          </div>
          <div className="sentinel-metric-box">
            <span className="mono metric-label">FALSE ALARMS</span>
            <strong className="metric-val">2</strong>
            <span className="mono metric-sub">Benign &amp; Flash crowd</span>
          </div>
          <div className="sentinel-metric-box">
            <span className="mono metric-label">MISSED ATTACKS</span>
            <strong className="metric-val">0</strong>
            <span className="mono metric-sub">Zero false negatives</span>
          </div>
          <div className="sentinel-metric-box">
            <span className="mono metric-label">SCENARIO PRECISION</span>
            <strong className="metric-val">80%</strong>
            <span className="mono metric-sub">8 TP / (8 TP + 2 FP)</span>
          </div>
        </div>

        {/* 10 Scenarios Breakdown Table */}
        <div className="scenarios-table-wrap">
          <table className="scenarios-table">
            <thead>
              <tr>
                <th scope="col" className="mono">#</th>
                <th scope="col">Scenario</th>
                <th scope="col">Traffic Category</th>
                <th scope="col">Evaluation Verdict</th>
                <th scope="col">Detection Behavior</th>
              </tr>
            </thead>
            <tbody>
              {SCENARIOS.map((sc) => {
                const isTP = sc.caught.includes('True positive');
                const isFP = sc.caught.includes('False positive');
                return (
                  <tr key={sc.id} className={isFP ? 'row-false-alarm' : ''}>
                    <td className="mono" style={{ color: 'var(--mu)' }}>{sc.id < 10 ? `0${sc.id}` : sc.id}</td>
                    <td><strong>{sc.name}</strong></td>
                    <td className="mono" style={{ fontSize: '11.5px', color: 'var(--mu)' }}>{sc.type}</td>
                    <td>
                      <span className={`mono scenario-verdict-pill ${isTP ? 'tp' : isFP ? 'fp' : ''}`}>
                        {isTP ? '✓ Caught' : '⚠ False Alarm'}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--mu)' }}>{sc.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. "Where it is weak" Callout Box */}
      <div className="where-it-is-weak-card" role="region" aria-label="Known weakness and limitations">
        <div className="weak-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="weak-alert-icon" aria-hidden="true">&#x26A0;</span>
            <h4 style={{ margin: 0, font: '700 16px var(--font-display)', color: '#D6483A' }}>
              Where it is weak: Window-level recall is 0.43%
            </h4>
          </div>
          <span className="mono weak-badge">BEING IMPROVED</span>
        </div>

        <div className="weak-metrics-row">
          <div className="weak-stat-cell">
            <span className="mono cell-k">5-SECOND WINDOW RECALL:</span>
            <strong className="cell-v alert">0.43%</strong>
          </div>
          <div className="weak-stat-cell">
            <span className="mono cell-k">5-SECOND WINDOW PRECISION:</span>
            <strong className="cell-v">28.95%</strong>
          </div>
          <div className="weak-stat-cell">
            <span className="mono cell-k">STATUS:</span>
            <span className="cell-v mono" style={{ fontSize: '12px', color: 'var(--ink)' }}>Rolling temporal aggregation in progress</span>
          </div>
        </div>

        <p className="weak-explanation-text">
          <strong>Why this happens:</strong> While entire attack scenarios are reliably detected (100% scenario recall), evaluating network traffic in fine-grained 5-second time slices exposes a real challenge. During low-volume phases of an attack, or between slow-scan intervals, individual 5-second windows contain only 1–2 packets that statistically resemble clean baseline traffic.
        </p>
        <p className="weak-explanation-text" style={{ marginTop: '8px', marginBottom: 0 }}>
          <strong>How it is being fixed:</strong> Currently refactoring the flow engine to maintain rolling temporal state across sliding 30s and 60s windows rather than evaluating isolated 5-second buckets, and introducing exponential packet decay weights to sustain detection memory.
        </p>
      </div>
    </section>
  );
}
