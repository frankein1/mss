# Comment Contribuer

Merci de prendre le temps de contribuer ! 🎉

## Signaler un problème

Afin de signaler un problème ou proposer des évolutions à notre plateforme, merci de [nous contacter par email](mailto:support@monsuivisocial.incubateur.anct.gouv.fr).

## Soumettre une modification

Les merge requests sont bienvenues ! N’hésitez pas à [nous en parler à l’avance](mailto:monsuivisocial@anct.gouv.fr).

La démarche est habituelle : faites un fork, créez une branche, faites une PR.

Pour les petites corrections de fautes d’orthographe, n’hésitez pas à proposer une modification directement depuis github.com.

## Mettre en place le dépôt local

Mon Suivi Social dépend de deux services externes :

- le service d'authentification Inclusion Connect
- un serveur SMTP d'envoi de mails transactionnels à choisir

Afin d'être autonome en local, il est possible d'installer ces deux services

### Installation locale d'Inclusion Connect

https://github.com/gip-inclusion/inclusion-connect

Installation avec https://github.com/gip-inclusion/inclusion-connect/blob/main/docs/development.md

Modifications nécessaires de la configuration :

[...]

Connexion à l'interface administrateur

- permet de valider les comptes

### Interception des mails de connexion en local

- table Email dans prisma studio

Permet de récupérer les mails de connexion pour avoir accès à la plateforme d'administration qui permet de créer le premier utilisateur

Alternativement, https://github.com/maildev/maildev

### Setup du .env

voir README.md

- Mettre la config du serveur mail local si nécessaire
- Mettre la config de la DB locale postgres & MAJ DATABASE_URL
- Mettre la config de Inclusion Connect


### Création du premier utilisateur

## Style de code


### Frontend

- Architecture de Nuxt
- Rendu serveur donc peu de données stockées dans le store on privilégie une seule source de vérité, la BDD
- Nommage en anglais et traduction des notions métiers
- Au maximum des requêtes prisma

A investiguer : traduction des notions métiers en français

### Backend

voir doc d'archi technique
- wrapper trpc pour les points d'entrée API :
  - sécurité par design
  - permissions et roles
  - organisation routeur - route - handler - service - repo


### Linter

Lint manuel avec `pnpm lint`. Validé par la CI
Compilation typescript
Lint vue, js/ts,css et formattage avec prettier

Fix avec `pnpm lintfix`

## Tests

### Priorisation des tests

- e2e
- tests API
- test métiers avec base de données
- tests UI de composants custom complexes
- tests e2e d'accessibilité (lancement manuel)

A investiguer : 
- base de données in-memory https://github.com/morintd/prismock/

## Workflow de merge des pull requests

Afin de garder un historique git lisible et navigable par `git blame`, nous recommandons l'une de ces deux façons de merger une PR :

- Utiliser _"Squash and merge"_ si les commits de la PR n'apportent pas individuellement de valeur explicative sur le contexte.
- Utiliser _"Create a merge commit"_ si la PR contient des commits qui permettent de mieux comprendre les différents changements indépendants introduits dans la PR.

Au sein de notre projet, il est assumé que la majorité du contexte autour du changement est trouvable dans la PR et non dans les commits. Cependant, il est tout à fait possible de conserver ses commits si on les a bien créés pour qu'ils permettent d'obtenir rapidement une synthèse du contexte via `git blame`.

Par exemple, si au sein d'une même PR on effectue un (petit 🤞) refactor puis une évolution fonctionnelle, il est apprécié que le refactor fasse l'objet d'un commit séparé.

Note : il est possible de réécrire son historique de commits juste avant de merger, si des commits correctifs ont été ajoutés durant la revue.

Un point d'attention : si vous avez mergé la branche `production` dans votre branche de feature pendant la vie de votre PR, veillez à ce que ces commits de merge ne finissent pas dans `production`. Pour ce faire :
- si vous utilisez un squash merge, ces commits vont disparaître
- si vous mergez dans `production` le plus pratique est de rebase votre branche sur `production` avant de merger.

Note : lorsque votre feature branch n'est plus à jour par rapport à `production`, GitHub affiche un avertissement "This branch is out-of-date with the base branch" et vous propose de remédier à la situation. Ce faisant, on déclenche une CI qui teste le code tel qu'il serait s'il était mergé. Si cette CI passe, on peut alors merger.

## Inspiré de

- https://github.com/betagouv/mon-entreprise/blob/master/CONTRIBUTING.md
- https://github.com/betagouv/rdv-service-public/blob/production/docs/2-contributions.md