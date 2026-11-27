---
title: "File Upload Vulnerabilities"
symbol: "Fu"
category: "Files"
readTime: 2
tldr: "Uploading executable scripts disguised as images allows attackers to run commands on the web server."
red: "Bypass extension and MIME checks to upload a webshell, then trigger it through the browser for remote code execution."
blue: "Store uploads outside the web root, re-encode images, randomize file names, and disable script execution in upload folders."
next: "broken-authentication"
---

### What are File Upload Vulnerabilities?
Many applications let users upload files—such as avatars, resumes, or receipts. If the application accepts files without thoroughly verifying what they contain and stores them in a web-accessible directory, an attacker can upload an executable script (a **webshell**) and gain full remote code execution.

### How it looks in practice
A profile page has an avatar upload form. An attacker creates a tiny PHP script named `shell.php`:

```php
<?php
// Tiny webshell
if (isset($_GET['cmd'])) {
    system($_GET['cmd']);
}
?>
```

The attacker uploads `shell.php`. The server accepts it and responds:
```json
{"status": "success", "url": "/uploads/avatars/shell.php"}
```

Now the attacker opens the uploaded file in their browser:
```http
GET /uploads/avatars/shell.php?cmd=id HTTP/1.1
```
The web server (Apache or Nginx) executes the PHP code and returns the server's user ID (`uid=33(www-data)`). The attacker now has an interactive shell.

### Common filter bypasses
- **Alternative extensions**: If `.php` is blocked, servers often still execute `.phtml`, `.php5`, `.phar`, or `.inc`.
- **MIME-type manipulation**: Changing `Content-Type: application/x-php` to `Content-Type: image/jpeg` in the HTTP request body fools naive checks.
- **Magic bytes**: Prepending valid image headers (`GIF89a;`) to the beginning of a script file bypasses file-inspection libraries.
- **Double extensions**: `avatar.php.png` or `avatar.php%00.png`.

### How to defend against it
1. **Store outside the web root**: Store uploaded files in an isolated private directory or object storage bucket (e.g. S3) that cannot be executed by the web server.
2. **Re-encode media files**: Do not store original uploaded byte streams directly. Load images through an image library and re-save them as clean PNGs or JPEGs.
3. **Randomize filenames**: Replace the user's filename with a generated UUID and assign the extension based on verified file content, not client headers.
