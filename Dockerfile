FROM registry.gitlab.com/vigigloo/tools/pnpm:node-18_pnpm-8.6.2 as build

WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc prisma /app/
RUN pnpm install --frozen-lockfile --prefer-offline
COPY . .
RUN pnpm run build

FROM gcr.io/distroless/nodejs20-debian11
ARG COMMIT_SHA=none
ARG COMMIT_REF_NAME=none
ARG COMMIT_TAG=none
WORKDIR /app
COPY --from=build /app/.output /app/

EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NUXT_PUBLIC_VERSION_COMMIT_SHA=${COMMIT_SHA}
ENV NUXT_PUBLIC_VERSION_COMMIT_REF_NAME=${COMMIT_REF_NAME}
ENV NUXT_PUBLIC_VERSION_COMMIT_TAG=${COMMIT_TAG}

CMD ["server/index.mjs"]
