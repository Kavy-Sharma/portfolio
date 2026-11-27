---
title: "Nmap & Scripting Engine (NSE)"
symbol: "Nm"
category: "Network"
readTime: 2
tldr: "Nmap maps open ports and running daemons; NSE scripts automate vulnerability detection and service checks."
red: "Run targeted scripts (-sC, --script vuln) to discover exposed services, default accounts, and known CVEs."
blue: "Scan your own perimeter with Nmap, disable banner disclosure, and restrict scanning visibility with firewalls."
next: "ftp"
---

### What is Nmap?
Nmap (Network Mapper) is the foundational tool for network reconnaissance. It identifies live hosts, open ports, listening service daemons, and operating system fingerprints.

Beyond basic port scanning, Nmap includes the **Nmap Scripting Engine (NSE)**—a powerful Lua-based scripting framework that automates tasks ranging from advanced service enumeration to vulnerability exploitation.

### Essential scanning flags
In everyday penetration testing and lab practice, these flags form the core toolkit:

```bash
# Comprehensive service & OS scan with default scripts
nmap -sC -sV -oN scan_results.txt <target_ip>
```
- `-sS`: Stealth SYN scan. Sends SYN packets and tears down the connection upon receiving SYN-ACK without completing the full handshake.
- `-sV`: Version detection. Probes open ports to determine the exact software banner and version.
- `-sC`: Runs default NSE scripts (equivalent to `--script=default`).
- `-p-`: Scans all 65,535 ports instead of just the top 1,000 common ports.

### Leveraging the Nmap Scripting Engine (NSE)
NSE scripts are grouped into categories such as `auth`, `vuln`, `discovery`, and `safe`.

#### 1. Checking for anonymous FTP
```bash
nmap --script ftp-anon -p 21 <target_ip>
```
If anonymous access is permitted, Nmap logs in and lists the root directory.

#### 2. Scanning for known CVEs
```bash
nmap --script vuln -p 80,443 <target_ip>
```
Nmap tests open web ports against known vulnerability signatures and reports CVE identifiers.

### Key takeaways
- **Scan all ports**: Attackers and administrators often run sensitive services on non-standard ports (e.g. running SSH on port 2222 or HTTP on 8080).
- **Audit your own assets**: Use Nmap regularly to verify that unexpected ports are not inadvertently exposed to the internet.
