FROM registry.gitlab.com/vigigloo/tools/pnpm:node-18_pnpm-8.3.1 as build
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc prisma /app/
RUN pnpm install --frozen-lockfile --prefer-offline
COPY . .
RUN pnpm run build

FROM gcr.io/distroless/nodejs18-debian11
WORKDIR /app
COPY --from=build /app/.output /app/

EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["server/index.mjs"]
