---
title: "Insecure Direct Object References (IDOR)"
symbol: "ID"
category: "Access"
readTime: 2
tldr: "The application trusts the ID in the request and never verifies if the record belongs to the user."
red: "Change an ID parameter in the URL or request body to view or modify someone else's private data."
blue: "Enforce strict server-side authorization checks verifying that the requesting session owns the targeted record."
next: "privilege-escalation"
---

### What is IDOR?
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
3. **Never trust client parameters**: Do not let client-side JavaScript or hidden input fields dictate object access rights.
