---
title: "SSH (Secure Shell)"
symbol: "Ss"
category: "Network"
readTime: 2
tldr: "Encrypted remote administration service on port 22; weak passwords and leaked private keys are the primary attack vectors."
red: "Brute-force weak administrative credentials or locate exposed private keys (id_rsa) to obtain interactive shell access."
blue: "Disable password authentication, enforce ed25519 public key pairs, disable root login, and rate-limit with fail2ban."
next: "telnet"
---

### What is SSH?
SSH (Secure Shell) is the industry-standard cryptographic network protocol running on port 22. It replaced insecure plaintext protocols like Telnet and rlogin, providing encrypted terminal access, command execution, and file transfer across untrusted networks.

SSH uses public-key cryptography to authenticate the remote host and optionally authenticate the connecting user.

### Primary attack vectors against SSH

#### 1. Weak passwords & brute-force attacks
If an SSH daemon permits password authentication, attackers use automated dictionaries to test common credentials:
```bash
hydra -l root -P passwords.txt ssh://<target_ip>
```
If an administrative account uses a weak password, the attacker obtains an immediate root shell.

#### 2. Leaked private keys (id_rsa)
In many CTF challenges and real penetration tests, initial access to an unprivileged web shell or exposed backup share reveals an unprotected private key:
```bash
# Locate private SSH keys
find / -name "id_rsa" 2>/dev/null
```
If the key file has permissions set to `600`, an attacker can download it and connect directly without entering a password:
```bash
chmod 600 id_rsa
ssh -i id_rsa user@<target_ip>
```

### Hardening SSH: Best practices
To secure an SSH daemon against common attacks, edit `/etc/ssh/sshd_config`:

1. **Disable password logins**: Force users to authenticate using public key pairs:
   ```ini
   PasswordAuthentication no
   ```
2. **Disable direct root logins**: Prevent attackers from targeting the `root` account:
   ```ini
   PermitRootLogin no
   ```
3. **Use modern key algorithms**: Prefer modern, compact `ed25519` keys over legacy 1024-bit RSA keys:
   ```bash
   ssh-keygen -t ed25519
   ```
4. **Deploy fail2ban**: Automatically ban IP addresses that generate repeated failed authentication attempts.
