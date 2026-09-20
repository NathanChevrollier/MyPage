#!/usr/bin/env bash
# Publishes chevrolliernathan.fr on the host nginx — safely.
#
#   sudo bash install-nginx.sh               apex + www + catch-all default server
#   sudo bash install-nginx.sh --portfolio   also redirect portfolio.chevrolliernathan.fr to the apex
#
# What it guarantees:
#   - a full backup of /etc/nginx before any change;
#   - nothing is touched unless the current config passes `nginx -t`;
#   - after the reload, every other site must answer exactly as before;
#     otherwise the backup is restored automatically.
# nginx.conf and the other vhosts are never modified.

set -Eeuo pipefail

DOMAIN="chevrolliernathan.fr"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AVAIL=/etc/nginx/sites-available
ENABLED=/etc/nginx/sites-enabled
BACKUP="/root/nginx-backup-$(date +%Y%m%d-%H%M%S).tgz"
# Sites encore servis par le VPS (les anciens ont été retirés le 20/09/2026).
OTHERS=(nexus scanlib cinemap)
WITH_PORTFOLIO=false
[[ "${1:-}" == "--portfolio" ]] && WITH_PORTFOLIO=true
$WITH_PORTFOLIO || OTHERS+=(portfolio)

bold() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
ok() { printf '    \033[32m✓\033[0m %s\n' "$*"; }
fail() { printf '    \033[31m✗ %s\033[0m\n' "$*"; }
code() { curl -s -o /dev/null -m 10 -w '%{http_code}' "$1" || true; }

snapshot() {
  for h in "${OTHERS[@]}"; do
    printf '%s https=%s http=%s\n' "$h" "$(code "https://$h.$DOMAIN/")" "$(code "http://$h.$DOMAIN/")"
  done
}

restore() {
  fail "$1 — restoring $BACKUP"
  rm -rf /etc/nginx
  tar -xzf "$BACKUP" -C /
  nginx -t && systemctl reload nginx
  fail "Rolled back. Nothing changed for the other sites."
  exit 1
}

[[ $EUID -eq 0 ]] || { echo "Run with sudo: sudo bash $0 $*"; exit 1; }

bold "Preflight"
nginx -t 2>/dev/null || { fail "Current nginx config is already invalid; fix it first (nginx -t)."; exit 1; }
ok "current nginx config is valid"
curl -fsS -m 5 http://127.0.0.1:3100/healthz >/dev/null \
  || { fail "The site container does not answer on 127.0.0.1:3100 (docker compose -p mypage up -d)."; exit 1; }
ok "site container answers on 127.0.0.1:3100"
for f in chevrolliernathan.fr.conf 00-default.conf portfolio-redirect.conf; do
  [[ -f "$HERE/nginx/$f" ]] || { fail "missing $HERE/nginx/$f"; exit 1; }
done

bold "Baseline of the other sites"
BEFORE="$(snapshot)"
echo "$BEFORE" | sed 's/^/    /'

bold "Backup"
tar -czf "$BACKUP" /etc/nginx 2>/dev/null
ok "$BACKUP"

bold "Certificate (certbot, nginx authenticator — no config is rewritten)"
certbot certonly --nginx --non-interactive --keep-until-expiring --expand \
  --cert-name "$DOMAIN" -d "$DOMAIN" -d "www.$DOMAIN"
[[ -s "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]] || { fail "certificate missing"; exit 1; }
ok "certificate for $DOMAIN + www.$DOMAIN"

trap 'restore "unexpected error on line $LINENO"' ERR

bold "Install vhosts"
install -m 644 "$HERE/nginx/chevrolliernathan.fr.conf" "$AVAIL/$DOMAIN"
install -m 644 "$HERE/nginx/00-default.conf" "$AVAIL/00-default"
ln -sfn "$AVAIL/$DOMAIN" "$ENABLED/$DOMAIN"
ln -sfn "$AVAIL/00-default" "$ENABLED/00-default"
ok "$DOMAIN and 00-default (catch-all)"
if $WITH_PORTFOLIO; then
  install -m 644 "$HERE/nginx/portfolio-redirect.conf" "$AVAIL/portfolio.$DOMAIN.conf"
  ok "portfolio.$DOMAIN -> https://$DOMAIN/"
fi

nginx -t 2>&1 | sed 's/^/    /' || restore "nginx -t failed"
systemctl reload nginx
sleep 2
ok "nginx reloaded"

bold "Checks"
AFTER="$(snapshot)"
if [[ "$BEFORE" != "$AFTER" ]]; then
  diff <(echo "$BEFORE") <(echo "$AFTER") | sed 's/^/    /' || true
  restore "another site changed behaviour"
fi
ok "all other sites answer exactly as before"

expect() { # url expected-code [expected-location]
  local got loc
  got="$(curl -s -o /dev/null -m 10 -w '%{http_code} %{redirect_url}' "$1")"
  loc="${got#* }"; got="${got%% *}"
  if [[ "$got" == "$2" && ( -z "${3:-}" || "$loc" == "$3" ) ]]; then ok "$1 -> $got ${3:-}"; else
    restore "$1 answered '$got $loc', expected '$2 ${3:-}'"; fi
}
expect "https://$DOMAIN/" 200
expect "https://$DOMAIN/api/status" 200
expect "https://www.$DOMAIN/" 301 "https://$DOMAIN/"
expect "http://$DOMAIN/" 301 "https://$DOMAIN/"
expect "http://51.89.150.209/" 301 "https://$DOMAIN/"
$WITH_PORTFOLIO && expect "https://portfolio.$DOMAIN/" 301 "https://$DOMAIN/"

trap - ERR
bold "Done"
echo "    https://$DOMAIN is live. Backup kept at $BACKUP"
echo "    Manual rollback if ever needed: sudo rm -rf /etc/nginx && sudo tar -xzf $BACKUP -C / && sudo systemctl reload nginx"
