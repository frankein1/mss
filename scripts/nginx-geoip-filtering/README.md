# Filtrage IP avec l'extension nginx-modsecurity

## Variables d'environnement

Les variables d'environnement permettant d'activer le pare-feu avec filtrage géographique d'IP :

```
ENABLE_MODSECURITY=true   # from nginx-buildpack
ENABLE_GEO_FILTER=true
MODSECURITY_GEOIP_DB_URL=https://url-to-download-geoip-database.fr
```

Pour commencer il est mieux de ne pas bloquer le traffic en activant uniquement les logs de détection

```
MODSECURITY_RULE_ENGINE=DetectionOnly
MODSECURITY_DEBUG_LOG_LEVEL=1              # from nginx-buildpack
MODSECURITY_AUDIT_LOG_LEVEL=RelevantOnly   # from nginx-buildpack
```

Note : pour désactiver le pare-feu, il ne faut pas mettre les variables à false mais les **supprimer complètement**.

## Téléchargement de la base de données de géolocalisation des IP

Le téléchargement de la BDD des IP est un prérequis à l'activation du pare-feu. Pour cela on utilise
le buildpack précédant nginx : nodejs-buildpack qui est exécuté avant.

Une étape `scalingo-prebuild` dans `package.json` permet d'effectuer des actions personnalisées avant de compiler l'application.

Le script `fetch-db-ip.sh` est lancé dans cette étape et enregistre la base dans l'emplacement configuré dans geo-filter.modsecurity (variable SecGeoLookupDB).

## Description des fonctionnalités du pare-feu

_à venir_

## Rafraichissement de la base de données de géolocalisation des IP

_à venir_
