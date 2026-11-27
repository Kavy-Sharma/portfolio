---
title: "TCP vs UDP"
symbol: "Tu"
category: "Network"
readTime: 2
tldr: "TCP guarantees reliable delivery with a 3-way handshake; UDP prioritizes raw speed without connection state."
red: "Abuse connectionless UDP services for spoofed reflection DDoS attacks, or exhaust TCP state tables with SYN floods."
blue: "Deploy SYN cookies for TCP services, rate-limit UDP amplification ports, and enforce stateful firewall inspection."
next: "nmap-scripts"
---

### The Two Pillars of Transport
At Layer 4 of the OSI model, TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) dictate how packets travel across networks. Understanding the architectural differences between them is essential for network reconnaissance and penetration testing.

### TCP: Reliable & Connection-Oriented
TCP establishes a verified connection before transmitting any user data. It uses a **3-Way Handshake**:

```
Client                     Server
  | ----- SYN (seq=x) ----> |  "Can we talk?"
  | <--- SYN-ACK (ack=x+1) -|  "Yes, I hear you."
  | ----- ACK (ack=y+1) --->|  "Great, let's begin."
```

- **Features**: Ordered delivery, error checking, retransmission of lost packets, and flow control.
- **Common protocols**: HTTP/HTTPS (80/443), SSH (22), FTP (21), SMTP (25).
- **Security implication**: Because the server allocates memory for half-open connections during the handshake, attackers can launch **SYN Flood** attacks, exhausting the server's connection backlog table.

### UDP: Fast & Connectionless
UDP does not establish a handshake, track connection state, or verify delivery. It simply sends datagrams directly to the destination address:
- **Features**: Low latency, minimal overhead, no retransmissions.
- **Common protocols**: DNS (53), DHCP (67/68), SNMP (161), streaming media, VoIP.
- **Security implication**: Because UDP does not verify source IP addresses, attackers can easily spoof the sender IP. In **Amplification DDoS attacks**, attackers send tiny requests with a spoofed target IP to open DNS or NTP servers, causing the servers to flood the victim with large responses.

### Key takeaways
1. **TCP port scanning** (like `nmap -sT` or `-sS`) looks for SYN-ACK responses to identify open services.
2. **UDP port scanning** (like `nmap -sU`) is much slower because open ports often do not respond at all unless queried with application-specific probes.
