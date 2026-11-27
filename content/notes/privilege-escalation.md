---
title: "Privilege Escalation"
symbol: "PE"
category: "Access"
readTime: 2
tldr: "A normal user bypasses access controls to gain administrative power or reach another user's level."
red: "Tamper with role parameters, manipulate session cookies, or abuse misconfigured server permissions to act as an admin."
blue: "Enforce role-based access control (RBAC) on the server for every endpoint and apply least privilege everywhere."
next: "header-tricks"
---

### What is Privilege Escalation?
Privilege escalation occurs when an attacker obtains permissions that were never intended for their account level. It comes in two primary forms:
- **Horizontal**: Accessing resources that belong to another user with the exact same privilege tier (e.g. user A reading user B's messages).
- **Vertical**: Jumping from a low-privilege tier (e.g. guest or student) to a high-privilege tier (e.g. administrator or root).

### How it looks in practice
In web applications, vertical privilege escalation often happens when developers trust user-supplied profile data during account updates:

```http
POST /api/user/update HTTP/1.1
Host: target.local
Content-Type: application/json

{
  "username": "kavy",
  "email": "kavy@mail.local",
  "role": "admin"
}
```

If the backend blindly unpacks the JSON object into the user model without a parameter allowlist (mass assignment), the user's role is updated to `admin` in the database.

In Linux operating systems, privilege escalation frequently happens through misconfigured SUID binaries or overly permissive `sudo` rights:

```bash
# Check binaries running with root privileges
find / -perm -4000 2>/dev/null
```

If a standard binary like `/usr/bin/python` or `/usr/bin/find` has the SUID bit set, a standard shell user can immediately spawn a root shell.

### Key takeaways
1. **Never trust client-submitted roles**: The client should never dictate its own authorization level. Role assignment must only happen through dedicated, restricted administrative APIs.
2. **Deny by default**: When a new API route or admin panel is deployed, access should be blocked by default unless explicitly granted to verified admin roles.
3. **Audit operating system permissions**: Regularly review `sudoers` files and SUID bits to ensure binaries do not give unprivileged users a route to root.
