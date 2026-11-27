---
title: "TryHackMe Machines: Basic Pentesting, RootMe & Kenobi"
slug: "thm-machines"
date: "2026-02-12"
category: "VAPT Walkthroughs"
tags: ["TryHackMe", "Basic Pentesting", "RootMe", "Kenobi", "Webshell", "SUID Privesc"]
owasp: ["A01:2021-Broken Access Control", "A05:2021-Security Misconfiguration"]
red: "I found hidden web endpoints, uploaded webshells through weak filters, and exploited misconfigured SUID binaries for root."
blue: "I validated uploaded file extensions, sanitized server paths, and stripped unnecessary SUID bits from host binaries."
summary: "Detailed analysis of three TryHackMe machine pathways: service enumeration on Basic Pentesting, webshell deployment on RootMe, and multi-service chaining with SUID privilege escalation on Kenobi."
wordCount: 434
readingTimeMinutes: 2
---

**Machine – 1**

**Basic Pentesting**

**First Look:**

- Multiple services were open (**HTTP, SMB, SSH**).
- So had to decide which one matters.
**Web-Service (HTTP):**

- Checked the website, but nothing useful found.
- It shows web was not the main entry point.
**SMB Service:**

- Since SMB was an open port, enumeration was done to check for shares.
- Found that some SMB shares were accessible without proper authentication.
- From SMB enumeration, valid usernames can be leaked.
**Connection between Services:**

- Usernames from SMB and SSH open
- Authentication based attack becomes possible.
**Access Idea:**


```bash
SSH was exposed.
```

- Credentials were weak.
- That’s why access was possible.
**After login:**

- Once entered, manual directory listing was done to understand the system and check for further information.
**Challenges Faced:**

- Web-service was looking like it will give some useful information but it didn’t.
- Real entry point only became clear after the SMB enumeration.
**Key Learnings:**

- Enumeration is always more important than exploitation.
- Not every open service is useful, identifying the right one always matter.
**Machine – 2**

**RootMe**

**First Thought:**

- Port 80 opened
- Means website is the main entry point here.
- No need to check for other ports now. **(Focusing here first)**
**Website thing I learned:**

- Whatever we see on the home page is not everything
- Websites usually have hidden pages. (Like *admin panels, upload pages etc…..*)
**File upload concept *********:**

- If a website allows file upload : it can be **dangerous****.**
- Because the server might execute an uploaded file, not only store it.
**Web-shell idea ****(****New for me****)****:**

- Webshell: a file that allows running commands on the server.
- Through browser : I can run **linux commands.**
- But getting a shell does not means you gained full control over the system.
- First shell is usually : limited user, **not root.**
**Privilege Escalation Part:**

- After getting the user shell ; Next step is checking the system mistakes.
- Like:
- Any wrong permissions.

```bash
Sudo access.
```

- Writable files.
- System is already weak, we just find those mistakes.
**Machine – 3**

**Kenobi**

**Entry Point:**

- Multiple services were open : **SMB, SSH, FTP.**
- **SMB **allowed reading files.

```bash
FTP **allowed anonymous access.
```

**What happened:**

- **SMB **had a readable share.
- Got internal file path from there.
**This tells that ****the internal file paths should never be exposed publicly.**

**Initial Access:**


```bash
FTP **allowed anonymous login.
```

- So by this, anyone can access the files.
**Important Realization:**

- **SMB **gave information.

```bash
FTP **allowed file interaction.
```

**Combining both **** shell**

**After getting Shell:**

- First shell was normal user, not root.
**Privilege Escalation: **

- Found **SUID **binary.
**If ****SUID**** binary is misconfigured, it can give ****root**** access.**

**What I Learned:**

- Services can work together.
- SUID is common is privesc method.