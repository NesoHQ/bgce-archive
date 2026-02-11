FROM node:20-alpine AS base

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install with pnpm
RUN pnpm install --frozen-lockfile

COPY . .

# Build args - will be set by K8s deployment
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_POSTAL_API_URL
ARG NEXT_PUBLIC_KRAKENS_PROJECT_ID

# Set env vars for build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_POSTAL_API_URL=$NEXT_PUBLIC_POSTAL_API_URL
ENV NEXT_PUBLIC_KRAKENS_PROJECT_ID=$NEXT_PUBLIC_KRAKENS_PROJECT_ID

RUN pnpm build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "start"]