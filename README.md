# Kavy Sharma — Security Research & VAPT Portfolio

> Personal cybersecurity and AI security portfolio structured as an interactive 5-floor building, featuring defensive architecture simulations, offensive lab walkthroughs, and field research notes.
>
> **Live Site:** [https://kavysharma.dev](https://kavysharma.dev) &nbsp;|&nbsp; **Stack:** React 18, Vite 6, GSAP 3.12, Lenis smooth scrolling, and vanilla CSS custom properties.

---

## 🏛️ Concept & Themes
- **Defend (Daylight)**: Calm, light default theme representing defensive verification, parameter guards, and reverse proxies (`#EEF2F5`).
- **Attack (Night)**: Dark adversary theme representing penetration testing, prompt injection fuzzing, and exploit paths (`#150C11`).
- **Signature Visual**: Smooth, slow-drifting contour lines rendered dynamically via marching squares on HTML5 canvas (~20fps, throttled, pauses offscreen, static when `prefers-reduced-motion` is enabled).

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 18, Vite 6
- **Motion & Scrolling**: GSAP 3.12, ScrollTrigger, Lenis smooth scrolling
- **Design System**: Vanilla CSS custom properties with WCAG AA compliance (contrast ratio $\ge 4.5:1$)
- **Typography**: Google Fonts — *Bricolage Grotesque* (display), *Instrument Sans* (body), *Geist Mono* (metrics and labels)
- **Data Layer**: Eagerly loaded Markdown notes (`/content/notes/*.md`), standalone dynamic stats (`data/stats.json`), and automated GitHub telemetry (`data/github.json`)

---

## 🚀 Running Locally

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Kavy-Sharma/portfolio.git
cd portfolio

# Install dependencies
npm install
```

### 3. Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Production Build & Preview
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```
Open `http://localhost:4173` to view the optimized build.

---

## 🌐 Deploying to Vercel from GitHub (Step by Step)

Deploying this portfolio to [Vercel](https://vercel.com) takes less than 2 minutes:

1. **Push to GitHub**:
   Ensure your local repository is committed and pushed to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete portfolio build"
   git push origin main
   ```

2. **Sign in to Vercel**:
   Go to [vercel.com](https://vercel.com) and log in with your GitHub account.

3. **Import Project**:
   - Click the **"Add New..."** button on your dashboard and select **"Project"**.
   - Select your portfolio repository from the list and click **"Import"**.

4. **Configure Project Settings**:
   - **Framework Preset**: Vercel will automatically detect **Vite**.
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Deploy**:
   - Click **"Deploy"**.
   - Vercel will build the application and issue a production URL with automatic HTTPS and global edge caching.
   - Any future push to the `main` branch on GitHub will automatically trigger a production deployment.

---

## 📱 How to update

### Editing `data/stats.json` from a phone (3 short steps)

You can update all live portfolio stats (PortSwigger labs, TryHackMe rank, and current "Now" focus) directly from your mobile browser in under 60 seconds:

1. **Open `data/stats.json` on GitHub**: In your mobile browser, navigate to your repo and open `data/stats.json` (e.g. `github.com/Kavy-Sharma/portfolio/blob/main/data/stats.json`).
2. **Tap the pencil icon to edit**: Tap the **pencil icon** (or the **⋯** menu > **Edit file**). Update `portswiggerLabs`, `thmRank`, `nowLine`, and set `asOf` to today's date (`YYYY-MM-DD`).
3. **Commit changes directly to `main`**: Scroll down, tap **Commit changes...**, and confirm. Your hosting provider (Vercel) automatically rebuilds and deploys the new stats within seconds.

> [!IMPORTANT]
> **Never use GitHub commit counts as a headline number**: The core engine of PhishSim AI lives in a private repository (`phishsim-core`), so public GitHub commit counters significantly understate the actual volume of work and technical effort. All headline metrics on the site are driven by verified external proofs and `data/stats.json`.

---

## 🔄 Content & Automation Details

### 1. How to Add a New Field Note
The site automatically indexes and generates reader pages for any Markdown file located in `content/notes/`:

1. Create a new markdown file in `content/notes/<slug>.md`.
2. Add the required frontmatter header:
   ```yaml
   ---
   title: "Your Note Title"
   slug: "your-note-slug"
   date: "2026-11-25"
   category: "Web Security"
   tags: ["VAPT", "OWASP", "Burp Suite"]
   owasp: ["A01:2021-Broken Access Control"]
   red: "What I did as the attacker in plain words."
   blue: "How a defender detects and stops it."
   summary: "Short summary of the note."
   ---
   ```
3. Write your technical notes below the frontmatter using standard Markdown. Code blocks (```` ```bash ````, ```` ```sql ````, etc.) will automatically render with interactive **"Copy"** buttons.
4. Images can be placed in `content/notes/images/` and referenced via `![Caption](./images/your-image.png)`.
5. That's it! Vite's `import.meta.glob` data layer will automatically index the note as a card in the Field Notes section and render it in the reader modal.

### 2. How to Update Stats & Proof Numbers
Every metric on the site (PortSwigger solved count, TryHackMe global percent, CTF rank, certificates, client test counts) lives **strictly in `data/stats.json`**. No changing numbers are hardcoded in template text.

To update stats directly from **github.com**:
1. Navigate to `data/stats.json` on GitHub.
2. Click the pencil icon (**Edit this file**).
3. Update the relevant values (e.g. increment `portswigger` solved counts, change `updated` date):
   ```json
   {
     "updated": "2026-11-25",
     "portswigger": {
       "apprentice": [31, 64],
       "practitioner": [67, 175],
       "expert": [7, 40]
     },
     "tryhackme": {
       "top_percent": 7,
       "profile_url": "https://tryhackme.com/p/kavysharma196"
     },
     "htb_starting_point": ["Meow", "Fawn", "Dancing"],
     "ctf": [
       {
         "name": "Sea of Secrets (HackItUp)",
         "date": "2026-10",
         "mode": "solo",
         "rank_under": 150,
         "participants": null
       }
     ],
     "certificates": [
       {
         "name": "Introduction to AI Security",
         "issuer": "AI Security University",
         "date": "2026-09"
       }
     ],
     "client_tests_plus": 20
   }
   ```
4. Commit your changes. Vercel will automatically re-deploy the updated numbers.

### 3. Automated Daily GitHub Activity Sync
The repository includes a GitHub Actions workflow (`.github/workflows/refresh.yml`) that runs daily at **06:00 UTC** and supports manual triggers:
- Fetches all public repositories for `github.com/Kavy-Sharma` via GitHub REST API using `GITHUB_TOKEN`.
- Writes the latest active repository and push timestamp to `data/github.json`.
- **Fail-safe**: If the API rate limits or network fails, the workflow gracefully keeps the existing good file without overwriting.
- The portfolio is resilient and **never breaks** even if `data/github.json` is missing.

---

## 🛡️ Facts & Constraints Verification

This portfolio strictly adheres to the facts documented in `project-notes/facts.md`:
- **Identity**: Kavy Sharma, Jodhpur. B.E. Electronics & Computer Engineering, MBM University (2023–2027).
- **Hero Statement**: "since mid-2025" (no start month claimed).
- **Projects**:
  - **PhishSim AI**: Live on Render, public showcase repo, full engine private. Runs in sandbox mode with zero outbound emails.
  - **AegisAgent**: Tested against real ESP32 hardware with honest documentation of declarative keyword guard limitations.
  - **SentinelFlow**: Hybrid NIDS engine pairing heuristic rules with unsupervised Isolation Forest.
  - **SafeLine WAF Lab**: Marked **IN PROGRESS** (VMs, DVWA, DNS, self-signed TLS, and reverse proxy verified; attack/blocking tests pending; no block page).
- **Exclusions**: Zero invented CVEs, zero bug bounties, zero fake user counts, zero revenue claims, zero dark terminal cosplay or matrix tropes.

---

## 📜 License

MIT License &copy; 2026 Kavy Sharma. All rights reserved.
