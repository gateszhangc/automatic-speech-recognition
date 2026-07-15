FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat && yarn global add pnpm@10

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* source.config.ts next.config.mjs ./
RUN pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM deps AS builder

WORKDIR /app

ARG NEXT_PUBLIC_APP_URL=https://automatic-speech-recognition.homes
ARG NEXT_PUBLIC_APP_NAME="Automatic Speech Recognition"
ARG NEXT_PUBLIC_APP_DESCRIPTION="Plan and evaluate automatic speech recognition workflows for transcription, captions, search, compliance, and voice AI products."
ARG NEXT_PUBLIC_APP_LOGO=/logo-asr.svg
ARG NEXT_PUBLIC_APP_FAVICON=/favicon-asr.svg
ARG NEXT_PUBLIC_APP_PREVIEW_IMAGE=/preview-asr.png
ARG NEXT_PUBLIC_DEFAULT_LOCALE=en
ARG NEXT_PUBLIC_THEME=default
ARG NEXT_PUBLIC_APPEARANCE=light
ARG PUBLIC_SITE_ONLY=false

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME \
    NEXT_PUBLIC_APP_DESCRIPTION=$NEXT_PUBLIC_APP_DESCRIPTION \
    NEXT_PUBLIC_APP_LOGO=$NEXT_PUBLIC_APP_LOGO \
    NEXT_PUBLIC_APP_FAVICON=$NEXT_PUBLIC_APP_FAVICON \
    NEXT_PUBLIC_APP_PREVIEW_IMAGE=$NEXT_PUBLIC_APP_PREVIEW_IMAGE \
    NEXT_PUBLIC_DEFAULT_LOCALE=$NEXT_PUBLIC_DEFAULT_LOCALE \
    NEXT_PUBLIC_THEME=$NEXT_PUBLIC_THEME \
    NEXT_PUBLIC_APPEARANCE=$NEXT_PUBLIC_APPEARANCE \
    PUBLIC_SITE_ONLY=$PUBLIC_SITE_ONLY

# Install dependencies based on the preferred package manager
COPY . .
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir .next && \
    chown nextjs:nodejs .next

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV PUBLIC_SITE_ONLY=false

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]
