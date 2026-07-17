#!/bin/bash
# quickscan.sh - Fast network discovery
# Usage: quickscan.sh 192.168.1.0/24

TARGET=${1:-"192.168.1.0/24"}
OUTFILE="/scans/quickscan_$(date +%Y%m%d_%H%M%S).txt"

echo -e "\e[32m[*] Quick scan: $TARGET\e[0m"
echo -e "\e[90m[*] Output: $OUTFILE\e[0m"
echo ""

nmap -sn -T4 "$TARGET" -oN "$OUTFILE"

echo ""
echo -e "\e[32m[✓] Done. Results saved to $OUTFILE\e[0m"
