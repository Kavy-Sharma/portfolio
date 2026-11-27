# 🚀 How to Deploy Your Portfolio to Vercel (5 Simple Steps)

This guide walks you through connecting your GitHub repository to [Vercel](https://vercel.com) so your portfolio goes live with automatic HTTPS, global CDN caching, and continuous deployment.

---

### Step 1: Push your latest code to GitHub
Make sure all your latest files are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: portfolio ready for deployment"
git push origin main
```

---

### Step 2: Sign in to Vercel with GitHub
1. Open [vercel.com](https://vercel.com) in your browser.
2. Click **Sign Up** (or **Log In**) and choose **Continue with GitHub**.
3. Authorize Vercel to access your GitHub repositories.

---

### Step 3: Import your repository
1. On your Vercel Dashboard, click the **Add New...** button and select **Project**.
2. Find your **`portfolio`** repository in the list.
3. Click **Import** next to it.

---

### Step 4: Confirm project settings (zero configuration needed)
Vercel automatically detects the Vite framework and pre-fills the correct build configuration:
- **Framework Preset**: `Vite`
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

*(The included `vercel.json` file automatically handles single-page app routing so direct URLs like `/notes` or `/project/aegis` reload smoothly without 404 errors).*

---

### Step 5: Click "Deploy"
1. Click the blue **Deploy** button.
2. Wait ~30 to 45 seconds while Vercel builds the production bundle.
3. Congratulations! Your portfolio is live. Vercel provides an instant production URL (e.g. `https://portfolio-kavy.vercel.app`).
4. Whenever you push new commits to `main` (or edit `data/stats.json` from your phone), Vercel automatically deploys the updates within seconds!
