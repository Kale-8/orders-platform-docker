# Dockerfile
# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: production image
FROM node:18-alpine
WORKDIR /app
# Instalar pm2 runtime globalmente (para manejar procesos)
RUN npm install -g pm2
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY pm2.config.js ./pm2.config.js
EXPOSE 3000
ENV NODE_ENV=pr oduction
CMD ["pm2-runtime", "pm2.config.js"]