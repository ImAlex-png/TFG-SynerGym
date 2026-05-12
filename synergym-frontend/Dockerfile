# --- Etapa de Compilación ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Etapa de Nginx ---
FROM nginx:alpine

# Ahora la ruta coincide con tu configuración personalizada
COPY --from=builder /app/dist/synergym-frontend/browser /usr/share/nginx/html/

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /usr/share/nginx/html/assets
COPY src/assets/env.template.js /usr/share/nginx/html/assets/env.template.js
RUN apk add --no-cache gettext
EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]