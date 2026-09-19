# syntax=docker/dockerfile:1.7
# Build context: repository root (see deploy/docker-compose.yml).

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY web/package.json web/
COPY status/package.json status/
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY status status
RUN npm run build -w status

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY web/package.json web/
COPY status/package.json status/
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --workspace status --include-workspace-root=false --no-audit --no-fund

FROM node:24-alpine
ENV NODE_ENV=production PORT=3101 SITES_FILE=/app/sites.json
WORKDIR /app
COPY --from=deps /app/node_modules node_modules
COPY --from=build /app/status/dist dist
COPY content/sites.json sites.json
USER node
EXPOSE 3101
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:3101/healthz || exit 1
CMD ["node", "dist/index.js"]
