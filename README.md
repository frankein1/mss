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

````sh
docker run --rm -p 8080:3000 \
    -e NUXT_PUBLIC_APP_URL='http://localhost:8080' \
    -e NUXT_PUBLIC_INCLUSION_CONNECT_ISSUER='https://recette.connect.inclusion.beta.gouv.fr/realms/local' \
    -e NUXT_PUBLIC_INCLUSION_CONNECT_CLIENT_ID='local_inclusion_connect' \
    -e NUXT_INCLUSION_CONNECT_CLIENT_SECRET='xxxxxxxxxxxxxxxx' \
    -e NUXT_JWT_KEY='secret' \
    -e DATABASE_URL="postgresql://mss:password@host.docker.internal:5453/mss" \
      monsuivisocial
``



## Sheatsheet

generate migration script with prisma

```sh
pnpm prisma migrate dev --name [MIGRATION_NAME]
````

format prisma schema file

```sh
pnpm prisma format
```
