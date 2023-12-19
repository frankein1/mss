FROM registry.gitlab.com/vigigloo/tools/pnpm:node-18_pnpm-8.6.2 as build

WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc prisma /app/
RUN pnpm install --frozen-lockfile --prefer-offline
COPY . .
RUN pnpm run build

FROM gcr.io/distroless/nodejs20-debian11
ARG COMMIT_SHA=none
ARG COMMIT_REF_NAME=none
WORKDIR /app
COPY --from=build /app/.output /app/

EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
ENV COMMIT_SHA=${COMMIT_SHA}
ENV COMMIT_REF_NAME=${COMMIT_REF_NAME}

CMD ["server/index.mjs"]
