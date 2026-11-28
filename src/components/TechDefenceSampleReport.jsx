import React, { useState } from 'react';

const FICTIONAL_CHECKS = [
  {
    id: 'FW-01',
    name: 'Default Admin Username & Credentials',
    severity: 'Critical',
    verification: "CLI: 'config system admin' -> 'show' | Check for default user 'admin' with factory password",
    status: 'Non-compliant',
    recommendation: 'Disable or rename default "admin" account. Create dedicated named administrative accounts with multi-factor authentication (MFA).'
  },
  {
    id: 'FW-02',
    name: 'Insecure Remote Management Protocols (HTTP/Telnet)',
    severity: 'High',
    verification: "CLI: 'get system interface' | Verify 'allowaccess' directive on WAN interface",
    status: 'Non-compliant',
    recommendation: 'Remove HTTP and Telnet from WAN-facing interface allowaccess. Restrict administrative management strictly to HTTPS/SSH on dedicated management VLAN.'
  },
  {
    id: 'FW-03',
    name: 'Unrestricted Outbound Any/Any Egress Rules',
    severity: 'High',
    verification: "CLI: 'show firewall policy' | Inspect rules with 'srcintf any dstintf any action accept'",
    status: 'Non-compliant',
    recommendation: 'Replace global any-to-any egress rules with explicit port and protocol allowlists (e.g., TCP 80/443 for web traffic, TCP 53 for internal DNS only).'
  },
  {
    id: 'FW-04',
    name: 'Firmware Patch Level & Active CVE Mitigation',
    severity: 'Medium',
    verification: "CLI: 'get system status' | Compare running FortiOS/RouterOS version against security advisory bulletins",
    status: 'Compliant',
    recommendation: 'Maintain automated security patch notification. Current build is on approved vendor security maintenance baseline.'
  },
  {
    id: 'FW-05',
    name: 'NTP Synchronization & Secure Time Source',
    severity: 'Low',
    verification: "CLI: 'show system ntp' | Verify synchronized stratum-1/2 NTP servers and authentication key",
    status: 'Compliant',
    recommendation: 'Ensure redundant internal NTP server peering to maintain forensically sound log timestamps across appliances.'
  },
  {
    id: 'FW-06',
    name: 'SNMP Community String Hardening',
    severity: 'High',
    verification: "CLI: 'show system snmp community' | Check for default strings 'public' or 'private'",
    status: 'Non-compliant',
    recommendation: 'Deprecate SNMPv1/v2c unencrypted community strings. Migrate to SNMPv3 with SHA authentication and AES encryption; restrict polling IPs.'
  },
  {
    id: 'FW-07',
    name: 'Unused Physical Network Interfaces Shutdown',
    severity: 'Low',
    verification: "CLI: 'get hardware nic' | Check administrative state of unpatched physical ports",
    status: 'Compliant',
    recommendation: 'Keep all unpatched switch/firewall ports administratively disabled (down) in a dedicated quarantine VLAN.'
  },
  {
    id: 'FW-08',
    name: 'Administrator Session Inactivity Timeout',
    severity: 'Medium',
    verification: "CLI: 'config system global' -> 'get | grep admintimeout'",
    status: 'Non-compliant',
    recommendation: 'Configure administrative inactivity timeout to 10 minutes (600 seconds) or fewer to prevent unauthorized workstation hijacking.'
  }
];

export default function TechDefenceSampleReport() {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'NON_COMPLIANT' | 'COMPLIANT'

  const filteredChecks = FICTIONAL_CHECKS.filter((c) => {
    if (filter === 'NON_COMPLIANT') return c.status === 'Non-compliant';
    if (filter === 'COMPLIANT') return c.status === 'Compliant';
    return true;
  });

  const nonCompliantCount = FICTIONAL_CHECKS.filter((c) => c.status === 'Non-compliant').length;
  const compliantCount = FICTIONAL_CHECKS.filter((c) => c.status === 'Compliant').length;

  return (
    <section className="techdefence-report-section" aria-label="Sample Fictional Firewall Configuration Review Report">
      {/* Header and Truthful Disclaimer Badge */}
      <div className="report-viewer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <span className="mono tag" style={{ borderColor: 'var(--ac)', color: 'var(--ac)' }}>
            WORK SAMPLES · AUDIT FORMAT
          </span>
          <span className="mono status-badge fictional-badge" style={{ background: 'rgba(47,127,208,0.12)', color: 'var(--ac)', border: '1px solid var(--ac)' }}>
            Fictional example. No client data.
          </span>
        </div>

        <h3 style={{ margin: '4px 0 6px', font: '800 20px var(--font-display)', color: 'var(--ink)' }}>
          Sample report (fictional): Firewall Configuration Review
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--mu)', lineHeight: 1.45 }}>
          Clean fictional demonstration of a FortiGate &amp; MikroTik configuration audit sheet for an invented company called <strong>Example Corp</strong>. Demonstrates the technical layout, verification commands, and remediation guidance used during client assessments.
        </p>
      </div>

      {/* Meta Bar: Scope & Auditor Details */}
      <div className="report-meta-card">
        <div className="report-meta-grid">
          <div>
            <span className="mono meta-k">TARGET ENTITY:</span>
            <strong className="meta-v">Example Corp (Invented)</strong>
          </div>
          <div>
            <span className="mono meta-k">ASSESSMENT TYPE:</span>
            <span className="meta-v">Firewall Configuration Audit (CIS-Style)</span>
          </div>
          <div>
            <span className="mono meta-k">TARGET APPLIANCE:</span>
            <span className="meta-v">FortiGate 60F &middot; FortiOS 7.2</span>
          </div>
          <div>
            <span className="mono meta-k">AUDIT SUMMARY:</span>
            <span className="meta-v mono" style={{ color: 'var(--ink)' }}>
              {nonCompliantCount} Non-compliant &middot; {compliantCount} Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="report-table-toolbar">
        <div className="filter-chips-row" role="group" aria-label="Filter report checks by compliance status">
          <button
            type="button"
            className={`report-tab-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
            aria-pressed={filter === 'ALL'}
          >
            All Checks ({FICTIONAL_CHECKS.length})
          </button>
          <button
            type="button"
            className={`report-tab-btn ${filter === 'NON_COMPLIANT' ? 'active' : ''}`}
            onClick={() => setFilter('NON_COMPLIANT')}
            aria-pressed={filter === 'NON_COMPLIANT'}
          >
            ● Non-compliant ({nonCompliantCount})
          </button>
          <button
            type="button"
            className={`report-tab-btn ${filter === 'COMPLIANT' ? 'active' : ''}`}
            onClick={() => setFilter('COMPLIANT')}
            aria-pressed={filter === 'COMPLIANT'}
          >
            ✓ Compliant ({compliantCount})
          </button>
        </div>
      </div>

      {/* Review Sheet Data Table */}
      <div className="report-table-container">
        <table className="fictional-report-table" aria-label="Example Corp Firewall Review Matrix">
          <thead>
            <tr>
              <th scope="col" className="mono" style={{ width: '70px' }}>ID</th>
              <th scope="col" style={{ minWidth: '180px' }}>Check Name</th>
              <th scope="col" className="mono" style={{ width: '90px' }}>Severity</th>
              <th scope="col" style={{ minWidth: '220px' }}>How it is verified</th>
              <th scope="col" className="mono" style={{ width: '120px' }}>Status</th>
              <th scope="col" style={{ minWidth: '240px' }}>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {filteredChecks.map((item) => {
              const isNonCompliant = item.status === 'Non-compliant';
              const sevClass = item.severity.toLowerCase();

              return (
                <tr key={item.id} className={isNonCompliant ? 'row-finding' : 'row-passed'}>
                  <td className="mono report-id-cell">{item.id}</td>
                  <td>
                    <strong style={{ fontSize: '12.5px', color: 'var(--ink)' }}>{item.name}</strong>
                  </td>
                  <td>
                    <span className={`mono sev-badge ${sevClass}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td>
                    <code className="mono cli-verify-code">{item.verification}</code>
                  </td>
                  <td>
                    <span className={`mono status-pill ${isNonCompliant ? 'fail' : 'pass'}`}>
                      {isNonCompliant ? 'Non-compliant' : 'Compliant'}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.45 }}>
                    {item.recommendation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Small "How to read this" Caption */}
      <div className="report-caption-box">
        <span className="caption-icon" aria-hidden="true">&#x1F4DD;</span>
        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: '12px', color: 'var(--ink)' }}>How to read this sheet:</strong>
          <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--mu)', lineHeight: 1.45 }}>
            A configuration review audits appliance settings against established security benchmarks (such as CIS Controls) to locate risky management exposure, weak encryption, or overly permissive routing. Each finding is tagged with the exact CLI query used to verify the rule and the actionable patch steps required for compliance.
          </p>
        </div>
      </div>
    </section>
  );
}
