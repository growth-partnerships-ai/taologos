#!/usr/bin/env bash
# Usage: TELEGRAM_BOT_TOKEN=... ./scripts/telegram-chat-id.sh
# 1) Message @taologos_bot on Telegram first
# 2) Run this script to print chat_id values from getUpdates

set -euo pipefail
TOKEN="${TELEGRAM_BOT_TOKEN:-}"
if [[ -z "$TOKEN" ]]; then
  if [[ -f .env.local ]]; then
    # shellcheck disable=SC1091
    set -a
    source .env.local
    set +a
    TOKEN="${TELEGRAM_BOT_TOKEN:-}"
  fi
fi
if [[ -z "$TOKEN" ]]; then
  echo "Set TELEGRAM_BOT_TOKEN first" >&2
  exit 1
fi

curl -s "https://api.telegram.org/bot${TOKEN}/getUpdates" | python3 - <<'PY'
import json,sys
data=json.load(sys.stdin)
if not data.get('ok'):
    print(data); sys.exit(1)
results=data.get('result') or []
if not results:
    print('No updates yet. Open Telegram, search @taologos_bot, tap Start/send any message, then rerun.')
    sys.exit(0)
seen=set()
for u in results:
    chat=(u.get('message') or u.get('edited_message') or {}).get('chat') or {}
    cid=chat.get('id')
    if cid is None or cid in seen: continue
    seen.add(cid)
    print(f"chat_id={cid}  type={chat.get('type')}  title/name={chat.get('title') or chat.get('username') or chat.get('first_name')}")
PY
