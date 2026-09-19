# Déploiement — chevrolliernathan.fr

Le site tourne dans deux conteneurs. `web` (nginx non privilégié) sert les pages prérendues et
relaie `/api/status` vers `status` (Hono), qui sonde les sites. Le conteneur `web` n'écoute que sur
`127.0.0.1:3100`, derrière le nginx de l'hôte, qui gère le TLS.

- **Dossier sur le VPS :** `~/apps/mypage`.
- **Compose :** le VPS a `docker-compose` **v1.29**. Le projet s'appelle toujours `mypage`, d'où `-p mypage`.
- **Ports déjà pris :** 3000, 3001, 4001, 5000, 5001, 6000, 8000, 8080. Le 3100 est libre.

## 1. Conteneurs (sans sudo)

```bash
cd ~/apps/mypage
docker-compose -p mypage pull          # images publiées par la CI sur GHCR
docker-compose -p mypage up -d --no-build
curl -fsS http://127.0.0.1:3100/healthz && curl -s http://127.0.0.1:3100/api/status
```

Sans GHCR, on peut transférer les images depuis le poste :
`docker save ghcr.io/nathanchevrollier/mypage-web:latest ghcr.io/nathanchevrollier/mypage-status:latest | gzip > images.tgz`,
puis `scp`, puis `gunzip -c images.tgz | docker load` sur le VPS.

**Tester avant publication** (tunnel SSH, rien n'est exposé) : `ssh -N -L 3200:127.0.0.1:3100 -p 6666 nathchev@51.89.150.209`,
puis ouvrir http://localhost:3200.

### CV

Le CV contient des données personnelles : il n'est **pas dans git**. Il est servi depuis
`~/apps/mypage/cv/nathan-chevrollier-cv.pdf`, monté en lecture seule dans le conteneur.
Pour le mettre à jour, il suffit de remplacer le fichier : aucun redéploiement n'est nécessaire.

## 2. Publication nginx (sudo, une commande)

```bash
cd ~/apps/mypage && sudo bash install-nginx.sh
```

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

## 3. Redirection de l'ancien portfolio (plus tard)

```bash
cd ~/apps/mypage && sudo bash install-nginx.sh --portfolio
```

Même script, mêmes garde-fous. En plus, `portfolio.chevrolliernathan.fr` redirige (301) vers la racine.

## Mise à jour et retour arrière

La CI publie `latest` et `<sha>` à chaque push sur `main`.

```bash
cd ~/apps/mypage
docker-compose -p mypage pull && docker-compose -p mypage up -d --no-build   # dernière version
TAG=<sha> docker-compose -p mypage up -d --no-build                           # version précise
```

Retour arrière nginx manuel : `sudo rm -rf /etc/nginx && sudo tar -xzf /root/nginx-backup-<date>.tgz -C / && sudo systemctl reload nginx`.

Déploiement automatique (optionnel) : dans GitHub, créer la variable `DEPLOY_ENABLED=true` et les
secrets `VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_DEPLOY_KEY`. Utiliser une clé SSH **dédiée**,
limitée dans `authorized_keys` par `command="…"`, et jamais la clé personnelle.
