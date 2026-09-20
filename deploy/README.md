# Déploiement — chevrolliernathan.fr

Le site tourne dans deux conteneurs. `web` (nginx non privilégié) sert les pages prérendues et
relaie `/api/status` vers `status` (Hono), qui sonde les sites. Le conteneur `web` n'écoute que sur
`127.0.0.1:3100`, derrière le nginx de l'hôte, qui gère le TLS.

- **Dossier sur le VPS :** `/srv/apps/mypage` (déplacé depuis `~/apps/mypage` le 20/09/2026).
- **Compose :** Docker CE 29 et **Compose v2** — `docker compose`, sans tiret. Projet `mypage`.
- **Ports pris :** voir `/srv/apps/PORTS.md` sur le VPS. MyPage utilise 3100 (web) et 3101 (status, interne).

## 1. Conteneurs (sans sudo)

```bash
cd /srv/apps/mypage
docker compose -p mypage pull          # images publiées par la CI sur GHCR
docker compose -p mypage up -d --no-build
curl -fsS http://127.0.0.1:3100/healthz && curl -s http://127.0.0.1:3100/api/status
```

Les images GHCR sont publiques : plus besoin de les transférer avec `docker save`.

**Tester avant publication** (tunnel SSH, rien n'est exposé) : `ssh -N -L 3200:127.0.0.1:3100 -p 6666 nathchev@51.89.150.209`,
puis ouvrir http://localhost:3200.

### CV

Le CV contient des données personnelles : il n'est **pas dans git**. Il est servi depuis
`/srv/apps/mypage/cv/nathan-chevrollier-cv.pdf`, monté en lecture seule dans le conteneur.
Pour le mettre à jour, il suffit de remplacer le fichier : aucun redéploiement n'est nécessaire.

## 2. Publication nginx (sudo, une commande)

```bash
cd /srv/apps/mypage && sudo bash install-nginx.sh
```

> Ce script est spécifique à l'apex (certificat `chevrolliernathan.fr` + `www`, vhost catch-all).
> Pour **tout autre** sous-domaine, le VPS dispose maintenant de `sudo new-app` et `sudo new-site`,
> qui génèrent le vhost, les en-têtes de sécurité et le certificat en une commande.

Le script :

1. vérifie que la config actuelle passe `nginx -t` et que le conteneur répond, sinon il s'arrête sans rien toucher ;
2. relève les codes HTTP de tous les autres sites ;
3. sauvegarde `/etc/nginx` dans `/root/nginx-backup-<date>.tgz` ;
4. obtient ou étend le certificat `chevrolliernathan.fr` + `www` avec `certbot certonly --nginx`, comme les autres sites : aucune config n'est réécrite ;
5. installe `sites-available/chevrolliernathan.fr` (racine, `www` → racine, HTTP → HTTPS) et `sites-available/00-default`, le catch-all `default_server` :
   - en HTTP, l'IP ou un nom inconnu sont redirigés vers la racine ;
   - en HTTPS, la connexion est refusée au lieu de servir le certificat d'un autre site ;
6. lance `nginx -t`, recharge nginx, puis vérifie que **chaque autre site répond exactement comme avant** et que la racine, `www`, l'IP et `/api/status` répondent comme prévu.

**Au moindre écart, la sauvegarde est restaurée automatiquement.** `nginx.conf` et les autres vhosts ne sont jamais modifiés.

## 3. Redirection de l'ancien portfolio

```bash
cd /srv/apps/mypage && sudo bash install-nginx.sh --portfolio
```

Même script, mêmes garde-fous. En plus, `portfolio.chevrolliernathan.fr` redirige (301) vers la racine.

## Mise à jour et retour arrière

**Le déploiement automatique est actif depuis le 20/09/2026.** Chaque push sur `main` déclenche :
tests → construction des images → publication sur GHCR → appel du compte `deploy` sur le VPS.
Celui-ci télécharge le tag, recrée les conteneurs, vérifie `/healthz` et **revient à la version
précédente** si le contrôle échoue.

La clé de déploiement ne donne aucun shell : `authorized_keys` la limite par
`command="/usr/local/bin/deploy-hook",restrict`, et le script n'accepte que
`deploy|rollback|status <app> <tag>` sur une application déclarée dans `/srv/apps`.

Commandes manuelles, depuis un poste ayant la clé de déploiement :

```bash
ssh -i <cle> -p 6666 deploy@51.89.150.209 "status mypage"
ssh -i <cle> -p 6666 deploy@51.89.150.209 "deploy mypage <sha>"
ssh -i <cle> -p 6666 deploy@51.89.150.209 "rollback mypage"
```

Ou directement sur le VPS :

```bash
cd /srv/apps/mypage
docker compose -p mypage pull && docker compose -p mypage up -d --no-build   # dernière version
TAG=<sha> docker compose -p mypage up -d --no-build                           # version précise
```

Retour arrière nginx manuel : `sudo rm -rf /etc/nginx && sudo tar -xzf /root/nginx-backup-<date>.tgz -C / && sudo systemctl reload nginx`.
