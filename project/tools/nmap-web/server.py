"""
Rainmap Lite — Modern web-based nmap scanner
Inspired by the original Rainmap (nmap.org/rainmap)
Single-file Flask app with SQLite backend, no external deps beyond nmap.
"""
import os
import json
import uuid
import sqlite3
import subprocess
import threading
import time
from datetime import datetime
from functools import wraps

from flask import (
    Flask, render_template_string, request, jsonify,
    redirect, url_for, session, send_from_directory
)

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'change-me-in-production-' + uuid.uuid4().hex)

DB_PATH = '/app/db/rainmap.db'
SCAN_DIR = '/app/scans'
ADMIN_USER = os.environ.get('ADMIN_USER', 'admin')
ADMIN_PASS = os.environ.get('ADMIN_PASS', 'admin')

os.makedirs(SCAN_DIR, exist_ok=True)
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)


# ─── Database ───────────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS scans (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            targets TEXT NOT NULL,
            options TEXT DEFAULT '',
            status TEXT DEFAULT 'queued',
            created_at TEXT NOT NULL,
            started_at TEXT,
            finished_at TEXT,
            output_file TEXT,
            error TEXT
        );
    ''')
    conn.commit()
    conn.close()


init_db()


# ─── Auth ───────────────────────────────────────────────────────────────────

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('authenticated'):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated


# ─── Scanner ────────────────────────────────────────────────────────────────

def run_scan_task(scan_id, targets, options):
    """Run nmap in background thread"""
    conn = get_db()
    conn.execute("UPDATE scans SET status='running', started_at=? WHERE id=?",
                 (datetime.now().isoformat(), scan_id))
    conn.commit()

    output_xml = os.path.join(SCAN_DIR, f"{scan_id}.xml")
    output_html = os.path.join(SCAN_DIR, f"{scan_id}.html")
    output_txt = os.path.join(SCAN_DIR, f"{scan_id}.txt")

    # Build command
    cmd = ['nmap']
    if options:
        cmd.extend(options.split())
    cmd.extend(['-oX', output_xml, '-oN', output_txt])
    cmd.extend(targets.split())

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=3600)

        if result.returncode == 0:
            # Convert XML to HTML via xsltproc
            try:
                subprocess.run(['xsltproc', output_xml, '-o', output_html],
                             capture_output=True, timeout=30)
            except Exception:
                pass

            conn.execute(
                "UPDATE scans SET status='complete', finished_at=?, output_file=? WHERE id=?",
                (datetime.now().isoformat(), f"{scan_id}.html", scan_id))
        else:
            conn.execute(
                "UPDATE scans SET status='error', finished_at=?, error=? WHERE id=?",
                (datetime.now().isoformat(), result.stderr[:500], scan_id))
    except subprocess.TimeoutExpired:
        conn.execute(
            "UPDATE scans SET status='error', finished_at=?, error=? WHERE id=?",
            (datetime.now().isoformat(), 'Scan timed out (1h limit)', scan_id))
    except Exception as ex:
        conn.execute(
            "UPDATE scans SET status='error', finished_at=?, error=? WHERE id=?",
            (datetime.now().isoformat(), str(ex)[:500], scan_id))

    conn.commit()
    conn.close()


# ─── Routes ─────────────────────────────────────────────────────────────────

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if (request.form['username'] == ADMIN_USER and
            request.form['password'] == ADMIN_PASS):
            session['authenticated'] = True
            return redirect(url_for('dashboard'))
        error = 'Invalid credentials'
    return render_template_string(LOGIN_HTML, error=error)


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


@app.route('/')
@login_required
def dashboard():
    conn = get_db()
    scans = conn.execute("SELECT * FROM scans ORDER BY created_at DESC LIMIT 50").fetchall()
    conn.close()

    running = sum(1 for s in scans if s['status'] == 'running')
    complete = sum(1 for s in scans if s['status'] == 'complete')
    errors = sum(1 for s in scans if s['status'] == 'error')

    return render_template_string(DASHBOARD_HTML,
        scans=scans, running=running, complete=complete, errors=errors)


@app.route('/scan/new', methods=['GET', 'POST'])
@login_required
def scan_new():
    if request.method == 'POST':
        scan_id = uuid.uuid4().hex[:12]
        name = request.form.get('name', 'Untitled Scan')
        targets = request.form.get('targets', '').strip()
        options = request.form.get('options', '').strip()

        if not targets:
            return render_template_string(SCAN_NEW_HTML, error='Targets required')

        conn = get_db()
        conn.execute(
            "INSERT INTO scans (id, name, targets, options, created_at) VALUES (?,?,?,?,?)",
            (scan_id, name, targets, options, datetime.now().isoformat()))
        conn.commit()
        conn.close()

        # Launch scan in background
        t = threading.Thread(target=run_scan_task, args=(scan_id, targets, options))
        t.daemon = True
        t.start()

        return redirect(url_for('dashboard'))

    return render_template_string(SCAN_NEW_HTML, error=None)


@app.route('/scan/<scan_id>')
@login_required
def scan_view(scan_id):
    conn = get_db()
    scan = conn.execute("SELECT * FROM scans WHERE id=?", (scan_id,)).fetchone()
    conn.close()

    if not scan:
        return redirect(url_for('dashboard'))

    # Read text output
    txt_path = os.path.join(SCAN_DIR, f"{scan_id}.txt")
    txt_output = ''
    if os.path.exists(txt_path):
        with open(txt_path) as fh:
            txt_output = fh.read()

    return render_template_string(SCAN_VIEW_HTML, scan=scan, output=txt_output)


@app.route('/scan/<scan_id>/html')
@login_required
def scan_html(scan_id):
    html_path = os.path.join(SCAN_DIR, f"{scan_id}.html")
    if os.path.exists(html_path):
        return send_from_directory(SCAN_DIR, f"{scan_id}.html")
    return "No HTML output available", 404


@app.route('/scan/<scan_id>/xml')
@login_required
def scan_xml(scan_id):
    xml_path = os.path.join(SCAN_DIR, f"{scan_id}.xml")
    if os.path.exists(xml_path):
        return send_from_directory(SCAN_DIR, f"{scan_id}.xml",
                                   mimetype='application/xml')
    return "No XML output available", 404


@app.route('/scan/<scan_id>/delete', methods=['POST'])
@login_required
def scan_delete(scan_id):
    conn = get_db()
    conn.execute("DELETE FROM scans WHERE id=?", (scan_id,))
    conn.commit()
    conn.close()

    # Clean up files
    for ext in ['.xml', '.html', '.txt']:
        path = os.path.join(SCAN_DIR, f"{scan_id}{ext}")
        if os.path.exists(path):
            os.remove(path)

    return redirect(url_for('dashboard'))


@app.route('/api/status')
@login_required
def api_status():
    conn = get_db()
    scans = conn.execute("SELECT id, status FROM scans WHERE status='running'").fetchall()
    conn.close()
    return jsonify({'running': [dict(s) for s in scans]})


# ─── Templates ──────────────────────────────────────────────────────────────

STYLE = '''
<style>
* { margin:0; padding:0; box-sizing:border-box; }
:root {
    --bg: #0a0a0a; --bg2: #111; --bg3: #1a1a1a;
    --text: #fff; --slate: #708090; --muted: #4a5568;
    --green: #39ff14; --orange: #f6821f; --magenta: #ff2ecc;
    --border: #333;
}
body { font-family: 'Segoe UI',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }
a { color:var(--green); text-decoration:none; }
a:hover { color:var(--orange); }
.mono { font-family: 'Consolas','Courier New',monospace; }
.container { max-width:1100px; margin:0 auto; padding:0 24px; }

/* Header */
.header { display:flex; align-items:center; justify-content:space-between; padding:20px 0; border-bottom:2px solid var(--border); }
.logo { font-family:monospace; font-size:1.3rem; font-weight:700; color:var(--green); }
.nav { display:flex; gap:20px; align-items:center; }
.nav a { font-family:monospace; font-size:0.85rem; text-transform:uppercase; color:var(--slate); }
.nav a:hover { color:var(--green); }

/* Buttons */
.btn { display:inline-block; padding:10px 24px; font-family:monospace; font-size:0.85rem; font-weight:600;
       text-transform:uppercase; letter-spacing:0.05em; border:2px solid; cursor:pointer; text-decoration:none; }
.btn-green { background:var(--green); color:#000; border-color:var(--green); }
.btn-green:hover { background:transparent; color:var(--green); }
.btn-ghost { background:transparent; color:var(--slate); border-color:var(--border); }
.btn-ghost:hover { border-color:var(--text); color:var(--text); }
.btn-red { background:transparent; color:var(--magenta); border-color:var(--magenta); }
.btn-red:hover { background:var(--magenta); color:#000; }

/* Forms */
input,select,textarea { width:100%; padding:12px; background:var(--bg2); border:2px solid var(--border);
    color:var(--text); font-size:1rem; font-family:inherit; }
input:focus,textarea:focus,select:focus { outline:none; border-color:var(--green); box-shadow:0 0 10px rgba(57,255,20,0.2); }
label { display:block; font-family:monospace; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--slate); margin-bottom:4px; }
::placeholder { color:var(--muted); }

/* Cards */
.card { background:var(--bg3); border:2px solid var(--border); padding:24px; margin-bottom:16px; }
.card:hover { border-color:var(--green); }

/* Stats */
.stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin:32px 0; }
.stat { padding:20px; border:2px solid var(--border); background:var(--bg3); }
.stat-val { font-family:monospace; font-size:2rem; font-weight:700; color:var(--green); }
.stat-label { font-family:monospace; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); margin-top:4px; }

/* Table */
table { width:100%; border-collapse:collapse; }
th { text-align:left; padding:12px; font-family:monospace; font-size:0.7rem; text-transform:uppercase;
     letter-spacing:0.1em; color:var(--muted); border-bottom:2px solid var(--border); }
td { padding:12px; border-bottom:1px solid var(--border); font-size:0.9rem; }
tr:hover td { background:var(--bg2); }

/* Status badges */
.badge { display:inline-block; padding:2px 8px; font-family:monospace; font-size:0.7rem; font-weight:600;
         text-transform:uppercase; border:1px solid; }
.badge-running { border-color:var(--orange); color:var(--orange); }
.badge-complete { border-color:var(--green); color:var(--green); }
.badge-error { border-color:var(--magenta); color:var(--magenta); }
.badge-queued { border-color:var(--slate); color:var(--slate); }

/* Pre/code */
pre { background:var(--bg2); border:1px solid var(--border); padding:16px; overflow-x:auto;
      font-family:'Consolas','Courier New',monospace; font-size:0.85rem; color:var(--green); line-height:1.5; }

/* Alert */
.alert { padding:12px 16px; border:2px solid var(--magenta); color:var(--magenta); font-family:monospace; font-size:0.85rem; margin-bottom:16px; }

@media(max-width:768px) {
    .stats { grid-template-columns:1fr 1fr; }
}
</style>
'''

LOGIN_HTML = '''<!DOCTYPE html><html><head><meta charset="utf-8"><title>Rainmap — Login</title>
<meta name="viewport" content="width=device-width,initial-scale=1">''' + STYLE + '''</head><body>
<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px">
<div style="width:100%;max-width:400px">
<div class="logo" style="margin-bottom:48px">RAINMAP_</div>
<h2 style="margin-bottom:8px">Login</h2>
<p style="color:var(--slate);margin-bottom:32px">Web-based network scanner</p>
{% if error %}<div class="alert">{{ error }}</div>{% endif %}
<form method="POST">
<div style="margin-bottom:16px"><label>Username</label><input name="username" required placeholder="admin"></div>
<div style="margin-bottom:24px"><label>Password</label><input name="password" type="password" required placeholder="••••••••"></div>
<button class="btn btn-green" style="width:100%">Login →</button>
</form></div></div></body></html>'''

DASHBOARD_HTML = '''<!DOCTYPE html><html><head><meta charset="utf-8"><title>Rainmap — Dashboard</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="15">''' + STYLE + '''</head><body>
<div class="container">
<div class="header">
<div class="logo">RAINMAP_</div>
<nav class="nav"><a href="/">Dashboard</a><a href="/scan/new">New Scan</a><a href="/logout">Logout</a></nav>
</div>
<div class="stats">
<div class="stat"><div class="stat-val">{{ scans|length }}</div><div class="stat-label">Total Scans</div></div>
<div class="stat"><div class="stat-val" style="color:var(--orange)">{{ running }}</div><div class="stat-label">Running</div></div>
<div class="stat"><div class="stat-val">{{ complete }}</div><div class="stat-label">Complete</div></div>
<div class="stat"><div class="stat-val" style="color:var(--magenta)">{{ errors }}</div><div class="stat-label">Errors</div></div>
</div>
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
<h3>Scan History</h3>
<a href="/scan/new" class="btn btn-green">+ New Scan</a>
</div>
{% if scans %}
<div style="border:2px solid var(--border);overflow-x:auto">
<table>
<thead><tr><th>Name</th><th>Targets</th><th>Status</th><th>Started</th><th>Actions</th></tr></thead>
<tbody>
{% for s in scans %}
<tr>
<td style="font-weight:500"><a href="/scan/{{ s.id }}">{{ s.name }}</a></td>
<td class="mono" style="font-size:0.8rem;color:var(--slate)">{{ s.targets[:40] }}</td>
<td><span class="badge badge-{{ s.status }}">{{ s.status }}</span></td>
<td style="font-size:0.8rem;color:var(--muted)">{{ s.created_at[:16] }}</td>
<td>
<a href="/scan/{{ s.id }}" style="font-size:0.8rem;margin-right:12px">View</a>
<form method="POST" action="/scan/{{ s.id }}/delete" style="display:inline">
<button style="background:none;border:none;color:var(--magenta);font-size:0.8rem;cursor:pointer;font-family:monospace">Delete</button>
</form>
</td>
</tr>
{% endfor %}
</tbody></table></div>
{% else %}
<div class="card" style="text-align:center;padding:48px">
<div style="font-size:2rem;margin-bottom:12px">◉</div>
<h4 style="margin-bottom:8px">No scans yet</h4>
<p style="color:var(--slate);margin-bottom:24px">Launch your first network scan</p>
<a href="/scan/new" class="btn btn-green">New Scan →</a>
</div>
{% endif %}
</div></body></html>'''

SCAN_NEW_HTML = '''<!DOCTYPE html><html><head><meta charset="utf-8"><title>Rainmap — New Scan</title>
<meta name="viewport" content="width=device-width,initial-scale=1">''' + STYLE + '''</head><body>
<div class="container">
<div class="header">
<div class="logo">RAINMAP_</div>
<nav class="nav"><a href="/">Dashboard</a><a href="/scan/new">New Scan</a><a href="/logout">Logout</a></nav>
</div>
<div style="max-width:600px;margin:48px auto">
<h2 style="margin-bottom:32px">New Scan</h2>
{% if error %}<div class="alert">{{ error }}</div>{% endif %}
<form method="POST">
<div style="margin-bottom:20px"><label>Scan Name</label>
<input name="name" placeholder="Internal network sweep" required></div>
<div style="margin-bottom:20px"><label>Targets</label>
<textarea name="targets" rows="3" placeholder="192.168.1.0/24&#10;10.0.0.1&#10;example.com" required></textarea>
<p style="font-size:0.75rem;color:var(--muted);margin-top:4px">IP addresses, CIDR ranges, or hostnames. One per line or space-separated.</p>
</div>
<div style="margin-bottom:20px"><label>Nmap Options</label>
<input name="options" placeholder="-sV -sC -T4 (leave blank for default)">
<p style="font-size:0.75rem;color:var(--muted);margin-top:4px">Any valid nmap flags. Default: basic host/port scan.</p>
</div>
<div style="margin-bottom:20px"><label>Common Presets</label>
<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">
<button type="button" onclick="document.querySelector('[name=options]').value='-sn'" class="btn btn-ghost" style="padding:6px 12px;font-size:0.75rem">Ping Sweep</button>
<button type="button" onclick="document.querySelector('[name=options]').value='-sV -sC -T4'" class="btn btn-ghost" style="padding:6px 12px;font-size:0.75rem">Service Detection</button>
<button type="button" onclick="document.querySelector('[name=options]').value='-sV --script=vuln -T4'" class="btn btn-ghost" style="padding:6px 12px;font-size:0.75rem">Vuln Scan</button>
<button type="button" onclick="document.querySelector('[name=options]').value='-sS -T4 --top-ports 1000'" class="btn btn-ghost" style="padding:6px 12px;font-size:0.75rem">Stealth SYN</button>
<button type="button" onclick="document.querySelector('[name=options]').value='-A -T4'" class="btn btn-ghost" style="padding:6px 12px;font-size:0.75rem">Aggressive</button>
<button type="button" onclick="document.querySelector('[name=options]').value='-sU --top-ports 50'" class="btn btn-ghost" style="padding:6px 12px;font-size:0.75rem">UDP Top 50</button>
<button type="button" onclick="document.querySelector('[name=options]').value='-p- -T4'" class="btn btn-ghost" style="padding:6px 12px;font-size:0.75rem">All Ports</button>
<button type="button" onclick="document.querySelector('[name=options]').value='-O --osscan-guess'" class="btn btn-ghost" style="padding:6px 12px;font-size:0.75rem">OS Detection</button>
</div></div>
<div style="display:flex;gap:12px">
<button class="btn btn-green" style="flex:1">Launch Scan →</button>
<a href="/" class="btn btn-ghost" style="flex:1;text-align:center">Cancel</a>
</div>
</form></div></div></body></html>'''

SCAN_VIEW_HTML = '''<!DOCTYPE html><html><head><meta charset="utf-8"><title>Rainmap — {{ scan.name }}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
{% if scan.status == "running" %}<meta http-equiv="refresh" content="5">{% endif %}
''' + STYLE + '''</head><body>
<div class="container">
<div class="header">
<div class="logo">RAINMAP_</div>
<nav class="nav"><a href="/">Dashboard</a><a href="/scan/new">New Scan</a><a href="/logout">Logout</a></nav>
</div>
<div style="margin-top:32px">
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px">
<div>
<h2 style="margin-bottom:8px">{{ scan.name }}</h2>
<p class="mono" style="color:var(--slate);font-size:0.85rem">{{ scan.targets }}</p>
</div>
<span class="badge badge-{{ scan.status }}">{{ scan.status }}</span>
</div>

<div class="card" style="margin-bottom:16px">
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
<div><span style="font-size:0.75rem;color:var(--muted);font-family:monospace;text-transform:uppercase">Options</span>
<p class="mono" style="margin-top:4px;font-size:0.85rem">{{ scan.options or 'default' }}</p></div>
<div><span style="font-size:0.75rem;color:var(--muted);font-family:monospace;text-transform:uppercase">Started</span>
<p style="margin-top:4px;font-size:0.85rem">{{ scan.started_at or 'Pending' }}</p></div>
<div><span style="font-size:0.75rem;color:var(--muted);font-family:monospace;text-transform:uppercase">Finished</span>
<p style="margin-top:4px;font-size:0.85rem">{{ scan.finished_at or '—' }}</p></div>
</div></div>

{% if scan.error %}
<div class="alert" style="margin-bottom:16px">{{ scan.error }}</div>
{% endif %}

{% if scan.status == "running" %}
<div class="card" style="text-align:center;padding:48px">
<div style="color:var(--orange);font-size:1.5rem;margin-bottom:12px">◎</div>
<p style="color:var(--orange)">Scan in progress... (auto-refreshing)</p>
</div>
{% elif output %}
<div style="display:flex;gap:12px;margin-bottom:16px">
<a href="/scan/{{ scan.id }}/html" class="btn btn-ghost" style="font-size:0.75rem;padding:6px 16px">View HTML</a>
<a href="/scan/{{ scan.id }}/xml" class="btn btn-ghost" style="font-size:0.75rem;padding:6px 16px">Download XML</a>
</div>
<pre>{{ output }}</pre>
{% else %}
<div class="card"><p style="color:var(--muted)">No output available yet.</p></div>
{% endif %}

<div style="margin-top:24px">
<form method="POST" action="/scan/{{ scan.id }}/delete">
<button class="btn btn-red">Delete Scan</button>
</form>
</div>
</div></div></body></html>'''


# ─── Run ────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    debug = os.environ.get('DEBUG', 'false').lower() == 'true'
    print(f"[*] Rainmap starting on port {port}")
    print(f"[*] Login: {ADMIN_USER} / {'*' * len(ADMIN_PASS)}")
    app.run(host='0.0.0.0', port=port, debug=debug)
