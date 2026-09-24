FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code and build production static bundle
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install lightweight static server
RUN npm install -g serve

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built static bundle
COPY --from=builder --chown=nextjs:nodejs /app/out ./out
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["serve", "-s", "out", "-l", "3000"]
