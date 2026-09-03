#!/usr/bin/env python3
"""
Fetches public GitHub activity for a user and writes it to data/github-activity.json.

Uses only unauthenticated public REST API endpoints, since the account's
activity is public. No personal access token is required. If you hit
GitHub's low unauthenticated rate limit (60 req/hr) during testing, the
optional GITHUB_TOKEN env var (set automatically by GitHub Actions) is
used only to raise that limit -- it is never exposed to site visitors
because this script only ever runs server-side in the Action, not in
the browser.
"""

import json
import os
import sys
import urllib.request
import urllib.error
from collections import defaultdict
from datetime import datetime, timezone

USERNAME = os.environ.get("GITHUB_USERNAME", "chloeatwood")
OUTPUT_PATH = os.environ.get("OUTPUT_PATH", "data/github-activity.json")
CURRENTLY_WORKING_ON = [
    {"repo": "BookScout", "note": "Active development", "emoji": "\U0001F4DA"},
    {"repo": "Portfolio", "note": "Active development", "emoji": "\U0001F4BB"},
]

API_ROOT = "https://api.github.com"


def _get(url):
    req = urllib.request.Request(
        url,
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": f"{USERNAME}-portfolio-github-activity-script",
        },
    )
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"Request failed ({e.code}) for {url}: {e.reason}", file=sys.stderr)
        return None
    except Exception as e:  # noqa: BLE001
        print(f"Request error for {url}: {e}", file=sys.stderr)
        return None


def fetch_public_events(username):
    events = []
    for page in range(1, 4):  # public events API caps at ~300 recent events / 3 pages
        data = _get(f"{API_ROOT}/users/{username}/events/public?per_page=100&page={page}")
        if not data:
            break
        events.extend(data)
        if len(data) < 100:
            break
    return events


def fetch_repos(username):
    data = _get(f"{API_ROOT}/users/{username}/repos?per_page=100&sort=updated")
    return data or []


def build_contribution_heatmap(events):
    """Rough daily activity counts derived from public events (not the exact
    GitHub contribution graph algorithm, but a close visual approximation)."""
    counts = defaultdict(int)
    for e in events:
        created = e.get("created_at")
        if not created:
            continue
        day = created[:10]
        counts[day] += 1
    return dict(sorted(counts.items()))


def build_recent_commits(events, limit=8):
    commits = []
    for e in events:
        if e.get("type") != "PushEvent":
            continue
        repo_name = e.get("repo", {}).get("name", "")
        for c in e.get("payload", {}).get("commits", []):
            commits.append({
                "repo": repo_name,
                "message": c.get("message", "").split("\n")[0][:120],
                "sha": (c.get("sha") or "")[:7],
                "date": e.get("created_at"),
            })
    commits.sort(key=lambda c: c["date"], reverse=True)
    return commits[:limit]


def build_language_breakdown(repos):
    langs = defaultdict(int)
    for r in repos:
        lang = r.get("language")
        if lang:
            langs[lang] += 1
    total = sum(langs.values()) or 1
    return [
        {"language": lang, "percent": round(count / total * 100, 1)}
        for lang, count in sorted(langs.items(), key=lambda kv: kv[1], reverse=True)
    ]


def build_recently_updated_repos(repos, limit=6):
    sorted_repos = sorted(repos, key=lambda r: r.get("pushed_at", ""), reverse=True)
    return [
        {
            "name": r.get("name"),
            "url": r.get("html_url"),
            "description": r.get("description"),
            "language": r.get("language"),
            "stars": r.get("stargazers_count", 0),
            "pushed_at": r.get("pushed_at"),
        }
        for r in sorted_repos[:limit]
    ]


def main():
    events = fetch_public_events(USERNAME)
    repos = fetch_repos(USERNAME)

    output = {
        "username": USERNAME,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "currently_working_on": CURRENTLY_WORKING_ON,
        "heatmap": build_contribution_heatmap(events),
        "recent_commits": build_recent_commits(events),
        "recently_updated_repos": build_recently_updated_repos(repos),
        "languages": build_language_breakdown(repos),
    }

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print(f"Wrote {OUTPUT_PATH} with {len(output['recent_commits'])} recent commits, "
          f"{len(output['recently_updated_repos'])} repos, "
          f"{len(output['heatmap'])} active days.")


if __name__ == "__main__":
    main()
