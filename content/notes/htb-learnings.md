---
title: "Hack The Box Starting Point: Core Vulnerability Concepts"
slug: "htb-learnings"
date: "2026-01-27"
category: "VAPT Walkthroughs"
tags: ["HTB", "Starting Point", "Enumeration", "Telnet", "FTP", "SMB"]
owasp: ["A05:2021-Security Misconfiguration", "A07:2021-Identification and Authentication Failures"]
red: "I surveyed target systems for default credentials, unauthenticated FTP, and unprotected SMB file shares."
blue: "I disabled plaintext protocols, enforced robust authentication, and restricted network share access."
summary: "Key operational lessons learned from HTB Starting Point machines Meow, Fawn, and Dancing: the dangers of default accounts, unauthenticated services, and open SMB shares."
wordCount: 198
readingTimeMinutes: 1
---

**Machine – 1****: ****Meow**

Learned enumerating TELNET and its insecure side.  Communicates in plain-text and systems with default or empty credentials can give its full access.

Used **nmap **just to understand what the machines are exposing and **Telnet **became relevant because that was the only service available.

No other tool needed  service was the weakness itself.

Also learned how common the default usernames are, and also how risky it gets if its not properly used.

**Machine – ****2****: ****Fawn**

Learned how dangerous an anonymous FTP access can be.

Anonymous login allows anyone to access the file system without an account.

Used nmap to see the services running firstly. And FTP became relevant because the service itself allowed access without authentication.

This shown that there is no need to exploit always. We can check for any services left open firstly.

**Machine – ****3****: ****Dancing**

Learned how risky open SMB shares can be.

If shared folders are opened and not protected properly, anyone who reaches the system can look into the files.

Checked what services were running and found SMB because it is used for file sharing.

Used **smbclient** tool with the share name to access the files which are left unprotected.
