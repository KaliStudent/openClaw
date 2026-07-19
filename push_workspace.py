"""
Quick GitHub push utility for MainStreet AI
Pushes all project files to KaliStudent/openClaw
"""
import urllib.request
import json
import os
import base64

TOKEN = open("/workspace/.github_token").read().strip()
OWNER = "KaliStudent"
REPO = "openClaw"
BRANCH = "main"
BASE_DIR = "/workspace"
API = "https://api.github.com"

def gh(method, path, data=None):
    url = API + path
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    if data:
        headers["Content-Type"] = "application/json"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(req)
        return json.loads(resp.read()), resp.status
    except urllib.error.HTTPError as err:
        return json.loads(err.read().decode()), err.code

def get_files(base):
    ignore = ['node_modules', '__pycache__', '.env', '.next', 'output', '.npm', '.nvm', '.cache', '.local', '.clawhub', '.superdesign', '.playwright', '.git',
              'voices', 'logs', '.vscode', '.idea', '.node', 'venv', '.venv',
              'package-lock.json', 'push_to_github.py', 'check_tools.py']
    files = []
    for root, dirs, fnames in os.walk(base):
        dirs[:] = [d for d in dirs if d not in ignore]
        for fname in fnames:
            if fname in ignore:
                continue
            if fname.endswith(('.pyc', '.wav', '.mp3', '.tar.xz', '.swp')):
                continue
            fp = os.path.join(root, fname)
            rp = os.path.relpath(fp, base)
            files.append((rp, fp))
    return files

def main():
    print(f"Pushing to {OWNER}/{REPO}...")
    
    # Get current commit SHA
    res, code = gh("GET", f"/repos/{OWNER}/{REPO}/git/ref/heads/{BRANCH}")
    parent_sha = res["object"]["sha"] if code == 200 else None
    
    # Collect and upload
    files = get_files(BASE_DIR)
    print(f"  {len(files)} files")
    
    tree_items = []
    for i, (rp, fp) in enumerate(files):
        with open(fp, "rb") as f:
            content = f.read()
        encoded = base64.b64encode(content).decode()
        res, code = gh("POST", f"/repos/{OWNER}/{REPO}/git/blobs", {
            "content": encoded, "encoding": "base64"
        })
        if code == 201:
            tree_items.append({"path": rp, "mode": "100644", "type": "blob", "sha": res["sha"]})
        if (i+1) % 10 == 0:
            print(f"  {i+1}/{len(files)}")
    
    # Create tree
    res, code = gh("POST", f"/repos/{OWNER}/{REPO}/git/trees", {"tree": tree_items})
    if code != 201:
        print(f"Tree failed: {code}")
        return
    tree_sha = res["sha"]
    
    # Create commit
    commit_data = {"message": "Workspace snapshot - css-component-lab, designs, memory, configs", "tree": tree_sha}
    if parent_sha:
        commit_data["parents"] = [parent_sha]
    else:
        commit_data["parents"] = []
    res, code = gh("POST", f"/repos/{OWNER}/{REPO}/git/commits", commit_data)
    if code != 201:
        print(f"Commit failed: {code}")
        return
    commit_sha = res["sha"]
    
    # Update ref
    if parent_sha:
        res, code = gh("PATCH", f"/repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}", {"sha": commit_sha, "force": True})
    else:
        res, code = gh("POST", f"/repos/{OWNER}/{REPO}/git/refs", {"ref": f"refs/heads/{BRANCH}", "sha": commit_sha})
    
    if code in (200, 201):
        print(f"\nDone! https://github.com/{OWNER}/{REPO}")
    else:
        print(f"Ref update failed: {code} {res}")

if __name__ == "__main__":
    main()
