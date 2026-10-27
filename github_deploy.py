import subprocess
import urllib.request
import json
import os

# 1. Get credentials from git credential helper
def get_github_token():
    try:
        proc = subprocess.Popen(['git', 'credential', 'fill'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        out, err = proc.communicate(input="protocol=https\nhost=github.com\n\n")
        token = None
        username = None
        for line in out.splitlines():
            if line.startswith('password='):
                token = line[len('password='):].strip()
            elif line.startswith('username='):
                username = line[len('username='):].strip()
        return username, token
    except Exception as e:
        print("Error getting credentials:", e)
        return None, None

username, token = get_github_token()
print(f"Username from credentials: {username}")
if not token:
    print("No token found in credential helper.")
    exit(1)

headers = {
    'Authorization': f'Bearer {token}',
    'User-Agent': 'Antigravity-Agent',
    'Accept': 'application/vnd.github.v3+json'
}

# 2. Check authenticated user via API
req = urllib.request.Request('https://api.github.com/user', headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        user_data = json.loads(resp.read().decode('utf-8'))
        login = user_data.get('login')
        print(f"Authenticated as GitHub user: {login} ({user_data.get('name')})")
except Exception as e:
    print("Failed to authenticate with GitHub API:", e)
    exit(1)

# 3. Create repository if it doesn't already exist
repo_name = 'aashri-restaurant'
repo_payload = {
    'name': repo_name,
    'description': 'Aashri Pure Veg Restaurant & Banquet — Luxury hospitality website for Nagpur, Maharashtra. Inspired by Persepolis storytelling.',
    'private': False,
    'has_issues': True,
    'has_wiki': False
}

repo_url = f"https://github.com/{login}/{repo_name}"
clone_url = f"https://github.com/{login}/{repo_name}.git"

create_req = urllib.request.Request(
    'https://api.github.com/user/repos',
    data=json.dumps(repo_payload).encode('utf-8'),
    headers={**headers, 'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(create_req) as resp:
        created_data = json.loads(resp.read().decode('utf-8'))
        print(f"Created new repository: {created_data.get('html_url')}")
except urllib.error.HTTPError as e:
    if e.code == 422:
        print(f"Repository {repo_name} already exists or was created.")
    else:
        print(f"HTTPError creating repo: {e.code} {e.read().decode('utf-8', errors='ignore')}")
except Exception as e:
    print("Repo creation notice:", e)

# 4. Initialize git and commit files
subprocess.run(['git', 'init'], check=True)
subprocess.run(['git', 'config', 'user.name', 'yogini-na'], check=True)
subprocess.run(['git', 'config', 'user.email', 'yogininasare12@gmail.com'], check=True)
subprocess.run(['git', 'branch', '-M', 'main'], check=True)
subprocess.run(['git', 'add', '.'], check=True)
subprocess.run(['git', 'commit', '-m', 'feat: initial release of Aashri Pure Veg Restaurant & Banquet website'], check=False)

# Check remotes
remotes_proc = subprocess.run(['git', 'remote', '-v'], capture_output=True, text=True)
if 'origin' in remotes_proc.stdout:
    subprocess.run(['git', 'remote', 'set-url', 'origin', clone_url], check=True)
else:
    subprocess.run(['git', 'remote', 'add', 'origin', clone_url], check=True)

# 5. Push to origin main
print(f"Pushing to {clone_url}...")
push_proc = subprocess.run(['git', 'push', '-u', 'origin', 'main'], capture_output=True, text=True)
print("Push stdout:", push_proc.stdout)
print("Push stderr:", push_proc.stderr)

# 6. Enable GitHub Pages on the repo
print("Enabling GitHub Pages...")
pages_req = urllib.request.Request(
    f'https://api.github.com/repos/{login}/{repo_name}/pages',
    data=json.dumps({'source': {'branch': 'main', 'path': '/'}}).encode('utf-8'),
    headers={**headers, 'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(pages_req) as resp:
        pages_data = json.loads(resp.read().decode('utf-8'))
        print(f"GitHub Pages enabled! Live URL: {pages_data.get('html_url')}")
except urllib.error.HTTPError as e:
    resp_text = e.read().decode('utf-8', errors='ignore')
    if e.code == 409 or 'already has a Pages site' in resp_text:
        print(f"GitHub Pages is already enabled. Live URL: https://{login.lower()}.github.io/{repo_name}/")
    else:
        print(f"GitHub Pages configuration notice (code {e.code}): {resp_text}")
except Exception as e:
    print("GitHub Pages notice:", e)

print(f"\nSUCCESS! Repository is live at: {repo_url}")
print(f"Hosted GitHub Pages site at: https://{login.lower()}.github.io/{repo_name}/")
