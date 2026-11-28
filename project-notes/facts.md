# FACTS - only source of truth. Never add anything not written here or in the notes.

## Person
Kavy Sharma, Jodhpur. B.E. Electronics & Computer Engineering, MBM University, 2023-2027.
Goal: internship and full-time roles in VAPT and AI security.
Email kavysharma196@gmail.com. LinkedIn linkedin.com/in/kavysharma. GitHub github.com/Kavy-Sharma. TryHackMe: https://tryhackme.com/p/kavysharma196
## Journey
Learning and growing, still in progress. Say "since mid-2025" once in the hero. Never show a start month.
Show the journey as chapters by topic, not a dated line: 1 Networking and ports, 2 First machines (HTB Meow, Fawn, Dancing; THM Basic Pentesting, RootMe, Kenobi), 3 Web security (OWASP notes, PortSwigger labs), 4 Building tools, 5 Real work and proof.
Only real dates: DRDO Jun-Jul 2025; TechDefence Jun-Jul 2026; AI Security certificate Sep 2026; CTF Oct 2026 (solo).

## Numbers
Every changing number (PortSwigger labs, THM percent, CTFs, certificates, client tests) lives ONLY in data/stats.json. Never type such a number in site text. Always compute totals and percentages from it and show its "updated" date.

## Projects
PhishSim AI: live https://phishsim-ai.onrender.com, public showcase repo github.com/Kavy-Sharma/phishsim-ai, full engine private. Python, Flask, MySQL, OpenRouter LLMs. Public demo runs in sandbox mode (no live email delivery). No claims about users, revenue or customers.
AegisAgent: github.com/Kavy-Sharma/AegisAgent. Works on real ESP32 hardware. Known limits are in its README; show a short honest "Limits" note.
SentinelFlow: github.com/Kavy-Sharma/SentinelFlow. Details only from its README.
SafeLine WAF lab: IN PROGRESS. Done: Kali + Ubuntu VMs, DVWA, local DNS, self-signed cert, SafeLine, HTTPS reverse proxy through SafeLine verified. NOT done: attack and block tests. Never say SafeLine blocked anything. If the status in the repo changes, follow the repo.

## Never claim
CVEs, bug bounties, critical-finding counts, "production" use, user counts, revenue.

## Voice
First person, curious, direct, short sentences, plain words. No "leverage", "robust", "seamless", "cutting-edge".

## Hardware and media
The AegisAgent ESP32 hardware is currently with my college. No photo or video exists. Use a drawn diagram, never a fake or stock photo. Say "Tested on real ESP32 hardware."
The sandbox on the home page is a simulation with toy rules. It never sends real traffic and is never described as my real engine or as connected to hardware.

## Facts to paste
ESP32 photos exist: door UNLOCKED (green LEDs on), BLOCKED (red LED on), and one photo of laptop + board together while AegisAgent shows a blocked prompt injection. A short video of the buzzer sounding exists (Kavy will supply).
AegisAgent dashboard has pages: Overview (replay of latest decisions through the 9 gates), Console, Aura (voice assistant, "Virtual Home" simulation), Attack Lab, Approvals, Audit Log. It can run with real hardware connected or in simulation mode. Label simulation screenshots as simulation.
PhishSim AI features: own terminal console, mascot "Lure" that stays with the user on every page, Attack Lab (edit an email and see how it looks), tools (PhishRecon, Threat Analyser, Header Analyser, URL Decoder, Password Breach Check), campaign dashboard with team readiness score and weekly risk briefing, AI reports with prevention advice, several email sending modes, scheduling for later, and a "you clicked a simulated phish" learning page that explains what happened and how to prevent it. The public demo is in Sandbox Mode with sample data. No real emails are sent.
SentinelFlow: network attack detector that evaluates PCAP captures from the command line (sentinelflow.cli evaluate, hybrid mode). Tested on 10 scenarios: benign, port scan, slow scan, SYN flood, spoofed SYN flood, UDP flood, ARP spoof, SSH brute force, distributed slow scan, flash crowd. Scenario-level result: 8 true positives, 2 false positives (the benign capture and the flash crowd), 0 missed (precision 80%, recall 100%). Window-level (5 second windows) result is weak: recall 0.43%, precision 28.95%. This is a known limitation being worked on. Do not hide it.
TryHackMe profile shows "Top 8%", Silver league, 68-day highest streak, capability score 45. Use "top 8%" everywhere (site, resume, stats.json). Do not show the join date.
PortSwigger: show as three rings from data/stats.json (31/64 Apprentice, 67/175 Practitioner, 7/40 Expert), NOT as a screenshot.