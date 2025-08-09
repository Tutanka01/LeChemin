# Multi-stage build for production static site (Vite + React)
# 1. Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install deps (use ci if lockfile present)
COPY package.json ./
# Copy lock file if exists to leverage caching (ignored if absent)
COPY package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source
COPY . .

# Build
RUN npm run build

# 2. Final stage (nginx to serve static assets)
FROM nginx:1.27-alpine AS production
# Remove default config & add our SPA config
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Set non-root user (optional; nginx image already uses 101)
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
