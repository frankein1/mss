# Ajout d'un ou plusieurs champs dans un formulaire

## Informations des champs

### Description des champs

- Nom: _remplir_
- Type:
  - [ ] champ libre
  - [ ] case à cocher
  - [ ] radio
  - [ ] sélection unique
  - [ ] sélection multiple
  - [ ] liste fixe (e.g. situation familiale)
  - [ ] liste dynamique (e.g. organisme instructeur)
  - [ ] autre (date, recherche, etc.) : _remplir_

### Localisation du champ

- [ ] Formulaire configuration structure
- [ ] Formulaire création agent
- [ ] Formulaire création bénéficiaire
- [ ] Formulaire synthèse d'entretien
- [ ] Formulaire instruction de dossier (aide de logement, aide financière, autre) : _remplir_
- [ ] Autre formulaire: _remplir_

### Capture d'écran

_à compléter_

## Impacts

- [ ] Impression : ajout du champ à l'impression
- [ ] Export : ajout du champ à l'export
- [ ] Filtres : ajout du champ dans des filtres (filtre bénéficiaires, filtre accompagnement, filtre statistiques): _remplir_
- [ ] Statistiques : ajout du champ dans les statistiques (spécifier la carte statistique concernée): _remplir_

## Instructions d'implémentation (pour les devs)

**Modèle**

- [ ] Les champs sont ajoutés au modèle de données en incluant éventuellement les clés étrangères ou les enums nécessaires.
- [ ] Les champs sont ajoutés dans les schémas des formulaires.

**API**

- [ ] Les requêtes de création (mutation trpc) sont adaptées
      pour inclure les nouveaux champs.
- [ ] Les requêtes de mise à jour (mutation trpc) sont adaptées
      pour inclure les nouveaux champs.
- [ ] Les requêtes de lecture (query trpc) sont adaptées
      pour inclure les nouveaux champs.
- [ ] Si des permissions spécifiques sont nécessaires pour visualiser ces champs, elles sont ajoutées dans le point d'entrée de lecture des données (query trpc).

**UI**

- [ ] Les composants UI des champs sont ajoutés à la création de l'objet
- [ ] Les champs sont ajoutés aux valeurs initiales du formulaire pour la mise à jour.
- [ ] La valeur courante des champs est ajoutée dans le composant UI de visualisation de l'objet.

**Impacts**

- [ ] Impression
- [ ] Export
- [ ] Filtres
- [ ] Ajout du champ dans les statistiques

**Tests unitaires**

- [ ] Ce champ est concerné par un test e2e (champ accessible sur permission spécifique comme l'accès aux données de santé,...)
- [ ] Ce champ est concerné par un test unitaire (impact sur les statistiques, champ ayant recours à un algorithme métier, etc.)
