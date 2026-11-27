---
title: "Hack The Box Starting Point: Tier 0 Walkthroughs"
slug: "htb-walkthroughs"
date: "2026-01-26"
category: "VAPT Walkthroughs"
tags: ["HTB", "Meow", "Fawn", "Dancing", "Telnet", "FTP", "smbclient"]
owasp: ["A05:2021-Security Misconfiguration", "A07:2021-Identification and Authentication Failures"]
red: "I connected to misconfigured targets with default usernames and anonymous SMB shares to retrieve challenge flags."
blue: "I removed default credentials, required authentication for SMB shares, and restricted root logins."
summary: "Step-by-step technical walkthroughs for Hack The Box Tier 0 machines: Meow (Telnet enumeration), Fawn (anonymous FTP exploitation), and Dancing (SMB share enumeration)."
wordCount: 367
readingTimeMinutes: 2
---

**Machine – 1**

**Meow**

- Open Port found: 1 *checked with ***nmap**
- Service Running: telnet – port 23
- Then tried to connect with telnet:

```bash
telnet *<machine ip> *23
```

- Now it tells to login but we don’t know the username & password.
- We know some common usernames for every machine can be:
Administrator, admin, root.

- After trying we got root as the username which doesn’t require any password.
- Now we logged into the root user.
- On listing the contents (*ls*), we get the **flag.txt** file.
- This file has the flag we have to enter to complete the room.
**Learnings:**


```bash
Telnet is an insecure protocol because it allows plaintext authentication.
```

- Enumeration is very important before exploitation.
- Every machine has **admin, administrator, root** usernames by default.
**Machine – 2**

**Fawn**

- Open ports: Port 21 – ftp
- Service running: vsftpd 3.0.3
- Tried to connect with ftp:

```bash
ftp *<**target** ip>
```

- Username **anonymous **will be used for logging in without an account.

```bash
FTP logged in.
```

- List the file contents.
ls

- There is a file naming **flag.txt**.
- Download it:

```bash
get flag.txt
```

- Open it in the home directory:

```bash
cat flag.txt
```

- Flag found  Machine completed.
**Learnings:**

- Anonymous FTP access allows unauthenticated users to read files.
- Always check for anonymous login during FTP enumeration.
- For reading any file, we have to download it first. Can’t open a file in the FTP.
**Machine – 3**

**Dancing**

- Open Ports : 4.
- Service Running: SMB (Microsoft-DS) on port 445 **(****Relevant one****)****.**
- We use -L flag with the **smbclient** command to list the available shares on that particular machine.

```bash
smbclient -L *<target_IP>
```


## **Or**


```bash
smbclient -L //*<target_IP> *-N
```

**(-N for NO PASSWORD)**

- Check the shares. We found the share named **Workshares **which we can access with a blank password.
- Now finally run the **smbclient **command for this share.

```bash
smbclient //*<target_IP>/<share_name>* -U anonymous -p 445
```


## **Or**


```bash
smbclient //*<target_IP>/<share_name>* -N
```


```bash
Find the file named **flag.txt **there by listing and traversing the files:
```


```bash
ls **and** cd.
```

- If flag found, download the file:

```bash
get flag.txt
```

- Enter the flag  Machine completed.
**Learnings:**

- SMB shares with anonymous access can expose sensitive files.
- -N flag is for no password login.