# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app

# Only NUXT_PUBLIC_* vars are needed at build time (baked into client bundle).
# Private NUXT_* vars (secrets, DB) are injected at runtime via env_file.
ARG NUXT_PUBLIC_APP_URL=http://localhost:3000
ARG NUXT_PUBLIC_LANDING_PAGE_URL=http://localhost:3000
ARG NUXT_PUBLIC_MSS_ENVIRONMENT=local
ARG NUXT_PUBLIC_EMAIL_FROM=noreply@localhost
ARG NUXT_AUTH_PROCONNECT_ISSUER_URL=https://fca.integ01.dev-agentconnect.fr/api/v2

ENV NUXT_PUBLIC_APP_URL=${NUXT_PUBLIC_APP_URL}
ENV NUXT_PUBLIC_LANDING_PAGE_URL=${NUXT_PUBLIC_LANDING_PAGE_URL}
ENV NUXT_PUBLIC_MSS_ENVIRONMENT=${NUXT_PUBLIC_MSS_ENVIRONMENT}
ENV NUXT_PUBLIC_EMAIL_FROM=${NUXT_PUBLIC_EMAIL_FROM}
ENV NUXT_AUTH_PROCONNECT_ISSUER_URL=${NUXT_AUTH_PROCONNECT_ISSUER_URL}

# Dummy DATABASE_URL for prisma generate (no actual DB connection needed at build)
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy

RUN corepack enable && corepack prepare pnpm@12.14.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma/ ./prisma/

# postinstall runs: DISABLE_ERD=true prisma generate && nuxt prepare
RUN pnpm install --prefer-offline --frozen-lockfile

COPY . .

RUN pnpm build:nuxt


# Stage 2: Production runtime
FROM node:24-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.output ./.output
# Prisma 6 query engine binaries are not bundled by nitro
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
