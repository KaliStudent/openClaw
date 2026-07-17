#!/bin/bash
# portscan.sh - Full port scan with service detection
# Usage: portscan.sh <target> [ports]

TARGET=${1:-"127.0.0.1"}
PORTS=${2:-"1-65535"}
OUTFILE="/scans/portscan_${TARGET//\//_}_$(date +%Y%m%d_%H%M%S).txt"

echo -e "\e[32m[*] Port scan: $TARGET\e[0m"
echo -e "\e[33m[*] Ports: $PORTS\e[0m"
echo -e "\e[90m[*] Output: $OUTFILE\e[0m"
echo ""

nmap -sV -sC -O -p "$PORTS" -T4 "$TARGET" -oN "$OUTFILE"

echo ""
echo -e "\e[32m[✓] Done. Results saved to $OUTFILE\e[0m"
