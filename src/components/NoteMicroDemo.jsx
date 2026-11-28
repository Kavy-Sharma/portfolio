import React, { useState } from 'react';

// ==========================================
// 1. IDOR Micro-Demo Component
// ==========================================
const INVOICES = {
  101: { id: 101, owner: 'Alice Cooper (Current Session)', amount: '$120.00', service: 'Standard Web Hosting', status: 'PAID' },
  102: { id: 102, owner: 'Bob Smith', amount: '$850.00', service: 'Enterprise Audit (CONFIDENTIAL)', status: 'OVERDUE' },
  103: { id: 103, owner: 'Carol Danvers', amount: '$2,400.00', service: 'Executive Retainer Fee', status: 'PENDING' },
  104: { id: 104, owner: 'Dave Miller', amount: '$45.00', service: 'DNS Domain Registration', status: 'PAID' }
};

function IdorDemo() {
  const [selectedId, setSelectedId] = useState(101);
  const [serverCheckEnabled, setServerCheckEnabled] = useState(false);

  const currentUser = 'Alice Cooper (#101)';
  const invoice = INVOICES[selectedId];
  const isOwner = selectedId === 101;
  const isAccessBlocked = serverCheckEnabled && !isOwner;

  return (
    <div className="micro-demo-box idor-demo" role="region" aria-label="Interactive IDOR Demo">
      <div className="micro-demo-top">
        <span className="mono demo-badge">&#9654; INTERACTIVE DEMO &middot; INSECURE DIRECT OBJECT REFERENCE</span>
        <div className="demo-toggle-wrap">
          <span className="mono toggle-label">SERVER CHECKS OWNER:</span>
          <button
            type="button"
            className={`demo-toggle-btn ${serverCheckEnabled ? 'on' : 'off'}`}
            onClick={() => setServerCheckEnabled((prev) => !prev)}
            aria-pressed={serverCheckEnabled}
          >
            {serverCheckEnabled ? 'ON (AUTHENTICATED)' : 'OFF (VULNERABLE)'}
          </button>
        </div>
      </div>

      <p style={{ margin: '8px 0 12px', fontSize: '13px', color: 'var(--mu)', lineHeight: 1.45 }}>
        You are logged in as <strong>{currentUser}</strong>. Change the invoice ID in the request below to test object boundaries:
      </p>

      {/* Fake URL Bar */}
      <div className="fake-address-bar">
        <span className="mono fake-proto">https://</span>
        <span className="mono fake-host">billing.internal/invoices?id=</span>
        <div className="id-selector-chips">
          {[101, 102, 103, 104].map((id) => (
            <button
              key={id}
              type="button"
              className={`id-chip-btn ${selectedId === id ? 'active' : ''}`}
              onClick={() => setSelectedId(id)}
              aria-label={`Inspect invoice ${id}`}
            >
              {id} {id === 101 ? '(Yours)' : '(Other)'}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Output Render */}
      <div className="invoice-result-display">
        {isAccessBlocked ? (
          <div className="access-denied-card" role="alert">
            <span className="mono status-403">HTTP 403 FORBIDDEN</span>
            <strong style={{ fontSize: '13px', color: 'var(--ink)', display: 'block', margin: '4px 0' }}>
              Access Denied: Object Ownership Validation Failed
            </strong>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--mu)' }}>
              Server verified session token against invoice owner: current session user ({currentUser}) does not own Invoice #{selectedId}.
            </p>
          </div>
        ) : (
          <div className={`invoice-card ${!isOwner ? 'leaked-data' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--ac)', fontWeight: 600 }}>
                INVOICE #{invoice.id}
              </span>
              <span className={`mono invoice-status-pill ${invoice.status.toLowerCase()}`}>
                {invoice.status}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              <div>
                <span className="mono meta-k">BILL TO:</span>
                <strong style={{ fontSize: '13px', color: 'var(--ink)', display: 'block' }}>{invoice.owner}</strong>
              </div>
              <div>
                <span className="mono meta-k">SERVICE:</span>
                <span style={{ fontSize: '12.5px', color: 'var(--ink)', display: 'block' }}>{invoice.service}</span>
              </div>
              <div>
                <span className="mono meta-k">TOTAL:</span>
                <strong style={{ fontSize: '14px', color: 'var(--ink)', display: 'block' }}>{invoice.amount}</strong>
              </div>
            </div>

            {!isOwner && !serverCheckEnabled && (
              <div className="idor-leak-alert" role="alert">
                &#9888; IDOR VULNERABILITY: Successfully viewed another customer's private invoice by simply changing the numeric ID.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. SQLi Micro-Demo Component
// ==========================================
function SqliDemo() {
  const [username, setUsername] = useState("' OR 1=1 --");
  const [password, setPassword] = useState("pass123");
  const [paramQueryEnabled, setParamQueryEnabled] = useState(false);

  const isBypassed = !paramQueryEnabled && (username.includes("'") || username.toLowerCase().includes('or'));

  return (
    <div className="micro-demo-box sqli-demo" role="region" aria-label="Interactive SQL Injection Demo">
      <div className="micro-demo-top">
        <span className="mono demo-badge">&#9654; INTERACTIVE DEMO &middot; SQL INJECTION</span>
        <div className="demo-toggle-wrap">
          <span className="mono toggle-label">PARAMETERISED QUERY:</span>
          <button
            type="button"
            className={`demo-toggle-btn ${paramQueryEnabled ? 'on' : 'off'}`}
            onClick={() => setParamQueryEnabled((prev) => !prev)}
            aria-pressed={paramQueryEnabled}
          >
            {paramQueryEnabled ? 'ON (PREPARED STATEMENT)' : 'OFF (CONCATENATION)'}
          </button>
        </div>
      </div>

      <p style={{ margin: '8px 0 12px', fontSize: '13px', color: 'var(--mu)', lineHeight: 1.45 }}>
        Type in the login box below and watch how backend query construction changes in real time:
      </p>

      {/* Preset Chips */}
      <div className="sqli-presets-bar">
        <span className="mono" style={{ fontSize: '11px', color: 'var(--mu)' }}>PRESETS:</span>
        <button type="button" className="preset-chip" onClick={() => setUsername("admin")}>admin (normal)</button>
        <button type="button" className="preset-chip" onClick={() => setUsername("' OR 1=1 --")}>' OR 1=1 --</button>
        <button type="button" className="preset-chip" onClick={() => setUsername("admin' OR 'a'='a")}>admin' OR 'a'='a</button>
      </div>

      {/* Inputs Form */}
      <div className="login-form-fields">
        <div className="form-group">
          <label htmlFor="demo-user-input" className="mono input-label">USERNAME:</label>
          <input
            id="demo-user-input"
            type="text"
            className="mono demo-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="demo-pass-input" className="mono input-label">PASSWORD:</label>
          <input
            id="demo-pass-input"
            type="text"
            className="mono demo-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password..."
          />
        </div>
      </div>

      {/* Live Query Construction Box */}
      <div className="query-inspector-box">
        <span className="mono query-box-title">
          {paramQueryEnabled ? 'PREPARED STATEMENT (SAFE EXECUTION)' : 'CONCATENATED RAW SQL (VULNERABLE)'}
        </span>

        {paramQueryEnabled ? (
          <div className="sql-code-block">
            <code className="mono">
              <span className="sql-kw">SELECT</span> * <span className="sql-kw">FROM</span> users <span className="sql-kw">WHERE</span> username = <span className="sql-param">?</span> <span className="sql-kw">AND</span> password = <span className="sql-param">?</span>;
            </code>
            <div className="params-list mono">
              <span>Bound parameter 1: "{username}"</span>
              <span>Bound parameter 2: "{password}"</span>
            </div>
          </div>
        ) : (
          <div className="sql-code-block">
            <code className="mono">
              <span className="sql-kw">SELECT</span> * <span className="sql-kw">FROM</span> users <span className="sql-kw">WHERE</span> username = '<span className="injected-val">{username}</span>' <span className="sql-kw">AND</span> password = '<span className="injected-val">{password}</span>';
            </code>
          </div>
        )}

        <div className={`query-status-banner ${isBypassed ? 'alert' : 'safe'}`}>
          {paramQueryEnabled ? (
            <span>&#10003; <strong>PROTECTED:</strong> Quotes are treated strictly as literal data. Database never alters syntax tree.</span>
          ) : isBypassed ? (
            <span>&#9888; <strong>LOGIC HIJACKED:</strong> Injected <code className="mono">OR 1=1</code> makes condition always TRUE &rarr; Authenticated as Admin!</span>
          ) : (
            <span>&#8505; Normal SQL query. Standard authentication check executed.</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. XSS Micro-Demo Component
// ==========================================
function XssDemo() {
  const [comment, setComment] = useState("<script>alert('XSS')</script> Hello!");
  const [escapingEnabled, setEscapingEnabled] = useState(false);

  const escapeHtml = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const processedContent = escapingEnabled ? escapeHtml(comment) : comment;
  const hasTags = comment.includes('<') && comment.includes('>');

  return (
    <div className="micro-demo-box xss-demo" role="region" aria-label="Interactive XSS Demo">
      <div className="micro-demo-top">
        <span className="mono demo-badge">&#9654; INTERACTIVE DEMO &middot; CROSS-SITE SCRIPTING (XSS)</span>
        <div className="demo-toggle-wrap">
          <span className="mono toggle-label">HTML ENTITY ESCAPING:</span>
          <button
            type="button"
            className={`demo-toggle-btn ${escapingEnabled ? 'on' : 'off'}`}
            onClick={() => setEscapingEnabled((prev) => !prev)}
            aria-pressed={escapingEnabled}
          >
            {escapingEnabled ? 'ON (ENCODED)' : 'OFF (RAW)'}
          </button>
        </div>
      </div>

      <p style={{ margin: '8px 0 12px', fontSize: '13px', color: 'var(--mu)', lineHeight: 1.45 }}>
        Post user content into the comment box below and toggle HTML escaping to observe DOM sanitization:
      </p>

      {/* Preset Chips */}
      <div className="sqli-presets-bar">
        <span className="mono" style={{ fontSize: '11px', color: 'var(--mu)' }}>PRESETS:</span>
        <button type="button" className="preset-chip" onClick={() => setComment("Safe message from visitor.")}>Normal text</button>
        <button type="button" className="preset-chip" onClick={() => setComment("<b>Bold text test</b>")}>HTML &lt;b&gt;</button>
        <button type="button" className="preset-chip" onClick={() => setComment("<img src=x onerror=\"alert('XSS')\">")}>&lt;img onerror&gt;</button>
        <button type="button" className="preset-chip" onClick={() => setComment("<script>alert('Cookie stolen')</script>")}>&lt;script&gt;</button>
      </div>

      {/* Comment Input */}
      <textarea
        className="mono demo-textarea"
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Type a comment or payload..."
        aria-label="Comment input"
      />

      {/* Rendered Output Display in Sandboxed Environment */}
      <div className="xss-render-box">
        <span className="mono render-title">
          DOM OUTPUT ({escapingEnabled ? 'ESCAPED ENTITIES' : 'UNESCAPED INNERHTML'})
        </span>

        <div className="rendered-comment-preview">
          <span className="mono" style={{ fontSize: '10.5px', color: 'var(--mu)', display: 'block', marginBottom: '6px' }}>
            SANDBOXED SRCDOC IFRAME:
          </span>
          <iframe
            title="XSS Sandboxed Output Preview"
            sandbox="allow-scripts"
            srcDoc={
              escapingEnabled
                ? `<!DOCTYPE html><html><head><style>body{font-family:system-ui,sans-serif;font-size:13px;margin:8px;color:#0C2A33;line-height:1.4;}</style></head><body><div id="out"></div><script>document.getElementById("out").textContent = ${JSON.stringify(comment)};</script></body></html>`
                : `<!DOCTYPE html><html><head><style>body{font-family:system-ui,sans-serif;font-size:13px;margin:8px;color:#0C2A33;line-height:1.4;}</style></head><body>${comment}</body></html>`
            }
            className="xss-srcdoc-iframe"
            style={{
              width: '100%',
              height: '75px',
              border: '1px solid var(--ln)',
              borderRadius: '4px',
              background: '#ffffff',
              display: 'block'
            }}
          />
        </div>

        <div className={`query-status-banner ${hasTags && !escapingEnabled ? 'alert' : 'safe'}`}>
          {escapingEnabled ? (
            <span>&#10003; <strong>PROTECTED:</strong> Special characters (<code className="mono">&lt; &gt; " ' &amp;</code>) converted to safe HTML entities. Browser renders them as text, never executes them.</span>
          ) : hasTags ? (
            <span>&#9888; <strong>SCRIPT INJECTION:</strong> Browser parsed unencoded tags as live DOM elements. Any executable attributes or scripts will run in visitor's context.</span>
          ) : (
            <span>&#8505; Clean plain text comment.</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Unified Dispatcher Export
// ==========================================
export default function NoteMicroDemo({ slug }) {
  if (slug === 'idor') return <IdorDemo />;
  if (slug === 'sqli') return <SqliDemo />;
  if (slug === 'xss') return <XssDemo />;
  return null;
}

