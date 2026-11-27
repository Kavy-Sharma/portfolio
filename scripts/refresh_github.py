import os
import sys
import json
import urllib.request
import urllib.error

GITHUB_USER = "Kavy-Sharma"
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
DATA_PATH = os.path.join("data", "github.json")
PUBLIC_DATA_PATH = os.path.join("public", "data", "github.json")

def main():
    print(f"Fetching public repositories for user: {GITHUB_USER}...")
    url = f"https://api.github.com/users/{GITHUB_USER}/repos?sort=pushed&per_page=30"
    req = urllib.request.Request(url)
    req.add_header("User-Agent", "Portfolio-Sync/1.0")
    req.add_header("Accept", "application/vnd.github.v3+json")
    if GITHUB_TOKEN:
        req.add_header("Authorization", f"Bearer {GITHUB_TOKEN}")

    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            if res.status != 200:
                print(f"Warning: GitHub API returned status {res.status}. Keeping existing file.")
                sys.exit(0)
            raw = res.read().decode("utf-8")
            data = json.loads(raw)
    except Exception as e:
        print(f"Warning: Failed to fetch from GitHub API ({e}). Keeping existing file.")
        sys.exit(0)

    if not isinstance(data, list) or len(data) == 0:
        print("Warning: Received invalid or empty repository list. Keeping existing file.")
        sys.exit(0)

    # Filter out forks or keep all public repos
    repos = []
    for r in data:
        if r.get("private"):
            continue
        repos.append({
            "name": r.get("name"),
            "description": r.get("description"),
            "html_url": r.get("html_url"),
            "pushed_at": r.get("pushed_at"),
            "stargazers_count": r.get("stargazers_count", 0),
            "language": r.get("language")
        })

    if not repos:
        print("No public repositories found. Keeping existing file.")
        sys.exit(0)

    # Sort by pushed_at descending
    repos.sort(key=lambda x: x.get("pushed_at") or "", reverse=True)
    latest_repo = repos[0] if repos else None

    payload = {
        "updated_at": latest_repo.get("pushed_at") if latest_repo else "",
        "username": GITHUB_USER,
        "latest_repo": latest_repo,
        "repos": repos
    }

    os.makedirs("data", exist_ok=True)
    os.makedirs(os.path.join("public", "data"), exist_ok=True)

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    with open(PUBLIC_DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    print(f"Successfully updated {DATA_PATH} and {PUBLIC_DATA_PATH} with {len(repos)} repositories.")

if __name__ == "__main__":
    main()
