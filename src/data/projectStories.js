// Verified project story content derived strictly from project READMEs and project-notes/facts.md

export const PROJECT_STORIES = {
  aegis: {
    id: 'aegis',
    title: 'AegisAgent',
    oneLine: 'A 9-gate shield between an AI and real hardware.',
    status: 'Hardware tested',
    floorLabel: 'Floor 4 \u00b7 BUILD',
    url: 'https://github.com/Kavy-Sharma/AegisAgent',
    diagramType: 'aegis',
    beats: [
      {
        title: 'The problem',
        text: 'An AI that can press real buttons is risky. One prompt injection (OWASP LLM01) or excessive agency flaw (LLM06) can trick an LLM into unlocking physical doors or triggering alarms without permission.'
      },
      {
        title: 'The idea',
        text: 'Do not trust the AI to self-police. Put a deterministic security gateway between its words and the hardware. Every action must pass 9 sequential validation gates outside the model context before dispatch.'
      },
      {
        title: 'What I built',
        text: 'A 9-gate defense pipeline tested on real ESP32 hardware with an authenticated MQTT bridge. Includes multi-view regex normalizer, declarative parameter guard, human operator approval with SHA-256 request hashing, and a physical attack-blocked LED.'
      },
      {
        title: 'What I learned',
        text: 'Regex detectors alone catch only 16.7% of novel bypasses in benchmarks. Defense-in-depth is mandatory: when the detector misses, Intent Lock, RBAC, parameter guards, and human approval stop the harm.'
      },
      {
        title: 'What is next',
        text: 'Replace keyword-based intent locking with semantic vector bounds, add TLS mutual authentication to the hardware bridge, and benchmark multi-agent orchestrations.'
      }
    ],
    breakFix: {
      redTitle: 'Adversarial Injection (Attacker Lens)',
      redText: 'Injected base64-encoded instructions ("SWdub3Jl...") and hidden control characters to bypass raw string filters and trick the local LLM into calling the high-risk "unlock_door" tool.',
      blueTitle: '9-Gate Defense (Defender Lens)',
      blueText: 'Normalized input text, validated intent and RBAC, enforced strict parameter schemas, required one-time human operator authorization, and triggered a physical red LED on block.'
    },
    limits: [
      'Transport security: Plain HTTP and MQTT local traffic only (no TLS mutual auth yet); network eavesdropping is possible on shared LANs.',
      'Detector constraints: Rule-based detector catches only 16.7% of novel bypasses in benchmarks and misses foreign-language or homoglyph substitutions.',
      'Intent lock phrasing: Keyword matching causes false blocks on uncommon wording or benign paraphrases.',
      'Hardware evidence: Tested on real ESP32 hardware in college lab, but no video/photo exists (per honesty rules).',
      'Single-worker concurrency: Handles one synchronous request at a time; pending human approval blocks the queue up to 60s.'
    ]
  },

  safe: {
    id: 'safe',
    title: 'SafeLine WAF Lab',
    oneLine: 'Home lab: a vulnerable app behind a WAF.',
    status: 'In progress',
    floorLabel: 'Floor 4 \u00b7 BUILD',
    url: 'https://github.com/Kavy-Sharma/safeline-dvwa-waf-lab',
    diagramType: 'safeline',
    beats: [
      {
        title: 'The problem',
        text: 'Deploying a vulnerable web application directly onto a network exposes it to immediate exploitation. Web application firewalls claim to shield backends, but understanding reverse proxy routing and TLS termination requires hands-on verification.'
      },
      {
        title: 'The idea',
        text: 'Build an isolated multi-VM lab: Kali Linux as the testing attacker, Ubuntu running DVWA as the backend, and SafeLine WAF intercepting all traffic as an HTTPS reverse proxy.'
      },
      {
        title: 'What I built',
        text: 'Configured VirtualBox NatNetwork (10.0.2.0/24) with Kali (10.0.2.3) and Ubuntu (10.0.2.4). Verified DVWA on Apache port 8080, configured local DNS resolution (dvwa.local), deployed self-signed TLS certificates, and confirmed reverse proxy routing with curl.'
      },
      {
        title: 'What I learned',
        text: 'Setting up reverse proxy architecture taught me real-world TLS handshakes, certificate trust chains, and how header forwarding affects backend session handling.'
      },
      {
        title: 'What is next',
        text: 'Execute structured SQLi and XSS test suites from Kali to observe and measure SafeLine semantic inspection and blocking behavior.'
      }
    ],
    breakFix: {
      redTitle: 'Offensive Probing (Attacker Lens)',
      redText: 'Send crafted SQL injection (\' OR 1=1--), reflected XSS, and command injection payloads through port 443 targeting dvwa.local.',
      blueTitle: 'Defensive Architecture (Defender Lens)',
      blueText: 'SafeLine terminates HTTPS on port 443, inspects incoming HTTP request semantics, and only forwards benign traffic to backend DVWA on port 8080.'
    },
    limits: [
      'LAB IN PROGRESS: Attack tests are NOT done. SafeLine has not blocked any attacks yet in this lab.',
      'Isolation: Bound to private NatNetwork (10.0.2.0/24); never exposed to the public internet.',
      'Certificates: Uses self-signed TLS certificates; requires local client CA trust.',
      'DNS: Configured via local /etc/hosts resolution rather than enterprise BIND9.'
    ]
  },

  phish: {
    id: 'phish',
    title: 'PhishSim AI',
    oneLine: 'Phishing awareness trainer. Runs live for anyone.',
    status: 'Live demo',
    floorLabel: 'Floor 4 \u00b7 BUILD',
    url: 'https://phishsim-ai.onrender.com',
    diagramType: 'phishsim',
    beats: [
      {
        title: 'The problem',
        text: 'Traditional security awareness training uses static, generic email templates that employees quickly ignore. Real attackers use domain reconnaissance and role context to craft hyper-targeted lures.'
      },
      {
        title: 'The idea',
        text: 'Build an agentic training platform that audits an organization\'s public attack surface, generates realistic role-specific simulation emails, and provides instant educational feedback.'
      },
      {
        title: 'What I built',
        text: 'Full-stack Flask and MySQL application with OpenRouter LLMs. Built PhishRecon (passive SPF, DMARC, look-alike domain checks), campaign delivery engine, and an executive risk briefing dashboard.'
      },
      {
        title: 'What I learned',
        text: 'Proactive reporting is the most important metric: highlighting employees who immediately report suspicious lures builds a stronger defense culture than simply penalizing clickers.'
      },
      {
        title: 'What is next',
        text: 'Add automated micro-learning modules triggered immediately when an employee clicks a simulated lure.'
      }
    ],
    breakFix: {
      redTitle: 'Social Engineering Lure (Attacker Lens)',
      redText: 'Audited public DNS records for SPF/DMARC gaps, identified corporate department structures from public sources, and crafted urgent invoice verification requests.',
      blueTitle: 'Simulation & Coaching (Defender Lens)',
      blueText: 'Simulated safe sandbox delivery, captured telemetry (opens, clicks, reports), and provided constructive coaching ledgers and DMARC enforcement guides.'
    },
    limits: [
      'Sandbox mode: Public demo runs in safe sandbox mode; no real emails are dispatched.',
      'Passive recon only: PhishRecon uses non-intrusive DNS and WHOIS lookups; it is not a vulnerability scanner.',
      'Honest metrics: No claims about user counts, enterprise customers, or revenue.'
    ]
  },

  sent: {
    id: 'sent',
    title: 'SentinelFlow',
    oneLine: 'Early idea, still growing.',
    status: 'In progress',
    floorLabel: 'Floor 4 \u00b7 BUILD',
    url: 'https://github.com/Kavy-Sharma/SentinelFlow',
    diagramType: 'sentinelflow',
    beats: [
      {
        title: 'The problem',
        text: 'Pure signature-based intrusion detection misses novel anomalies, while purely statistical ML models generate confusing black-box alerts with high false positive rates.'
      },
      {
        title: 'The idea',
        text: 'Pair deterministic rule-based heuristics with an unsupervised Isolation Forest trained strictly on benign baseline traffic, delivering structured MITRE ATT&CK explainability.'
      },
      {
        title: 'What I built',
        text: 'Python 3.11 NIDS engine with offline PCAP parsing, bidirectional flow feature extraction, heuristic signatures (SYN flood, port scan, ARP spoofing), Isolation Forest model, and a Streamlit dashboard.'
      },
      {
        title: 'What I learned',
        text: 'Training ML anomaly detectors strictly on benign baseline traffic avoids label noise and makes z-score anomaly deviation explainable to security analysts.'
      },
      {
        title: 'What is next',
        text: 'Add live packet capture via AF_PACKET / eBPF without root privileges.'
      }
    ],
    breakFix: {
      redTitle: 'Evasion & Floods (Attacker Lens)',
      redText: 'Executed slow distributed SYN port scans and randomized TCP/UDP floods to stay below naive volume thresholds.',
      blueTitle: 'Hybrid Fusion (Defender Lens)',
      blueText: 'Correlated heuristic signature hits with statistical z-score flow anomalies, escalating alert priority with MITRE ATT&CK technique tags.'
    },
    limits: [
      'Early stage: Core engine and CLI workflows are functional; live streaming engine is still growing.',
      'Offline analysis: Optimized for PCAP analysis rather than real-time Gigabit wire speeds.',
      'Baseline dependency: Isolation Forest requires clean benign network traffic for baseline calibration.'
    ]
  },

  ps: {
    id: 'ps',
    title: 'PortSwigger Academy',
    oneLine: '__LABS__ labs solved so far. Keeps growing.',
    status: 'Auto-ish stat',
    floorLabel: 'Floor 2 \u00b7 PROVE',
    url: 'https://portswigger.net',
    diagramType: 'portswigger',
    beats: [
      {
        title: 'The problem',
        text: 'Theoretical web security knowledge is insufficient without practical, repeatable hands-on exploitation against real-world vulnerability patterns.'
      },
      {
        title: 'The idea',
        text: 'Systematically work through PortSwigger\'s rigorous Web Security Academy across all core vulnerability classes and difficulty tiers.'
      },
      {
        title: 'What I built',
        text: 'Solves across Apprentice, Practitioner, and Expert tiers using Burp Suite Professional tools (Repeater, Intruder, Match and Replace, Collaborator).'
      },
      {
        title: 'What I learned',
        text: 'Chaining subtle flaws—such as an IDOR combined with business logic race conditions—often leads to full account compromise.'
      },
      {
        title: 'What is next',
        text: 'Complete the remaining Expert-tier labs in OAuth2, WebSockets, and Advanced Server-Side Template Injection.'
      }
    ],
    breakFix: {
      redTitle: 'Offensive Web Exploitation (Attacker Lens)',
      redText: 'Intercepted and modified raw HTTP traffic in Burp Suite, exploited blind SQL injection with time delays, bypassed CSRF protections, and extracted sensitive tokens.',
      blueTitle: 'Secure Coding Principles (Defender Lens)',
      blueText: 'Implemented parameterized queries, contextual output encoding, robust session invalidation, and strict access control checks on every server endpoint.'
    },
    limits: [
      'Numbers source: All lab counts are read dynamically from data/stats.json.',
      'Academic scope: Completed in simulated PortSwigger lab environments, not live unauthorized systems.'
    ]
  },

  thm: {
    id: 'thm',
    title: 'TryHackMe',
    oneLine: 'Ranked __THM__ worldwide.',
    status: 'Profile',
    floorLabel: 'Floor 2 \u00b7 PROVE',
    url: 'https://tryhackme.com/p/kavysharma196',
    diagramType: 'tryhackme',
    beats: [
      {
        title: 'The problem',
        text: 'Modern penetration testing requires navigating complete operating systems, Active Directory domains, and misconfigured services from initial foothold to root.'
      },
      {
        title: 'The idea',
        text: 'Practice offensive security against real Linux and Windows target machines across diverse CTF and enterprise network rooms.'
      },
      {
        title: 'What I built',
        text: 'Solved extensive machine challenges, elevating global profile ranking into the top 7% worldwide.'
      },
      {
        title: 'What I learned',
        text: 'Enumeration is 90% of the game. Thorough port and service scanning uncovers forgotten services that provide initial access.'
      },
      {
        title: 'What is next',
        text: 'Target advanced Active Directory rooms (Kerberoasting, AS-REP roasting, DCSync) and complete OSCP-style target networks.'
      }
    ],
    breakFix: {
      redTitle: 'Privilege Escalation & Footholds (Attacker Lens)',
      redText: 'Identified vulnerable services (ProFTPD 1.3.5), cracked password hashes, and abused SUID binaries via GTFOBins to escalate from user to root.',
      blueTitle: 'Hardening & Least Privilege (Defender Lens)',
      blueText: 'Decommissioned legacy protocols (Telnet/FTP), enforced ed25519 SSH keys, audited sudoers configurations, and applied principle of least privilege.'
    },
    limits: [
      'Numbers source: Ranking and badge counts read from data/stats.json.',
      'Target scope: Educational training machines on TryHackMe network.'
    ]
  },

  ctf: {
    id: 'ctf',
    title: 'CTF + AI cert',
    oneLine: 'Sea of Secrets CTF, solo, rank under 150. AI Security cert.',
    status: 'Achievements',
    floorLabel: 'Floor 2 \u00b7 PROVE',
    url: '',
    diagramType: 'ctf',
    beats: [
      {
        title: 'The problem',
        text: 'Security threats are rapidly expanding from traditional web architectures into generative AI and Large Language Model deployments.'
      },
      {
        title: 'The idea',
        text: 'Validate both classical CTF exploitation skills under competition pressure and structured AI security governance principles.'
      },
      {
        title: 'What I built',
        text: 'Competed solo in the Sea of Secrets CTF (rank under 150) and earned the Introduction to AI Security certification (AI Security University).'
      },
      {
        title: 'What I learned',
        text: 'AI models cannot distinguish between developer system instructions and untrusted user data, making defense-in-depth architectural gateways mandatory.'
      },
      {
        title: 'What is next',
        text: 'Compete in collegiate team CTFs and conduct adversarial red-teaming against open-weight LLMs.'
      }
    ],
    breakFix: {
      redTitle: 'Adversarial Prompting (Attacker Lens)',
      redText: 'Constructed jailbreak prompts, prompt injections, and data extraction queries against unguarded LLM agent endpoints.',
      blueTitle: 'Model Alignment & Guardrails (Defender Lens)',
      blueText: 'Enforced dual-layer guardrails, input normalization, parameter allowlists, and human-in-the-loop authorization.'
    },
    limits: [
      'Observable proof: Verified certificate and CTF scoreboard ranking from facts.md.',
      'Solo rank: Sea of Secrets rank under 150 achieved as an individual competitor.'
    ]
  },

  td: {
    id: 'td',
    title: 'TechDefence',
    oneLine: 'VAPT intern. Tested apps for 20+ clients.',
    status: 'Internship',
    floorLabel: 'Floor 1 \u00b7 WORK',
    url: '',
    diagramType: 'techdefence',
    beats: [
      {
        title: 'The problem',
        text: 'Production client applications contain subtle business logic and access control vulnerabilities that automated scanners completely miss.'
      },
      {
        title: 'The idea',
        text: 'Perform manual Vulnerability Assessment and Penetration Testing (VAPT) following structured OWASP testing methodologies.'
      },
      {
        title: 'What I built',
        text: 'VAPT Intern at TechDefence (Jun\u2013Jul 2026). Tested web applications and APIs for 20+ clients using Burp Suite, Nessus, Nmap, and Kali Linux.'
      },
      {
        title: 'What I learned',
        text: 'Writing actionable remediation guidance for developers is just as important as discovering the vulnerability itself.'
      },
      {
        title: 'What is next',
        text: 'Advance towards professional certifications (e.g. eJPT, CEH, OSCP) and expand into cloud infrastructure security.'
      }
    ],
    breakFix: {
      redTitle: 'Client Assessment Scope (Attacker Lens)',
      redText: 'Audited authentication flows, IDOR boundaries, session fixation risks, and input sanitization across client-staging web apps.',
      blueTitle: 'Remediation Reporting (Defender Lens)',
      blueText: 'Delivered executive vulnerability summaries with CVSS severity scoring, proof-of-concept reproductions, and specific code-level patch steps.'
    },
    limits: [
      'NDA & Privacy: Client names, internal target URLs, and specific client findings are confidential and omitted per rules.md.',
      'Dates: Internship conducted Jun\u2013Jul 2026.'
    ]
  },

  drdo: {
    id: 'drdo',
    title: 'DRDO',
    oneLine: 'Project intern. UAV simulations in MATLAB.',
    status: 'Internship',
    floorLabel: 'Floor 1 \u00b7 WORK',
    url: '',
    diagramType: 'drdo',
    beats: [
      {
        title: 'The problem',
        text: 'Evaluating unmanned aerial vehicle (UAV) flight stability and sensor behavior requires high-fidelity mathematical simulations before physical flight tests.'
      },
      {
        title: 'The idea',
        text: 'Develop computational flight dynamics models in MATLAB to simulate flight trajectories and analyze sensor telemetry.'
      },
      {
        title: 'What I built',
        text: 'Project Intern at Defence Research and Development Organisation (Jun\u2013Jul 2025). Built simulation models and telemetry processing scripts.'
      },
      {
        title: 'What I learned',
        text: 'Engineering rigor, deterministic state modeling, and how sensor errors propagate through control systems.'
      },
      {
        title: 'What is next',
        text: 'Apply control-system security principles to embedded IoT and robotics hardware.'
      }
    ],
    breakFix: null, // No threat/defence info for defense simulation
    limits: [
      'Classification: Technical formulas, vehicle specifics, and defense data are strictly confidential.',
      'Scope: Numerical simulation and telemetry analysis in MATLAB; no physical flight hardware media.',
      'Dates: Project internship conducted Jun\u2013Jul 2025.'
    ]
  },

  wr: {
    id: 'wr',
    title: 'Machine write-ups',
    oneLine: 'Basic Pentesting, RootMe, Kenobi, Meow, Fawn, Dancing.',
    status: 'Write-ups',
    floorLabel: 'Floor 3 \u00b7 LEARN',
    url: 'https://tryhackme.com/p/kavysharma196',
    diagramType: 'writings',
    beats: [
      {
        title: 'The problem',
        text: 'Knowing attack theory is different from having muscle memory across port enumeration, exploit compilation, and privilege escalation.'
      },
      {
        title: 'The idea',
        text: 'Document step-by-step write-ups of retired target machines to reinforce reproducible pentesting techniques.'
      },
      {
        title: 'What I built',
        text: 'Detailed walkthroughs across Basic Pentesting, RootMe, Kenobi, Meow, Fawn, and Dancing.'
      },
      {
        title: 'What I learned',
        text: 'How legacy services (ProFTPD 1.3.5, SMBv1, unauthenticated Telnet) remain common entry vectors in enterprise environments.'
      },
      {
        title: 'What is next',
        text: 'Publish advanced Active Directory and Linux kernel exploit walkthroughs.'
      }
    ],
    breakFix: {
      redTitle: 'Exploitation Path (Attacker Lens)',
      redText: 'Enumerate open ports, search Exploit-DB for public exploits, obtain unprivileged shell, and escalate via SUID binaries.',
      blueTitle: 'Hardening & Remediation (Defender Lens)',
      blueText: 'Close unneeded ports, upgrade vulnerable daemons, remove SUID bits from script interpreters, and enforce robust password policies.'
    },
    limits: [
      'Scope: Target machines solved on TryHackMe and Hack The Box platforms.',
      'Integrity: Walkthroughs reflect hands-on lab methodology.'
    ]
  }
};
