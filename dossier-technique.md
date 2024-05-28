# Dossier technique

> Ce dossier a pour but de présenter l’architecture technique du SI. Il n’est par conséquent ni un dossier d’installation, ni un dossier d’exploitation ou un dossier de spécifications fonctionnelles.

**Nom du projet :** Mon Suivi Social

**Dépôt de code :** https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2

**Hébergeur :** Scalingo, Paris (région Scalingo "osc-secnum-fr1", région Outscale "cloudgouv-eu-west-1")

**Décision d’homologation :** !!<date>!!

## Suivi du document

> Le suivi de ce document est assuré par le versionnage Git.

## Fiche de contrôle

> Cette fiche a pour vocation de lister l’ensemble des acteurs du projet ainsi que leur rôle dans la rédaction de ce dossier.

| Organisme                  | Nom                   | Rôle                   | Activité  |
|----------------------------|-----------------------|------------------------|-----------|
| Mon Suivi Social           | Thomas Glatt          | Lead tech              | Relecture + Rédaction |
| Mon Suivi Social           | Nayanka Bolnet        | Lead tech              | Relecture + Rédaction |
| Mon Suivi Social           | Clara Dumont          | Product Manager        | Relecture |
| Incubateur des territoires | Florian Busi          | Consultant SSI         | Relecture |

## Description du projet

Il est open source, bien que toutes les instances soient gérées par l'équipe.

Plus d'infos sur la fiche beta : https://beta.gouv.fr/startups/mon-suivi-social.html

## Architecture

### Stack technique

Le projet est un monolithe [Nuxt](https://nuxt.com/) avec une base Postgres pour les données métier. L'infrastructure est entièrement gérée par Scalingo en PaaS.
[Nuxt](https://nuxt.com/) peut fonctionner en mode SSR (Server Side Rendering). C'est à dire que le HTML peut être généré soit du coté du serveur, soit du coté du navigateur. On distinguera donc deux parties:
- Nuxt client: code pouvant être executé coté serveur ou coté navigateur
- Nuxt server: code s'excutant uniquement coté serveur

Le projet est écrit en [Typescript](https://www.typescriptlang.org/).

Les briques structurantes du projet sont:
- l'ORM [Prisma](https://www.prisma.io/)
- [trpc](https://trpc.io/) permet de typer les API de bout en bout

### Matrice des flux

#### Applications métier sur Scalingo

| Source           | Destination       | Protocole | Port | Localisation      | Interne/URL Externe |
|------------------|-------------------|-----------|------|-------------------|---------------------|
| Navigateur       | Nuxt client       | HTTPS     | 443  | Paris/SecNumCloud | Externe             |
| Nuxt server      | Postgres Scalingo | TCP       | 5432 | Paris/SecNumCloud | Interne             |
| Nuxt client      | Metabase          | HTTPS     | 443  | Paris/SecNumCloud | Externe             |
| Metabase         | Postgres Scalingo | TCP       | 5432 | Paris/SecNumCloud | Interne             |

#### Tooling (error monitoring)

| Source      | Destination | Protocole | Port | Localisation              | Interne/URL Externe                             |
|-------------|-------------|-----------|------|---------------------------|-------------------------------------------------|
| Nuxt client | Sentry      | HTTPS     | 443  | Tours, France             | sentry.incubateur.net                           |
| Nuxt server | Sentry      | HTTPS     | 443  | Tours, France             | sentry.incubateur.net                           |
| Nuxt client | Matomo      | HTTPS     | 443  | Tours, France             | https://matomo.incubateur.anct.gouv.fr          |


#### Services externes

| Source                            | Destination                | Protocole     | Port | Localisation        | Interne/URL Externe                 |
|-----------------------------------|----------------------------|---------------|------|---------------------|-------------------------------------|
| Nuxt Server                       | Brevo                      | SMTP          | 587  | Paris, France       | smtp-relay.sendinblue.com           |

Note : l'application expose aussi une API `https://monsuivisocial.incubateur.anct.gouv.fr/api/structures` qui retourne les structures utilisatrices du service. Cette API est protégée par un système de token.

#### Fournisseurs d'identité

| Source     | Destination      | Protocole     | Port | Localisation        | Interne/URL Externe            |
|------------|------------------|---------------|------|---------------------|--------------------------------|
| Navigateur | InclusionConnect | HTTPS (OAuth) | 443  | France              | connect.inclusion.beta.gouv.fr |

### Inventaire des dépendances

| Nom de l’applicatif | Service          | Version   | Commentaires                                                    |
|---------------------|------------------|-----------|-----------------------------------------------------------------|
| Serveur web         | Nuxt @ Scalingo  | Nuxt 3    | Voir ci-dessous pour le détail des librairies                   |
| BDD métier          | PostgreSQL       | `14.11.0` | Stockage des données métier, voir [/prisma/schema.prisma](/prisma/schema.prisma) |

La liste des librairies JS est disponible dans :
- [package.json](/package.json) pour la liste des dépendances directes
- [pnpm-lock.yaml](/pnpm-lock.yaml) pour la liste complète des librairies utilisées directement et indirectement (dépendances
  indirectes), et leurs versions précises

### Schéma de l’architecture

Notre application est accessible à l'adresse: https://monsuivisocial.incubateur.anct.gouv.fr/

Nous avons actuellement 3 instances :
- `anct-monsuivisocial-prod` : serveur de production pour `https://monsuivisocial.incubateur.anct.gouv.fr`
- `anct-monsuivisocial-demo` : serveur de demo pour `https://monsuivisocial-demo.dev.incubateur.anct.gouv.fr`
- `anct-monsuivisocial-dev` : serveur de dev pour `https://monsuivisocial.dev.incubateur.anct.gouv.fr`

```mermaid
flowchart TD
    %% Domaines de prod
    monsuivisocial.incubateur.anct.gouv.fr

    %% Domaines de demo
    monsuivisocial-demo.dev.incubateur.anct.gouv.fr

    %% Domaines de dev
    monsuivisocial.dev.incubateur.anct.gouv.fr

    %% Apps Scalingo
    anct-monsuivisocial-prod((anct-monsuivisocial-prod))
    anct-monsuivisocial-demo((anct-monsuivisocial-demo))
    anct-monsuivisocial-dev((anct-monsuivisocial-dev))

    %% Relations domaine -> app
    monsuivisocial.incubateur.anct.gouv.fr --> anct-monsuivisocial-prod
    monsuivisocial-demo.dev.incubateur.anct.gouv.fr --> anct-monsuivisocial-demo
    monsuivisocial.dev.incubateur.anct.gouv.fr --> anct-monsuivisocial-dev
    
```

`anct-monsuivisocial-prod` est notre instance de production actuelle. Elle est représentée fidèlement dans les
schémas ci-dessous. 

L'instance `anct-monsuivisocial-demo` sert de plateforme de démo, elle est toujours à la même version que la production

L'instance `anct-monsuivisocial-dev` est la plateforme de dev. Elle permet de tester les évolutions en cours de développement.

#### Architecture interne à Scalingo

```mermaid
C4Container
    Person(user, "Utilisateur⋅ice", "Agent / usager")

    Container_Boundary(scalingo, "Scalingo") {
        System(scalingo_gateway, "Gateway Scalingo", "Load balancer+ router")
        Container(web_app, "Nuxt", "Application web + API JSON")
        ContainerDb(postgres, "PostgreSQL", "Données métier")
    }

    Rel(user, scalingo_gateway, "HTTPS")
    Rel(scalingo_gateway, web_app, "")
    Rel(web_app, postgres, "TCP")
```

#### Échanges entre l'app et les services externes

```mermaid
C4Container
    System(web_app, "Ruby on Rails", "Application web + API JSON")

    System_Ext(sentry, "Sentry", "Error monitoring")
    System_Ext(skylight, "Skylight", "APM")

    System_Ext(brevo, "Brevo", "Emails transactionnels")
    System_Ext(api_microsoft, "API Microsoft", "Synchro Outlook")
    System_Ext(netsize, "Netsize", "Envoi SMS")
    System_Ext(sfr_mail2sms, "SFR Mail2SMS", "Envoi SMS")
    System_Ext(clever_technologies, "Clever Technologies", "Envoi SMS")

    Rel(web_app, sentry, "HTTPS")
    Rel(web_app, skylight, "HTTPS")
    Rel(web_app, brevo, "SMTP")
    Rel(web_app, api_microsoft, "HTTPS")
    Rel(web_app, netsize, "HTTPS")
    Rel(web_app, sfr_mail2sms, "SMTP")
    Rel(web_app, clever_technologies, "HTTPS")
```

#### Échanges entre l'app, les fournisseurs d'identités, et les utilisateur⋅ices

```mermaid
C4Container
    System(web_app, "Ruby on Rails", "Application web + API JSON")

    Person(user, "Utilisateur⋅ice", "Agent / usager")

    System_Ext(france_connect, "FranceConnect", "")
    System_Ext(inclusion_connect, "InclusionConnect", "")
    System_Ext(oauth_microsoft, "Oauth Microsoft", "")
    System_Ext(oauth_github, "Oauth GitHub", "")

    Rel(user, web_app, "HTTPS redirect")

    Rel(user, france_connect, "HTTPS redirect")
    Rel(user, inclusion_connect, "HTTPS redirect")
    Rel(user, oauth_microsoft, "HTTPS redirect")
    Rel(user, oauth_github, "HTTPS redirect")
```

#### Échanges entre l'app et Metabase

Notre équipe utilise Metabase pour comprendre l'utilisation de l'application par les différents. Metabase pointe vers une copie anonymisée de la base de production.
Cette copie anonymisée est gérée par une application Scalingo d'ETL (Extract Transform Load). Cette appli n'a pas de serveur web, mais juste un job qui est lancé périodiquement. Ce job télécharge un backup de la base de données de production, exécute un script d'anonymisation pour supprimer les données personnelles ou sensibles.
Le serveur web Metabase est hébergé sur une application Scalingo.

```mermaid
C4Container
    Person(user, "Utilisateur⋅ice Metabase", "membre de l'équipe")

    Container_Boundary(metabase_app, "Application Scalingo pour Metabase") {
        System(metabase_web, "Metabase", "Serveur web")
    }

    Rel(user, metabase_web, "HTTPS")

    Container_Boundary(etl_app, "Application Scalingo pour l'ETL") {
        System(job_etl, "Job d'ETL", "Copie et anonymisation")
        ContainerDb(postgres_etl, "PostgreSQL", "Données métier anonymisées")
    }

    Rel(job_etl, postgres_etl, "TCP avec SSL")
    Rel(metabase_web, postgres_etl, "TCP avec SSL")

    Container_Boundary(production_app, "Application Scalingo pour la production") {
        Container(web_app, "Ruby on Rails", "Application web + API JSON")
        ContainerDb(postgres, "PostgreSQL", "Données métier")
        ContainerDb(backups, "Backups PostgreSQL", "Données métier")
    }

    Rel(web_app, postgres, "TCP")
    Rel(job_etl, backups, "TCP")
```

### Gestion DNS

C'est **Gandi (gandi.net)** qui fournit nos noms de domaine et la gestion DNS.

Nous y gérons les domaines suivants :
- `rdv-solidarites.fr` : domaine de production historique, également utilisé pour `demo.rdv-solidarites.fr`
- `rdv-service-public.fr` : gestion d'une boite mail support@rdv-service-public.fr
- `rdv-aide-numerique.fr` : domaine de production de la plateforme RDV Aide Numérique (pointe sur l'instance principale)
- `rdv-services-publics.fr` : anti phishing : redirige vers `rdv-service-public.fr`
- `rdv-solidarite.fr` : anti phishing : redirige vers `rdv-solidarites.fr`
- `rdv-solidarités.fr` : anti phishing : redirige vers `rdv-solidarites.fr`
- `rdv-solidarité.fr` : anti phishing : redirige vers `rdv-solidarites.fr`

### Schéma des données

Lancer `make generate_db_diagram` pour obtenir un SVG de l'état actuel des tables Postgres. Le fichier `db/schema.rb` donne aussi une description des tables via un DSL Ruby.

Nous avons cessé de versionner ce SVG depuis le commit 6b3069c. La dernière version commitée était celle-ci :
https://github.com/betagouv/rdv-solidarites.fr/blob/f12411c0760be1316aae571bb35c62a78a5b7d7f/docs/domain_model.svg

## Exigences générales

### Accès aux serveurs et sécurité des échanges

Les serveurs (applicatif et base de données) sont gérés par Scalingo. Scalingo ne fournit pas de système de rôle : soit
on a accès à une app, soit on ne l'a pas.

Nous avons actuellement 6 apps Scalingo, les trois premières pour le métier, les trois autres pour le tooling :

- `osc-secnum-fr1/production-rdv-solidarites`
- `osc-secnum-fr1/production-rdv-mairie`
- `osc-secnum-fr1/demo-rdv-solidarites`
- `osc-secnum-fr1/rdv-service-public-etl`
- `osc-secnum-fr1/rdv-service-public-etl-staging`
- `osc-secnum-fr1/rdv-service-public-metabase`

Le fait d'avoir accès à une app Scalingo donne les droits suivants :

- augmenter ou réduire le nombre d'instances applicatives de l'app / régler les paramètres d'autoscaling
- administrer la base Postgres (changer la taille de l'instance, mettre à jour Postgres, télécharger des backups, etc)
- administrer la base Redis (même fonctionnalités que pour Postgres ci-dessus)
- visualiser les déploiements passés ou en cours
- configurer le déploiement automatique d'une branche GitHub
- visualiser l'activité de l'app (scaling, déploiements, commandes lancées en one-off)
- visualiser les logs (app + jobs + routeur Scalingo) et en télécharger des archives
- visualiser des metrics (requêtes par minute, temps de réponse, CPU, RAM)
- lire et modifier les variables d'environnements :
  - credentials SMTP du compte secretariat@rdv-solidarites.fr
  - credentials Microsoft Azure
  - credentials de Postgres
  - credentials de Netsize (envoi de SMS)
  - credentials FranceConnect
  - credentials InclusionConnect
  - credentials GitHub
  - master key Rails (permettant de déchiffrer les colonnes chiffrées en base)
  - credentials Brevo (ex Sendinblue)
- octroyer aux équipes support Scalingo le droit d'accéder à l'environnement d'exécution de l'application et aux
  métadonnées et aux données de surveillance des bases de données
- ajouter ou supprimer des collaborateurs sur l'app
- ajouter au supprimer les domaines autorisés à pointer vers l'app
- gérer les alertes

Les accès Scalingo sont octroyés uniquement à l'équipe technique ("devs") car iels en ont besoin de tout ou une partie
des fonctionnalités listées afin de :

- surveiller la santé de l'app de production
- lancer une console distante en production afin d'investiguer des bugs
- ajouter ou mettre à jour des variables d'environnement
- vérifier le bon déploiement des nouvelles versions du code

**Scalingo propose du 2FA par TOTP, mais aucun mécanisme ne force les collaborateurs à l'activer. Nous avons donc dans
notre checklist d'onboarding un point précisant qu'il faut impérativement activer le 2FA.** En cas de perte des codes
TOTP, Scalingo propose une procédure qui inclut la vérification de l'identité de l'utilisateur concerné par la
transmission d'un document d'identité.

Note : la fonctionnalité de review app est activée sur l'app de démo. Le fichier `scalingo.json` contient la liste des
variables d'environnement qu'il ne faut pas hériter de l'app de démo lors de la création d'une review app. Une review
app est automatiquement créée lors de l'ouverture d'une Pull Request Github, et automatiquement détruire lors de la
fermeture / merge d'une PR.

#### Détection de fuite de secrets

Nous avons activé la fonctionnalité "Secret scanning" de GitHub sur notre dépôt. Ce système envoie des alertes et bloque le push si des secrets sont détectés dans un commit.

GitGuardian, qui fait de la détection automatisée de fuites de secrets est aussi activé parmis les Github actions de la CI.

### Authentification, contrôle d’accès, habilitations et profils

L'application a 3 types d'utilisateurs :
- usager⋅e
- agent⋅e
- super admin
Pour visualiser, modifier ou annuler un RDV, l'usager peut soit cliquer sur un lien fourni en notification mail ou SMS et entrer les trois premières lettres de son nom de famille.

Les comptes utilisateurs ont une contrainte d'unicité sur les emails mais ce n'est pas le cas des profils sans emails créés par les agents.

Les sessions sont déconnectées automatiquement.

#### Les usager⋅es

Les usager⋅es prennent RDV avec les agents. Iels peuvent voir leurs RDVs, annuler ou modifier des RDVs futurs, et
changer son e-mail, mot de passe et infos personnelles.

Pour visualiser, modifier ou annuler un RDV, l'usager peut soit cliquer sur un lien fourni en notification mail ou SMS,
soit se connecter pour accéder à tous ses RDVs.

La connexion à un profil usager est faite par email + mot de passe. Les mots de passes sont stockés salés et chiffrés
(en utilisant Devise qui utilise Bcrypt). Une connexion via FranceConnect est aussi proposée : un compte est alors
créé ou relié si l'e-mail existe déjà dans notre base usagers.

Un mot de passe doit avoir une longueur d'**au moins 12 caractères** et ne pas faire partie des 20 000 mots de passe les plus utilisés par des francophones (https://github.com/francois-ferrandis/common_french_passwords).

#### Les agents

Les agents ont accès à diverses fonctionnalités touchants à :
- la déclaration de leurs plages d'ouvertures et absences
- le configuration des motifs de RDVs et des lieux de RDVs
- la gestion des autres agents de leur organisation
- la liste de leurs RDVs et de ceux de leurs collègues
- la sectorisation géographique des lieux
- la définition de webhooks (sortants) pour l'interopérabilité de la solution

Les règles d'accès à ces ressources sont complexes et dépendent de plusieurs niveaux d'accès attribués aux agents.
Ces niveaux d'accès sont gérés par les administrateurs locaux de la solution au sein des organisations
utilisatrices (départements, mairies).

La connexion à un profil agent est faite par email + mot de passe. Les mots de passes sont stockés salés et chiffrés
(en utilisant une Devise qui utilise Bcrypt). Une connexion via InclusionConnect est aussi proposée : un compte est alors
créé ou relié si l'e-mail existe déjà dans notre base agents.

Un mot de passe doit avoir une longueur d'**au moins 12 caractères** et ne pas faire partie des 20 000 mots de passe les plus utilisés par des francophones (https://github.com/francois-ferrandis/common_french_passwords).

#### Les super admins

Une interface CRUD permettant de gérer l'ensemble des organisations, services, motifs, lieux, territoires et
usagers est proposée en interne à l'équipe.

Afin de s'y connecter, il faut utiliser l'OAuth de GitHub. L'adresse e-mail alors fournie par GitHub doit être
présente dans une table `super_admins`, où les entrées sont crées et supprimées à la main lors de l'arrivée et
du départ de membres de l'équipe;

Tous les membres de l'équipe faisant partie de [l'organisation `betagouv` sur Github](https://github.com/betagouv), ils utilisent une authentification à 2 facteurs.

### Traçabilité des erreurs et des actions utilisateurs

#### Logs textuels

Les logs textuels sont écrits dans le système de log de Scalingo. Cela comprend :
- Les logs des commandes de la production (e.g. lancer la console)
- les changements de variables d'environnements

Les logs applicatifs (générés par Rails) contiennent, pour chaque requêtes HTTP :

- timestamp
- path HTTP
- méthode HTTP
- format (HTML, JSON)
- controller + action
- durée

Les logs produits par le routeur de Scalingo contiennent, pour chaque requêtes HTTP :

- timestamp
- path HTTP
- méthode HTTP
- IP d'origine
- referer
- user agent

La consultation des logs textuels ne se fait que lors d'investigations de bugs. Leur usage est donc uniquement ponctuel
et leur consultation est manuelle. Nous n'avons pas de système d'analyse de logs.

#### Traçabilité applicative / auditing

Nous utilisons également la gem `paper_trail`, qui permet d'enregistrer chaque modification (création, modification,
suppression) effectuée dans une sélection de tables Postgres. Elle est activée sur une partie des tables et colonnes
et permet ainsi d'avoir une traçabilité partielle des changements.

Nous n'avons en revanche pas de système permettant de savoir quel profil a eu accès à quelle information et quand.

#### Monitoring d'erreur

Nous utilisons Sentry afin d'être informé⋅es sur les nouvelles erreurs, et le volume des erreurs existantes.
Nous sommes alerté⋅es en cas de nouvelles erreurs ou volume inhabituel, en direct sur notre outil de
communication principal Mattermost. Nous utilisons l'instance Sentry de l'incubateur beta.gouv (sentry.incubateur.net).

Notre hébergeur Scalingo propose aussi un système d'alerting déclenché selon des métriques diverses, mais
celui-ci n'est pas utilisé actuellement car sa calibration est difficile.

### Politique de mise à jour des applicatifs

Voici les cas dans lesquels nous mettons à jour une librairie spécifique :

- une version plus récente corrige une faille de sécurité (nous utilisons Dependabot pour être prévenu⋅es)
- une version plus récente permet de répondre à un besoin technique ou fonctionnel
- une montée de version est requises par une librairie correspondant aux critères ci-dessus (autrement dit, nous devons
  mettre à jour de manière indirecte)
- une fois par mois, nous mettons à jour les gems vers leur dernier "patch level", afin d'être proactif sur les fixes de
  sécurité et de bugs

La décision a été prise le 24 avril 2023, voir log de décision
ici : [2023-04-24-politique-maj-gems.md](/docs/decisions/2023-04-24-politique-maj-gems.md)

Afin d'être prévenus lors de la publication d'une CVE, nous utilisons Dependabot sur notre dépôt GitHub.
Une alerte e-mail est envoyée aux devs qui watchent le dépôt (et nous faisons en sorte de le watch à travers
notre procédure d'onboarding).

### Détection des vulnérabilités

Nous utilisons la librairie ruby `brakeman` qui scanne le code afin de trouver des mauvaises pratiques de sécurité.

Nous avons également activé CodeQL sur notre dépot GitHub. Cet outil permet de détecter les vulnérabilités via une analyse statique du code.

### Intégrité

Des backups de nos bases de données Postgres et Redis sont faîtes automatiquement par Scalingo. Ces backups sont
créés quotidiennement et gardés 1 an.

Nous les testons régulièrement en les téléchargeant et en les chargeant dans notre environnement local.

Scalingo nous offre également la fonctionnalité de Point-in-time Recovery. Nous profitons également d'un système
de cluster avec 2 nodes, qui permet un failover automatique en cas de plantage d'une instance Postgres.

### Confidentialité

**L'application est initialement conçue pour la prise de RDV dans le milieu médico-social. Nous manipulons donc des données médicales.**

Parmi les données que nous manipulons, les plus critiques sont :
- les coordonnées des usager⋅es
- l'historique des RDVs pris par une personne ainsi que le motif de ces RDV
- le champs "contexte", un champs texte libre où les agents peuvent saisir des informations de contexte sur un RDV

### Flux des données personnelles dans le SI

Le flux des données personnelles dans le SI est détaillé dans  [ce diagramme](/docs/flux_de_donnees_personnelles_si.svg) et [sa légende](/docs/legende_flux_de_donnees_personnelles_si.md).

### Bonnes pratiques de sécurité au sein de l'équipe

Lors de l'accueil d'un nouveau membre de l'équipe, on le forme à plusieurs bonnes pratiques de sécurité :
- chiffrer son disque dur
- Prendre l’habitude de verrouiller son écran dès qu’on est dans un lieu public (coworking, bureaux à Ourq, etc). Sous Mac OSX, nous recommandons l’usage des coins actifs.

Pour les membres de l'équipe technique, on prend ces mesures supplémentaires :
- [formation aux bonnes pratiques d'accès aux dumps de la production](docs/4-notes-techniques.md#Dumps-de-production)
- activation de l'authentification à 2 facteur sur Scalingo

#### Suppression automatique de données anciennes

Voici les suppressions automatiques mises en place :
- Suppression des RDVs de plus de 2 ans
- Suppression des plages d'ouverture de plus de 1 an
- Suppression des logs PaperTrail (auditing) de plus de 2 ans
- Suppression des usagers inactifs pendant au moins 2 ans (pas de rdv dans les 2 dernières années, et compte créé depuis plus de 2 ans)
- Suppression des agents inactifs pendant au moins 2 ans (pas de rdv dans les 2 dernières années, et compte créé depuis plus de 2 ans, pas de connexion depuis 2 ans)
