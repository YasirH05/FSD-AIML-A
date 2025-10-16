import requests
import datetime

GITHUB_API_URL = "https://api.github.com"

def fetch_repo_stats(owner: str, repo: str):
    """Fetch basic stats of a GitHub repository."""
    url = f"{GITHUB_API_URL}/repos/{owner}/{repo}"
    response = requests.get(url)

    if response.status_code != 200:
        print(f"❌ Failed to fetch data: {response.status_code}")
        return None

    data = response.json()
    return {
        "name": data["name"],
        "description": data["description"],
        "stars": data["stargazers_count"],
        "forks": data["forks_count"],
        "open_issues": data["open_issues_count"],
        "last_update": data["updated_at"]
    }

def track_repositories(repos):
    """Track multiple repositories and display summary."""
    print("📊 GitHub Repo Tracker\n")
    for owner, repo in repos:
        stats = fetch_repo_stats(owner, repo)
        if stats:
            print(f"🔹 {stats['name']} ({owner})")
            print(f"   ⭐ Stars: {stats['stars']}")
            print(f"   🍴 Forks: {stats['forks']}")
            print(f"   🐞 Open Issues: {stats['open_issues']}")
            print(f"   ⏱️ Last Updated: {stats['last_update']}")
            print("-" * 40)

def log_to_file(stats_list, filename="github_log.txt"):
    """Save repository stats to a log file with timestamp."""
    with open(filename, "a") as f:
        f.write(f"\n--- {datetime.datetime.now()} ---\n")
        for stats in stats_list:
            f.write(f"{stats['name']} - ⭐ {stats['stars']} | 🍴 {stats['forks']}\n")

if __name__ == "__main__":
    repos_to_track = [
        ("torvalds", "linux"),
        ("microsoft", "vscode"),
        ("openai", "gpt-4"),
    ]

    stats_list = []
    for owner, repo in repos_to_track:
        data = fetch_repo_stats(owner, repo)
        if data:
            stats_list.append(data)

    if stats_list:
        log_to_file(stats_list)
        track_repositories(repos_to_track)
        print("\n✅ Data logged successfully!")
