# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy source and build
COPY . .
RUN yarn build-only

# Production stage
FROM nginx:alpine

# Copy nginx config template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy only built assets (not node_modules)
COPY --from=builder /app/dist /usr/share/nginx/html

# Set default backend URL (can be overridden at runtime)
ENV CORTEX_API_URL=http://cortex:8080

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
