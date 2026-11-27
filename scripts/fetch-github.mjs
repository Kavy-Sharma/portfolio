import fs from 'node:fs';
import path from 'node:path';

const GITHUB_USERNAME = 'Kavy-Sharma';
const OUTPUT_FILE = path.resolve('data/github.json');

async function main() {
  console.log(`[fetch-github] Starting GitHub fetch for ${GITHUB_USERNAME}...`);

  const headers = {
    'User-Agent': 'Kavy-Portfolio-Bot/1.0',
    'Accept': 'application/vnd.github.v3+json'
  };

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) {
    headers['Authorization'] = `token ${token}`;
    console.log('[fetch-github] Using authenticated GitHub token');
  } else {
    console.log('[fetch-github] Running unauthenticated (standard rate limits apply)');
  }

  try {
    // 1. Fetch user data (public repo count)
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers });
    if (!userRes.ok) {
      throw new Error(`Failed to fetch user data: HTTP ${userRes.status} ${userRes.statusText}`);
    }
    const userData = await userRes.json();
    const publicRepoCount = userData.public_repos || 0;

    // 2. Fetch public repos sorted by pushed date
    const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`, { headers });
    if (!reposRes.ok) {
      throw new Error(`Failed to fetch repos: HTTP ${reposRes.status} ${reposRes.statusText}`);
    }
    const reposData = await reposRes.json();

    const repos = {};
    const lastPushByRepo = {};

    if (Array.isArray(reposData)) {
      for (const repo of reposData) {
        if (!repo.name) continue;
        repos[repo.name] = {
          name: repo.name,
          pushedAt: repo.pushed_at,
          createdAt: repo.created_at,
          description: repo.description || '',
          url: repo.html_url
        };
        lastPushByRepo[repo.name] = repo.pushed_at;
      }
    }

    // 3. Fetch public events for activity history
    const eventsRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`, { headers });
    let eventsData = [];
    if (eventsRes.ok) {
      eventsData = await eventsRes.json();
      if (!Array.isArray(eventsData)) eventsData = [];
    } else {
      console.warn(`[fetch-github] Warning: events returned HTTP ${eventsRes.status}; continuing with repo push dates`);
    }

    // 4. Build 52-week activity array
    // Anchor to today's date
    const now = new Date();
    const weeks = [];
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const MS_PER_WEEK = 7 * MS_PER_DAY;

    // Align the most recent week to end today
    const currentWeekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const startOf52WeeksAgo = new Date(currentWeekEnd.getTime() - 52 * MS_PER_WEEK + 1);

    // Group events and repo push events into weekly buckets
    for (let w = 0; w < 52; w++) {
      const weekStart = new Date(startOf52WeeksAgo.getTime() + w * MS_PER_WEEK);
      const weekEnd = new Date(weekStart.getTime() + MS_PER_WEEK - 1);

      const startISO = weekStart.toISOString().split('T')[0];
      const endISO = weekEnd.toISOString().split('T')[0];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const label = `Week of ${monthNames[weekStart.getMonth()]} ${weekStart.getDate()}`;

      // Count events matching this week's date range
      let count = 0;

      // Check PushEvents and CreateEvents from events API
      for (const event of eventsData) {
        if (!event.created_at) continue;
        const eventTime = new Date(event.created_at).getTime();
        if (eventTime >= weekStart.getTime() && eventTime <= weekEnd.getTime()) {
          if (event.type === 'PushEvent') {
            const commitCount = event.payload?.commits?.length || 1;
            count += commitCount;
          } else if (event.type === 'CreateEvent' || event.type === 'WatchEvent') {
            count += 1;
          }
        }
      }

      // Also count repo pushes that fall into this week if not covered
      for (const repo of Object.values(repos)) {
        if (repo.pushedAt) {
          const pushTime = new Date(repo.pushedAt).getTime();
          if (pushTime >= weekStart.getTime() && pushTime <= weekEnd.getTime()) {
            // Count at least 1 activity if repo was pushed this week
            if (count === 0) count = 1;
          }
        }
      }

      // Activity level: 0 (none), 1 (1-2), 2 (3-5), 3 (6-9), 4 (10+)
      let level = 0;
      if (count >= 10) level = 4;
      else if (count >= 6) level = 3;
      else if (count >= 3) level = 2;
      else if (count >= 1) level = 1;

      weeks.push({
        week: w + 1,
        startDate: startISO,
        endDate: endISO,
        label,
        count,
        level
      });
    }

    const outputData = {
      fetchedAt: new Date().toISOString(),
      publicRepoCount,
      repos,
      lastPushByRepo,
      weeks
    };

    // Ensure data directory exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2) + '\n', 'utf-8');
    console.log(`[fetch-github] Successfully wrote ${OUTPUT_FILE} (${publicRepoCount} repos, 52 weeks)`);
  } catch (error) {
    console.warn('[fetch-github] Request failed:', error.message);
    if (fs.existsSync(OUTPUT_FILE)) {
      console.log('[fetch-github] Existing data/github.json preserved. Exiting cleanly without error.');
    } else {
      console.warn('[fetch-github] No existing data/github.json found.');
    }
    // As per rule: "If a request fails, keep the previous file and exit without error."
    process.exit(0);
  }
}

main();
