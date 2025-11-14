# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY PriceStocker/package*.json ./
RUN npm ci
COPY PriceStocker/ ./
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
RUN npm run build

# ---- Runtime stage ----
FROM caddy:2.7-alpine
WORKDIR /srv
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["caddy","run","--config","/etc/caddy/Caddyfile","--adapter","caddyfile"]
