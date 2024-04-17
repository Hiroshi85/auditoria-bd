FROM node:20-alpine AS base

FROM base AS deps

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install


# build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules 
COPY . .

RUN npm run build

FROM base AS runner
WORKDIR /app

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder /app/public ./public

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT 3000

CMD node server.js