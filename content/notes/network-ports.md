---
title: "Network Ports and Service Enumeration"
slug: "network-ports"
date: "2026-02-17"
category: "Networking"
tags: ["Networking", "Reconnaissance", "Ports", "Protocols"]
owasp: ["A05:2021-Security Misconfiguration"]
red: "I probed target ports to map exposed daemons, banner versions, and unauthenticated network services."
blue: "I closed unneeded ports, bound sensitive services to localhost, and enforced strict firewall rules."
summary: "Deep dive into TCP/UDP ports, transport protocol mechanics, common service vulnerabilities (FTP, SSH, Telnet, HTTP, DNS, SMTP), and manual reconnaissance methods."
wordCount: 8442
readingTimeMinutes: 42
---


## **Network Ports**

- A port is not a physical connection.
- It is a logical connection that’s used by programs and services to exchange information.
- It specifically determines which program or service on a computer or server that is going to be used.
- It can be web page, FTP, email etc.
- Ports will have a unique number that identifies them.Range = 0 to 65535
- Common port numbers: 80, 443 = Web pages {HTTP, HTTPS}21 = FTP (File Transfer Protocol)25 = Email (SMTP)
- A port is always associated with an IP address.
IP address: Port66.94.34.13:2112.34.56.78:2575.12.212.44:8043.14.250.12:443

- An IP address determines the location of that server
- A port number determines which service or program on that server it wants to use.
Example:

- Let’s take port 80 [Most common and associated with HTTP] which is web pages.
- When I want to visit google.com, will write it in the browser.
- Before bringing up Google’s web page, it will do certain things.
- Firstly, the domain name of google.com is converted into its IP address.
- Then the port number of the particular protocol is attached to the IP address.
- Now, the IP address is going to be used to locate the google server.
- When the location found, now the port number’s turn.
- The Google web server will see an incoming request from port 80 and will forward that request to its built-in web server.
- Now you can see the Google web page.
- We can’t see the IP address or the port number that is used.
- There is a way to see :- netstat (Network Statistics)
- Netstat is a command line tool that is used to display the current network connections and port activity on your computer.
- Port numbers are assigned by IANA (Internet assigned Numbers Authority)
- Port Numbers are broken down into 3 categories.
- 0 - 1023 = System or well-known ports
- 1024 – 49151 = User or registered portscan be registered by companies and developers for a particular service.
- 49152 – 65535 = Dynamic or Private portsclient’s side ports that are free to use.your PC assigns temporarily to itself during a session.
- Port always works with a protocol:
- **TCP **or **UDP**
- **Transfer Control Protocol **or ** User Datagram Protocol**
- **TCP: **Slow but safe.
- Uses three way handshake  **S****yn ** **Syn-Ack **** Ack**
- Data sent in packets and in order.
- Missing data is resent.
- **UDP: **Fast but blind.
- Just send the packet and doesn’t even check them.
- Packets can be lost or shuffled.
- **Working of TCP/IP Model**
**W****hen Sending Data (From Sender to Receiver)**

- Application Layer: Prepares user data using protocols like HTTP, FTP, or SMTP.
- Transport Layer (TCP/UDP**): **Breaks data into segments and ensures reliable (TCP) or fast (UDP) delivery.
- Internet Layer (IP): Adds IP addresses and decides the best route for each packet.
- Link Layer (Network Access Layer**): **Converts packets into frames and sends them over the physical network.
**When Receiving Data (At the Destination)**

- Link Layer: Receives bits from the network and rebuilds frames to pass to the next layer.
- Internet Layer: Checks the IP address, removes the IP header, and forwards data to the Transport Layer.
- Transport Layer: Reassembles segments, checks for errors, and ensures data is complete.
- Application Layer: Delivers the final data to the correct application (e.g., displays a web page in the browser).
**Socket**** Address: **A "Socket" is the combination of an IP Address and a Port Number (e.g., <target-ip>:80). This is the actual endpoint for communication.

- **To check if any program or server is installed or not: **
- rpm -qa | grep <*server name*>
- **OR**
- dpkg –get-selections *<server name>*
**HTTP – ****Port 80**

**Hypertext Transfer Protocol**

- It is the system that allows communications between web browsers and websites.
- When you visit a website, your browser uses HTTP to send a request to the web server hosting that site, and the server sends back the data needed to display the page.
Think of it like a set of rules or language used by your browser and server to communicate and ensure that websites work properly.

- **How it works: **
- Open a web browser and type a website URL.
- Your browser asks a DNS [Domain Name System] server to find out the IP address associated with that URL.
- Then browser sends an HTTP request to the server.
- The server processes the HTTP request and sends back an HTTP response. It contains the requested resources needed to load the page.
- Browser receives data from the server and displays webpage on the screen.
After page loaded, the connection between browser and server is closed. On further requesting, new connection is made.

- **HTTP request includes:**
- HTTP version
- URL
- HTTP method: The type of action requested.
- HTTP request headers: Extra info about the request.
- HTTP request body: In some cases, request include a body containing data.
- **HTTP response includes:**
- HTTP status code.
- Response Headers: Info about the response.
- Response Body: Content that the server sends back.
**HTTP Status Code: ***3**-**digit code, server tells the browser that what happened with the request you sent.*

- **Informational: **1xxJust give you info.100 Continue means the request is still being processed.
- **Successful: **2xxTells everything went fine.200 OK means request was successful.
- **Redirection: **3xxTells browser to take additional actions.301 Moved Permanently means the requested page has moved to a new address.
- **Client Error: **4xxIndicate there was a problem with your request.404 Not Found means page doesn’t exist.
- **Server Error: **5xxTells you something went wrong on server side.500 Internal Server Error means the server had an issue operating the request.
- **HTTP Cookie:**
A little piece of data server transmits to user’s web browser.

When making a subsequent query, the browser may keep the cookie and transmit it back to the same server.

**HTTP is a Stateless Protocol**. This means the server does not "remember" the user from one request to the next. This is exactly why **Cookies** were invented —to provide "state" (memory) to a stateless protocol.

Eg. To maintain a user’s login state and to determine whether two requests originate from same browser.

**Practice in Kali**

**Apache Web Server:**

A web server software that listens to port 80.

**Commands:**


```bash
sudo systemctl start apache2  start apache.
```


```bash
sudo systemctl stop apache2  stop.
```


```bash
sudo systemctl restart apache2  restart.
```


```bash
sudo systemctl status apache2  run check.
```

Default folder: **/var/www/html**

We can place files here {index.html, about.html} accessing: http://*<IP>*/___.html

**Check Open Ports:**

ss/netstat:

ss -tulnp

t – TCPu – UDPl – Listening Portsn – Show No.p – Show process using port.

Used to see the services running and on which ports.


```bash
Nmap:
```

Tool to discover open ports and services.


```bash
nmap -p 80 *<IP>*scan port 80.
```


```bash
nmap -p- *<IP>*scan all ports.
```


```bash
nmap -sV *<IP>*detect service version.
```

-p = specify ports.

-p- = all 65535 ports.

-sV = service version detection.

-sS = TCP SYN scan (stealthy doesn’t complete handshake)

-A = aggressive scan (OS detection + version + scripts)

Netcat (nc):

A tool used to connect to or listen to ports.


```bash
nc *<IP> *80
```

Then:


```bash
GET / HTTP/1.1
```

Host: *<IP>*


## Or We Can Write

echo -e “GET / HTTP/1.1\r\n Host: *<IP> *\r\n\r\n” | nc *<IP> *80

**file name to show contents**

Echo is a command that simply prints the text onto the terminal.

-e  to enable the \r [Move cursor to first line], \n [new line] commands.


```bash
curl:
```

A command line tool to make HTTP requests. Used to quickly test a webpage or see server headers.


```bash
curl http://*<IP>*get full webpage
```


```bash
curl -I http://*<IP>*only headers
```

- Start Apache  systemctl start apache2.
- Create a webpage in /var/ww/html  *sudo nano* **<file name>**
- Open browser  http://127.0.0.1
- Scan with nmap  nmap -p 80 *<Kali IP>*
- Test with curl  curl http://*<IP>*
- Connect manually with nc  nc *<IP> *80
- Enumerate with nmap scripts  nmap -p 80 –script http-enum *<IP>*

![Evidence: network-ports](network-ports-image2.png)

**Apache Default page: ****When I write ***http://localhost* **in kali browser and ***http://<Kali IP> ***in windows browser.**

**HTTPS – ****Port 443**

**Hypertext Transfer Protocol Secure**

- In standard HTTP, all the information is sent in clear text. So all the info that is exchanged between the computer and that web server, which includes any text that you type, that info is transferred over public internet.
- Now, in some situation, this can be dangerous as we type our personal data.
- This is why HTTPS developed.
- It ensures that all the data transferring between the computer and the web server is secure by making the data impossible to read.
- Uses encryption algorithms to scramble the data that’s being transferred.
- HTTPS establishes the communication between the browser and the web server by using Secure Socket Layer (SSL) and Transport Layer Security (TLS).
The new version of SSL is TLS.

- HTTPS uses conventional HTTP protocol and adds a layer of SSL/TLS over it.
- Workflow HTTP and HTTPS remains same.
**Secure Socket Layer (SSL)**

Ensures the data transfer between the communicating systems is secure and reliable.

Used for encryption and decryption of data during transmission of requests.

Uses a digital certificate called SSL Certificate for establishing a secure communication link between the communicating devices.

**Encryption in HTTPS:**

HTTPS uses an asymmetric public key infrastructure for securing a communication link.

There are two different kinds of keys used for encryption:

**1.** Private Key: Used for the decryption of the data that has been encrypted by the public key. It resides on the server side and is controlled by the owner of the website.

**2. **Public Key: It is accessible to all the users who communicate with the server.

**Practice in Kali**

By default, Apache works with HTTP.

For making it work with HTTPS we need to:

- Enable SSL.
- Certificate (self-signed in my case)
- Enable SSL: sudo a2enmod ssl
a2enmod  ‘Apache 2 enable module’ssl  The feature for HTTPS

- Self-signed Certificate:

```bash
sudo mkdir /etc/apache2/ssl
```


```bash
cd /etc/apache2/ssl
```


```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout apache.key -out apache.crt
```

- **Here:**
- openssl  Program for encryption
- req  Request new certificate
- -x509  Type of certificate
- -nodes  No password needed
- -days 365  Valid for 1 year
- -newkey rsa:2048 Make a new key with 2048-bit strength
- -keyout apache.key Save the private key here
- -out apache.crt Save the certificate here
- **How to use this certificate:**

```bash
sudo nano /etc/apache2/sites-available/default-ssl.conf
```

- nano is a simple text editor.
- Inside the file, add the paths after the certificate.
- **SSLCertificateFile****/etc/apache2/ssl/apache.crt**
- **SSLCertificateKeyFile****/etc/apache2/ssl/apache.key**
- Enabling SSL site:

```bash
sudo a2ensite default-ssl.conf
```

- Then restart apache.
- **Test HTTPS:**

```bash
curl -k https://localhost
```

- -k = ignore warning
- On opening from Windows browser :-
- https://*<Kali IP>*
- A warning will be shown [because of the self-signed certificate], “Connection not private”.
- To get certificate details:

```bash
nmap –script ssl-cert -p 443 localhost
```

- See what ciphers supported:

```bash
nmap –script ssl-enum-ciphers -p 443 localhost
```

- **Ciphers: **A named combination of cryptographic algorithms used to establish secure connection.

```bash
FTP – ****Port 21
```

**File Transfer Protocol**

The standard protocol that is used to transfer files between computers and servers over a network.


```bash
FTP is the language that computers use to transfer files over a TCP/IP network.
```

You can also configure your own computer to act as an FTP server.

Sometimes FTP servers will require an account with a username and password.

And sometimes you can just log in anonymously.

While transferring files, FTP uses three different modes: block, steam and compressed.

Steam: Enables FTP to manage info in a string of data without any boundaries between them.

Block: Separates the data into blocks.

Compress: FTP uses an algorithm called the Lempel-Ziv to compress the data.


```bash
FTP has ability to perform large file transfers FTP allows you to send multiple files at once.
```

**Types of FTP:**

**1. **FTP Plain:

- Normal FTP without encryption.
- By default, uses port 21.
- Supported by majority of web browsers.
**2. **FTPS: FTP secure or FTP secure sockets layer (SSL)

Uses SSL encryption, which is slightly different from traditional FTP.

Primary difference – security that comes with FTPS which was the first type of encrypted FTP invented.


## **Ftpes:**

- E stands for ‘explicit’.
- File transfer protocol over explicit TLS/SSL.
Begins like regular FTP, using port 21 but then special commands upgrade it to a TLS/SSL encrypted transmission.

It tends to work well with firewalls.

**How FTP works:**

- By opening two connections that link the computers trying to communicate with each other.
- One connection – for the commands and replies that get sent between the two clients and the other channel handles the transfer of data.
Command channel uses port 21.

Data channel uses port 20.

- The FTP client using URL and FTP server address, gets connected to the network.
- The client logins using user ID and password. If user not registered with server, then he/she can access files by using anonymous login where password is client’s email address.

```bash
FTP Commands:
```


```bash
cd****: ** changes working directory on remote host.
```

**close****: **closes FTP connection.

**quit****: **quits FTP.

**pwd****: **displays current working directory on remote host.

**dir ****or ****ls****: **provides a Directory Listing of the current working directory.

**help****: ** displays list of all client FTP commands.

**remotehelp****:** displays a list of all server FTP commands.

**type****:** Allows the user to specify the filetype.

**struct****:** specifies the file structure.

**Practice in Kali**

- Install vsftpd. {Very Secure FTP Daemon}
- Open config file:

```bash
sudo nano /etc/vsftpd.conf
```

- Enable both anonymous and local user login.
write_enable = YESALLOW UPLOADS

local_enable = YESALLOW LOCAL USERS TO LOGIN

anonymous_enable = YESALLOW ANONYMOUS LOGIN

- Restart and check status.
**Testing:**

Connect to ftp {from KALI itself}ftp localhost

Login Types: anonymous - without password.

Username {kavy}: required password.


```bash
FTP Commands:
```

lslist files

pwdcurrent directory

cdchange directory


```bash
get filedownload file
```

put fileupload file

byeexit

Opening in Windows:

In cmd:


```bash
ftp *<Kali IP>
```

Then enter username and password…

Scan port using nmap:

Service detection: nmap -sV -p 21 localhost

Check if anonymous login enabled:


```bash
nmap --script = ftp-anon -p 21 localhost
```


```bash
FTP system server info:
```


```bash
nmap --script = ftp-syst -p 21 localhost
```


![Evidence: network-ports](network-ports-image3.png)

**The snapshot when I ran ftp in command prompt.**


```bash
SSH – ****Port 22
```

**Secured Shell**

A protocol that allows you to connect securely to another computer over an unsecured network.

It is a cryptographic network protocol that is used for transferring encrypted data over a network.

For authentication, SSH uses public and private key pairs.

**Public Key - **Everyone can see it, no need to protect. [For encryption]

**Private Key – **Stays in computer, must be protected. [For decryption]

**General Procedure:**

- Public keys from local computers are passed to the server which is to be accessed.
- The server then identifies if the public key is registered.
- If so, the server then creates a new secret key and encrypts it with the public key.

## Or We Can Say

- The server generates a random string and encrypts it using the public key.
- This encrypted code is sent to the local computer.
- The code is decrypted by the private key of the system and is sent to the server.
- Then the server verifies.
- After verifying, SSH creates a route or tunnel and all encrypted data are transferred through it with no security issues.
How this system can be used?

For mac/Linux – terminal

Windows – Putty [A software]

It is defined as a replacement for Telnet and other unsecured remote shell protocol.

**Practice in Kali**

We have to download openssh-server.

Start and enable it: sudo systemctl start ssh **&** sudo systemctl enable ssh.

In windows command prompt:ssh kavy@*<Kali IP>***Here kavy is the username of kali which I am using.**

Now in command prompt, we can run our Kali Linux OS.

We can check the opened port using nmap:nmap -p 22 localhost

Service + Version:nmap -sV -p 22 localhost

Host-key info:nmap --script = ssh-hostkey -p 22 localhost

Algorithms supported:nmap --script = ssh2-enum-algos -p 22 localhost


![Evidence: network-ports](network-ports-image4.png)


```bash
SSH in the windows command prompt
```


```bash
TELNET – ****Port 23
```

**Teletype Network**

- A terminal emulation program used to access remote servers.
- No graphical user interface.
- All commands are sent by keyboard.
- That’s why it is very fast.
- No encryption [All commands were sent as a clear text].
- It is used as a standard TCP/IP protocol for virtual terminal service which is provided by ISO.
Local Computer – starts the connection.

Remote Computer – computer being connected.

Whatever being performed on the remote computer will be displayed by the local computer.

**Logging in TELNET:**

- Local login.
- Remote login.
**1. **Local Login: When a user logs into its local system, called as local login.

**Procedure:**

Keystrokes are accepted by the terminal driver when the user types at the terminal.

Terminal driver passes these characters to OS.

OS validates the combination of characters and opens the required application.

**2. **Remote Login: Users can log into a remote site i.e. computer and use services that are available or the remote computer.

**Procedure:**

When the user types something on the local computer, the local operating system accepts the character.

Then it will send them to TELNET client.


```bash
TELNET client transforms these characters to a universal character set called Network Virtual Terminal [NVT] characters and it will pass them to the local TCP/IP protocol stack.
```

Commands or text which are in form of NVT, travel through the Internet and it will arrive at the TCP/IP stack at the remote computer.

Characters are then delivered to the OS and later or passed to the TELNET server.

It changes those characters to characters that can be understandable by a remote computer.

The remote OS receives characters from a pseudo-terminal driver.

The OS then passes the character to the appropriate application program.

NVT is a virtual terminal in TELNET that has a fundamental structure that is shared by many different types of real terminals.

**SMTP – ****Port 25**

**Simple Mail Transfer Protocol**

A set of communication guidelines that allow to transmit an e-mail over the internet.

Main Purpose – setup communication rules between servers.

It is an application layer protocol.

Uses TCP at transport layer.

SMTP is a pure text-based protocol.

SMTP can only handle messages containing 7-bit ASCII text.

Can’t transfer other types of data like images, video, audio etc.

Can’t transfer executable files and binary objects.

MIME – Multipurpose Internet Email Extension is an extension to the internet email protocol.

It extends the limited capabilities of email by enabling the users to send and receive graphics, audio files, video files, etc. in the message.

**SMTP Commands:**

Sender’s Mail Server

[SMTP Client]

HELO – Starts the convo identifying the server and is followed by its domain name.

EHLO – Alternative command to start convo.

MAIL FROM – Indicates sender’s address.

RCPT TO – Identifies recipient of the mail. Can be repeated multiple times for sending similar message to multiple users.

SIZE – Informs about the estimates size (in terms of bytes) of the attached email.

DATA – Signifies that a steam of data will follow.

QUIT – Used to terminate the SMTP connection.

VRFY – The server is asked to verify whether a particular email address or username actually exists.

**SMTP Response Codes:**

Receiver’s Mail Server

[SMTP Server]

101 – server connection error.

211 – system status [response to HELP]

214 – Help message [response to HELP]

220 – The server is ready.

221 – Server closes transmission channel.

235 – Authentication successful.

250 – Requested command is completed. Code is followed by OK.

354 – Server confirms mail content transfer. After that, client starts sending mail. Terminated with (“**.**”).

500 – Syntax error.

510 – Invalid email address.

**Sender’s Mail Server       **    **220****                  Receiver’s Mail Server **

**    (SMTP Client)****(SMTP Server)**


| Send an EHLO message | 250250HELO/EHLO <gmail.com> | Receive an EHLO message and respond appropriately. |
| --- | --- | --- |
|  |  |  |
| Identify the ‘sender’ to receiver mail address | 250250Mail from: <sender@gmail.com> | This sender is OK with me. |
|  |  |  |
| Identify the ‘recipient’ to receiver mail server. | RCPT to: <recipient@gmail.com> | This recipient is OK with me. |
|  | 250250 |  |
| Ready for message? | DATA | OK ready, send message. |
|  | 354354 |  |
| Message send line by line. | ..250250 | Message received. |
|  |  |  |
| Terminate this session | 221221QUIT | Closing connection. |

**Practice in Kali**


```bash
sudo apt install postfix -y
```


```bash
telnet localhost 25Connect to the server Will respond with 220Now can try SMTP commands on it
```

HELO kalireturns 250

MAIL FROM: <you@kali.local>can take any [random] id.That’s why it is also used for spoofing.

Returns 250

RCPT TO: <kavy@localhost>

Returns 250


## Data

Tells the server the body is started

After typing the body.

Type **.** on new line to stop it.


## Quit

To check the mail:


```bash
sudo cat /var/mail/root [instead of root I can write kavy or nobody]
```

To remove the mails:


## **Another And Verified Approach**

- Firstly, install **postfix** and **mailx**……But the **mailx **is outdated so download **s-nail**.
- Open the main.cf file.sudo nano /etc/postfix/main.cf
- In this file:
- Scroll and search for **relayhost.**
- Add in this:
- relayhost = [smtp.gmail.com]:587
- And also add:
- myhostname = kali
- To find the hostname we can write hostname -f
- Add the following lines:
- #Location of sasl_passwd we saved
- smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
- #Enables SASL authentication for postfix
- smtp_sasl_auth_enable = yes
- smtp_tls_security_level = encrypt
- #Disallow methods that allow anonymous authentication
- smtp_sasl_security_options = noanonymous
- Save this and exit: **ctrl + o **** enter **** ctrl + x**
- Create a file named **sasl_passwd **under /etc/postfix/sasl

```bash
sudo nano /etc/postfix/sasl/sasl_passwd
```

- In this file, add
- [smtp.gmail.com]:587 kavyaboti2005@gmail.com:*<password**>*
- We can add any other email id instead of the above one.
- Now for the password:
- Open google
- Manage your google account

```bash
Find app security there
```

- Type smtp and then generate
- A set of random 16 alphabets (set of 4-4, separated with spaces)
- Write this where we have to insert password (**Without Spaces**).
- Save and exit.
- Convert the sasl_passwd file into the db file:

```bash
sudo postmap /etc/postfix/sasl/sasl_passwd
```

- We have to change the permissions of both the files. (**Read and write to root only**)

```bash
Get into the directory (**/etc/postfix/sasl**).
```


```bash
sudo chmod 600
```

- Restart postfix.
- Now send a mail:
- echo “Test Mail” | mail -s “Postfix Test” kavyaboti2005@gmail.com
- We can check the mails which are not sent: mailq
- If any problem is there in sending the mail, open a new terminal window and type the command: sudo journalctl -u postfix -f
- If any changes are made in any file, then don’t forget to make the db file again and restart the postfix.

![Evidence: network-ports](network-ports-image5.png)

**DNS – ****Port 53**

**Domain Name System**

A system that translates human-readable domain names into machine readable IP addresses.

**DNS Lookup Process:**

Root DNS Server

User Recursive DNS                                      resolver    TLD name server

Authoritative DNS resolver

DNS servers are backbone of DNS, handling the conversion of domain names to IP addresses.

**DNS server types:**

**1. **Recursive DNS resolver:

**Role in DNS resolution**

When you enter a domain name into your browser. The request is first sent to the recursive resolver. It is provided by your Internet Service Provider [ISP].

If the resolver doesn’t have the answer to the query stored. It performs the recursive queries, contacting other DNS servers in the hierarchy on behalf of the client to find the correct IP address for the domain.

The recursive resolver stores the results of DNS queries in a cache for a period of time. This allows future requests for the same domain to be resolved more quickly.

**2. **Root Name Server:

When a recursive resolver receives a DNS query, it first contacts one of the root servers.

The root server doesn’t know the IP address of the requested domain, but it does know which Top-Level Domain [TLD] server [eg., .com, .org, .edu] should be queried next.

The root server responds by directing the recursive resolver to the appropriate TLD server based on the domain extension.

There are 13 root name servers worldwide.

**3. **TLD Name Server:

Once the recursive resolver has been referred to TLD server by the root server, it queries the TLD server for the IP address of the authoritative DNS server that holds the specific domain name records.

**Types of TLDs:**

Generic TLDs (gTLDs): Common extensions  .com, .net, .org….

Country-Code TLDs (ccTLDs): country specific extensions  .us (United States), .in (India), .jp (Japan)………

Sponsored TLDs (sTLDs): Sponsored by specific organizations, such as .edu for educational institutions or .gov for government organizations.

**4. **Authoritative Name Server:

- Once the recursive resolver reaches the authoritative name server. It receives the IP address (or other DNS records, such as MX or CNAME).
- For the requested domain name.
- This server hosts “zone files”, which includes DNS like:
- ‘A’ records: Link domain names to IP address enabling access to websites.
- CNAME records: Allow one domain to point to another.
- MX records: Specify mail servers responsible for receiving emails for a domain.
- NS records: Indicate which DNS servers are authoritative for the domain.
- After the authoritative server provides the IP address, the recursive resolver returns this information to the user’s browser, which can then connect to the web server and load the website.
- DNS servers often cache the results of previous queries to improve efficiency.
- Its benefits are:
- Improves response time.
- Reduces load on DNS servers.
- Network Efficiency.
**Practice in Kali**


```bash
sudo apt install bind9 bind9utils -y
```

Its service name is **named****. **

Config. File:

**/etc/bind/named.conf.options**

- Set forwarders like <dns-resolver>
- This tells your server to send queries it can’t answer to these external servers.
**/etc/bind/named.conf.local**

- In this: zone “mykali.local” {
type master;

file “/etc/bind/db.mykali.local”;

};

- We created a new zone for mykali.local. It tells bind9 that it is the master of this domain.
**/etc/bind/db.mykali.local**

- It is the zone file, contains actual records.
- To write in it:

## $Ttl 604800

@ IN JOA mykali.local. root.mykali.local. (

2; Serial

604800; Refresh

86400; Retry

2419200; Expire

604800 ); Negative Cache TTL

;

@ IN NS mykali.local

@ IN A *<**Kali IP**>*

- The A record maps the domain name (mykali.local) to an IP address.
- Start bind9.
**Configuring Client:**


```bash
sudo nano /etc/resolv.confChange nameserver line to kali’s IP.
```

**Use nslookup/dig:**nslookup mykali.local

dig mykali.local Gives more detailed look at DNS query and response.

**POP3 – ****Port 110**

**Post Office Protocol Version 3**

Works on application layer.

Used for retrieving email from the email server.

POP mainly arises when the user does not have a continuous internet connect and wants to receive email messages.

POP3 is updated.

Once a connection is established, it can easily retrieve all the messages from the server.

This protocol can download and delete messages.

When a message is sent, SMTP is used to transfer it from the client to the server and to the server of the recipient.

EmailMail ServerComputer

Port 110: Default port.

Port 995: It is a TLS or SSL port, provides more security.

**Working:**

- When the connection is established between POP client and POP server, several commands are exchanged between them to perform task.
- Client requests available email messages server sends the messages along with their size and unique identifier number.
- After receiving messages, client makes a request to server for downloading the messages. The user marks such messages and sends them to server.
- Upon receiving from client-server sends the messages selected by the client and accordingly marks them as read or unread.
- The client if wants, sends a request to delete messages.
- Once tasks are completed, client sends a close connection request to the server.
- The server then sends an acknowledgement to the client and closes the connection.
**Practice in Kali**

Install dovecot: sudo apt install dovecot-pop3d

It will start automatically.

Can check if the server is listening to the port or not:sudo ss -tlpn | grep 110

Practical Exploration:


```bash
telnet localhost 110user kavypass *<my password>*list Will show the mails in the mailbox with    their sizes.retr *<message number>*The server will output the full content of the particular message.dele *<message number>*Delete the particular message. (When we quit the session the mail will be deleted.)quit
```

**IMAP – ****Port 143**

**Internet Message Access Protocol**

A protocol used by email clients to retrieve emails from a mail server.

Allows users to access their email from multiple devices, as emails are stored on the server and not downloaded to the device.

IMAP synchronizes changes made on different devices, like marking emails as read or deleting them.

IMAP allows you to choose only the headers or download the entire email when needed. [Selective Downloading]

Operates on a client server model, where the email client communicates with the email server.

IMAP stores emails on the server. (POP3 downloads to the device)

Enables you to manage your emails in folders directly on the server.

Changes made on one device are reflected on other devices.

Port 143: for non-encrypted connections.

Port 993: for secure [SSL/TLS] connections.

We use the IMAP4 version.

**Working:**

IMAP defines how servers receive the sent emails through a series of commands.

The recipients mail client connects to the server where the email is stored.

The recipient sees the displayed email headers via the client.

IMAP download a copy of a particular message that the recipient chooses to open.

**Practice in Kali**

Install dovecot for imap: sudo apt install dovecot-imapd.

It will start automatically.

Can check if the server is listening to the port or not:sudo ss -tlpn | grep 143

Practical Exploration: Similar to POP3, we will use telnet for this.

We have to preface each command with a unique tag like a1,a2,a3,b1,b2,b3 **or** a,b,c,d….


```bash
telnet localhost 143a1 login kavy *<my_password>*a2 list “” “*” list command shows the folders  available inside the server.
```

We will see something like (*** LIST (/HasNoChildren)** **“/”** **INBOX**). This confirms that the mailbox is there.

a3 select inbox(The server will respond with the number of messages in the folder along with other info.)

a4 fetch 1 all (**FETCH **command is used to retrive the message data. Use **ALL **flag to get all quick summary.)This will give the headers only along with the UID.To get the body, run: a4 fetch 1 body[text] only **if all are texts**. **And after restarting the telnet service otherwise it will give error.**

a5 logout

**HTTPS (Alternative) – ****Port 8443**

It is an alternative port for the default HTTPS port – 443.

Frequently chosen for SSL/TLS in Apache Tomcat.

When port 443 are being used or blocked. It represents a channel that has a safe channel for transmission of secure info from the client to the server.

Port 8443 utilizes SSL/TLS encryption to send information via an encrypted channel.

It is an alternative port for HTTPS traffic, often used when a server needs to host multiple secure services.

Apache Tomcat  A popular Web Server.

Provides flexibility and functionality for secure web communication.

**Practice in Kali**

There is no need to practice it again it is same as the port 443.

Although we can change the port through which it listens in /etc/apache2/ports.conf.

**SNMP – ****Port 161**

**Simple Network Management Protocol**

It is an Internet Standard Protocol used for managing and monitoring network connected devices in IP networks.

Application Layer Protocol which uses UDP port number 161/162.

Used to monitor network, detect network faults and sometimes even to configure remote devices.

**3 main components of SNMP:**

**1. **SNMP Manager: Also called Network Management Station [NMS].

It is a centralized system used to monitor the network.

Router that runs the SNMP server program is called an agent, while a host that runs the SNMP client program is called manager.

**2. **SNMP Agent: It is a software that gathers information about the device and responds to the requests from the NMS.

Agent maintains the information in database.

It runs on a managed device.

Responds to queries from SNMP manager.

**3. **Management Information Base: MIB

Consists of information on resources that are to be managed.

This info is organized hierarchically.

It generates a collection of named objects, their types and their relationships to each other in an entity to be managed.

Can say it like a dictionary or list of all things SNMP can ask about a device.

**SNMP Messages:**


```bash
Get Request: Used to retrieve data from the SNMP agents.
```

GetNext Request: To get the value of a variable, the manager sends the agent a GetNext Request.

Set Request: Used to set value of an object instance on the SNMP agent.

Response: When sent in Response to the set message, will contain a newly set value as confirmation that the value has been set.

Trap: Sent when fault is occurred. Sent by agent without being requested by manager.

Inform Request: Used to determine if the manager has received a trap message or not. Was added to SNMPv2c.

**Versions of SNMP**

SNMPv1, SNMPv2c & SNMPv3   Most secure version

**Practice in Kali**

- Install snmpd for **snmp: **sudo apt install snmpd
- Check for the config file : /etc/snmp/snmpd.conf
- In this file check for the line agentaddress …….
- Whatever written after it change it to udp:161
- Here we can also change the read and write permissions in the line rocommunity (read only), can also be rwcommunity (read-write).
- **Runing ****snmpwalk ****command :**
snmpwalk -v2c -c public localhost

- This gives all the possible oids present for the or in the system.
- -v2c is the version
- -c is to set the community string
- Public is the community string , also there can be private community string which we can define.
- **Run ****:** echo “mibs : -ALL” | sudo tee /etc/snmp/snmp.conf
This disables the MIB loading, which stops all the configuring errors which comes in running the snmp commands for a specific oid.

snmpwalk command traverses the tree fully and give us all the nodes where it travelled.

**To use human-readable names instead of long OIDs, do not disable MIBs. Instead, install the downloader:**


```bash
sudo apt install snmp-mibs-downloader && sudo download-mibs
```

- Now you can use sysUpTime.0 instead of 1.3.6.1.<target-ip>.0.
- Always add .0 at the end of a numeric OID to get a specific value.
- **Running ****snmpget**** command :**
snmpget -v2c -c public localhost 1.3.6.1.<target-ip>.0

- This oid = system uptime.
- This will provide us the exact timing till when the system is up.
snmpget -v2c -c public localhost 1.3.6.1.<target-ip>.0

- This oid = system description (OS info).
snmpget -v2c -c public localhost 1.3.6.1.<target-ip>.0

- This oid = Device name.
snmpget -v2c -c public localhost 1.3.6.1.<target-ip>.0

- This oid = Location.
snmpwalk -v2c -c public localhost 1.3.6.1.2.1.1

- This walks the system infos.
Always remember that the MIB is like a dictionary and the OIDs are like the words present in the dictionary.

We only copy the known OIDs not invent any.

- Now we made some changes in the config file, added :
rwcommunity kavysharma

- It means that there is a community string made of name **kavysharma **and it has a read and write permission.
- **Running ****snmpset ****command:**
snmpset -v2c -c kavysharma localhost s “darkseid”

- This changes the hostname to **darkseid**. It only changed because we used the private community string which was given the read-write permission.
Always remember that the **snmpset** requires write permission also.

The other two commands : **snmpget , snmpwalk **do not compulsorily requires the write permission. So in these two commands we used the **public **community string.

But in the case of **snmpget **we used a **private** community string.

The reason behind this is **public** has **read-only **permission and **private ** has **read-write **permission.

Even if you change "public" to a private string like kavysharma, it is **not secure** in SNMPv2c.

- **Running ****nmap ****command :**

```bash
nmap -sU -p 161 -sV localhost
```

- -sU because snmp uses UDP port.
- This is for the service detection.

```bash
nmap -sU -p 161 --script snmp-brute localhost
```

- It checks if the community string is ‘public’.
- And if the community string is public we can change it to private.
- Only by going to the configuration file and changing the rocommunity public to rocommunity <**anyname>**
- By this change, now if we run the same command again, it will not show about the public string.
**RDP – ****Port 3389**

**Remote Desktop Protocol**

A secure network communication protocol developed by Microsoft.

Allows users to connect and control a computer remotely. [can access a computer from different location]

Can support multiple users connecting to the same remote desktop simultaneously.

Uses encryption to protect the data transmitted between the local and remote computers, ensuring a secure connection.

Use Cases:

IT support

Remote Work

Accessing Virtual Desktop

Cybercriminals often target RDP due to its widespread use and common vulnerabilities like weak passwords or exposed ports.

**How it Works:**

- RDP transmits the activity a user carries on one computer, such as mouse movement, keyboard activity, to another computer remotely.
- Data is shared using port 3389 and is sent through core internet protocols like TCP/IP and UDP.
- RDP requires an RDP server which is the user’s Windows Computer, and an RDP client, a device which an RDP application that allows an admin to control and make remote changes to the user’s device.
- This remote desktop setup only enables admins to make changes to the user’s Windows Device, differentiating it from Cloud Computing.
**How to prevent RDP security issues:**

- Enabling Network Level authentication.
- Limiting who can use RDP.
- Using two factor authentication.
- Using strong passwords.
- Restricting access with firewalls.
**Practice in Kali**

- Firstly switch to the root user because many things will need sudo permission.

```bash
sudo su
```

- Install xrdp: apt install xrdp.

```sql
Update xrdp on startup: update-rc.d xrdp enable.
```

- Start the service: service xrdp start **OR** systemctl start xrdp.
- Checking the status: service xrdp status **OR** systemctl status xrdp.
- Create a new user because you cannot login into an RDP connection using the same user that you are locked in. (New user is going to be an admin user.)
adduser darkseid

- It will ask for password and username.
- Assign the admin priviledges to the new user: usermod -aG sudo darkseid.
- Now switch to the new user and check for its admin priviledge by sudo su.
- Now go to the Windows Remote Desktop app.
- Enter the Kali IP in it and connect.
- It will ask for the username and password, enter **darkseid **and its password. RDP connection done, now you are running kali from your windows desktop.

```bash
NMAP scan: **nmap -sV --script rdp-ntlm-info -p 3389 localhost.
```

- This gives the Target_name and the NetBIOS_Computer_Name.
- If it does not then it means the server is not disclosing th NTLM information.
**NTP – ****Port 123**

**Network Time Protocol**

A protocol that helps the computers clock times to be synchronized in a network.

**Working:**

- This protocol works on application layer, it uses a hierarchical system of time resources and provides synchronization within stratum servers.
- At topmost level, there is highly accurate time resources  atomic or GPS clocks.
- These clock resources are called stratum 0 servers and are linked to below NTP server called stratum 1,2,3 and so on.
- These servers then provide the accurate date and time so that communicating hosts are synced to each other.
**Stratum**:

- Indicates distance of device from an authoritative time source.
- Defines the quality of time being used.
- Stratum 0 represents the reference clock itself, so highly accurate.
- Then stratum 1,2,3….and so on, with decreasing accuracy.
- Till 15, after 15 the clock is considered unsynchronized.
**Features of NTP:**

Have access to highly precise atomic clocks and GPU clocks.

Uses Coordinated Universal Time (UTC) to synchronize CPU clock time.

UTC  standard time system of the world.

Avoids even having a fraction of vulnerabilities in information exchange communication.

Provides consistent timekeeping for file servers.

**Practice in Kali**

- Install ntpsec: sudo apt install ntpsec.
- Start & Enable it.
- In the file **/etc/ntpsec/ntp.conf****, **change the 4 lines of the pool 0,1,2,3.
- For changing these lines, go to **NTP Support** ** Servers **** NTP Pool Servers ** **Select your continent (Asia here) **** the first 4 lines showing ****server 0, 1, 2, 3**  **Copy them and replace with the 4 lines selected in the file****.**
- Save & Exit then restart the server.
- Run the command : ntpq -pn.
- In this **st **means **stratum, **if the stratum is 16 then it means it is in the stratum 15 and the time “*Unsynchronized*” and cannot be trusted.
- **reach**: This is an 8-bit shift register. If it says 377, it means the last 8 attempts to sync were successful and the connection is solid.
- **offset**: This shows the time difference (in milliseconds) between your PC and the server.
- There is a **Drift File **located at **/var/lib/ntpsec/ntp.drift **which shows how fast or slow your internal hardware clock naturally runs.
- Ran nmap --script ntp-monlist. The output shows the port is open but returns no data. This confirms the server is protected against DDoS amplification exploits.
**SMB – ****Port 139 and 445**

**Server Message Block**

A network file sharing protocol that allows computers to access files and resources on other computers over a network.

SMB enables user to treat files and resources on other machines as if they were local to their own computer.

Also facilitates sharing printers connected to different computers on the network.

SMB operates on client server model. Client sends requests to servers, and the server responds with the requested data or service.

Also provides a mechanism for inter-process communication, allowing different applications on a network to interact with each other.

**Working:**

A client initiates a request to access a file or resource on a server.

The client may need to authenticate with the server to prove its identity and access privileges.

If authentication successful, a session is established between both.

The client can then access the required resource.

Once the client is finished, the session is terminated.

SMB signing adds a digital signature to each packet sent between two computers ensuring that data received isn’t changed.

Uses authentication protocols like Kerberos and NTLM to verify user identities and control access to resources.

Commonly uses TCP port 445.

**SMB Versions:**

SMB 1.0: Original version, insecure and outdated.

SMB 2.x: Performance and security improvements.

SMB 3.x: Latest versions, offers further enhancements in performance, security and support for features like SMB direct and SMB multichannel.

**Practice in Kali**

- Check if **mousepad **editor is installed or not :
apt --installed list | grep mousepad

- Install **samba** server:

```bash
sudo apt-get install samba
```

- Open the config file from the mousepad editor:

```bash
sudo mousepad /etc/samba/smb.conf
```

- Here paste this :
[Public] comment = For Public browseable = yes path = /home/kavy/Public writable = yes read only = no force create mode = 0666 force directory mode = 0777

(Take its reference from the same file where the printer heading was)

- Restart and Enable smbd.
- Add a password for sharing user : sudo smbpasswd -a kavy
- Enable sharing for user : sudo smbpasswd -e kavy
- Go to Windows and open the file explorer.
- Write **\\****<kali ip>**
- Enter the username **darkseid **and its password.
- Now you have your Kali Linux file system in your Windows laptop.
**Exploiting SMB: **


```bash
smbclient: **smbclient //***<IP>***/***<share> ***-U ***<Username> ***-p ***<port>
```

**Commands: **ls, cd, get……

**LDAP – ****Port 389**

**Lightweight Directory Access Protocol**

Used to access and manage directory services over a network.

It is an open, vendor-neutral application protocol for accessing and maintaining the data.

Also tackle authentication, so users can sign on just once and access many different files on the servers.

Vendor-Neutral Application:

It is a system that is designed to work with various hardware and software from different vendors, rather than being tied to a single vendor’s product line.

Eg. The employees may use LDAP to connect with printers or verify passwords.

**Process:**

- A person connects with LDAP several times but he may not even know the connection is happened.
- The user connects to the server via LDAP port.
- The user submits a query, such as an email lookup, to the server.
- The protocol queries the directory, finds the information and delivers it to the user.
- The user disconnects from the LDAP port.
Before any search commences, the LDAP must authenticate the user.

Two methods are available for that work:

- Simple: The correct name and password connect the user to the server.
- Simple Authentication and Security Layer (SASL): A secondary service such as Kerberos, performs authentication before the user connects.
Operations with LDAP:

- Add: Enter a new file, into the database.

```sql
Delete
```

- Search
- Compare
- Modify
**LDAP Architecture:**

- Directory Information Tree: DIT
- Hierarchical structure of the LDAP directory.
- Composed of directory entries organized in a tree-like format.
- Each entry represents an object {user, group, device}.
- Entries include attributes describing the object {name, email, role}.
- LDAP directory servers:
- Store and manage the directory info.
- Handle client requests to query or modify directory entries.
- LDAP clients:
- Applications interacting with LDAP directory servers.
- Perform operations like retrieving or updating directory data.
- DIT:
- Distinguished Name (DN): Unique identifier for each directory entry.
- Constructed from RDNs  Relative Distinguished Names that define each level in the hierarchy.
- Eg. uid=jdoe, ou=users, dc=example, dc=com.
- Right to left: In domain  example.com
- Look inside  users.

```bash
Find entry  jdoe.
```

- This whole line is DN and one port {uid=jdoe many others}
- Common Naming Ports:
- dc  domain component
- ou  organizational unit (like a folder)
- cn  Common name
- uid  User ID
- o  Organization
- c  country
- LDAP Schema:
- Defines structures and rules for directory entries.
- Specifies  Object Types: Types of objects stored.
- Attribute Types: Data associated with objects.
- Syntax and Constraints for attributes.
- Access Control:
- Permissions (ACLs) can be applied at different DIT levels.
- **Practice in Kali**
- Install **slapd **& **ldap-utils.**
- **Core Command: **ldapsearch  Everything revolves around this.
- **Basic Template:**
ldapsearch -x -H ldap://TARGET -b “BASE” “FILTER”.

-x : simple/anonymous loginTARGET : IP or localhostBASE : Starting point of searchFILTER : What to search

- **B****ASE** **: **Eg.: dc=example,dc=comMeaning:
- Root of LDAP directory.
- If BASE is wrong  NO OUTPUT!
- **FILTERS : **
(objectClass=*)shows everything

(objectClass=inetOrgPerson)shows users

(uid=username)shows specific user

(objectClass=group)shows groups

Filters are like questions asked to LDAP.

- While running the **ldapsearch **command, if the LDAP replies without the username and password:
Anonymous Bind = Enabled

- This means anyone can read LDAP data.
- It is dangerous in real companies.
- Used for user enumeration.
- **Add User: **
ldapadd -x -D “cn=admin,dc=example,dc=com” -W -f user.ldif

- **-D “cn=admin,dc=example,dc=com”** : This is who you are loggin in as.
- So this full DN means : **Login as LDAP admin user.**
- Equivalent of: **Username: ** (but in LDAP format).
- **-W **means ask for password.
- **-f user.ldif **:
- -f = file
- user.ldif = file that contains LDAP data.
- This file tells LDAP:
What user to createUsernamePasswordUIDGroup, etc.

What is user.ldif?

LDAP Data Interchange Format.

Eg.:

dn: uid=john, dc=example, dc=comobjectClass: inetOrgPersonuid: johncn: John Doesn: DoeuserPassword: <redacted>

**It means: **Create a user called** john **in **example.com **domain.


```sql
Delete User:
```

ldapdelete -x -D “cn=admin,dc=example,dc=com” -W “uid=test,dc=example,dc=com”

**LDAP (Port 389) ** Plaintext.

**LDAPS (Port 636)**  Encrypted.

As LDAP is plaintext, we can encrypt the session using **STARTTLS.**

For this : Add the **-ZZ **flag to the LDAP search command. This makes the server establish a secure tunnel before any data is transmitted.

- **LDAP Enumeration****:**
- **n****map****:**

```bash
nmap -p 389 --script ldap* localhost
```

This detects the LDAP and provide its basic knowledge.

- **enum4linux****:**
enum4linux localhost

It will give the users, groups and domain info.

- **crackmapexec:**
crackmapexec ldap localhost

It will give errors because of the python version.

It doesn’t support the latest versions. (>3.12)

- **HTTP Proxy: ****Port 8080**
Proxy refers to someone authorized to carry out an action on behalf of someone else.

A proxy server acts as a gateway between users and the internet and prevents access to anyone outside the network.

This acts as an intermediary, which communicates with webpages on user’s behalf.

**Working:**

- The proxy receives a web request.
- It analyzes the request and determines whether it should perform actions on the request content.
- The proxy sends the modified version of the request onto the web server, unless it has determined that it is necessary to block the request, in which case it simple drops it.
- The proxy receives the server’s response and sends it back to the client. In some cases, it might modify the response, such as by compressing data to reduce network load.
**What it can do:**

- HTTP proxies can drop requests that originate from certain IP address or domains or that contain certain types of files.
- A proxy server can delete sensitive data.
- Compressing data can reduce the amount of information that needs to flow over the network.
- Can encrypt requests that arrive in unencrypted form.
The reverse proxy is an intermediary that sits in front of servers and forwards client requests to the appropriate backend server.

Forward proxy hides the client.

Reverse proxy hides the server.

**Transparent Proxy:**

Proxy is hidden from the user and the destination server, [No configuration needed, no IP masking]

**Non- transparent Proxy:**

The user is aware of the proxy and needs to configure their device to use it. [IP masking is possible].

**Practice in Kali**

- Type the command **locate proxychains.**
- Then the first one line written is our required file.
- Open it with nano editor.
- Comment the line saying strict proxy and uncomment the line saying dynamic proxy in this.
- At the bottom of it we can see our proxy ip and its port.
- We can comment it and make our own proxy. Find the proxy IPs from the internet and check if they are working or not.
- If they are working then we will write them in our file. In the format:
**<***type (http,https,socks4,socks5)***>** **<***IP of the proxy we found***>** **<***Port number***>**

- Save and exit.
- Now we can check it using the command:
proxychains firefox google.com


## **Or**

proxychains *<application name> <website name>*

- Here we can check our public IP. It will show the same which we wrote for the proxy and also the location will be different. (According to the proxy ip location).