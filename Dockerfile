# Stage 1: Build the React app
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . ./

# Copy .env.production for Vite to use during build
# Note: Make sure .env.production exists on your server before building
COPY .env.production ./

# Build for production - Vite will read .env.production automatically
RUN npm run build:production

# Stage 2: Development environment
FROM node:22-alpine AS development
WORKDIR /app

# Install dependencies again for development
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the full source code
COPY . ./

# Expose port for the development server
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 3: Production environment
FROM nginx:alpine AS production

# Copy the production build artifacts from the build stage
COPY --from=build /app/dist /usr/share/nginx/html/tp

# Create nginx configuration for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # redirect root to /tp \
    location = / { \
    return 301 /tp/; \
    } \
    \
    # ensure trailing slash \
    location = /tp { \
    return 301 /tp/; \
    } \
    \
    # SPA routing for /tp \
    location /tp/ { \
    try_files $uri $uri/ /tp/index.html; \
    } \
    \
    # Cache static assets \
    location /tp/assets/ { \
    expires 1y; \
    add_header Cache-Control "public, immutable"; \
    } \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    }' > /etc/nginx/conf.d/default.conf

# Expose the default NGINX port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]