import urllib.request
import json
import sys

BASE = "http://localhost:3001/api"

def req(method, path, data=None, token=None):
    url = BASE + path
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode() if data else None
    r = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(r)
        return json.loads(resp.read()), resp.status
    except urllib.error.HTTPError as e:
        return json.loads(e.read()), e.code

print("=== MainStreet AI Backend Tests ===\n")

# 1. Health check
res, code = req("GET", "/health")
print(f"1. Health: {code} -> {res}")
assert code == 200

# 2. Register a user
res, code = req("POST", "/auth/register", {
    "email": "mike@acmeauto.com",
    "password": "testpass123",
    "name": "Mike Johnson",
    "business_name": "Acme Auto Repair"
})
print(f"2. Register: {code} -> {res.get('message', res.get('error'))}")
assert code == 201
user_token = res["token"]

# 3. Login
res, code = req("POST", "/auth/login", {
    "email": "mike@acmeauto.com",
    "password": "testpass123"
})
print(f"3. Login: {code} -> user={res.get('user', {}).get('name')}")
assert code == 200

# 4. Create an agent
res, code = req("POST", "/agents", {
    "name": "Acme Assistant",
    "business_profile": {
        "name": "Acme Auto Repair",
        "type": "auto_repair",
        "description": "Full service auto shop"
    },
    "skills": ["appointment_scheduling", "faq_management", "receptionist_phone"],
    "languages": ["en", "es"]
}, token=user_token)
print(f"4. Create Agent: {code} -> id={res.get('agent', {}).get('id', 'N/A')[:8]}...")
assert code == 201
agent_id = res["agent"]["id"]

# 5. List agents
res, code = req("GET", "/agents", token=user_token)
print(f"5. List Agents: {code} -> count={len(res.get('agents', []))}")
assert code == 200
assert len(res["agents"]) == 1

# 6. Get agent detail
res, code = req("GET", f"/agents/{agent_id}", token=user_token)
agent = res.get("agent", {})
print(f"6. Get Agent: {code} -> skills={agent.get('skills', {}).get('enabled', [])[:3]}")
assert code == 200

# 7. Deploy agent
res, code = req("POST", f"/agents/{agent_id}/deploy", None, token=user_token)
print(f"7. Deploy: {code} -> {res.get('message')}")
assert code == 200

# 8. Chat with agent
res, code = req("POST", "/chat/message", {
    "agent_id": agent_id,
    "message": "What are your hours?",
    "language": "en"
}, token=user_token)
print(f"8. Chat: {code} -> response={res.get('message', 'N/A')[:60]}...")
assert code == 200

# 9. Admin login
res, code = req("POST", "/auth/admin-login", {
    "email": "admin@platform.local",
    "password": "admin123"
})
print(f"9. Admin Login: {code} -> role={res.get('user', {}).get('role')}")
assert code == 200
admin_token = res["token"]

# 10. Admin skills list
res, code = req("GET", "/admin/skills", token=admin_token)
print(f"10. Skills: {code} -> count={len(res.get('skills', []))}")
assert code == 200

print("\n=== ALL TESTS PASSED ===")
