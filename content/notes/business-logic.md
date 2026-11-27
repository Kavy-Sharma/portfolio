---
title: "Business Logic Vulnerabilities"
symbol: "Bl"
category: "Logic"
readTime: 2
tldr: "The application functions exactly as coded, but the coded rules contain flawed assumptions that can be abused."
red: "Manipulate parameters, skip mandatory checkout steps, or enter negative numbers to bypass business restrictions."
blue: "Model system invariants, validate state machines on the server, and write positive integration tests for edge cases."
next: "race-conditions"
---

### What are Business Logic Flaws?
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
2. **Enforce state machines**: Verify that step N cannot be executed unless step N-1 has been verified and recorded in the session ledger.
