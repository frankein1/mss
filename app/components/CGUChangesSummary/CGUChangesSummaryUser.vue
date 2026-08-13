<template>
  <AtomAlertMSS
    :alert-type="AlertType.Warning"
    class="fr-mb-4w"
  >
    <template #detailedMessage>
      <h2>
        Version {{ cguVersion }}&nbsp;: Les modifications majeures pour les CGU
      </h2>
      <h3>Article 1 – Champ d’application</h3>
      <p>
        Ajout&nbsp;: Intégration des ministères chargés du travail, de la santé
        et des solidarités, ainsi que des académies relevant du ministère chargé
        de l’Éducation nationale parmi les structures éligibles.
      </p>
      <h3>Article 2 – Objet</h3>
      <p>Ajout&nbsp;: Précision que les bénéficiaires peuvent être mineurs.</p>
      <h3>Article 3 – Définitions</h3>
      <p>
        Ajout&nbsp;: Une nouvelle catégorie de données dans le tableau de
        l’annexe&nbsp;:
      </p>
      <ul>
        <li>
          Données relatives au Délégué à la protection des données ou au
          référent protection des données (nom, prénom, adresse e-mail).
        </li>
        <li>
          Données de connexion (identifiant utilisateur, logs, adresse IP).
        </li>
      </ul>
      <h3>Article 4 – Fonctionnalités</h3>
      <h4>4.2&nbsp;:</h4>
      <p>Ajouts&nbsp;:</p>
      <ul>
        <li>
          Gestion des liens avec les partenaires via l’annuaire des partenaires.
        </li>
        <li>
          Gestion des prises de rendez-vous bénéficiaires via la plateforme RDV
          Service Public.
        </li>
        <li>Export/impression des données.</li>
      </ul>
      <p>
        Précision&nbsp;: Les données de santé (GIR, médecin traitant, etc.) ne
        peuvent être collectées que par les structures habilitées.
      </p>
      <h3>Article 5 – Responsabilités</h3>
      <p>Aucune modification majeure.</p>
    </template>
  </AtomAlertMSS>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'

  const {
    public: { cguVersion }
  } = useRuntimeConfig()
</script>
