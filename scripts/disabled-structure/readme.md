# Script de restauration en cas de désactivation malencontreuse d'une structure

## Contexte

## Caveat

Ce script contient des colonnes en dur donc est garanti à la date du dernier test de récupération effectué.

Avant de l'utiliser il faut impérativement mettre les colonnes à jours et ajouter les tables manquantes.

## Utilisation

Un one-off container de Scalingo est utilisé avec l’installation d’un client postgresql pour exécuter les commandes.

```
scalingo --app mon-suivi-social run bash
```

Ce script nécessite l'extension postgresql `dblink` à installer préalablement sur la base de données (disponible)
sur les bases de données de scalingo. Elle doit être supprimée suite à la manipulation.

```bash
psql $SCALINGO_POSTGRESQL_URL -v structure_id="'<structure_id>'" -v source_db="'postgresql://restore:password@<ip>:<port>/remote_restored_db'" -f 1-restore-structure-users.sql
```

Les 5 scripts présents sont à exécuter les uns à la suite des autres car les données étant interdépendantes,
l'ordre de récupération est important. Le script de l'étape 4 s'exécute via shell, voir paragraphe suivant.

Par défaut les scripts se déroulent dans une transaction "rolled-back" pour tester. Pour l'exécution il
faut modifier manuellement chaque script pour commiter la transaction.

### Cas de la récupération des documents

Les documents peuvent être volumineux, l'étape 4 de leur récupération utilise un script shell qui
copie les données d'une base à l'aude avec `\COPY`.

```
./4-restore-document-content.sh "<structure_id>" "postgresql://restore:password@<ip>:9366/remote_restored_db" $SCALINGO_POSTGRESQL_URL
```

### Perspectives

Il serait sans doute plus judicieux de supprimer l'intégralité des données de la structure puis de les réinsérer
avec un script shell et des commandes `\COPY` (qui permettent des `INSERT` performant mais pas des `UPDATE`).

Pour cela il faut valider une methode de suppression complète des données de structure et pas juste une anonymisation
(v2 de la désactivation des structures ?)
