# ---- Étape de build ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Étape finale (serveur) ----
FROM nginx:stable-alpine-slim

COPY --from=builder /app/build /usr/share/nginx/html

# Supprimer la config par défaut pour éviter les conflits
RUN rm /etc/nginx/conf.d/default.conf

# Copie ta config custom Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
