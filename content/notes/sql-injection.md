---
title: "SQL Injection (SQLi)"
symbol: "Sq"
category: "Injection"
readTime: 2
tldr: "Untrusted input gets concatenated into a database query, allowing attackers to change the query logic."
red: "Inject quotes and SQL keywords to dump database tables, bypass logins, or read private credentials."
blue: "Use parameterized queries (prepared statements) for all database operations so input is never parsed as code."
next: "blind-sqli"
---

### What is SQL Injection?
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
The database pre-compiles the query structure first. User input is treated strictly as literal data, making injection mathematically impossible.
