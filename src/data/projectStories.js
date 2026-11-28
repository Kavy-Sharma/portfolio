// Project story content

export const PROJECT_STORIES = {
  aegis: {
    id: 'aegis',
    title: 'AegisAgent',
    oneLine: 'A 9-gate shield between an AI and real hardware.',
    status: 'Hardware tested',
    floorLabel: 'Floor 4 \u00b7 BUILD',
    url: 'https://github.com/Kavy-Sharma/AegisAgent',
    diagramType: 'aegis',
    benchmarkNote: 'Component benchmark (benchmark/run.py): Standalone rule detector evaluated against 60 novel adversarial prompt bypasses (Hindi/Hinglish translations, homoglyphs, base64/hex, role spoofing, multi-turn payloads) and 30 benign inputs. Detected 10 of 60 novel bypasses (16.7%) with 0/30 false positives. Bypasses that evade regex are stopped downstream by Gates 2–8 (Intent Lock, RBAC, Parameter Guard, Rate Limiter, and Human-in-the-Loop approval).',
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
    floorLabel: 'Floor 4 · BUILD',
    url: 'https://phishsim-ai.onrender.com',
    diagramType: 'phishsim',
    sandboxNote: 'Sandbox mode, sample data, no real email is sent',
    beats: [
      {
        title: 'The problem',
        text: 'Traditional security awareness training uses static, generic email templates that employees quickly ignore. Real attackers use domain reconnaissance and role context to craft hyper-targeted lures.'
      },
      {
        title: 'The idea',
        text: 'Build an interactive awareness platform guided by mascot "Lure" who stays with the user on every page. Give defenders an Attack Lab to inspect and edit realistic email lures, security utility tools, and an immediate learning experience right when someone clicks a simulated phish.'
      },
      {
        title: 'What I built',
        text: 'Full-stack Python, Flask, MySQL, and OpenRouter LLM platform. Key capabilities include: mascot "Lure" companion across all views; Attack Lab to draft and preview emails; modular tools (PhishRecon for SPF/DMARC/look-alikes, Threat Analyser, Header Analyser, URL Decoder, Password Breach Check); campaign dashboard with team readiness score and weekly risk briefing; automated AI reports with prevention advice; multi-mode email dispatch with scheduling for later; and a dedicated "You clicked a simulated phish" learning page that immediately breaks down the red flags and teaches prevention.'
      },
      {
        title: 'What I learned',
        text: 'Immediate, constructive coaching at the moment of click is far more effective than punitive metrics. Showing employees exactly what headers or look-alike domains looked suspicious builds lasting security habits.'
      },
      {
        title: 'What is next',
        text: 'Add adaptive difficulty levels and automated refresher modules triggered when an employee repeatedly clicks simulated lures.'
      }
    ],
    breakFix: {
      redTitle: 'Social Engineering Lure (Attacker Lens)',
      redText: 'Audited public DNS records for SPF/DMARC gaps, identified corporate department structures from public sources, and crafted urgent invoice verification requests.',
      blueTitle: 'Simulation & Coaching (Defender Lens)',
      blueText: 'Simulated safe sandbox delivery, captured telemetry (opens, clicks, reports), and provided constructive coaching ledgers and DMARC enforcement guides.'
    },
    limits: [
      'Sandbox mode: Public demo runs in safe sandbox mode with sample data; no real emails are sent.',
      'Passive recon only: PhishRecon uses non-intrusive DNS and WHOIS lookups; it is not an intrusive scanner.',
      'Honest metrics: No claims about user counts, enterprise customers, or revenue.'
    ]
  },

  sent: {
    id: 'sent',
    title: 'SentinelFlow',
    oneLine: 'Early idea, still growing.',
    status: 'In progress',
    floorLabel: 'Floor 4 · BUILD',
    url: 'https://github.com/Kavy-Sharma/SentinelFlow',
    diagramType: 'sentinelflow',
    scenariosDetected: [
      'Benign baseline',
      'Port scan',
      'Slow scan',
      'SYN flood',
      'Spoofed SYN flood',
      'UDP flood',
      'ARP spoof',
      'SSH brute force',
      'Distributed slow scan',
      'Flash crowd'
    ],
    scenarioResults: {
      attacksCaught: '8 of 8 attacks caught (100% scenario recall)',
      falseAlarms: '2 false alarms (benign capture and flash crowd)',
      missed: '0 missed attacks',
      precision: '80%',
      recall: '100%'
    },
    weaknessNote: {
      windowRecall: '0.43%',
      windowPrecision: '28.95%',
      detail: 'Window-level (5-second time slices) recall is currently 0.43% with 28.95% precision. While the engine catches entire attack sessions reliably at the scenario level, individual 5-second windows during low-volume or quiet attack phases often mimic normal traffic. This is a documented limitation currently being improved with rolling temporal aggregation and adaptive thresholds.'
    },
    beats: [
      {
        title: 'The problem',
        text: 'Pure signature-based intrusion detection systems miss subtle anomalies, while purely statistical ML models generate confusing black-box alerts with high false positive rates.'
      },
      {
        title: 'The idea',
        text: 'A hybrid command-line evaluation pipeline (sentinelflow.cli evaluate, hybrid mode) that combines deterministic heuristic signatures with an unsupervised Isolation Forest trained strictly on benign baseline network traffic.'
      },
      {
        title: 'What I built',
        text: 'Python 3.11 NIDS engine with offline PCAP parsing, bidirectional flow feature extraction, heuristic signatures, Isolation Forest model, and a terminal evaluation summary.'
      },
      {
        title: 'What I learned',
        text: 'Scenario-level detection is strong (8 of 8 attacks caught, 0 missed), but window-level granularity (5-second windows) requires temporal window memory to catch sparse or distributed packets.'
      },
      {
        title: 'What is next',
        text: 'Add rolling temporal window aggregation to raise window-level recall from 0.43%, and integrate live capture via AF_PACKET / eBPF.'
      }
    ],
    breakFix: {
      redTitle: 'Evasion & Floods (Attacker Lens)',
      redText: 'Executed slow distributed SYN port scans and randomized TCP/UDP floods to stay below naive volume thresholds.',
      blueTitle: 'Hybrid Fusion (Defender Lens)',
      blueText: 'Correlated heuristic signature hits with statistical z-score flow anomalies, escalating alert priority with MITRE ATT&CK technique tags.'
    },
    limits: [
      'Early stage: Command-line evaluation pipeline is functional; real-time streaming engine is still growing.',
      'Offline analysis: Evaluates PCAP capture files from CLI rather than live Gigabit wire speeds.',
      'Documented weakness: 5-second window-level recall is 0.43% (being actively improved).'
    ]
  },

  ps: {
    id: 'ps',
    title: 'PortSwigger Academy',
    oneLine: '__LABS__ labs solved so far. Keeps growing.',
    status: 'Proof',
    floorLabel: 'Floor 2 \u00b7 PROVE',
    url: 'https://portswigger.net',
    diagramType: 'portswigger',
    isProof: true,
    summary: 'PortSwigger Web Security Academy practical lab curriculum solved across Apprentice, Practitioner, and Expert tiers.',
    proofDetails: [
      { label: 'Tools', value: 'Burp Suite Professional (Repeater, Intruder, Match & Replace, Collaborator)' },
      { label: 'Topics', value: 'SQL injection, blind SQLi, XSS, CSRF, SSRF, IDOR, path traversal, file upload, business logic, race conditions' },
      { label: 'Verification', value: 'Solved within official PortSwigger Academy interactive training curriculum.' }
    ],
    limits: [
      'Lab environment: Completed in simulated PortSwigger lab environments.',
      'Data source: Lab counts read dynamically from data/stats.json.'
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
    isProof: true,
    summary: 'Hands-on offensive security practice across Linux and Windows training machines and CTF rooms.',
    proofDetails: [
      { label: 'Ranking', value: 'Top 8% worldwide \u00b7 Silver League \u00b7 68-day streak' },
      { label: 'Write-ups', value: 'Basic Pentesting, RootMe, Kenobi, Meow, Fawn, Dancing' },
      { label: 'Skills', value: 'Network reconnaissance, service enumeration, initial access, Linux privilege escalation' }
    ],
    limits: [
      'Platform: Completed on TryHackMe educational lab network.',
      'Data source: Ranking and streak read dynamically from data/stats.json.'
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
    isProof: true,
    summary: 'Competed solo in Sea of Secrets CTF and certified in AI Security fundamentals.',
    proofDetails: [
      { label: 'Competition', value: 'Sea of Secrets CTF (HackItUp, Oct 2026) \u00b7 Solo rank under 150 of 2,500' },
      { label: 'Certification', value: 'Introduction to AI Security (AI Security University, Sep 2026)' },
      { label: 'Focus', value: 'Web security, cryptographic challenges, LLM prompt injection defenses, model guardrails' }
    ],
    limits: [
      'Solo participation: Sea of Secrets rank achieved as an individual competitor.',
      'Verification: Certificate issued by AI Security University.'
    ]
  },

  td: {
    id: 'td',
    title: 'TechDefence',
    oneLine: 'VAPT intern. Network and web testing.',
    status: 'Internship',
    floorLabel: 'Floor 1 \u00b7 WORK',
    url: '',
    diagramType: 'techdefence',
    isWork: true,
    role: 'VAPT Intern',
    dates: 'Jun\u2013Jul 2026',
    location: 'Ahmedabad, Gujarat',
    tools: ['Nessus', 'Nmap', 'Burp Suite', 'Kali Linux'],
    honestLine: 'VAPT intern, TechDefence (Jun-Jul 2026). Worked on network VAPT with Nessus and Nmap, firewall configuration reviews (FortiGate and MikroTik, against CIS-style checklists), network architecture reviews, CIS configuration reviews and web application testing. Wrote the technical reports and handled client communication. Clients in finance, startups and other sectors. Details are confidential.',
    workSamples: [],
    limits: [
      'Confidentiality: Client names, network targets, and vulnerability reports are strictly confidential.',
      'Dates: Internship completed Jun\u2013Jul 2026.'
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
    isWork: true,
    role: 'Project Intern',
    dates: 'Jun\u2013Jul 2025',
    location: 'Jodhpur, Rajasthan',
    tools: ['MATLAB'],
    honestLine: 'Built MATLAB UAV flight-path simulations with monitoring logic that flags routes entering restricted zones.',
    workSamples: [],
    limits: [
      'Confidentiality: Defense project specifics and flight algorithms are confidential.',
      'Dates: Project internship completed Jun\u2013Jul 2025.'
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
