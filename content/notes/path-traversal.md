---
title: "Path Traversal (Directory Traversal)"
symbol: "Pt"
category: "Files"
readTime: 2
tldr: "Using dot-dot-slash sequences to walk out of the restricted web folder and read private server files."
red: "Pass ../ sequences in file parameters to read sensitive operating system configuration files like /etc/passwd."
blue: "Validate filenames against a strict allowlist and resolve canonical paths to verify they stay in the base folder."
next: "file-upload"
---

### What is Path Traversal?
Path Traversal (also known as Directory Traversal or `../` manipulation) allows an attacker to read arbitrary files stored on the server file system. It happens when an application accepts a filename or path from user input and passes it directly to file-system APIs without ensuring the path stays within the intended root folder.

### How it looks in practice
Consider an image viewing script:
```http
GET /loadImage?filename=logo.png HTTP/1.1
Host: shop.local
```

On the backend, the developer wrote:
```python
# Insecure file retrieval
file_path = "/var/www/shop/images/" + filename
with open(file_path, "rb") as f:
    return f.read()
```

An attacker modifies the request using directory traversal sequences:
```http
GET /loadImage?filename=../../../../etc/passwd HTTP/1.1
Host: shop.local
```

The operating system resolves the path:
1. `/var/www/shop/images/`
2. `..` &rarr; `/var/www/shop/`
3. `..` &rarr; `/var/www/`
4. `..` &rarr; `/var/`
5. `..` &rarr; `/`
6. `etc/passwd` &rarr; `/etc/passwd`

The server opens `/etc/passwd` and returns the operating system user accounts to the client.

### Common bypass techniques
Developers often try naive string replacements, which attackers easily evade:
- **Nested sequences**: If the code strips `../`, an attacker sends `....//`. When the inner `../` is removed, the remaining characters reform `../`.
- **URL encoding**: `%2e%2e%2f` (URL encoded) or `%252e%252e%252f` (double encoded).
- **Null byte injection**: In older runtimes, appending `%00` truncated appended file extensions.

### How to defend against it
1. **Resolve and verify canonical paths**:
   ```python
   import os
   base_dir = os.path.abspath("/var/www/shop/images")
   target_path = os.path.abspath(os.path.join(base_dir, user_input))
   if not target_path.startswith(base_dir):
       raise ValueError("Access Denied: Path outside base directory")
   ```
2. **Use an allowlist or database index**: Store files using random alphanumeric IDs and map them to physical paths in a database.
