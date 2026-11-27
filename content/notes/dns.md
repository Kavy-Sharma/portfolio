---
title: "DNS (Domain Name System)"
symbol: "Dn"
category: "Network"
readTime: 2
tldr: "The internet's phone book running on port 53; misconfigured zone transfers expose internal network topology."
red: "Perform DNS zone transfers (AXFR) to dump all registered subdomains, IP ranges, and internal hostnames."
blue: "Restrict AXFR zone transfers to authorized secondary nameservers only and monitor DNS queries."
next: "proxychains"
---

### What is DNS?
The Domain Name System (DNS) operates on port 53 (using UDP for standard queries and TCP for large responses and zone transfers). It translates human-readable domain names (like `target.local`) into machine-routable IP addresses.

During the reconnaissance phase of a security assessment, DNS enumeration reveals internal subdomains, mail servers, staging environments, and administrative panels.

### Core DNS record types
- **A**: Maps a domain name to an IPv4 address.
- **AAAA**: Maps a domain name to an IPv6 address.
- **MX**: Identifies mail exchange servers.
- **TXT**: Holds verification tokens, SPF, and DMARC email security records.
- **NS**: Identifies authoritative nameservers for the zone.

### The AXFR Zone Transfer vulnerability
In large networks, primary nameservers replicate their complete record database to secondary nameservers using an **AXFR (Asynchronous Full Transfer Zone)** operation.

If the administrator fails to restrict who can request a zone transfer, any external client can ask the nameserver to dump its entire database:

```bash
dig axfr @<target_ip> target.local
```

If the transfer succeeds, the nameserver responds with every single record:
```
target.local.       IN SOA  ns1.target.local.
mail.target.local.  IN A    10.0.2.15
dev.target.local.   IN A    10.0.2.22
vpn.target.local.   IN A    10.0.2.50
admin.target.local. IN A    10.0.2.99
```
In one command, the attacker discovers the organization's private development server, VPN gateway, and internal admin portal.

### How to defend against it
1. **Restrict zone transfers**: In BIND configuration (`named.conf`), explicitly restrict zone transfers to known secondary IP addresses:
   ```ini
   allow-transfer { 10.0.1.5; };
   ```
2. **Audit external records**: Ensure development or staging subdomains are not published in public DNS zones.
