#!/bin/bash
# stealthscan.sh - SYN stealth scan
# Usage: stealthscan.sh <target>

TARGET=${1:-"127.0.0.1"}
OUTFILE="/scans/stealth_${TARGET//\//_}_$(date +%Y%m%d_%H%M%S).txt"

echo -e "\e[32m[*] Stealth SYN scan: $TARGET\e[0m"
echo -e "\e[90m[*] Output: $OUTFILE\e[0m"
echo ""

nmap -sS -T4 -Pn --top-ports 1000 "$TARGET" -oN "$OUTFILE"

echo ""
echo -e "\e[32m[✓] Done. Results saved to $OUTFILE\e[0m"
