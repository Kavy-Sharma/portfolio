import React from 'react';

/**
 * SkillsGlance Component
 * Grouped chips: Web security, Network, AI security, Tools, Languages.
 * Strictly taken from facts.md and project-notes. No percentage bars.
 */
export default function SkillsGlance() {
  const SKILL_GROUPS = [
    {
      id: 'web',
      category: 'Web security',
      description: 'Vulnerability assessment, client & server-side web flaws',
      chips: [
        'OWASP Top 10',
        'PortSwigger Academy',
        'IDOR & Access Controls',
        'SQL Injection & Blind SQLi',
        'Cross-Site Scripting (XSS)',
        'CSRF',
        'Path Traversal',
        'File Upload Security',
        'WAF Reverse Proxy (SafeLine)'
      ]
    },
    {
      id: 'network',
      category: 'Network',
      description: 'Protocols, packet forensics, reconnaissance and auditing',
      chips: [
        'Network Ports & Protocols (TCP/UDP)',
        'Wireshark / PCAP Forensics',
        'Nmap Scripting Engine (NSE)',
        'SYN & ARP Attack Detection',
        'Firewall Config Audit (CIS-Style)',
        'DNS / SSH / FTP Enumeration'
      ]
    },
    {
      id: 'ai-sec',
      category: 'AI security',
      description: 'LLM guardrails, attack simulation, and physical safety signals',
      chips: [
        'Prompt Injection Defense',
        '9-Gate Security Gateway (AegisAgent)',
        'Hardware Defense Signals (ESP32 UART/LEDs)',
        'Phishing Threat Modeling (PhishSim)',
        'AI Security University Certified'
      ]
    },
    {
      id: 'tools',
      category: 'Tools',
      description: 'Hands-on offensive and defensive tooling',
      chips: [
        'Burp Suite',
        'Nmap',
        'Wireshark',
        'SafeLine WAF',
        'Kali Linux',
        'ESP32-WROOM-32',
        'Git',
        'Docker'
      ]
    },
    {
      id: 'languages',
      category: 'Languages',
      description: 'Scripting, systems programming and database queries',
      chips: [
        'Python',
        'C / C++ (ESP32 Firmware)',
        'JavaScript / React',
        'SQL',
        'Bash'
      ]
    }
  ];

  return (
    <section className="skills-glance-section" aria-label="Skills at a glance">
      <div className="section-head">
        <span className="mono" style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'var(--mu)', textTransform: 'uppercase' }}>
          CAPABILITIES &middot; FACTS ONLY
        </span>
        <h2 className="section-title">Skills at a glance</h2>
        <p className="section-desc">
          Technical skills verified through working software, CTF competitions, lab environments, and internships. No generic percentage bars.
        </p>
      </div>

      <div className="skills-groups-grid">
        {SKILL_GROUPS.map((group) => (
          <div key={group.id} className="skills-group-card">
            <div className="skills-group-header">
              <h3 className="skills-group-title">{group.category}</h3>
              <span className="skills-group-count mono">{group.chips.length}</span>
            </div>
            <p className="skills-group-desc">{group.description}</p>
            <div className="skills-chips-wrap">
              {group.chips.map((chip) => (
                <span key={chip} className="skill-chip">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
