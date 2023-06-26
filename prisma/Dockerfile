FROM registry.gitlab.com/vigigloo/tools/pnpm:node-18_pnpm-8.6.2 as build
WORKDIR /app

COPY prisma /app/
RUN pnpm init
RUN pnpm add prisma

CMD ["pnpm", "prisma", "migrate", "deploy"]
