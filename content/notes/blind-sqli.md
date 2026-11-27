---
title: "Blind SQL Injection"
symbol: "Bq"
category: "Injection"
readTime: 2
tldr: "When the application returns no SQL errors or data, you extract information using true/false checks or time delays."
red: "Send conditional boolean queries or database sleep commands to reconstruct secrets character by character."
blue: "Use parameterized queries everywhere and log unexpected query patterns on backend servers."
next: "xss"
---

### What is Blind SQL Injection?
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
2. **Generic error responses**: Keep error messages generic, but never rely on obscurity as a substitute for secure query parameterization.
