# Contribuer à Mon Suivi Social

Merci de prendre le temps de contribuer à **Mon Suivi Social** 💜 ! Ce guide décrit comment mettre en place votre environnement et soumettre vos contributions.

Le projet est hébergé sur [GitLab](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2). Toutes les contributions (merge requests, issues) se font sur GitLab.

## Table des matières

1. [Mise en place de l'environnement](#mise-en-place-de-lenvironnement)
2. [Outils de développement](#outils-de-développement)
3. [Vérifier avant de pousser](#vérifier-avant-de-pousser)
4. [Workflow Git](#workflow-git)
5. [Merge Requests et revue de code](#merge-requests-et-revue-de-code)
6. [Signaler un bug](#signaler-un-bug)
7. [Documentation et ressources](#documentation-et-ressources)

---

## Mise en place de l'environnement

### Prérequis

- **Node.js** : voir le champ `engines` du `package.json`
- **pnpm** : voir le champ `packageManager` du `package.json`
- **Docker Compose** (pour la base de données PostgreSQL)

### Installation

Les étapes d'installation sont décrites dans le [README.md](./README.md).

### Services externes

Pour être autonome en local, vous aurez besoin de :

- **ProConnect** (authentification) : créez un compte d'intégration sur [partenaires.proconnect.gouv.fr](https://partenaires.proconnect.gouv.fr/)
- **Serveur SMTP** (emails) : voir la configuration Mailtrap décrite dans le [README.md](./README.md)

## Outils de développement

**Prisma Studio** : interface web pour explorer/modifier la base de données

```
pnpm prisma studio
```

**Mode debug** : affiche les logs de Prisma, tRPC et RDVSP

```
pnpm dev:log
```

## Vérifier avant de pousser

Avant de pousser votre branche, exécutez les vérifications suivantes :

```bash
pnpm lint:typecheck    # vérification des types TypeScript
pnpm test              # tests unitaires et d'intégration (Vitest)
```

Des hooks de pre-commit (Husky) exécutent automatiquement ESLint, Prettier et stylelint à chaque commit. [Talisman](https://github.com/thoughtworks/talisman) doit également être installé pour détecter les secrets et fichiers sensibles avant chaque commit.

## Workflow Git

### Branche principale

- **`main`** est la branche de déploiement de la version de développement, elle est protégée et accessible uniquement par Merge Request
- Les versions suivent le [Semantic Versioning](https://semver.org/) et sont générées automatiquement via `commit-and-tag-version`, qui produit les tags de version et le CHANGELOG à partir des commits conventionnels

### Nommage des branches

Format : `<numéro-issue>-description-courte`

Utilisez le numéro de l'issue GitLab associée. Si aucune issue n'existe, créez-en une avant de commencer.

```
42-ajout-champ-email
153-correction-export-csv
```

### Conventional Commits

Le projet utilise [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/#summary) (obligatoire). Les commits sont rédigés en **français** et servent à générer automatiquement le CHANGELOG via `commit-and-tag-version`.

Pour le scope, utilisez le domaine métier ou technique concerné : beneficiaire, accompagnement, document, auth, archivage, atelier.

Exemple :

```
feat(beneficiaire): ajout d'un champ au formulaire complet

- Mise à jour des exports
- Adaptation de l'archivage
```

Les titres des merge requests suivent le même format pour permettre le "squash and merge".

## Merge Requests et revue de code

### Ouvrir une Merge Request

1. Forkez le projet sur GitLab
2. Poussez votre branche sur votre fork : `git push origin <votre-branche>`
3. Sur GitLab, créez une merge request depuis votre fork vers le projet principal
4. Remplissez le titre (format Conventional Commits) et la description :
   - **Contexte** : pourquoi ce changement ?
   - **Changements** : quoi exactement ?
   - **Comment tester** : étapes de vérification
   - **Captures d'écran** (si UI)
   - **Issue liée** : `cf. #123`

### CI automatique

Les pipelines CI ne sont pas accessibles pour les contributeurs externes. Un mainteneur déclenchera la pipeline sur votre MR après une première revue. Tous les checks doivent passer avant le merge.

### Revue de code

Au moins **1 approbation** est requise. Les reviewers vérifient en particulier :

- **Type-safety** : le code doit passer `nuxt typecheck`
- **Sécurité** : contrôle d'accès, validation des inputs
- **Accessibilité** : conformité DSFR/RGAA
- **Tests** : chemins critiques couverts

Pour les conventions de code détaillées, consultez [CLAUDE.md](./CLAUDE.md) et les fichiers [.claude/rules/](./.claude/rules/). **Lecture recommandée pour tout nouveau contributeur.**

## Signaler un bug ou proposer un changement

Utilisez le système d'issues GitLab avec les templates disponibles :

- **`bogue.md`** : pour signaler un bug
- **`ajout-champ.md`** : pour proposer l'ajout d'un champ de formulaire, avec le cadrage des impacts associés

Les issues sont triées par l'équipe. Une issue prête à être développée recevra le label `READY TO DEV` et sera associée à un milestone indiquant dans quelle version elle sera planifiée.

## Documentation et ressources

- [README.md](./README.md) — installation et commandes principales
- [CLAUDE.md](./CLAUDE.md) — architecture, conventions de code, patterns
- [.claude/rules/](./.claude/rules/) — description de l'architecture et des conventions du projet par domaine (sécurité, data model, tests, accessibilité, etc.)

---

## Questions ?

- Ouvrez une issue sur GitLab
- Contactez l'équipe via [Tchap](https://tchap.gouv.fr) ou via le [formulaire de contact](https://monsuivisocial.incubateur.anct.gouv.fr/contactez-nous/)
