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
npm install
```

copy env variables

```sh
cp .env.dist .env

## fill .env file
```

start postgres

```sh
npm run db:start
```

generate the prisma client

```sh
npm run prisma generate
```

apply migrations

```sh
npm run prisma migrate deploy
```

## Sheatsheet

generate migration script with prisma

```sh
npm run prisma migrate dev --name [MIGRATION_NAME]
```

format prisma schema file

```sh
npm run prisma format
```
