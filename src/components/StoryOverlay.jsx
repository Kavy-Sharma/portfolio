import React, { useEffect, useRef, useState } from 'react';
import rawStats from '../../data/stats.json';

const POST_DETAILS = {
  IDOR: {
    line: 'The app trusts the ID you send, and never asks if the record is yours.',
    looks: 'You open your invoice and the address ends in a number. You change it. Another person\'s invoice opens.',
    red: 'Change the number, watch what comes back.',
    blue: 'Check on the server that the record belongs to the logged-in user.'
  },
  'Privilege escalation': {
    line: 'A standard user account accesses administrative actions without authorization.',
    looks: 'Changing a hidden parameter "role=user" to "role=admin" gives full control.',
    red: 'Find where role boundaries are enforced and tamper with tokens or parameters.',
    blue: 'Enforce role-based access control (RBAC) strictly on the server session.'
  },
  'Header tricks': {
    line: 'The application trusts HTTP headers like X-Forwarded-For or Host for security decisions.',
    looks: 'Injecting "X-Forwarded-For: 127.0.0.1" bypasses an internal-only IP restriction.',
    red: 'Probe custom and proxy headers to trigger unintended server routing.',
    blue: 'Never rely on client-supplied headers for authentication or perimeter trust.'
  },
  'SQL injection': {
    line: 'Untrusted user input becomes executable code inside the database query.',
    looks: "Entering ' OR 1=1-- dumps the entire table instead of matching one username.",
    red: 'Break query structure with quotes and operators to extract hidden tables.',
    blue: 'Use parameterized prepared statements and object-relational mappers.'
  },
  'Blind SQLi': {
    line: 'No data or error is reflected on screen, so you ask binary true/false questions.',
    looks: "If SUBSTRING(password,1,1)='a', the page takes 5 seconds to respond (time-based).",
    red: 'Infer data character by character using Boolean conditions or sleep delays.',
    blue: 'Enforce parameterized queries and eliminate dynamic query concatenation.'
  },
  XSS: {
    line: 'Malicious JavaScript executes inside the victim user\'s browser session.',
    looks: "Submitting a comment with <script>alert(document.cookie)</script> steals session tokens.",
    red: 'Inject unescaped scripts into web pages to hijack accounts or trigger actions.',
    blue: 'Contextually HTML/JavaScript-encode all untrusted output and enforce Content Security Policy (CSP).'
  },
  'Path traversal': {
    line: 'Relative path sequences navigate outside the intended public web directory.',
    looks: 'Requesting /download?file=../../../../etc/passwd exposes operating system users.',
    red: 'Chain dot-dot-slash characters to read sensitive configuration and shadow files.',
    blue: 'Sanitize file paths against canonical allowlists and strip directory separators.'
  },
  'File upload': {
    line: 'An uploaded file is executed on the server rather than treated as static data.',
    looks: 'Uploading "shell.php.png" that the server executes, granting remote terminal access.',
    red: 'Bypass extension and MIME checks to run arbitrary code on the web host.',
    blue: 'Validate file signatures, store uploads off the web root, and disable script execution.'
  },
  'Broken auth': {
    line: 'Authentication mechanisms allow credential stuffing, weak passwords, or session fixation.',
    looks: 'Sessions never expire after logout, allowing reused session cookies to access accounts.',
    red: 'Exploit predictable tokens, lack of rate limiting, and broken session lifetimes.',
    blue: 'Enforce multi-factor authentication, secure cookie attributes, and session revocation.'
  },
  CSRF: {
    line: 'A malicious website tricks the user\'s authenticated browser into submitting unauthorized commands.',
    looks: 'Visiting an attacker page quietly triggers a POST request changing your email address.',
    red: 'Craft hidden forms targeting authenticated endpoints without CSRF token validation.',
    blue: 'Enforce unique cryptographically random CSRF tokens and SameSite cookie attributes.'
  },
  'Business logic': {
    line: 'The software functions as coded, but fails to prevent fundamentally flawed business flows.',
    looks: 'Ordering -1 items results in a positive credit refund applied to the account.',
    red: 'Subvert assumed step order, coupon stacking, or negative values.',
    blue: 'Validate all operational assumptions, quantity signs, and workflow state transitions.'
  },
  'Race condition': {
    line: 'Concurrent requests arrive within the tiny processing window before state is locked.',
    looks: 'Submitting a gift card redemption twice simultaneously redeems twice the balance.',
    red: 'Send parallel burst requests to exploit atomic check-and-set delays.',
    blue: 'Use database transactions, row-level locks, or mutexes to prevent concurrent execution.'
  },
  'TCP vs UDP': {
    line: 'TCP guarantees delivery and ordering with a 3-way handshake; UDP prioritizes latency without ack.',
    looks: 'TCP SYN -> SYN-ACK -> ACK ensures reliable connection; UDP sends datagrams without state.',
    red: 'Craft raw SYN packets to map open listening sockets without completing full connections.',
    blue: 'Configure stateful firewall inspection and drop unsolicited incoming packets.'
  },
  'Nmap scripts': {
    line: 'NSE (Nmap Scripting Engine) automates advanced vulnerability detection and service interrogation.',
    looks: 'Running nmap -sC -sV banner-grabs software versions and identifies known CVE exposures.',
    red: 'Deploy vuln scripts to identify unpatched services and default configurations.',
    blue: 'Minimize public exposure, disable default accounts, and enforce regular patch cadences.'
  },
  FTP: {
    line: 'Legacy plaintext protocol for file transfer, frequently left open with anonymous login enabled.',
    looks: 'Connecting with user "anonymous" and empty password downloads internal backups.',
    red: 'Enumerate port 21, check for anonymous access, and exploit write-access permissions.',
    blue: 'Migrate to SFTP/SSH, disable plaintext FTP, and strictly restrict anonymous uploads.'
  },
  SSH: {
    line: 'Encrypted remote shell terminal protocol running on port 22.',
    looks: 'Enumerating weak passwords or outdated OpenSSH versions (e.g. Terrapin attack).',
    red: 'Check for default credentials, key leakage, and banner disclosure.',
    blue: 'Disable root password login, require ed25519 public keys, and bind to bastion hosts.'
  },
  DNS: {
    line: 'Domain Name System translates human hostnames to IP addresses over port 53.',
    looks: 'Performing AXFR zone transfers to dump an entire organization\'s internal subdomains.',
    red: 'Request zone transfers and inspect DNS TXT records for exposed API tokens.',
    blue: 'Restrict zone transfers to authorized secondary nameservers only.'
  },
  'Basic Pentesting': {
    line: 'Entry-level TryHackMe Linux machine focusing on brute-forcing and privilege escalation.',
    looks: 'Enumerating SMB shares -> cracking password for user jan -> finding sudo vim misconfiguration.',
    red: 'Map SMB shares with enum4linux, crack password with Hydra, and escalate via GTFOBins.',
    blue: 'Enforce strong passwords, restrict SMB to authenticated users, and audit sudo privileges.'
  },
  RootMe: {
    line: 'TryHackMe machine demonstrating file upload bypass and SUID privilege escalation.',
    looks: 'Uploading .phtml file to bypass .php filter, then finding SUID /usr/bin/python to get root.',
    red: 'Test alternate PHP extensions and abuse SUID binaries with gtfobins python payload.',
    blue: 'Enforce strict file extension whitelisting and audit SUID bit on system executables.'
  },
  Kenobi: {
    line: 'TryHackMe machine exploiting ProFTPD vulnerabilities and NFS share mounting.',
    looks: 'Exploiting mod_copy in ProFTPD 1.3.5 to copy private keys, then exploiting SUID path variable.',
    red: 'Use ProFTPD SITE CPFR/CPTO commands to move files into an accessible NFS share.',
    blue: 'Patch ProFTPD, restrict NFS mount permissions to trusted internal subnets, and sanitize PATH.'
  },
  Meow: {
    line: 'Hack The Box Starting Point Tier 0 target focusing on unauthenticated Telnet services.',
    looks: 'Scanning port 23, logging in with blank root password, and retrieving root.txt flag.',
    red: 'Probe port 23 with Nmap, connect via Telnet, and check standard default credentials.',
    blue: 'Decommission Telnet in favor of SSH, and enforce non-empty root passwords.'
  }
};

export default function StoryOverlay({ openItem, onClose, originCoords }) {
  const [isOpen, setIsOpen] = useState(false);
  const [renderedItem, setRenderedItem] = useState(null);
  const closeBtnRef = useRef(null);

  const stats = rawStats || {
    portswigger: { apprentice: [31, 64], practitioner: [67, 175], expert: [7, 40] },
    tryhackme: { top_percent: 7 },
    client_tests_plus: 20
  };

  const totalLabs =
    (stats.portswigger?.apprentice?.[0] || 0) +
    (stats.portswigger?.practitioner?.[0] || 0) +
    (stats.portswigger?.expert?.[0] || 0);

  useEffect(() => {
    if (openItem) {
      setRenderedItem(openItem);
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
      if (closeBtnRef.current) {
        requestAnimationFrame(() => {
          closeBtnRef.current?.focus({ preventScroll: true });
        });
      }
    } else {
      setIsOpen(false);
      document.body.style.overflow = '';
    }
  }, [openItem]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeItem = renderedItem || openItem;

  const x = originCoords ? originCoords.x : (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const y = originCoords ? originCoords.y : (typeof window !== 'undefined' ? window.innerHeight / 2 : 300);

  const renderContent = () => {
    if (!activeItem) return null;
    const renderedItem = activeItem;
    // 1. Resume Modal
    if (renderedItem.type === 'resume') {
      return (
        <div>
          <span className="tag">/resume &middot; built from verified data</span>
          <h2 style={{ fontSize: 'clamp(34px, 6vw, 60px)', margin: '10px 0 16px' }}>Kavy Sharma</h2>
          <p className="lead">
            Cybersecurity (VAPT) and AI security researcher. B.E. Electronics &amp; Computer Engineering, MBM University (2023&ndash;2027).
          </p>

          <div className="beat">
            <b>TechDefence &middot; VAPT Intern</b>
            <div style={{ color: 'var(--mu)' }}>
              Jun&ndash;Jul 2026. Conducted penetration tests across web applications, APIs, and networks for {stats.client_tests_plus || 20}+ clients using Burp Suite, Nmap, Nessus, and Kali Linux.
            </div>
          </div>

          <div className="beat">
            <b>DRDO &middot; Project Intern</b>
            <div style={{ color: 'var(--mu)' }}>
              Jun&ndash;Jul 2025. Developed UAV flight simulation models and sensor telemetry analysis in MATLAB.
            </div>
          </div>

          <div className="beat">
            <b>Engineering Projects</b>
            <div style={{ color: 'var(--mu)' }}>
              &bull; <strong>AegisAgent:</strong> 9-gate security gateway for local LLMs, tested on real ESP32 hardware.<br />
              &bull; <strong>PhishSim AI:</strong> Agentic phishing simulation trainer with passive reconnaissance (live public sandbox).<br />
              &bull; <strong>SentinelFlow:</strong> Explainable hybrid NIDS pairing heuristic signatures with Isolation Forest.<br />
              &bull; <strong>SafeLine WAF Lab:</strong> Dual-VM TLS reverse proxy lab (in progress, attack tests not done).
            </div>
          </div>

          <div className="beat">
            <b>Observable Proof</b>
            <div style={{ color: 'var(--mu)' }}>
              &bull; PortSwigger Web Security Academy: {totalLabs} labs cleared.<br />
              &bull; TryHackMe: Ranked top {stats.tryhackme?.top_percent || 7}% worldwide.<br />
              &bull; Sea of Secrets CTF: Solo competitor, rank under 150.<br />
              &bull; Certifications: Introduction to AI Security (AI Security University).
            </div>
          </div>

          <p style={{ marginTop: '20px' }}>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: 'var(--ink)',
                color: 'var(--bg)',
                borderRadius: '99px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Open Resume PDF &rarr;
            </a>
          </p>
        </div>
      );
    }

    // 2. Post Walkthrough from Vulnerability Table
    if (renderedItem.category && renderedItem.title) {
      const detail = POST_DETAILS[renderedItem.title] || {
        line: renderedItem.desc,
        looks: 'Observable payload execution behavior in lab targets.',
        red: 'Analyze entry vector and manipulate request parameters.',
        blue: 'Implement server-side input validation and perimeter boundaries.'
      };

      return (
        <div>
          <span className="tag">
            {renderedItem.category} &middot; 2 min read &middot; field research
          </span>
          <h2 style={{ fontSize: 'clamp(34px, 6vw, 60px)', margin: '10px 0 16px' }}>{renderedItem.title}</h2>
          <p className="lead">{renderedItem.desc}</p>

          <div className="beat">
            <b>In one line</b>
            <div style={{ color: 'var(--mu)' }}>{detail.line}</div>
          </div>

          <div className="beat">
            <b>How it looks</b>
            <div style={{ color: 'var(--mu)' }}>{detail.looks}</div>
          </div>

          <div className="rb">
            <div className="r">
              <b>Attacker Lens</b>
              {detail.red}
            </div>
            <div className="bl">
              <b>Defender Lens</b>
              {detail.blue}
            </div>
          </div>

          <p style={{ marginTop: '24px' }}>
            <a
              href={`#table`}
              onClick={onClose}
              style={{ color: 'var(--ac)', fontWeight: 600, textDecoration: 'none' }}
            >
              &larr; Back to Vulnerability Table
            </a>
          </p>
        </div>
      );
    }

    // 3. AegisAgent Project Story
    if (renderedItem.id === 'aegis') {
      return (
        <div>
          <span className="tag">{renderedItem.st}</span>
          <h2 style={{ fontSize: 'clamp(34px, 6vw, 60px)', margin: '10px 0 16px' }}>{renderedItem.t}</h2>
          <p className="lead">{renderedItem.d}</p>

          <div className="beat">
            <b>The problem</b>
            <div style={{ color: 'var(--mu)' }}>
              An AI that can press real buttons is risky. One bad prompt, and a motor or a lock does something it should not. Prompt injection (OWASP LLM01) and excessive agency (LLM06) can bypass model alignment.
            </div>
          </div>

          <div className="beat">
            <b>The idea</b>
            <div style={{ color: 'var(--mu)' }}>
              Do not trust the AI. Put gates between its words and the hardware. Every action must pass all of them outside the model context before dispatch.
            </div>
          </div>

          <div className="beat">
            <b>What I built</b>
            <div style={{ color: 'var(--mu)' }}>
              Nine gates, in order. Tested on real ESP32 hardware with a physical attack-blocked LED (no photo or video). The README documents honest boundaries: unencrypted local MQTT/HTTP, and regex detector limits.
            </div>
          </div>

          <div className="tag" style={{ marginTop: '16px' }}>
            The 9 gates
          </div>
          <div className="gates">
            {[
              'Detection Engine (Multi-view normalizer)',
              'Intent Lock (Pre-call scope boundary)',
              'Model Call (Local Ollama llama3.1)',
              'Role Check (RBAC boundary)',
              'Parameter Guard (Path, URL, SQL constraints)',
              'Rate Limiter (Sliding window)',
              'Human Approval (High-risk SHA-256 sign-off)',
              'Hardware Bridge (MQTT / USB ESP32 bridge)',
              'Output Scan (Indirect injection trap)'
            ].map((gate, i) => (
              <div key={gate} className="gate on">
                <b>{i + 1}</b>
                <span>{gate}</span>
              </div>
            ))}
          </div>

          <div className="rb">
            <div className="r">
              <b>Attacker Lens</b>
              Slip a hidden base64 or prompt override in the prompt and hope it reaches the hardware.
            </div>
            <div className="bl">
              <b>Defender Lens</b>
              Check intent, role and limits at every step. A human approves risky moves, and the physical Red LED triggers on block.
            </div>
          </div>

          <p style={{ marginTop: '20px' }}>
            <a
              style={{ color: 'var(--ac)', fontWeight: 600, textDecoration: 'none' }}
              href="https://github.com/Kavy-Sharma/AegisAgent"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the real thing &rarr;
            </a>
          </p>
        </div>
      );
    }

    // 4. PhishSim AI Project Story
    if (renderedItem.id === 'phish') {
      return (
        <div>
          <span className="tag">{renderedItem.st}</span>
          <h2 style={{ fontSize: 'clamp(34px, 6vw, 60px)', margin: '10px 0 16px' }}>{renderedItem.t}</h2>
          <p className="lead">{renderedItem.d}</p>

          <div className="beat">
            <b>The problem</b>
            <div style={{ color: 'var(--mu)' }}>
              People click bad emails. Training is boring and static, so it does not stick.
            </div>
          </div>

          <div className="beat">
            <b>The idea</b>
            <div style={{ color: 'var(--mu)' }}>
              Let people practise on safe fake phishing generated from real attack surface signals, and learn why it was fake.
            </div>
          </div>

          <div className="beat">
            <b>What I built</b>
            <div style={{ color: 'var(--mu)' }}>
              A live web app anyone can try. The public demo runs in sandbox mode, so no real email is sent.
            </div>
          </div>

          <div className="rb">
            <div className="r">
              <b>Attacker Lens</b>
              Craft a believable email using target signals and induce an urgent click.
            </div>
            <div className="bl">
              <b>Defender Lens</b>
              Teach the observable signs: sender domains, artificial urgency, and look-alike links.
            </div>
          </div>

          <p style={{ marginTop: '20px' }}>
            <a
              style={{ color: 'var(--ac)', fontWeight: 600, textDecoration: 'none' }}
              href="https://phishsim-ai.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the live demo &rarr;
            </a>
          </p>
        </div>
      );
    }

    // 5. SafeLine WAF Lab Story
    if (renderedItem.id === 'safe') {
      return (
        <div>
          <span className="tag">In progress</span>
          <h2 style={{ fontSize: 'clamp(34px, 6vw, 60px)', margin: '10px 0 16px' }}>SafeLine WAF Lab</h2>
          <p className="lead">Home lab: a vulnerable app behind a WAF.</p>

          <div className="beat">
            <b>Status</b>
            <div style={{ color: 'var(--mu)' }}>
              <strong>IN PROGRESS.</strong> Attack tests are not done. Verified so far: dual VMs (Kali + Ubuntu), DVWA target, local DNS resolution, self-signed TLS certificates, and HTTPS reverse proxy routing through SafeLine.
            </div>
          </div>

          <div className="beat">
            <b>The setup</b>
            <div style={{ color: 'var(--mu)' }}>
              Traffic routes from Kali (10.0.2.15) through SafeLine WAF (10.0.2.5:9443) to backend DVWA (10.0.2.4:80). SafeLine terminates TLS with self-signed certs.
            </div>
          </div>

          <div className="rb">
            <div className="r">
              <b>Attacker Lens</b>
              Send SQLi, XSS, and command injection attacks toward the protected hostname.
            </div>
            <div className="bl">
              <b>Defender Lens</b>
              SafeLine terminates TLS, analyzes HTTP payloads with its semantic engine, and intercepts malicious requests before reaching DVWA.
            </div>
          </div>

          <p style={{ marginTop: '20px' }}>
            <a
              style={{ color: 'var(--ac)', fontWeight: 600, textDecoration: 'none' }}
              href="https://github.com/Kavy-Sharma/safeline-dvwa-waf-lab"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open repository &rarr;
            </a>
          </p>
        </div>
      );
    }

    // 6. SentinelFlow Story
    if (renderedItem.id === 'sent') {
      return (
        <div>
          <span className="tag">In progress</span>
          <h2 style={{ fontSize: 'clamp(34px, 6vw, 60px)', margin: '10px 0 16px' }}>SentinelFlow</h2>
          <p className="lead">Early idea, still growing.</p>

          <div className="beat">
            <b>The problem</b>
            <div style={{ color: 'var(--mu)' }}>
              Heuristic intrusion detection misses novel anomalies, while ML models produce unexplainable black-box alerts.
            </div>
          </div>

          <div className="beat">
            <b>What I built</b>
            <div style={{ color: 'var(--mu)' }}>
              An explainable hybrid network intrusion detection system pairing deterministic heuristic rules with unsupervised Isolation Forest scoring on live PCAP packet streams.
            </div>
          </div>

          <div className="rb">
            <div className="r">
              <b>Attacker Lens</b>
              Execute stealthy multi-port scans (T1046) and protocol-anomaly probes below rate-threshold filters.
            </div>
            <div className="bl">
              <b>Defender Lens</b>
              Flag statistical outliers, correlate with known signature rules, and output MITRE ATT&CK mapping with explainability scores.
            </div>
          </div>

          <p style={{ marginTop: '20px' }}>
            <a
              style={{ color: 'var(--ac)', fontWeight: 600, textDecoration: 'none' }}
              href="https://github.com/Kavy-Sharma/SentinelFlow"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open repository &rarr;
            </a>
          </p>
        </div>
      );
    }

    // 7. Machine Write-ups Story
    if (renderedItem.id === 'wr') {
      return (
        <div>
          <span className="tag">Write-ups &middot; TryHackMe &amp; Hack The Box</span>
          <h2 style={{ fontSize: 'clamp(34px, 6vw, 60px)', margin: '10px 0 16px' }}>Machine Write-ups</h2>
          <p className="lead">Documented penetration testing write-ups across Linux targets: Basic Pentesting, RootMe, Kenobi, Meow, Fawn, and Dancing.</p>

          <div className="beat">
            <b>Reconnaissance &amp; Port Enumeration</b>
            <div style={{ color: 'var(--mu)' }}>
              Network discovery and service version fingerprinting with Nmap, Gobuster, and Nikto. Mapping open ports across SSH (22), Telnet (23), FTP (21), SMB (445), and custom web apps (80, 8080).
            </div>
          </div>

          <div className="beat">
            <b>Initial Foothold &amp; Exploitation</b>
            <div style={{ color: 'var(--mu)' }}>
              &bull; <strong>Kenobi:</strong> Exploited ProFTPD 1.3.5 mod_copy vulnerability (SITE CPFR / SITE CPTO) to stage private SSH keys into accessible NFS shares.<br />
              &bull; <strong>RootMe:</strong> Bypassed file upload filter by uploading <code>.phtml</code> PHP reverse shell.<br />
              &bull; <strong>Basic Pentesting:</strong> SMB enumeration with enum4linux followed by hydra credential brute-forcing.
            </div>
          </div>

          <div className="beat">
            <b>Privilege Escalation to Root</b>
            <div style={{ color: 'var(--mu)' }}>
              Escalated to root using SUID binary abuse (GTFOBins) on Python and custom binaries, and misconfigured sudo privileges.
            </div>
          </div>

          <div className="rb">
            <div className="r">
              <b>Attacker Lens</b>
              Identify service vulnerabilities, exploit file upload bypasses, and leverage SUID permissions to escape low-privilege shells.
            </div>
            <div className="bl">
              <b>Defender Lens</b>
              Disable legacy plaintext protocols (Telnet, anonymous FTP), enforce strict upload extension allowlists, and audit sudo/SUID permissions.
            </div>
          </div>

          <p style={{ marginTop: '20px' }}>
            <a
              style={{ color: 'var(--ac)', fontWeight: 600, textDecoration: 'none' }}
              href="https://tryhackme.com/p/kavysharma196"
              target="_blank"
              rel="noopener noreferrer"
            >
              View TryHackMe profile &rarr;
            </a>
          </p>
        </div>
      );
    }

    // 8. PortSwigger Academy Story
    if (renderedItem.id === 'ps') {
      return (
        <div>
          <span className="tag">Auto-ish Stat &middot; PortSwigger Web Security Academy</span>
          <h2 style={{ fontSize: 'clamp(34px, 6vw, 60px)', margin: '10px 0 16px' }}>PortSwigger Academy</h2>
          <p className="lead">{totalLabs} labs cleared across Apprentice, Practitioner, and Expert tiers.</p>

          <div className="beat">
            <b>Tiers Cleared</b>
            <div style={{ color: 'var(--mu)' }}>
              &bull; <strong>Apprentice:</strong> {stats.portswigger?.apprentice?.[0] || 31} / {stats.portswigger?.apprentice?.[1] || 64} labs.<br />
              &bull; <strong>Practitioner:</strong> {stats.portswigger?.practitioner?.[0] || 67} / {stats.portswigger?.practitioner?.[1] || 175} labs.<br />
              &bull; <strong>Expert:</strong> {stats.portswigger?.expert?.[0] || 7} / {stats.portswigger?.expert?.[1] || 40} labs.
            </div>
          </div>

          <div className="beat">
            <b>Vulnerability Topics Mastered</b>
            <div style={{ color: 'var(--mu)' }}>
              SQL Injection (UNION, error-based, blind time-delays), Cross-Site Scripting (Reflected, Stored, DOM), CSRF token bypasses, Path Traversal, Insecure Direct Object References (IDOR), and Business Logic flaws.
            </div>
          </div>

          <div className="rb">
            <div className="r">
              <b>Attacker Lens</b>
              Tamper with raw HTTP requests via Burp Suite Repeater, probe database response timing, and chain subtle logic flaws.
            </div>
            <div className="bl">
              <b>Defender Lens</b>
              Enforce parameterized queries, contextual output encoding, strict session revocation, and defense-in-depth WAF rules.
            </div>
          </div>
        </div>
      );
    }

    // 9. TryHackMe Story
    if (renderedItem.id === 'thm') {
      return (
        <div>
          <span className="tag">Profile &middot; TryHackMe</span>
          <h2 style={{ fontSize: 'clamp(34px, 6vw, 60px)', margin: '10px 0 16px' }}>TryHackMe</h2>
          <p className="lead">Ranked in the top {stats.tryhackme?.top_percent || 7}% worldwide.</p>

          <div className="beat">
            <b>Practical Pentesting</b>
            <div style={{ color: 'var(--mu)' }}>
              Continuous hands-on offensive and defensive cybersecurity training. Focus on realistic Linux target machines, Active Directory fundamentals, and web security.
            </div>
          </div>

          <div className="beat">
            <b>Core Competencies</b>
            <div style={{ color: 'var(--mu)' }}>
              Network reconnaissance (Nmap, Wireshark), Linux privilege escalation (SUID, cronjobs, sudo), web vulnerability enumeration (Burp Suite, Gobuster), and hash cracking (John the Ripper, Hashcat).
            </div>
          </div>

          <div className="rb">
            <div className="r">
              <b>Attacker Lens</b>
              Systematically map network surfaces, exploit misconfigurations, and establish persistent footholds.
            </div>
            <div className="bl">
              <b>Defender Lens</b>
              Implement baseline host hardening, isolate critical network segments, and monitor authentication telemetry.
            </div>
          </div>

          <p style={{ marginTop: '20px' }}>
            <a
              style={{ color: 'var(--ac)', fontWeight: 600, textDecoration: 'none' }}
              href={stats.tryhackme?.profile_url || 'https://tryhackme.com/p/kavysharma196'}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open TryHackMe profile &rarr;
            </a>
          </p>
        </div>
      );
    }

    // 10. CTF + AI Certification Story
    if (renderedItem.id === 'ctf') {
      return (
        <div>
          <span className="tag">Achievements &middot; Competitions &amp; Certifications</span>
          <h2 style={{ fontSize: 'clamp(34px, 6vw, 60px)', margin: '10px 0 16px' }}>CTF &amp; Certifications</h2>
          <p className="lead">Sea of Secrets CTF solo rank under 150 &middot; AI Security Certification.</p>

          <div className="beat">
            <b>Sea of Secrets CTF</b>
            <div style={{ color: 'var(--mu)' }}>
              Competed as a solo participant against international teams, achieving a final rank under 150. Solved challenges across web security, reverse engineering, digital forensics, and cryptographic ciphers.
            </div>
          </div>

          <div className="beat">
            <b>Introduction to AI Security (AI Security University)</b>
            <div style={{ color: 'var(--mu)' }}>
              Certified in AI security fundamentals, covering OWASP Top 10 for LLMs: prompt injection vulnerabilities, jailbreaks, data leakage, insecure output handling, and model alignment boundaries.
            </div>
          </div>

          <div className="rb">
            <div className="r">
              <b>Attacker Lens</b>
              Devise novel adversarial prompts and injection vectors to bypass model behavioral constraints.
            </div>
            <div className="bl">
              <b>Defender Lens</b>
              Architect deterministic out-of-band guardrails, role checks, and hardware isolation layers.
            </div>
          </div>
        </div>
      );
    }

    // 11. TechDefence Internship Story
    if (renderedItem.id === 'td') {
      return (
        <div>
          <span className="tag">Internship &middot; TechDefence</span>
          <h2 style={{ fontSize: 'clamp(34px, 6vw, 60px)', margin: '10px 0 16px' }}>TechDefence</h2>
          <p className="lead">VAPT Intern &middot; June&ndash;July 2026.</p>

          <div className="beat">
            <b>Client VAPT Engagements</b>
            <div style={{ color: 'var(--mu)' }}>
              Conducted vulnerability assessments and penetration testing for {stats.client_tests_plus || 20}+ clients across web applications, REST APIs, and corporate network perimeters.
            </div>
          </div>

          <div className="beat">
            <b>Methodology &amp; Tooling</b>
            <div style={{ color: 'var(--mu)' }}>
              Followed OWASP Top 10 and PTES testing standards using Burp Suite Professional, Nmap, Nessus, SQLmap, and Kali Linux. Analyzed authorization logic, authenticated sessions, and input sanitation.
            </div>
          </div>

          <div className="beat">
            <b>Audit Reporting &amp; Remediation</b>
            <div style={{ color: 'var(--mu)' }}>
              Authored clear vulnerability assessment reports with CVSS severity scoring, reproducible proof-of-concept steps, and actionable technical remediation advice for engineering teams.
            </div>
          </div>

          <div className="rb">
            <div className="r">
              <b>Attacker Lens</b>
              Simulate external threat actors to uncover exploitable flaws in production applications.
            </div>
            <div className="bl">
              <b>Defender Lens</b>
              Provide developers with exact remediation guidelines to patch vulnerabilities before deployment.
            </div>
          </div>
        </div>
      );
    }

    // 12. DRDO Internship Story
    if (renderedItem.id === 'drdo') {
      return (
        <div>
          <span className="tag">Internship &middot; DRDO</span>
          <h2 style={{ fontSize: 'clamp(34px, 6vw, 60px)', margin: '10px 0 16px' }}>DRDO</h2>
          <p className="lead">Project Intern &middot; June&ndash;July 2025.</p>

          <div className="beat">
            <b>UAV Flight Simulation</b>
            <div style={{ color: 'var(--mu)' }}>
              Defence Research and Development Organisation. Developed unmanned aerial vehicle (UAV) flight trajectory simulation models in MATLAB.
            </div>
          </div>

          <div className="beat">
            <b>Telemetry &amp; Sensor Modeling</b>
            <div style={{ color: 'var(--mu)' }}>
              Processed sensor telemetry data, modeled aircraft aerodynamic control systems, and evaluated sensor signal accuracy under simulated mission conditions.
            </div>
          </div>
        </div>
      );
    }

    // Default Fallback
    return (
      <div>
        <span className="tag">{renderedItem.st || 'Story'}</span>
        <h2 style={{ fontSize: 'clamp(34px, 6vw, 60px)', margin: '10px 0 16px' }}>{renderedItem.t}</h2>
        <p className="lead">{renderedItem.d}</p>

        <div className="beat">
          <b>The story goes here</b>
          <div style={{ color: 'var(--mu)' }}>
            Each window opens its own page: problem, idea, what I built, what I learned. Written from my real notes and READMEs with no invented claims.
          </div>
        </div>

        {renderedItem.u && renderedItem.u[0] !== '#' && (
          <p style={{ marginTop: '20px' }}>
            <a
              style={{ color: 'var(--ac)', fontWeight: 600, textDecoration: 'none' }}
              href={renderedItem.u.startsWith('http') ? renderedItem.u : `https://${renderedItem.u}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the real thing &rarr;
            </a>
          </p>
        )}
      </div>
    );
  };

  return (
    <div
      className={`ov ${isOpen ? 'open' : ''}`}
      id="ov"
      style={{
        '--x': `${x}px`,
        '--y': `${y}px`
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="in">
        <button
          ref={closeBtnRef}
          type="button"
          className="x"
          id="x"
          onClick={onClose}
          aria-label="Close dialog"
        >
          Close &times;
        </button>

        <div id="ovc">{renderContent()}</div>
      </div>
    </div>
  );
}
