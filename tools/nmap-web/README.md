# Rainmap Lite

Modern web-based nmap scanner. Inspired by the original [Rainmap](http://nmap.org/rainmap/) project.

Single Docker container — no PostgreSQL, no RabbitMQ, no Celery. Just Flask + SQLite + nmap.

## Screenshot

Dark brutalist UI. Neon green on black. Monospace everything.

## Quick Start

```bash
cd tools/nmap-web
docker compose up -d --build
```

Open in your browser:
```
http://localhost:8080
```

Default login: `admin` / `admin`

## Features

- **Web UI** — Launch and monitor scans from any browser
- **Scan presets** — One-click buttons for common scan types (stealth, vuln, service detection, etc.)
- **Live status** — Dashboard auto-refreshes while scans run
- **Output formats** — View results as text, HTML (xsltproc), or download raw XML
- **Scan history** — All scans saved with SQLite, persist across restarts
- **No dependencies** — Single container, no external DB or message queue

## Configuration

Environment variables in `docker-compose.yml`:

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_USER` | `admin` | Login username |
| `ADMIN_PASS` | `admin` | Login password |
| `SECRET_KEY` | random | Flask session key |
| `PORT` | `8080` | Web server port |

## Network Mode

Using `network_mode: host` so nmap scans your actual network. If you only need to scan remote/external targets, you can remove that line and just use the default bridge network.

## Data Persistence

- Scan results: `./data/scans/` (XML, HTML, TXT files)
- Database: `./data/db/rainmap.db` (SQLite)

Both survive container restarts and rebuilds.

## Security

⚠️ **Do NOT expose port 8080 to the public internet** without:
- Changing the default password
- Putting it behind a reverse proxy with HTTPS
- Or restricting access via firewall/VPN

This is a pentesting tool — treat it like one.

## Scan Presets

The "New Scan" page has one-click preset buttons:

| Preset | Flags | Use Case |
|--------|-------|----------|
| Ping Sweep | `-sn` | Host discovery only |
| Service Detection | `-sV -sC -T4` | Find services + versions |
| Vuln Scan | `-sV --script=vuln -T4` | Run vuln NSE scripts |
| Stealth SYN | `-sS -T4 --top-ports 1000` | Half-open scan |
| Aggressive | `-A -T4` | OS + version + scripts + traceroute |
| UDP Top 50 | `-sU --top-ports 50` | Common UDP services |
| All Ports | `-p- -T4` | Full 65535 port scan |
| OS Detection | `-O --osscan-guess` | Operating system fingerprint |

Or type any valid nmap flags manually.

## Architecture

```
Browser → Flask (port 8080) → nmap subprocess → results to /app/scans/
                            → SQLite (/app/db/rainmap.db)
```

No workers, no queues. Scans run as background threads. Simple.
