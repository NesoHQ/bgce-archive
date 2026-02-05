# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy source and build
COPY . .

# Build with relative URLs for production (nginx will proxy)
ENV VITE_API_BASE_URL=/api/cortex/v1
ENV VITE_POSTAL_API_BASE_URL=/api/postal/v1
ENV VITE_APP_NAME="Archive Admin"
ENV VITE_APP_VERSION=1.0.0

RUN yarn build-only

# Production stage
FROM nginx:alpine

# Copy nginx config template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy only built assets (not node_modules)
COPY --from=builder /app/dist /usr/share/nginx/html

# Set default backend URLs (override in K8s deployment)
ENV CORTEX_API_URL=http://cortex-service:8080
ENV POSTAL_API_URL=http://postal-service:8081

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
