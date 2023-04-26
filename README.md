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

## Sheatsheet

generate migration script with prisma

```sh
pnpm prisma migrate dev --name [MIGRATION_NAME]
```

format prisma schema file

```sh
pnpm prisma format
```
