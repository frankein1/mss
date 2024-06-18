<template>
  <div>
    <h3>Stats List</h3>

    <p>
      Les données ne sont pas ordonnées automatiquement. Les poucentages ne sont
      pas calculés automatiqument ; il est nécessaire de founir le total en
      argument du composant.
    </p>

    <div class="fr-container--fluid">
      <div class="fr-grid-row fr-grid-row--gutters bg-color-grey-light">
        <div class="fr-col-3">
          <div class="main-container fr-p-2w">
            <h4>Distribution des noms d'entité sans pourcentage</h4>

            <StatsList
              :stats="countNoPercentage"
              :stats-percentage="false"
            />
          </div>
        </div>

        <div class="fr-col-3">
          <div class="main-container fr-p-2w">
            <h4>
              Distribution des noms d'entité sans pourcentage et avec unité et
              arrondi à la seconde décimale
            </h4>

            <StatsList
              :stats="countAmountNoPercentage"
              :stats-percentage="false"
              unit="€"
              :to-fixed="2"
            />
          </div>
        </div>

        <div class="fr-col-6">
          <div class="main-container fr-p-2w">
            <h4>
              Distribution des noms d'entité avec pourcentage, picto et couleur
            </h4>

            <StatsList
              :total-count="totalCount"
              :stats="countPercentagePictoColor"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { StatsListPropType } from '~/types/stat'

  const countNoPercentage: StatsListPropType = [
    {
      key: 'visio',
      label:
        'Très long label pour faire une test UI de rendu de la carte de statistiques',
      count: 1965
    },
    { key: 'physique', label: 'Accueil physique sur rendez-vous', count: 36 },
    { key: 'telephonique', label: 'Entretien téléphonique', count: 31 },
    { key: 'tiers', label: 'Entretien avec un tiers', count: 16 },
    { key: 'domicile', label: 'Rendez-vous à domicile', count: 23 },
    { key: 'courrier', label: 'Courrier', count: 8 },
    { key: 'exterieur', label: 'Rendez-vous extérieur', count: 8 },
    { key: 'visio', label: 'Visioconférence', count: 12 }
  ]

  const countAmountNoPercentage: StatsListPropType = [
    { key: 'aide-logement', label: 'Aide financière - logement', count: 5467 },
    {
      key: 'aide-transport',
      label: 'Aide non remboursable - transport',
      count: 9364
    },
    { key: 'demande-rsa', label: 'Demande de RSA', count: 8473 },
    { key: 'domiciliation', label: 'Domiciliation', count: 4567 },
    {
      key: 'famille-accueil',
      label: "Entrée en famille d'accueil",
      count: 360
    },
    {
      key: 'retraite',
      label: 'Retraite - infos droits et démarches',
      count: 1166
    },
    {
      key: 'visio',
      label:
        'Très long label pour faire une test UI de rendu de la carte de statistiques',
      count: 1965
    }
  ]

  const countPercentagePictoColor: StatsListPropType = [
    { key: 'aide-logement', label: 'Aide financière - logement', count: 36 },
    {
      key: 'aide-transport',
      label: 'Aide non remboursable - transport',
      count: 42
    },
    { key: 'demande-rsa', label: 'Demande de RSA', count: 25 },
    { key: 'domiciliation', label: 'Domiciliation', count: 11 },
    { key: 'famille-accueil', label: "Entrée en famille d'accueil", count: 78 },
    {
      key: 'retraite',
      label: 'Retraite - infos droits et démarches',
      count: 36
    },
    {
      key: 'visio',
      label:
        'Très long label pour faire une test UI de rendu de la carte de statistiques',
      count: 19
    }
  ]

  const totalCount = countPercentagePictoColor.reduce((acc, cur) => {
    return acc + cur.count
  }, 0)
</script>
