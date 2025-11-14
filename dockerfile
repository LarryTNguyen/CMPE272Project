# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app
# install deps using only package files to enable layer caching
COPY PriceStocker/package*.json ./
RUN npm ci
# now bring in the app source and build
COPY PriceStocker/ ./
RUN npm run build

# ---- Runtime stage (serve static) ----
FROM caddy:2.7-alpine
WORKDIR /srv
COPY caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["caddy","run","--config","/etc/caddy/Caddyfile","--adapter","caddyfile"]
