---
title: "Hack The Box: Meow"
symbol: "Me"
category: "Machines"
readTime: 2
tldr: "Scanning for open ports, finding unencrypted Telnet, and logging in as root without a password."
red: "Scan for port 23, connect with telnet, test default system usernames, and claim root without entering a password."
blue: "Decommission Telnet, enforce SSH with key-based authentication, and ensure default accounts require passwords."
next: "fawn"
---

### Machine Overview
Meow is the introductory machine in Hack The Box's Starting Point Tier 0. It demonstrates basic network scanning and the danger of running unencrypted legacy protocols with blank administrative credentials.

### Step 1: Port Scanning
We begin with an Nmap scan to discover what services are listening:
```bash
nmap -sV <target_ip>
```
The scan identifies a single open port:
```
PORT   STATE SERVICE VERSION
23/tcp open  telnet  Linux telnetd
```
Port 23 runs Telnet—a legacy, unencrypted remote terminal protocol.

### Step 2: Testing Default Usernames
Because Telnet does not use key pairs or cryptographic handshakes, we connect directly using the Telnet client:
```bash
telnet <target_ip> 23
```
The server responds with an operational banner:
```
Meow login:
```

When approaching a system with an unknown password, penetration testers always test default administrative usernames:
- `admin`
- `administrator`
- `guest`
- `root`

We enter `root` at the prompt and press Enter.

### Step 3: Gaining Root Access
The system does not prompt for a password and immediately drops into an interactive root terminal:
```
Linux meow 5.4.0-77-generic #86-Ubuntu SMP
root@meow:~# whoami
root
```

We list files in the root directory and inspect the challenge flag:
```bash
ls -la
cat flag.txt
```
The challenge flag is retrieved, and the machine is completed.

### Key takeaway
- **Default accounts must have strong passwords**: Never deploy Linux or Windows systems with blank root or administrative passwords.
- **Telnet should never be exposed**: Plaintext protocols allow eavesdropping and lack modern brute-force protection. Always use encrypted SSH with key-based authentication.
- **Audit listening sockets**: Regularly verify open ports to prevent forgotten legacy daemons from exposing root consoles.
