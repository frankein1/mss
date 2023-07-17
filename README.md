# Mon Suivi Social

[Mon Suivi Social](https://monsuivisocial.incubateur.anct.gouv.fr/) est une startup d'État portée par [beta.gouv.fr](beta.gouv.fr) et l'[Incubateur des Territoires](https://incubateur.anct.gouv.fr/).

Mon Suivi Social est un outil simple d'utilisation et complet pour gérer l'accompagnement social.

## Dépendances

Pour lancer le projet, vous avez besoin de :

- [Node.js](https://nodejs.org/en)
- [Docker](https://www.docker.com/)
- [pnpm](https://pnpm.io/)

## Technologies

Le projet utilise les technologies Node.js suivantes :

- [Nuxt](https://nuxt.com/)
- [Prisma](https://www.prisma.io/)

## Pour commencer

- Installez les dépendances Node.js

  ```sh
  pnpm install
  ```

  **À SAVOIR** : Si vous voulez contribuer au projet, merci d'exécuter la commande `pnpm simple-git-hooks` une fois les dépendances Node.js installées pour que votre code soit _linté_ et _formatté_ lorsque vous le _commitez_.

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
  - Lien d'accès : https://next.monsuivisocial.dev.incubateur.anct.gouv.fr/
  - Mode de déploiement : Poussée sur la branche `main`
