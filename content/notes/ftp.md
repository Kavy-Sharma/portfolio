---
title: "FTP (File Transfer Protocol)"
symbol: "Ft"
category: "Network"
readTime: 2
tldr: "Legacy file transfer service on port 21, frequently misconfigured with unauthenticated anonymous access."
red: "Connect as user 'anonymous' to read sensitive backups, source code, or upload files into web directories."
blue: "Disable anonymous access, enforce SFTP (over SSH) with key authentication, and retire plaintext FTP daemons."
next: "ssh"
---

### What is FTP?
FTP (File Transfer Protocol) is an old application-layer protocol running on port 21 designed for uploading and downloading files between clients and servers.

FTP was designed before modern network encryption standards existed. By default, it transmits all commands, filenames, usernames, and passwords across the network in clear, unencrypted text.

### How it looks in practice
During network enumeration, Nmap frequently uncovers port 21:
```
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
```

A common security misconfiguration in FTP servers is **Anonymous Access**. Many server configurations allow users to log in using the username `anonymous` without needing a verified account:

```bash
ftp <target_ip>
Connected to <target_ip>.
220 (vsftpd 3.0.3)
Name (<target_ip>:kavy): anonymous
331 Please specify the password.
Password: <enter or blank>
230 Login successful.
Remote system type is UNIX.
```

Once connected, an attacker uses standard FTP commands:
- `ls`: List files in the directory.
- `get filename.txt`: Download a file to the local machine.
- `put file.php`: Upload a file to the remote server.

If the FTP root folder coincides with an Apache web folder (such as `/var/www/html`), an attacker who can upload files can place a webshell on the server and trigger it via HTTP, escalating from file transfer to full system control.

### How to defend against it
1. **Disable anonymous login**: In `/etc/vsftpd.conf`, explicitly disallow anonymous access:
   ```ini
   anonymous_enable=NO
   ```
2. **Decommission plaintext FTP**: Replace legacy FTP with SFTP (SSH File Transfer Protocol) running over port 22, which encrypts authentication credentials and file payloads in transit.
3. **Restrict upload permissions**: Never grant write or execute permissions to FTP accounts within public web-accessible directory trees.
