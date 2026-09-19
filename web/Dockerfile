# syntax=docker/dockerfile:1.7
# Build context: repository root (see deploy/docker-compose.yml).

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY web/package.json web/
COPY status/package.json status/
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY content content
COPY scripts scripts
COPY web web
RUN npm run build -w web \
 && rm web/build/client/__spa-fallback.html \
 && node scripts/csp.mjs web/build/client web/build/csp.conf

FROM nginxinc/nginx-unprivileged:1-alpine
COPY web/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY web/nginx/headers.conf /etc/nginx/snippets/headers.conf
COPY --from=build /app/web/build/csp.conf /etc/nginx/snippets/csp.conf
COPY --from=build /app/web/build/client /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
