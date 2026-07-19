# 1. Close scan — the single source of truth for the checklist + summary
QUICKBOOKS_ACCESS_TOKEN=… \
  python3 .agents/skills/monthly-close-assistant/scripts/close_scan.py <company_id> <YYYY-MM>

# 2. Accountant summary PDF (2-page package) — renders from the saved scan JSON (numbers tie to scan)
python3 .agents/skills/monthly-close-assistant/scripts/accountant_summary.py \
  <scan_json_path> <output_pdf_path> "<company name>" "<accountant_email (optional)>"

# 3. AR reminder eligibility — who is due, at what stage, with live balances (READ-ONLY)
QUICKBOOKS_ACCESS_TOKEN=… GOOGLESHEETS_ACCESS_TOKEN=… \
REMINDER_FIRST_TRIGGER=on_due REMINDER_ESCALATION_DAYS=7 REMINDER_MAX_ATTEMPTS=3 \
  python3 .agents/skills/monthly-close-assistant/scripts/reminders_due.py <company_id> <ledger_sheet_id>
