---
title: "Header Tricks & Reverse Proxy Bypasses"
symbol: "HT"
category: "Access"
readTime: 2
tldr: "Injecting spoofed HTTP headers fools front-end proxies into believing requests come from localhost."
red: "Send fake headers like X-Forwarded-For or X-Original-URL to bypass IP restrictions and access hidden panels."
blue: "Configure front-end proxies to strip client-supplied headers and enforce authorization at the application layer."
next: "sql-injection"
---

### What are Header Tricks?
Modern web architectures place a reverse proxy, load balancer, or Web Application Firewall (WAF) in front of the actual application server. The proxy inspects the traffic and forwards legitimate requests to the backend.

During this process, proxies often append custom HTTP headers to tell the backend about the original client, such as `X-Forwarded-For` or `X-Real-IP`. If the backend blindly trusts these headers without verifying they came from a trusted proxy, an attacker can forge them directly.

### How it looks in practice
Consider an administrative panel at `/admin` that only allows connections from the local machine (`127.0.0.1`). When accessed externally, the server responds with:

```http
HTTP/1.1 403 Forbidden
Content-Type: text/plain

Access denied: Admin panel only accessible from localhost.
```

An attacker intercepts the request in Burp Suite and adds custom headers claiming the request originated from the server itself:

```http
GET /admin HTTP/1.1
Host: internal.portal
X-Forwarded-For: 127.0.0.1
X-Originating-IP: 127.0.0.1
X-Remote-IP: 127.0.0.1
```

If the backend framework checks `request.headers['X-Forwarded-For']` before checking the physical socket IP, it assumes the request is local and serves the administrative dashboard.

Another common trick involves URL override headers:
```http
GET / HTTP/1.1
Host: target.local
X-Original-URL: /admin/users
```
The front-end proxy sees a benign request to `/` and lets it pass. The backend reads `X-Original-URL`, executes the admin endpoint, and bypasses the proxy's path rules.

### How to defend against it
1. **Strip untrusted headers**: The ingress reverse proxy must explicitly strip or overwrite all `X-Forwarded-*` headers coming from external clients.
2. **Never rely on headers for authentication**: Use robust session tokens and mutual TLS rather than IP-based allowlists for sensitive administrative routes.
