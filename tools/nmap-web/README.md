# nmap-web

Browser-based terminal with nmap and networking tools. Access a full bash shell from any browser — no WSL needed.

## Quick Start

On your Linux/GPU box:

```bash
cd tools/nmap-web
docker compose up -d --build
```

Then open in your Windows browser:
```
http://<your-linux-box-ip>:7681
```

You'll get a full bash terminal with nmap ready to go.

## First Thing to Run

```bash
help.sh
```

Shows all available commands and scripts.

## Scripts

| Script | Usage | Description |
|--------|-------|-------------|
| `quickscan.sh` | `quickscan.sh 192.168.1.0/24` | Ping sweep / host discovery |
| `portscan.sh` | `portscan.sh 10.0.0.5 1-1000` | Port scan with service detection |
| `vulnscan.sh` | `vulnscan.sh 10.0.0.5` | NSE vulnerability scripts |
| `stealthscan.sh` | `stealthscan.sh 10.0.0.5` | SYN stealth scan |
| `recon.sh` | `recon.sh example.com` | Full recon (whois, DNS, ports, OS) |
| `help.sh` | `help.sh` | Show this reference |

## Scan Results

All results save to `/scans/` inside the container, mapped to `./results/` on your host.

## Security Notes

- **Do NOT expose port 7681 to the internet** — this is an unauthenticated shell
- For remote access, put it behind a VPN or SSH tunnel
- To add basic auth, use: `ttyd --credential user:password bash`

### Adding a Password

Edit the Dockerfile CMD line:
```dockerfile
CMD ["ttyd", "--port", "7681", "--writable", "--credential", "admin:yourpassword", "bash"]
```

## Network Mode

Using `network_mode: host` so nmap scans your real network, not the Docker bridge. If you want to scan remote targets only (not your LAN), you can remove that line.

## Stopping

```bash
docker compose down
```
