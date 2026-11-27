import React, { useState, useEffect } from 'react';

export default function StoryDiagram({ type, scrollProgress = 0, lens = 'defend' }) {
  const [activeGate, setActiveGate] = useState(1);
  const [userSelectedGate, setUserSelectedGate] = useState(null);

  // Update active gate based on scroll
  useEffect(() => {
    if (type === 'aegis') {
      const gateIdx = Math.min(9, Math.max(1, Math.ceil(scrollProgress * 9) || 1));
      setActiveGate(gateIdx);
    }
  }, [scrollProgress, type]);

  // Which gate is blocked: in attack mode, Gate 1 (Detection) stops the injection.
  // In defend mode, Gate 4 (Role check) stops excessive privilege.
  const blockedGate = userSelectedGate !== null ? userSelectedGate : (lens === 'attack' ? 1 : 4);

  switch (type) {
    case 'aegis':
      return (
        <div className="diagram-container aegis-diagram">
          <div className="diagram-header">
            <span className="mono tag-pill">9-GATE ARCHITECTURE</span>
            <div className="led-badge">
              <span className={`led-dot ${lens === 'attack' ? 'red' : 'green'}`} />
              <span className="mono led-text">
                {lens === 'attack' ? 'RED LED \u2022 ATTACK BLOCKED' : 'GREEN LED \u2022 NORMAL'}
              </span>
            </div>
          </div>

          <svg viewBox="0 0 340 480" className="diagram-svg" role="img" aria-label="AegisAgent 9 gates pipeline">
            <defs>
              <linearGradient id="aegisLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--ac)" />
                <stop offset="100%" stopColor="var(--h2)" />
              </linearGradient>
            </defs>

            {/* Central pipeline connecting spine */}
            <line x1="36" y1="32" x2="36" y2="440" stroke="var(--ln)" strokeWidth="2" strokeDasharray="3 3" />
            <line
              x1="36"
              y1="32"
              x2="36"
              y2={32 + Math.min(activeGate - 1, 8) * 48}
              stroke="var(--ac)"
              strokeWidth="2.5"
            />

            {[
              { n: 1, name: 'Detection', sub: 'Multi-view regex normalizer' },
              { n: 2, name: 'Intent lock', sub: 'Pre-call scope boundary' },
              { n: 3, name: 'Model call', sub: 'Tool-calling LLM execution' },
              { n: 4, name: 'Role check', sub: 'RBAC boundary (guest vs admin)' },
              { n: 5, name: 'Parameter guard', sub: 'Path, URL, SQL constraints' },
              { n: 6, name: 'Rate limiter', sub: 'Sliding window throttling' },
              { n: 7, name: 'Human approval', sub: 'One-time SHA-256 sign-off' },
              { n: 8, name: 'Hardware bridge', sub: 'MQTT & USB ESP32 bridge' },
              { n: 9, name: 'Output scan', sub: 'Indirect injection trap' }
            ].map((gate, i) => {
              const y = 32 + i * 48;
              const isLit = activeGate >= gate.n;
              const isBlockPoint = gate.n === blockedGate;

              return (
                <g
                  key={gate.n}
                  className={`gate-group ${isLit ? 'lit' : ''} ${isBlockPoint ? 'blocked' : ''}`}
                  onClick={() => setUserSelectedGate(gate.n)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Gate circle marker */}
                  <circle
                    cx="36"
                    cy={y}
                    r={isBlockPoint ? '11' : '8.5'}
                    fill={isBlockPoint ? 'var(--color-alert, #D6483A)' : isLit ? 'var(--ac)' : 'var(--surf)'}
                    stroke={isBlockPoint ? 'var(--color-alert, #D6483A)' : 'var(--ln)'}
                    strokeWidth="2"
                    style={{ transition: 'all 0.25s ease' }}
                  />
                  <text
                    x="36"
                    y={y + 3.5}
                    textAnchor="middle"
                    fill={isBlockPoint || isLit ? '#FFFFFF' : 'var(--mu)'}
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                    fontWeight="700"
                  >
                    {gate.n}
                  </text>

                  {/* Gate card */}
                  <rect
                    x="56"
                    y={y - 17}
                    width="268"
                    height="35"
                    rx="6"
                    fill="var(--surf)"
                    stroke={isBlockPoint ? 'var(--color-alert, #D6483A)' : isLit ? 'var(--ac)' : 'var(--ln)'}
                    strokeWidth={isBlockPoint ? '1.5' : '1'}
                    style={{ transition: 'all 0.25s ease' }}
                  />
                  <text
                    x="68"
                    y={y - 2}
                    fill="var(--ink)"
                    fontSize="11.5"
                    fontFamily="var(--font-display)"
                    fontWeight="700"
                  >
                    {gate.name}
                  </text>
                  <text
                    x="68"
                    y={y + 11}
                    fill={isBlockPoint ? 'var(--color-alert, #D6483A)' : 'var(--mu)'}
                    fontSize="9.5"
                    fontFamily="var(--font-mono)"
                    fontWeight={isBlockPoint ? '600' : '400'}
                  >
                    {isBlockPoint ? 'STOPPED HERE \u2022 Attack blocked' : gate.sub}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="diagram-footer">
            <span className="mono status-note">
              {blockedGate === 1
                ? 'Prompt injection stopped at Gate 1 (Detection) \u2022 Hardware safe'
                : `Blocked at Gate ${blockedGate} \u2022 Defense-in-depth enforced`}
            </span>
          </div>
        </div>
      );

    case 'safeline':
      return (
        <div className="diagram-container safeline-diagram">
          <div className="diagram-header">
            <span className="mono tag-pill">LAB NETWORK TOPOLOGY</span>
            <span className="mono badge-progress">attack tests in progress</span>
          </div>

          <svg viewBox="0 0 340 370" className="diagram-svg" role="img" aria-label="SafeLine lab network topology">
            {/* Box 1: Kali Attacker */}
            <rect x="20" y="16" width="300" height="74" rx="8" fill="var(--surf)" stroke="var(--ln)" strokeWidth="1" />
            <text x="35" y="38" fill="var(--ink)" fontSize="13" fontFamily="var(--font-display)" fontWeight="700">Kali Linux VM (Browser)</text>
            <text x="35" y="56" fill="var(--mu)" fontSize="10.5" fontFamily="var(--font-mono)">10.0.2.3 &bull; Testing &amp; Attack Probes</text>
            <text x="35" y="73" fill="var(--ok, #2FBF71)" fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">&bull; VERIFIED ACTIVE IN NATNETWORK</text>

            {/* Down arrow 1 */}
            <line x1="170" y1="90" x2="170" y2="132" stroke="var(--ac)" strokeWidth="2" strokeDasharray="3 3" />
            <text x="178" y="115" fill="var(--ac)" fontSize="9" fontFamily="var(--font-mono)">HTTPS (Port 443)</text>

            {/* Box 2: SafeLine WAF Reverse Proxy */}
            <rect x="20" y="132" width="300" height="96" rx="8" fill="var(--surf)" stroke="var(--ac)" strokeWidth="1.5" />
            <text x="35" y="156" fill="var(--ink)" fontSize="13" fontFamily="var(--font-display)" fontWeight="700">SafeLine WAF</text>
            <text x="35" y="174" fill="var(--mu)" fontSize="10" fontFamily="var(--font-mono)">HTTPS Reverse Proxy &bull; TLS Termination</text>
            <text x="35" y="191" fill="var(--mu)" fontSize="10" fontFamily="var(--font-mono)">dvwa.local &bull; 10.0.2.4:9443</text>
            <rect x="35" y="201" width="140" height="18" rx="3" fill="var(--bg)" stroke="var(--ln)" />
            <text x="43" y="213" fill="var(--ac)" fontSize="8.5" fontFamily="var(--font-mono)" fontWeight="600">REVERSE PROXY ROUTING VERIFIED</text>

            {/* Down arrow 2 */}
            <line x1="170" y1="228" x2="170" y2="268" stroke="var(--ln)" strokeWidth="2" />
            <text x="178" y="252" fill="var(--mu)" fontSize="9" fontFamily="var(--font-mono)">HTTP (Port 8080)</text>

            {/* Box 3: DVWA Backend */}
            <rect x="20" y="268" width="300" height="74" rx="8" fill="var(--surf)" stroke="var(--ln)" strokeWidth="1" />
            <text x="35" y="291" fill="var(--ink)" fontSize="13" fontFamily="var(--font-display)" fontWeight="700">Ubuntu DVWA Target</text>
            <text x="35" y="309" fill="var(--mu)" fontSize="10.5" fontFamily="var(--font-mono)">Apache2 &bull; MySQL &bull; /var/www/html/DVWA</text>
            <text x="35" y="326" fill="var(--ok, #2FBF71)" fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">&bull; DATABASE RESET &amp; READY</text>
          </svg>

          <div className="diagram-footer" style={{ borderTop: '1px solid var(--ln)', paddingTop: '10px' }}>
            <span className="mono status-note" style={{ color: 'var(--mu)' }}>
              Honest status: attack tests in progress &bull; No traffic blocked yet
            </span>
          </div>
        </div>
      );

    case 'phishsim':
      return (
        <div className="diagram-container phish-diagram">
          <div className="diagram-header">
            <span className="mono tag-pill">SIMULATION PIPELINE</span>
            <span className="mono badge-live">SANDBOX ACTIVE</span>
          </div>

          <svg viewBox="0 0 340 360" className="diagram-svg" role="img" aria-label="PhishSim AI simulation lifecycle">
            {[
              { step: '1', title: 'Target Reconnaissance', sub: 'SPF & DMARC lookup \u2022 Domain profiling' },
              { step: '2', title: 'Synthetic Lure Generation', sub: 'Context-specific AI prompt via OpenRouter' },
              { step: '3', title: 'Sandbox Dispatch', sub: 'Simulated email routed with tracking token' },
              { step: '4', title: 'User Decision Point', sub: 'Report Phish (defense) vs Click link (exposure)' },
              { step: '5', title: 'Executive Risk Briefing', sub: 'Human Security Score \u2022 Constructive coaching' }
            ].map((st, i) => {
              const y = 20 + i * 68;
              return (
                <g key={st.step}>
                  {i < 4 && <line x1="38" y1={y + 24} x2="38" y2={y + 68} stroke="var(--ac)" strokeWidth="2" />}
                  <circle cx="38" cy={y + 24} r="10" fill="var(--ac)" />
                  <text x="38" y={y + 27.5} textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700">{st.step}</text>
                  <rect x="58" y={y + 6} width="264" height="42" rx="6" fill="var(--surf)" stroke="var(--ln)" />
                  <text x="70" y={y + 22} fill="var(--ink)" fontSize="11" fontFamily="var(--font-display)" fontWeight="700">{st.title}</text>
                  <text x="70" y={y + 36} fill="var(--mu)" fontSize="9.5" fontFamily="var(--font-mono)">{st.sub}</text>
                </g>
              );
            })}
          </svg>

          <div className="diagram-footer">
            <span className="mono status-note">Public demo runs in sandbox mode &bull; zero real email delivery</span>
          </div>
        </div>
      );

    case 'sentinelflow':
      return (
        <div className="diagram-container sent-diagram">
          <div className="diagram-header">
            <span className="mono tag-pill">HYBRID DETECTION FLOW</span>
            <span className="mono badge-live">RULES + ML</span>
          </div>

          <svg viewBox="0 0 340 330" className="diagram-svg" role="img" aria-label="SentinelFlow architecture">
            {[
              { step: '1', title: 'PCAP Ingestion & Parsing', sub: 'Offline packet extraction without root permissions' },
              { step: '2', title: 'Flow Feature Extraction', sub: 'Bidirectional statistical window aggregation' },
              { step: '3', title: 'Dual Engine Analysis', sub: 'Deterministic Signatures + Isolation Forest' },
              { step: '4', title: 'Alert Correlation & Fusion', sub: 'MITRE ATT&CK mapping \u2022 Priority score' },
              { step: '5', title: 'Streamlit Analytical Triage', sub: 'Interactive dashboard for incident triage' }
            ].map((st, i) => {
              const y = 20 + i * 60;
              return (
                <g key={st.step}>
                  {i < 4 && <line x1="38" y1={y + 20} x2="38" y2={y + 60} stroke="var(--ac)" strokeWidth="2" />}
                  <circle cx="38" cy={y + 20} r="10" fill="var(--ac)" />
                  <text x="38" y={y + 23.5} textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700">{st.step}</text>
                  <rect x="58" y={y + 4} width="264" height="40" rx="6" fill="var(--surf)" stroke="var(--ln)" />
                  <text x="70" y={y + 20} fill="var(--ink)" fontSize="11" fontFamily="var(--font-display)" fontWeight="700">{st.title}</text>
                  <text x="70" y={y + 33} fill="var(--mu)" fontSize="9.5" fontFamily="var(--font-mono)">{st.sub}</text>
                </g>
              );
            })}
          </svg>

          <div className="diagram-footer">
            <span className="mono status-note">Trained strictly on benign baseline traffic for explainability</span>
          </div>
        </div>
      );

    case 'portswigger':
    case 'tryhackme':
    case 'ctf':
    case 'techdefence':
    case 'drdo':
    case 'writings':
    default:
      return (
        <div className="diagram-container evidence-diagram">
          <div className="diagram-header">
            <span className="mono tag-pill">OBSERVABLE EVIDENCE</span>
            <span className="mono badge-live">VERIFIED RECORD</span>
          </div>

          <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--ln)' }}>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--ac)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Primary Methodology
              </span>
              <h4 style={{ margin: '6px 0 2px', fontSize: '15px', color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {type === 'portswigger' ? 'Burp Suite Lab Progression' :
                 type === 'tryhackme' ? 'Offensive Machine Penetration' :
                 type === 'techdefence' ? 'Manual VAPT Assessment' :
                 type === 'drdo' ? 'MATLAB UAV Dynamics' :
                 type === 'ctf' ? 'Solo Jeopardy Scoring' : 'Documented Walkthroughs'}
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--mu)', lineHeight: 1.45 }}>
                {type === 'portswigger' ? 'Hands-on exploitation across Apprentice, Practitioner, and Expert lab environments.' :
                 type === 'tryhackme' ? 'Linux & Windows CTF machine exploitation from recon to root privilege escalation.' :
                 type === 'techdefence' ? 'Client application security auditing with Burp Suite Repeater and Nessus scanners.' :
                 type === 'drdo' ? 'Mathematical trajectory flight modeling and sensor telemetry processing.' :
                 type === 'ctf' ? 'Verified scoreboard standing and AI Security LLM governance certification.' : 'Reproducible step-by-step penetration testing notes.'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg)', border: '1px solid var(--ln)' }}>
                <span className="mono" style={{ fontSize: '9px', color: 'var(--mu)' }}>VERIFICATION</span>
                <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginTop: '2px' }}>
                  {type === 'techdefence' ? '20+ Clients' :
                   type === 'drdo' ? 'Simulation' :
                   type === 'ctf' ? 'Top 150 Solo' : 'Lab Proof'}
                </div>
              </div>
              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg)', border: '1px solid var(--ln)' }}>
                <span className="mono" style={{ fontSize: '9px', color: 'var(--mu)' }}>SOURCE</span>
                <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ac)', marginTop: '2px' }}>
                  facts.md
                </div>
              </div>
            </div>
          </div>

          <div className="diagram-footer">
            <span className="mono status-note">Derived strictly from verified facts &bull; No invented numbers</span>
          </div>
        </div>
      );
  }
}
