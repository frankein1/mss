FROM registry.gitlab.com/vigigloo/tools/pnpm:node-20_pnpm-9.1.4 as build

WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc prisma /app/
RUN pnpm install --frozen-lockfile --prefer-offline
COPY . .
RUN pnpm run build

# Temposary fix due to gitlab builds failing inexplicably
# See https://chat.incubateur.anct.gouv.fr/incubateur/pl/4r9m5p6xyj8o9mhodgmrb89aoo
# FROM gcr.io/distroless/nodejs20-debian11
FROM node:20-bullseye-slim
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
