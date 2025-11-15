
# Dockerfile Multi-stage para aplicação Next.js

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar arquivos de dependências
COPY nextjs_space/package.json nextjs_space/yarn.lock* nextjs_space/package-lock.json* nextjs_space/pnpm-lock.yaml* ./

# Instalar dependências
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY nextjs_space/ .

# Copiar Prisma schema e gerar cliente
COPY nextjs_space/prisma ./prisma/
RUN npx prisma generate

# Argumentos de build para variáveis de ambiente
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG AWS_BUCKET_NAME
ARG AWS_REGION
ARG AWS_FOLDER_PREFIX
ARG AWS_PROFILE

# Definir variáveis de ambiente para build
ENV DATABASE_URL=$DATABASE_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV AWS_BUCKET_NAME=$AWS_BUCKET_NAME
ENV AWS_REGION=$AWS_REGION
ENV AWS_FOLDER_PREFIX=$AWS_FOLDER_PREFIX
ENV AWS_PROFILE=$AWS_PROFILE
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_OUTPUT_MODE=standalone

# Build da aplicação
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos públicos
COPY --from=builder /app/public ./public

# Copiar arquivos de build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar node_modules e prisma para runtime
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Script de inicialização
CMD npx prisma migrate deploy && node server.js
