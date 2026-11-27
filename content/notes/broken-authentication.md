---
title: "Broken Authentication"
symbol: "Ba"
category: "Auth"
readTime: 2
tldr: "Flaws in login flows, session handling, or credential storage allow attackers to hijack user accounts."
red: "Brute-force weak credentials, exploit uninvalidated session tokens, or bypass password reset verification."
blue: "Enforce rate limiting, require multi-factor authentication, hash passwords with Argon2, and regenerate session IDs on login."
next: "csrf"
---

### What is Broken Authentication?
Broken Authentication refers to vulnerabilities in how an application verifies user identity and manages active sessions. When authentication mechanisms are poorly implemented, attackers can compromise passwords, session tokens, or user accounts, gaining the ability to impersonate legitimate users.

### Common authentication weaknesses

#### 1. Credential Stuffing & Brute Force
If a login form lacks rate limiting or account lockout controls, an attacker can use tools like Hydra or Burp Intruder to test thousands of username and password combinations against the endpoint.

#### 2. Session Fixation
When a user visits a site before logging in, they receive an anonymous session ID. If the application continues using that exact same session ID after the user successfully logs in, an attacker who previously knew that ID inherits the authenticated session.

#### 3. Predictable Password Reset Tokens
If password reset links use predictable numbers or sequential timestamps:
```http
https://target.local/reset?token=1708459200
```
An attacker can calculate the token generated for an administrator account and reset their password.

### Key takeaways
- **Passwords must never be stored in plain text or MD5**: Always use modern, slow, memory-hard hashing algorithms like Argon2id or bcrypt with appropriate work factors.
- **Session IDs must be unpredictable**: Session tokens must be cryptographically secure random values with sufficient entropy (at least 128 bits).

### How to defend against it
1. **Regenerate session tokens on login**: Always destroy pre-login session cookies and issue a completely fresh session identifier upon successful authentication.
2. **Rate limit sensitive endpoints**: Implement progressive delays, CAPTCHAs, or IP-based rate limiting on `/login` and `/reset-password` endpoints.
3. **Multi-Factor Authentication (MFA)**: Require a secondary verification factor (such as TOTP authenticator apps) for sensitive operations.
