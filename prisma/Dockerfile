FROM registry.gitlab.com/vigigloo/tools/pnpm:node-22_pnpm-9.1.4 as build
WORKDIR /app

COPY prisma /app/
RUN pnpm init
RUN pnpm add prisma

CMD ["pnpm", "prisma", "migrate", "deploy"]
