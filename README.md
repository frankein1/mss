# Mon Suivi Social

[Mon Suivi Social](https://monsuivisocial.incubateur.anct.gouv.fr/) est une startup d'État portée par [beta.gouv.fr](beta.gouv.fr) et l'[Incubateur des Territoires](https://incubateur.anct.gouv.fr/).

Mon Suivi Social est un outil simple d'utilisation et complet pour gérer l'accompagnement social.

## Dépendances

Pour lancer le projet, vous avez besoin de :

- [Node.js](https://nodejs.org/en) v20
- [Docker](https://www.docker.com/)
- [pnpm](https://pnpm.io/) voir version dans `/package.json > "engines"`

## Technologies

Le projet utilise les technologies Node.js suivantes :

- [Nuxt](https://nuxt.com/)
- [Prisma](https://www.prisma.io/)

## Pour commencer

- Installez les dépendances Node.js

  ```sh
  pnpm install
  ```

- Copiez les variables d'environnement

  ```sh
  cp .env.sample .env
  ```

  Puis remplissez le fichier `.env` avec les valeurs manquantes.

  Pour utiliser l'espace documents en local, ajoutez la configuration du stockage S3 de l'environnement de développement à votre fichier `.env`. Ces valeurs sont disponibles dans les variables d'environnement des paramètres _CI/CD_ du [dépôt GitLab](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2).

- Démarrez la base de données Postgres (utilise Docker)

  ```sh
  pnpm dev:db:start
  ```

- Générez le client Prisma

  ```sh
  pnpm prisma generate
  ```

- Appliquez les migrations Prisma

  ```sh
  pnpm prisma migrate deploy
  ```

- Démarrez le serveur de développement

  ```sh
  pnpm dev
  ```

Il est alors disponible à l'adresse [localhost:3000](http://localhost:3000/).

### Données de test

Si besoin, il est possible d'alimenter la base de donnée avec des données de test en exécutant :

```sh
pnpm prisma db seed
```

## Tests automatisés.

Cette section décrit l'exécution des tests en local. Un container postgres spécifique est créé pour permettre la coexistence d'une BDD de developpement et d'une BDD de tests automatisés.

> **❗Important**
>
> Afin de permettre aux tests de se dérouler correctement dans la CI, la version de playwright et de pnpm doit être précisée dans `.gitlab-ci.yml`.

### Mise en place

Le ficher de configuration du container de test est `docker-compose.test.local.yml`.

Pour initialiser les variables d'environnement de test

```
cp .env.test.sample .env.local.test
```

Ensuite, remplir les variables d'environnement en prenant soin de renseigner des valeurs différentes de celle de dev pour le port de la base de données et de l'application (variables `DATABASE_URL`, `APP_URL`, `DB_PORT`).

Ajouter les informations de connexion (email, mot de passe) pour les utilisateurs de test pour les test end-to-end.

### Données de test

On part d'une base de données vide pour les tests.

Si besoin on supprime son contenu avec :

```
pnpm test:db:stop
```

### Tests d'intégration

```
pnpm test:db:start
pnpm test:prisma migrate deploy
pnpm test:prisma db seed
pnpm test
```

### Tests end-to-end

```
pnpm test:db:start
pnpm test:prisma migrate deploy
pnpm test:prisma db seed
pnpm test:e2e
```

## Déploiement

- Construire l'image docker

  ```sh
  docker build . -t monsuivisocial
  ```

- Démarrer l'image docker

  ```sh
  docker run --rm -p 8080:3000 --env-file .env-list monsuivisocial
  ```

## Antisèche

- Générer une migration Prisma suite à une modification du schéma

  ```sh
  pnpm prisma migrate dev --name [MIGRATION_NAME]
  ```

## Conventions de code

Au-delà des conventions définies grâce aux _linters_ et _formatters_ ESLint, Stylelint et Prettier, le projet suis les [conventions de code proposées par la communauté de Vue.js](https://vuejs.org/style-guide/).

En supplément, deux choix ont été faits sur le nommage des composants :

- Le préfixe `Atom` a été choisi pour les [composants de base](https://vuejs.org/style-guide/rules-strongly-recommended.html#base-component-names),
- Le préfixe `The` a été choisi pour les [composants à instance unique](https://vuejs.org/style-guide/rules-strongly-recommended.html#single-instance-component-names).

## Environnements

L'application de Mon Suivi Social existe sur plusieurs environnements :

- production :
  - Lien d'accès : https://monsuivisocial.incubateur.anct.gouv.fr/
  - Mode de déploiement : `pnpm release`
- développement :
  - Lien d'accès : https://monsuivisocial.dev.incubateur.anct.gouv.fr/
  - Mode de déploiement : Poussée sur la branche `main`
