---
title: "Cross-Site Request Forgery (CSRF)"
symbol: "Cs"
category: "Auth"
readTime: 2
tldr: "A malicious site tricks an authenticated user's browser into submitting unauthorized actions."
red: "Craft a hidden HTML form that automatically submits state-changing requests using the victim's saved session cookies."
blue: "Require unpredictable Anti-CSRF tokens for all state-changing requests and configure SameSite cookie attributes."
next: "business-logic"
---

### What is CSRF?
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
2. **SameSite Cookie Attribute**: Set `SameSite=Strict` or `SameSite=Lax` on session cookies. This instructs modern browsers not to attach session cookies to cross-site requests.
