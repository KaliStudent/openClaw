#!/bin/bash
# recon.sh - Full recon on a target (DNS, whois, ports, services)
# Usage: recon.sh <target>

TARGET=${1:-"127.0.0.1"}
OUTDIR="/scans/recon_${TARGET//\//_}_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUTDIR"

echo -e "\e[32m╔══════════════════════════════════╗\e[0m"
echo -e "\e[32m║       FULL RECON: $TARGET\e[0m"
echo -e "\e[32m╚══════════════════════════════════╝\e[0m"
echo -e "\e[90m[*] Output dir: $OUTDIR\e[0m"
echo ""

# Whois
echo -e "\e[33m[1/4] Whois lookup...\e[0m"
whois "$TARGET" > "$OUTDIR/whois.txt" 2>/dev/null
echo -e "\e[90m      → $OUTDIR/whois.txt\e[0m"

# DNS
echo -e "\e[33m[2/4] DNS records...\e[0m"
dig "$TARGET" ANY +noall +answer > "$OUTDIR/dns.txt" 2>/dev/null
host "$TARGET" >> "$OUTDIR/dns.txt" 2>/dev/null
echo -e "\e[90m      → $OUTDIR/dns.txt\e[0m"

# Quick port scan
echo -e "\e[33m[3/4] Top ports...\e[0m"
nmap -T4 --top-ports 100 -sV "$TARGET" -oN "$OUTDIR/ports.txt"
echo -e "\e[90m      → $OUTDIR/ports.txt\e[0m"

# OS detection
echo -e "\e[33m[4/4] OS detection...\e[0m"
nmap -O -T4 "$TARGET" -oN "$OUTDIR/os.txt" 2>/dev/null
echo -e "\e[90m      → $OUTDIR/os.txt\e[0m"

echo ""
echo -e "\e[32m[✓] Recon complete. All results in: $OUTDIR/\e[0m"
ls -la "$OUTDIR/"
