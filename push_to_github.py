"""
Push MainStreet AI project to GitHub using the REST API.
Since we don't have git CLI, we use the GitHub API to create commits directly.
"""
import urllib.request
import json
import os
import base64
import hashlib

TOKEN = os.environ.get("GITHUB_TOKEN", "")
REPO_OWNER = "KaliStudent"  # Will detect from token
REPO_NAME = "openClaw"
BRANCH = "main"
BASE_DIR = "/workspace/project"

API = "https://api.github.com"

def gh_request(method, path, data=None):
    url = API + path if path.startswith("/") else path
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
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        return json.loads(error_body) if error_body else {}, e.code

def get_user():
    res, code = gh_request("GET", "/user")
    if code == 200:
        return res["login"]
    print(f"Failed to get user: {code} {res}")
    return None

def get_all_files(base_dir):
    """Walk directory and collect all files (respecting .gitignore patterns)"""
    ignore_patterns = [
        'node_modules', '__pycache__', '.env', '.next', 'out', 'dist',
        'build', 'output/', 'voices/', 'logs/', '.wav', '.mp3',
        '.vscode', '.idea', '.DS_Store', '*.pyc', '.venv', 'venv',
        '.node', '*.tar.xz', 'package-lock.json'
    ]
    
    files = []
    for root, dirs, filenames in os.walk(base_dir):
        # Skip ignored directories
        dirs[:] = [d for d in dirs if not any(
            p.rstrip('/') == d for p in ignore_patterns
        )]
        
        for fname in filenames:
            # Skip ignored files
            skip = False
            for p in ignore_patterns:
                if p.startswith('*'):
                    if fname.endswith(p[1:]):
                        skip = True
                        break
                elif fname == p or fname == p.rstrip('/'):
                    skip = True
                    break
            if skip:
                continue
                
            filepath = os.path.join(root, fname)
            relpath = os.path.relpath(filepath, base_dir)
            files.append((relpath, filepath))
    
    return files

def create_blob(owner, content_bytes):
    """Create a git blob"""
    encoded = base64.b64encode(content_bytes).decode()
    res, code = gh_request("POST", f"/repos/{owner}/{REPO_NAME}/git/blobs", {
        "content": encoded,
        "encoding": "base64"
    })
    if code == 201:
        return res["sha"]
    print(f"  Blob create failed: {code}")
    return None

def create_tree(owner, base_tree, tree_items):
    """Create a git tree"""
    res, code = gh_request("POST", f"/repos/{owner}/{REPO_NAME}/git/trees", {
        "base_tree": base_tree,
        "tree": tree_items
    } if base_tree else {
        "tree": tree_items
    })
    if code == 201:
        return res["sha"]
    print(f"  Tree create failed: {code} {res}")
    return None

def create_commit(owner, message, tree_sha, parent_sha=None):
    """Create a git commit"""
    data = {
        "message": message,
        "tree": tree_sha
    }
    if parent_sha:
        data["parents"] = [parent_sha]
    else:
        data["parents"] = []
    
    res, code = gh_request("POST", f"/repos/{owner}/{REPO_NAME}/git/commits", data)
    if code == 201:
        return res["sha"]
    print(f"  Commit create failed: {code} {res}")
    return None

def update_ref(owner, ref, sha):
    """Update branch reference"""
    # Try to update existing ref
    res, code = gh_request("PATCH", f"/repos/{owner}/{REPO_NAME}/git/refs/heads/{ref}", {
        "sha": sha,
        "force": True
    })
    if code == 200:
        return True
    
    # Create ref if it doesn't exist
    res, code = gh_request("POST", f"/repos/{owner}/{REPO_NAME}/git/refs", {
        "ref": f"refs/heads/{ref}",
        "sha": sha
    })
    return code == 201

def main():
    if not TOKEN:
        print("ERROR: Set GITHUB_TOKEN environment variable")
        return
    
    print("=== Pushing MainStreet AI to GitHub ===\n")
    
    # Get username
    owner = get_user()
    if not owner:
        return
    print(f"Authenticated as: {owner}")
    
    # Check repo exists
    res, code = gh_request("GET", f"/repos/{owner}/{REPO_NAME}")
    if code != 200:
        print(f"Repo {owner}/{REPO_NAME} not found (code {code})")
        print("Creating repo...")
        res, code = gh_request("POST", "/user/repos", {
            "name": REPO_NAME,
            "private": True,
            "description": "MainStreet AI - Small Business AI Agent Platform"
        })
        if code != 201:
            print(f"Failed to create repo: {code} {res}")
            return
        print("Repo created!")
    else:
        print(f"Repo found: {owner}/{REPO_NAME}")
    
    # Collect files
    print("\nCollecting files...")
    files = get_all_files(BASE_DIR)
    print(f"Found {len(files)} files to push")
    
    # Create blobs for all files
    print("\nCreating blobs...")
    tree_items = []
    for i, (relpath, filepath) in enumerate(files):
        with open(filepath, "rb") as f:
            content = f.read()
        
        blob_sha = create_blob(owner, content)
        if blob_sha:
            tree_items.append({
                "path": relpath,
                "mode": "100644",
                "type": "blob",
                "sha": blob_sha
            })
            if (i + 1) % 10 == 0:
                print(f"  {i+1}/{len(files)} files processed")
    
    print(f"  {len(tree_items)} blobs created")
    
    # Create tree
    print("\nCreating tree...")
    tree_sha = create_tree(owner, None, tree_items)
    if not tree_sha:
        print("Failed to create tree")
        return
    print(f"  Tree: {tree_sha[:8]}")
    
    # Create commit
    print("\nCreating commit...")
    commit_sha = create_commit(owner, "Initial commit - MainStreet AI platform\n\nIncludes:\n- Backend API (Node.js/Express)\n- Frontend (Next.js/React)\n- TTS Service (Python/XTTS v2)\n- Agent definitions (9 specialists)\n- Memory system design\n- Knowledge bank with access control", tree_sha)
    if not commit_sha:
        print("Failed to create commit")
        return
    print(f"  Commit: {commit_sha[:8]}")
    
    # Update main branch
    print("\nUpdating branch...")
    if update_ref(owner, BRANCH, commit_sha):
        print(f"  Branch '{BRANCH}' updated!")
    else:
        print("  Failed to update branch")
        return
    
    print(f"\n=== SUCCESS ===")
    print(f"https://github.com/{owner}/{REPO_NAME}")

if __name__ == "__main__":
    main()
