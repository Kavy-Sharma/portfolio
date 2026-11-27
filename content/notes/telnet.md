---
title: "Telnet"
symbol: "Tn"
category: "Network"
readTime: 2
tldr: "Ancient unencrypted terminal protocol on port 23; transmits all commands and passwords in clear plaintext."
red: "Sniff unencrypted credentials across network segments or connect directly to exploit unauthenticated root logins."
blue: "Disable Telnet services completely and migrate all remote administration to modern SSH."
next: "dns"
---

### What is Telnet?
Telnet is one of the earliest network terminal protocols, developed in 1969 and assigned port 23. It provides a bidirectional, text-oriented communication facility over TCP connections.

While Telnet was widely used in early computing, it lacks any form of cryptographic security. All keystrokes, commands, usernames, and passwords are transmitted over the network in clear, readable plaintext.

### Why Telnet is dangerous
Anyone on the local network path (or an attacker performing an ARP spoofing attack) can intercept the traffic with Wireshark or tcpdump and read every character typed by the user:

```
Packet bytes:
L o g i n :   a d m i n
P a s s w o r d :   S e c r e t 1 2 3 !
```

### In hands-on testing: HTB Meow
In Hack The Box's introductory machine **Meow**, an Nmap scan reveals port 23 open:
```
PORT   STATE SERVICE VERSION
23/tcp open  telnet  Linux telnetd
```

Connecting to the service:
```bash
telnet <target_ip> 23
```
The server displays a login prompt. By testing default system usernames (`admin`, `administrator`, `root`), the attacker discovers that the `root` user has no password configured. The prompt immediately drops into an unprivileged root shell (`root@meow:~#`).

### How to defend against it
1. **Never use Telnet on modern networks**: There is no valid use case for plaintext Telnet in production systems.
2. **Decommission the service**:
   ```bash
   sudo systemctl stop telnetd
   sudo systemctl disable telnetd
   ```
3. **Migrate to SSH**: Standardize all remote shell access on SSH, which encrypts session data and prevents packet-sniffing attacks.
