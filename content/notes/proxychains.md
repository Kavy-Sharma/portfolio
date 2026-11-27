---
title: "Proxychains & Traffic Pivoting"
symbol: "Px"
category: "Network"
readTime: 2
tldr: "Chaining SOCKS proxies to route tool traffic through compromised hosts and reach isolated internal subnets."
red: "Route Nmap or browser traffic through compromised jump hosts to attack hidden internal networks."
blue: "Segment internal networks with strict firewalls and monitor unexpected outbound SOCKS or SSH tunnels."
next: "basic-pentesting"
---

### What is Proxychains?
Proxychains is a UNIX tool that forces any TCP connection initiated by a given program to route through a chain of user-configured SOCKS4, SOCKS5, or HTTP proxies. It uses dynamic hook injection (`LD_PRELOAD`) to intercept socket calls from tools that do not natively support proxying.

In penetration testing and red-teaming, proxychains is essential for **network pivoting**—using a compromised edge host to attack internal machines that cannot be reached directly from the attacker's machine.

### How it works in practice
Imagine you compromise a dual-homed web server with two network interfaces:
- Interface 1: `192.168.1.10` (Public / External).
- Interface 2: `10.0.2.1` (Private internal LAN).

From your attack machine, you cannot directly ping `10.0.2.15`. To bypass this, you set up an SSH dynamic port forward on your machine:

```bash
# Create local SOCKS proxy on port 1080 via compromised host
ssh -D 1080 -N user@192.168.1.10
```

Next, configure `/etc/proxychains.conf`:
```ini
[ProxyList]
# Route traffic through local SOCKS proxy
socks5 127.0.0.1 1080
```

Now prepend `proxychains` to any command. The tool connects through the compromised host:
```bash
proxychains nmap -sT -Pn -p 80,445 10.0.2.15
```
Or launch an internal browser session:
```bash
proxychains firefox http://10.0.2.15:8080
```

### Modes of Proxychains
- **Dynamic Chain**: Tries proxies in order. If one fails, it skips to the next without failing the entire connection.
- **Strict Chain**: All proxies in the list must be active and traversed in exact sequence.
- **Random Chain**: Chooses proxies randomly from the list to spread traffic across multiple egress points.

### How to defend against it
1. **Network micro-segmentation**: Do not let DMZ servers initiate connections into sensitive internal subnets.
2. **Detect SSH tunneling**: Monitor long-lived SSH connections from DMZ servers and inspect abnormal traffic volume.
