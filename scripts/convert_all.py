import os
import re
import json
import zipfile
import xml.etree.ElementTree as ET

NS = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

def sanitize_text(text):
    # Standardize loopback
    text = re.sub(r'\b127\.0\.0\.1\b', '127.0.0.1', text)
    # Public DNS
    text = re.sub(r'\b8\.8\.8\.8\b', '<dns-resolver>', text)
    # Private / test IP ranges
    text = re.sub(r'\b(?:192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.0\.0\.\d{1,3}|2\.1\.1\.\d{1,3})\b', '<target-ip>', text)
    # Remove MD5 tokens / flags
    text = re.sub(r'token=[a-f0-9]{32,}', 'token=<token-redacted>', text)
    text = re.sub(r'\b[a-f0-9]{32}\b', '<hash-redacted>', text)
    # Redact passwords in walkthroughs and notes
    text = re.sub(r'(?i)(password[:=]\s*)([^\s,]+)', r'\1<redacted>', text)
    return text

def detect_code_lang(clean_text):
    clean = clean_text.strip('*_` ')
    if re.match(r'^(?:curl|nmap|nc|telnet|ftp|smbclient|cat|ls|get|ping|sudo|chmod|find|grep|ssh|whoami|id|cd|python)\b', clean, re.IGNORECASE):
        return 'bash'
    if re.match(r'^(?:SELECT|INSERT|UPDATE|DELETE|UNION|ORDER BY|\' OR \'1\'=\'1|1 OR 1=1|\‘ OR \‘1\’=\‘1)\b', clean, re.IGNORECASE):
        return 'sql'
    if re.match(r'^(?:\{\{.*?\}\}|\$\{.*?\}|\<\%=.*?\%\>|#\{.*?\})', clean):
        return 'text'
    return None

def parse_docx(docx_path, img_prefix=''):
    with zipfile.ZipFile(docx_path) as z:
        rels = {}
        try:
            rels_tree = ET.fromstring(z.read('word/_rels/document.xml.rels'))
            for r in rels_tree:
                rels[r.attrib['Id']] = r.attrib['Target']
        except Exception:
            pass

        # Extract media files
        for item in z.namelist():
            if item.startswith('word/media/'):
                fname = os.path.basename(item)
                out_path = os.path.join('content/notes/images', f'{img_prefix}-{fname}')
                with open(out_path, 'wb') as f:
                    f.write(z.read(item))

        tree = ET.fromstring(z.read('word/document.xml'))
        body = tree.find('.//w:body', NS)
        if body is None:
            return ''

        md_lines = []

        for elem in body:
            if elem.tag.endswith('p'):
                pPr = elem.find('w:pPr', NS)
                style = ''
                is_list = False
                if pPr is not None:
                    pStyle = pPr.find('w:pStyle', NS)
                    if pStyle is not None:
                        style = pStyle.attrib.get(f'{{{NS["w"]}}}val', '')
                    numPr = pPr.find('w:numPr', NS)
                    if numPr is not None:
                        is_list = True

                runs_text = []
                for r in elem.findall('w:r', NS):
                    t_nodes = r.findall('w:t', NS)
                    r_text = ''.join([t.text for t in t_nodes if t.text])
                    rPr = r.find('w:rPr', NS)
                    if rPr is not None:
                        b = rPr.find('w:b', NS) is not None
                        i = rPr.find('w:i', NS) is not None
                        if b and r_text.strip():
                            r_text = f'**{r_text}**'
                        elif i and r_text.strip():
                            r_text = f'*{r_text}*'
                    runs_text.append(r_text)

                text = ''.join(runs_text).strip()
                text = sanitize_text(text)

                # Check blip (images)
                blips = elem.findall('.//a:blip', NS)
                img_md = []
                for b in blips:
                    embed_id = b.attrib.get(f'{{{NS["r"]}}}embed')
                    if embed_id and embed_id in rels:
                        target = os.path.basename(rels[embed_id])
                        if not target.endswith('.gif'):
                            img_md.append(f'\n![Evidence: {img_prefix}]({img_prefix}-{target})\n')

                if img_md:
                    md_lines.extend(img_md)

                if not text:
                    continue

                # Heading detection
                if style.startswith('Heading1') or style == 'Title':
                    md_lines.append(f'\n# {text}\n')
                elif style.startswith('Heading2'):
                    md_lines.append(f'\n## {text}\n')
                elif style.startswith('Heading3'):
                    md_lines.append(f'\n### {text}\n')
                elif is_list or style == 'ListParagraph':
                    # Check if list item contains a command
                    clean = text.strip('*_` ')
                    lang = detect_code_lang(clean)
                    if lang:
                        md_lines.append(f'\n```{lang}\n{clean}\n```\n')
                    else:
                        md_lines.append(f'- {text}')
                else:
                    clean = text.strip('*_` ')
                    lang = detect_code_lang(clean)
                    if lang and len(clean) > 3:
                        md_lines.append(f'\n```{lang}\n{clean}\n```\n')
                    elif len(text) < 45 and text.isupper() and not text.startswith('HTTP') and not text.startswith('GET') and not text.startswith('POST') and not text.startswith('UNION'):
                        md_lines.append(f'\n## {text.title()}\n')
                    else:
                        md_lines.append(f'{text}\n')

            elif elem.tag.endswith('tbl'):
                rows = elem.findall('w:tr', NS)
                table_md = []
                col_count = 0
                for r_idx, r in enumerate(rows):
                    cells = r.findall('w:tc', NS)
                    if r_idx == 0:
                        col_count = len(cells)
                    cell_texts = []
                    for c in cells:
                        c_paras = []
                        for p in c.findall('w:p', NS):
                            t = ''.join([node.text for node in p.iter(f'{{{NS["w"]}}}t') if node.text])
                            if t.strip():
                                c_paras.append(sanitize_text(t.strip()))
                        cell_texts.append(' '.join(c_paras).replace('|', '\\|'))
                    row_line = '| ' + ' | '.join(cell_texts) + ' |'
                    table_md.append(row_line)
                    if r_idx == 0:
                        sep = '| ' + ' | '.join(['---'] * col_count) + ' |'
                        table_md.append(sep)
                if table_md:
                    md_lines.append('\n' + '\n'.join(table_md) + '\n')

        return '\n'.join(md_lines)

# Process notes
os.makedirs('content/notes/images', exist_ok=True)
os.makedirs('data', exist_ok=True)

notes_meta = [
    {
        'file': 'Network Ports.docx',
        'slug': 'network-ports',
        'title': 'Network Ports and Service Enumeration',
        'date': '2026-02-17',
        'category': 'Networking',
        'tags': ['Networking', 'Reconnaissance', 'Ports', 'Protocols'],
        'owasp': ['A05:2021-Security Misconfiguration'],
        'img_prefix': 'network-ports',
        'red': 'I probed target ports to map exposed daemons, banner versions, and unauthenticated network services.',
        'blue': 'I closed unneeded ports, bound sensitive services to localhost, and enforced strict firewall rules.',
        'summary': 'Deep dive into TCP/UDP ports, transport protocol mechanics, common service vulnerabilities (FTP, SSH, Telnet, HTTP, DNS, SMTP), and manual reconnaissance methods.'
    },
    {
        'file': 'OWASP - Top 10.docx',
        'slug': 'owasp-top-10',
        'title': 'OWASP Top 10 Web Application Vulnerabilities',
        'date': '2026-02-20',
        'category': 'Web Security',
        'tags': ['Web Security', 'OWASP Top 10', 'VAPT', 'SQLi', 'XSS', 'CSRF', 'SSTI', 'SSRF'],
        'owasp': [
            'A01:2021-Broken Access Control',
            'A02:2021-Cryptographic Failures',
            'A03:2021-Injection',
            'A04:2021-Insecure Design',
            'A05:2021-Security Misconfiguration',
            'A06:2021-Vulnerable and Outdated Components',
            'A07:2021-Identification and Authentication Failures',
            'A08:2021-Software and Data Integrity Failures',
            'A09:2021-Security Logging and Monitoring Failures',
            'A10:2021-Server-Side Request Forgery'
        ],
        'img_prefix': 'owasp-top-10',
        'red': 'I manipulated parameters, bypassed access controls, and injected SQL and command payloads into web applications.',
        'blue': 'I enforced server-side authorization checks, parameterized database queries, and validated all user inputs.',
        'summary': 'Comprehensive analysis of the OWASP Top 10 security risks: Broken Access Control, Cryptographic Failures, SQL and Command Injection, SSRF, SSTI, and defensive mitigations.'
    },
    {
        'file': 'HTB_Learnings.docx',
        'slug': 'htb-learnings',
        'title': 'Hack The Box Starting Point: Core Vulnerability Concepts',
        'date': '2026-01-27',
        'category': 'VAPT Walkthroughs',
        'tags': ['HTB', 'Starting Point', 'Enumeration', 'Telnet', 'FTP', 'SMB'],
        'owasp': ['A05:2021-Security Misconfiguration', 'A07:2021-Identification and Authentication Failures'],
        'img_prefix': 'htb-learnings',
        'red': 'I surveyed target systems for default credentials, unauthenticated FTP, and unprotected SMB file shares.',
        'blue': 'I disabled plaintext protocols, enforced robust authentication, and restricted network share access.',
        'summary': 'Key operational lessons learned from HTB Starting Point machines Meow, Fawn, and Dancing: the dangers of default accounts, unauthenticated services, and open SMB shares.'
    },
    {
        'file': 'HTB_Walkthroughs.docx',
        'slug': 'htb-walkthroughs',
        'title': 'Hack The Box Starting Point: Tier 0 Walkthroughs',
        'date': '2026-01-26',
        'category': 'VAPT Walkthroughs',
        'tags': ['HTB', 'Meow', 'Fawn', 'Dancing', 'Telnet', 'FTP', 'smbclient'],
        'owasp': ['A05:2021-Security Misconfiguration', 'A07:2021-Identification and Authentication Failures'],
        'img_prefix': 'htb-walkthroughs',
        'red': 'I connected to misconfigured targets with default usernames and anonymous SMB shares to retrieve challenge flags.',
        'blue': 'I removed default credentials, required authentication for SMB shares, and restricted root logins.',
        'summary': 'Step-by-step technical walkthroughs for Hack The Box Tier 0 machines: Meow (Telnet enumeration), Fawn (anonymous FTP exploitation), and Dancing (SMB share enumeration).'
    },
    {
        'file': 'THM_Machines.docx',
        'slug': 'thm-machines',
        'title': 'TryHackMe Machines: Basic Pentesting, RootMe & Kenobi',
        'date': '2026-02-12',
        'category': 'VAPT Walkthroughs',
        'tags': ['TryHackMe', 'Basic Pentesting', 'RootMe', 'Kenobi', 'Webshell', 'SUID Privesc'],
        'owasp': ['A01:2021-Broken Access Control', 'A05:2021-Security Misconfiguration'],
        'img_prefix': 'thm-machines',
        'red': 'I found hidden web endpoints, uploaded webshells through weak filters, and exploited misconfigured SUID binaries for root.',
        'blue': 'I validated uploaded file extensions, sanitized server paths, and stripped unnecessary SUID bits from host binaries.',
        'summary': 'Detailed analysis of three TryHackMe machine pathways: service enumeration on Basic Pentesting, webshell deployment on RootMe, and multi-service chaining with SUID privilege escalation on Kenobi.'
    }
]

converted_notes_list = []

for n in notes_meta:
    src_path = os.path.join('project-notes', n['file'])
    print(f"Parsing {src_path}...")
    body_md = parse_docx(src_path, n['img_prefix'])
    out_md_path = os.path.join('content/notes', f"{n['slug']}.md")

    # Count words and estimate read time
    words = len(re.findall(r'\w+', body_md))
    reading_time = max(1, round(words / 200))

    frontmatter = f"""---
title: "{n['title']}"
slug: "{n['slug']}"
date: "{n['date']}"
category: "{n['category']}"
tags: {json.dumps(n['tags'])}
owasp: {json.dumps(n['owasp'])}
red: "{n['red']}"
blue: "{n['blue']}"
summary: "{n['summary']}"
wordCount: {words}
readingTimeMinutes: {reading_time}
---

"""
    full_content = frontmatter + body_md
    with open(out_md_path, 'w', encoding='utf-8') as f:
        f.write(full_content)
    print(f"Wrote {out_md_path} ({words} words, ~{reading_time} min)")

    converted_notes_list.append({
        'slug': n['slug'],
        'title': n['title'],
        'date': n['date'],
        'category': n['category'],
        'tags': n['tags'],
        'owasp': n['owasp'],
        'red': n['red'],
        'blue': n['blue'],
        'summary': n['summary'],
        'wordCount': words,
        'readingTimeMinutes': reading_time
    })

# Now build site.json strictly from facts.md and notes
site_data = {
    "person": {
        "name": "Kavy Sharma",
        "location": "Jodhpur",
        "education": "B.E. Electronics & Computer Engineering, MBM University, 2023-2027",
        "goal": "Internship and full-time roles in VAPT and AI security",
        "email": "kavysharma196@gmail.com",
        "linkedin": "https://linkedin.com/in/kavysharma",
        "github": "https://github.com/Kavy-Sharma",
        "tryhackme": "https://tryhackme.com/p/kavysharma196",
        "hero_headline": "I find the way in. Then I close it.",
        "hero_sentence": "Security researcher and engineer focusing on VAPT and AI security since mid-2025. I build tools to understand attack paths and verify defenses with verifiable evidence."
    },
    "journey": [
        {
            "chapter": 1,
            "title": "Networking and ports",
            "description": "Understanding network protocols, listening daemons, packet flows, and port reconnaissance through hands-on testing."
        },
        {
            "chapter": 2,
            "title": "First machines",
            "description": "Enumerating exposed services and weak configurations on Hack The Box (Meow, Fawn, Dancing) and TryHackMe (Basic Pentesting, RootMe, Kenobi)."
        },
        {
            "chapter": 3,
            "title": "Web security",
            "description": "Deep study of OWASP Top 10 vulnerabilities, web application testing, and hands-on PortSwigger Web Security Academy labs."
        },
        {
            "chapter": 4,
            "title": "Building tools",
            "description": "Developing security tooling: PhishSim AI for awareness testing, SentinelFlow for hybrid intrusion detection, and AegisAgent for AI action security."
        },
        {
            "chapter": 5,
            "title": "Real work and proof",
            "description": "Applying skills to research internships, competitive CTF challenges, client testing engagements, and hardware WAF home labs."
        }
    ],
    "experience": [
        {
            "role": "Cybersecurity Intern",
            "organization": "DRDO",
            "period": "Jun-Jul 2025",
            "type": "Research & Defense",
            "details": "Conducted defense security research and technical analysis in government defense laboratory."
        },
        {
            "role": "Security Testing Intern",
            "organization": "TechDefence",
            "period": "Jun-Jul 2026",
            "type": "VAPT & Security Assessment",
            "details": "Hands-on vulnerability assessment and penetration testing across web and application targets."
        }
    ],
    "projects": [
        {
            "id": "phishsim",
            "name": "PhishSim AI",
            "subtitle": "Autonomous Agentic Phishing Simulator & Security Awareness Platform",
            "status": "Live Demo (Sandbox Mode)",
            "live_url": "https://phishsim-ai.onrender.com",
            "github_url": "https://github.com/Kavy-Sharma/phishsim-ai",
            "stack": ["Python", "Flask", "MySQL", "OpenRouter LLMs", "Vanilla CSS"],
            "red": "I simulated targeted credential harvesting emails to test whether users catch suspicious senders and report them.",
            "blue": "I enforced strict SPF and DMARC policies, configured passive lookalike domain monitoring, and gave employees an instant reporting button.",
            "description": "Agentic email simulation engine with passive attack-surface auditing (PhishRecon) and dynamic executive risk briefings. The public demo runs in a sandbox mode without outbound email dispatch.",
            "limits": "Public demo operates in sandbox mode without live email delivery. Full generation engine is private.",
            "demo_type": "attack_replay"
        },
        {
            "id": "aegis",
            "name": "AegisAgent",
            "subtitle": "Action-Layer Security Gateway for Local AI Agents & Smart Hardware",
            "status": "Working Hardware Integration",
            "live_url": None,
            "github_url": "https://github.com/Kavy-Sharma/AegisAgent",
            "stack": ["Python", "Ollama", "ESP32", "MQTT", "Vanilla CSS"],
            "red": "I sent prompt injections, role-spoofs, and encoded payloads to trick the AI agent into executing restricted tool actions.",
            "blue": "I locked intent scopes before the model runs, validated tool arguments against strict schemas, and required human operator approval for dangerous actions.",
            "description": "Security gateway interposing between local LLMs (Ollama) and device tools. Implements a 9-gate defense pipeline: injection detection, intent locking, RBAC, parameter guards, rate limiting, human approval, hardware bridging with physical Red Attack Blocked LED, output scanning, and SHA-256 audit chaining.",
            "limits": "Parameter guard uses declarative keyword and allowlist checks rather than a full SQL AST parser. Intent lock can block valid paraphrased requests. Local network web and MQTT traffic is unencrypted.",
            "demo_type": "prompt_pipeline"
        },
        {
            "id": "sentinelflow",
            "name": "SentinelFlow",
            "subtitle": "Explainable Hybrid Network Intrusion Detection System",
            "status": "Completed Engine & Streamlit Dashboard",
            "live_url": None,
            "github_url": "https://github.com/Kavy-Sharma/SentinelFlow",
            "stack": ["Python 3.11", "Scapy", "Scikit-learn", "Typer", "Streamlit"],
            "red": "I replayed port scans, SYN floods, and ARP poisoning captures to evaluate how stealthy attacks slip past standard filters.",
            "blue": "I paired deterministic heuristic rules with an unsupervised Isolation Forest baseline to flag traffic anomalies and map MITRE ATT&CK techniques.",
            "description": "Hybrid NIDS designed for network security triage and offline PCAP analysis. Pairs deterministic heuristic detection (port scans, SYN floods, SSH brute force, ARP spoofing) with an unsupervised Isolation Forest baseline trained on benign traffic, providing ranked feature deviations and incident reports.",
            "limits": "Designed for offline PCAP packet ingestion and time-windowed triage. Requires labeled baseline captures for Isolation Forest threshold calibration.",
            "demo_type": "packet_stream"
        },
        {
            "id": "safeline",
            "name": "SafeLine WAF Lab",
            "subtitle": "Web Application Firewall & Vulnerability Testbed",
            "status": "In progress",
            "live_url": None,
            "github_url": None,
            "stack": ["VirtualBox", "Kali Linux", "Ubuntu Server", "SafeLine WAF", "DVWA", "TLS"],
            "red": "I mapped direct backend routes to vulnerable DVWA targets to verify application exposure before applying firewall protections.",
            "blue": "I routed web traffic through SafeLine WAF with TLS termination to inspect incoming requests before they hit backend services.",
            "description": "Cybersecurity home lab built with VirtualBox, Kali Linux, Ubuntu Server, DVWA, and SafeLine WAF. Completed setup: Kali and Ubuntu VMs, DVWA database, local DNS resolution, self-signed SSL certificate, SafeLine installation, and verified HTTPS reverse proxy routing. Attack and block tests have not yet been conducted.",
            "limits": "Setup is in progress. The reverse proxy route is established, but attack tests and block verifications are pending. SafeLine has not yet blocked requests in this lab.",
            "demo_type": "lab_diagram"
        }
    ],
    "notes": converted_notes_list
}

with open('content/site.json', 'w', encoding='utf-8') as f:
    json.dump(site_data, f, indent=2)

print("Wrote content/site.json successfully!")
