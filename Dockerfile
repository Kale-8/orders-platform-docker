# -----------------------------
# Stage 1: Build
# -----------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# Instala dependencias para compilar (dev + prod)
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# -----------------------------
# Stage 2: Production
# -----------------------------
FROM node:18-alpine
WORKDIR /app

# Instala PM2 runtime
RUN npm install -g pm2

# Copia solo los archivos necesarios
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY pm2.config.js ./pm2.config.js

EXPOSE 3000
ENV NODE_ENV=production

CMD ["pm2-runtime", "pm2.config.js"]