# Mon Suivi Social

## Requirements

- [Node](https://nodejs.org/en)
- [Docker](https://www.docker.com/)

## Libraries

- [Nuxt](https://nuxt.com/)
- [Prisma](https://www.prisma.io/)

## Environment

### Local

install dependencies

```sh
pnpm install
```

copy env variables

```sh
cp .env.sample .env

## fill .env file
```

start postgres

```sh
pnpm db:start
```

generate the prisma client

```sh
pnpm prisma generate
```

apply migrations

```sh
pnpm prisma migrate deploy
```

## Déploiement

### local

build l'image docker

```sh
docker build . -t monsuivisocial
```

lancer l'image docker

```sh
docker run --rm -p 8080:3000 --env-file .env-list monsuivisocial
```

```.env
# env-list
DATABASE_URL="postgresql://mss:password@host.docker.internal:5433/mss"

NUXT_PUBLIC_APP_URL='http://localhost:8080'

NUXT_AUTH_JWT_KEY='secret'
NUXT_AUTH_KEYCLOAK_ISSUER='https://recette.connect.inclusion.beta.gouv.fr/realms/local'
NUXT_AUTH_KEYCLOAK_CLIENT_ID='monsuivisocial'
NUXT_AUTH_KEYCLOAK_CLIENT_SECRET=xxxxxxxxxxx

NUXT_EMAIL_FROM=contactincubateur@anct.gouv.fr
NUXT_EMAIL_SMTP_HOST=smtp-relay.sendinblue.com
NUXT_EMAIL_SMTP_PASSWORD=xxxxxxx
NUXT_EMAIL_SMTP_USER=contactincubateur@anct.gouv.fr

NUXT_S3_BUCKET=anct-monsuivisocial-directus-production
NUXT_S3_KEY=xxxxxxxxx
NUXT_S3_SECRET=xxxxxxxxx
```

migrer le base de données

```sh
docker build . -t monsuivisocial-migrate -f ./prisma/Dockerfile
docker run -e DATABASE_URL="postgresql://mss:password@host.docker.internal:5433/mss" monsuivisocial-migrate
```

## Cheat sheet

generate migration script with prisma

```sh
pnpm prisma migrate dev --name [MIGRATION_NAME]
```

format prisma schema file

```sh
pnpm prisma format
```
