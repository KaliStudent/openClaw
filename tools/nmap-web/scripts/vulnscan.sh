#!/bin/bash
# vulnscan.sh - Vulnerability scan using nmap scripts
# Usage: vulnscan.sh <target>

TARGET=${1:-"127.0.0.1"}
OUTFILE="/scans/vulnscan_${TARGET//\//_}_$(date +%Y%m%d_%H%M%S).txt"

echo -e "\e[35m[*] Vulnerability scan: $TARGET\e[0m"
echo -e "\e[90m[*] Output: $OUTFILE\e[0m"
echo -e "\e[33m[!] This may take a while...\e[0m"
echo ""

nmap -sV --script=vuln -T4 "$TARGET" -oN "$OUTFILE"

echo ""
echo -e "\e[32m[✓] Done. Results saved to $OUTFILE\e[0m"
