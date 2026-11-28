import React, { useState, useRef } from 'react';

const TEST_REQUESTS = [
  {
    id: 'sqli',
    type: 'SQL Injection',
    path: '/vulnerabilities/sqli/?id=1%27+OR+%271%27%3D%271&Submit=Submit',
    payloadSnippet: "' OR '1'='1",
    isMalicious: true,
    wafRule: 'SQLi Semantic Detection (Rule #942100)',
    vulnerableImpact: 'Database returned full table: Admin, Gordon, 1337 password hashes exposed.'
  },
  {
    id: 'xss',
    type: 'Cross-Site Scripting (XSS)',
    path: '/vulnerabilities/xss_r/?name=%3Cscript%3Ealert%281%29%3C%2Fscript%3E',
    payloadSnippet: "<script>alert(1)</script>",
    isMalicious: true,
    wafRule: 'XSS Filter Match (Rule #941100)',
    vulnerableImpact: 'Script payload reflected unencoded into DOM; session cookie accessible.'
  },
  {
    id: 'traversal',
    type: 'Path Traversal',
    path: '/vulnerabilities/fi/?page=..%2F..%2F..%2F..%2Fetc%2Fpasswd',
    payloadSnippet: '../../../../etc/passwd',
    isMalicious: true,
    wafRule: 'Directory Traversal Detection (Rule #930100)',
    vulnerableImpact: 'File content /etc/passwd leaked root:x:0:0 system accounts.'
  },
  {
    id: 'benign',
    type: 'Benign GET Request',
    path: '/dvwa/index.php',
    payloadSnippet: 'Normal navigation',
    isMalicious: false,
    wafRule: 'None (Clean Traffic)',
    vulnerableImpact: 'Normal page rendered with HTTP 200 OK.'
  }
];

export default function SafeLineRequestTrace() {
  const [wafEnabled, setWafEnabled] = useState(true);
  const [selectedReq, setSelectedReq] = useState(TEST_REQUESTS[0]);
  const [activeHop, setActiveHop] = useState(-1); // -1: idle, 0: browser, 1: proxy, 2: waf, 3: app
  const [animating, setAnimating] = useState(false);
  const [resultState, setResultState] = useState(null); // 'blocked' | 'passed' | 'exploited'
  const timerRef = useRef(null);

  const handleSendRequest = () => {
    if (animating) return;
    setAnimating(true);
    setResultState(null);
    setActiveHop(0);

    // Hop 0: Browser -> Proxy (:443)
    timerRef.current = setTimeout(() => {
      setActiveHop(1);

      // Hop 1: Proxy -> WAF
      timerRef.current = setTimeout(() => {
        setActiveHop(2);

        // Hop 2: WAF Evaluation
        timerRef.current = setTimeout(() => {
          if (wafEnabled && selectedReq.isMalicious) {
            // Blocked at WAF
            setResultState('blocked');
            setAnimating(false);
          } else {
            // Forwarded to DVWA App
            setActiveHop(3);
            timerRef.current = setTimeout(() => {
              setResultState(selectedReq.isMalicious ? 'exploited' : 'passed');
              setAnimating(false);
            }, 500);
          }
        }, 600);
      }, 500);
    }, 400);
  };

  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section className="safeline-trace-container" aria-label="SafeLine Animated Request Trace Simulation">
      <div className="safeline-trace-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="mono tag" style={{ borderColor: 'var(--ac)', color: 'var(--ac)' }}>
            REQUEST FLOW TRACE
          </span>
          <span className="mono status-badge" style={{ background: 'rgba(229,138,47,0.15)', color: '#E58A2F', border: '1px solid #E58A2F' }}>
            illustration, attack tests in progress
          </span>
        </div>

        <h3 style={{ margin: '8px 0 4px', font: '800 22px var(--font-display)', color: 'var(--ink)' }}>
          Interactive WAF Inspection Flow
        </h3>
        <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--mu)', lineHeight: 1.45 }}>
          Trace how reverse proxy TLS termination and inline inspection protect the vulnerable backend. Toggle WAF on/off to compare behavior.
        </p>
      </div>

      {/* Control Bar: Test payload picker + WAF On/Off toggle */}
      <div className="trace-controls-bar">
        <div className="req-picker-group">
          <label htmlFor="test-req-select" className="mono" style={{ fontSize: '11px', color: 'var(--mu)', fontWeight: 600 }}>
            TEST PAYLOAD:
          </label>
          <select
            id="test-req-select"
            className="mono req-select-dropdown"
            value={selectedReq.id}
            onChange={(e) => {
              const req = TEST_REQUESTS.find((r) => r.id === e.target.value);
              if (req) {
                setSelectedReq(req);
                setResultState(null);
                setActiveHop(-1);
              }
            }}
            disabled={animating}
          >
            {TEST_REQUESTS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.type} ({r.payloadSnippet})
              </option>
            ))}
          </select>
        </div>

        {/* WAF Switch Toggle */}
        <div className="waf-toggle-wrap">
          <span className="mono" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink)' }}>
            SAFE-LINE WAF:
          </span>
          <button
            type="button"
            className={`waf-state-pill ${wafEnabled ? 'is-on' : 'is-off'}`}
            onClick={() => {
              setWafEnabled((prev) => !prev);
              setResultState(null);
              setActiveHop(-1);
            }}
            aria-pressed={wafEnabled}
          >
            <span className="waf-dot" />
            {wafEnabled ? 'WAF ON (PROTECTED)' : 'WAF OFF (BYPASSED)'}
          </button>
        </div>

        <button
          type="button"
          className="send-trace-btn"
          onClick={handleSendRequest}
          disabled={animating}
        >
          {animating ? 'Tracing...' : 'Send Request \u2192'}
        </button>
      </div>

      {/* Topology Nodes Diagram */}
      <div className="trace-nodes-visual" role="region" aria-label="4-node topology inspection flow">
        {/* Node 1: Browser */}
        <div className={`topology-node ${activeHop === 0 ? 'active' : ''}`}>
          <div className="node-icon">&#128187;</div>
          <strong className="node-name">Browser</strong>
          <span className="mono node-meta">Kali (10.0.2.3)</span>
          <span className="mono node-role">Attacker / Client</span>
        </div>

        <div className={`trace-arrow ${activeHop >= 1 ? 'flowing' : ''}`}>
          <span className="arrow-line" />
          <span className="mono arrow-label">HTTPS :443</span>
        </div>

        {/* Node 2: HTTPS Proxy */}
        <div className={`topology-node ${activeHop === 1 ? 'active' : ''}`}>
          <div className="node-icon">&#128274;</div>
          <strong className="node-name">HTTPS Proxy</strong>
          <span className="mono node-meta">Port 443</span>
          <span className="mono node-role">TLS Termination</span>
        </div>

        <div className={`trace-arrow ${activeHop >= 2 ? 'flowing' : ''}`}>
          <span className="arrow-line" />
          <span className="mono arrow-label">Inline</span>
        </div>

        {/* Node 3: SafeLine WAF */}
        <div className={`topology-node waf-node ${activeHop === 2 ? 'active' : ''} ${!wafEnabled ? 'bypassed' : ''} ${resultState === 'blocked' ? 'blocked-alert' : ''}`}>
          <div className="node-icon">&#128737;</div>
          <strong className="node-name">SafeLine WAF</strong>
          <span className="mono node-meta">{wafEnabled ? 'Rule Engine Active' : 'INSPECTION OFF'}</span>
          <span className="mono node-role">{wafEnabled ? 'Semantic Parser' : 'Direct Pass-through'}</span>
        </div>

        <div className={`trace-arrow ${activeHop >= 3 ? 'flowing' : ''}`}>
          <span className="arrow-line" />
          <span className="mono arrow-label">HTTP :8080</span>
        </div>

        {/* Node 4: DVWA Backend */}
        <div className={`topology-node app-node ${activeHop === 3 ? 'active' : ''} ${resultState === 'exploited' ? 'exploited-alert' : ''}`}>
          <div className="node-icon">&#128452;</div>
          <strong className="node-name">DVWA Target</strong>
          <span className="mono node-meta">Ubuntu (10.0.2.4:8080)</span>
          <span className="mono node-role">Apache2 &amp; MySQL</span>
        </div>
      </div>

      {/* Path Display */}
      <div className="trace-url-display">
        <span className="mono method-badge">GET</span>
        <code className="mono path-text">{selectedReq.path}</code>
      </div>

      {/* Result Status Banner */}
      {resultState && (
        <div className={`trace-result-banner ${resultState}`} role="alert">
          {resultState === 'blocked' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="live-dot" style={{ background: '#2FBF71' }} />
                <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                  BLOCKED BY SAFELINE (HTTP 403 FORBIDDEN)
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--mu)', lineHeight: 1.45 }}>
                Matched {selectedReq.wafRule}. Request terminated at reverse proxy boundary; malicious packet never touched DVWA application or database.
              </p>
            </div>
          )}

          {resultState === 'exploited' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="live-dot" style={{ background: '#D6483A' }} />
                <strong style={{ fontSize: '13px', color: 'var(--color-alert, #D6483A)' }}>
                  VULNERABILITY REACHED BACKEND (WAF WAS OFF)
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--mu)', lineHeight: 1.45 }}>
                {selectedReq.vulnerableImpact}
              </p>
            </div>
          )}

          {resultState === 'passed' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="live-dot" style={{ background: '#2FBF71' }} />
                <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                  NORMAL TRAFFIC PASSED (HTTP 200 OK)
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--mu)', lineHeight: 1.45 }}>
                Safe benign request verified clean by reverse proxy. DVWA rendered response normally.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

