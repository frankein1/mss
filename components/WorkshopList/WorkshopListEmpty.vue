<template>
  <div class="workshops-empty-wrapper">
    <div class="workshops-empty-image">
      <img
        class="fr-responsive-img"
        src="~/assets/img/empty-workshop-list.svg"
        alt=""
      />
    </div>
    <div class="workshops-empty-content">
      <p class="fr-h4">
        {{
          timeDirection === FilterWorkshopTimeDirection.Past
            ? 'Aucun atelier passé'
            : 'Aucun atelier à venir'
        }}
      </p>
      <p v-if="isFiltered">
        Aucun atelier trouvé avec les filtres que vous avez sélectionnés.
        <br />Vous pouvez essayer d‘autres filtres pour trouver plus de
        résultats
      </p>
      <p v-else-if="timeDirection === FilterWorkshopTimeDirection.Past">
        Retrouvez ici la liste de tous les ateliers terminés. <br />Vous pourrez
        mettre à jour la liste des présences depuis cette page.
      </p>
      <template v-else>
        <ol class="ol-custom">
          <li>Commencez en cliquant sur "créer un atelier" en haut à droite</li>
          <li>
            Renseignez toutes les informations (date, lieu, intervenant) de
            votre atelier et validez le formulaire
          </li>
          <li>
            Ajoutez les participants depuis la page de l’atelier ou depuis
            l’historique du bénéficiaire
          </li>
        </ol>
        <hr />
        <div class="info-wrapper">
          <img
            src="/pictograms/information-bubble.svg"
            alt=""
          />
          <p>
            Une fois l'atelier terminé, rendez-vous sur la page "Ateliers
            passés" pour mettre à jour la liste des personnes présentes.
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { FilterWorkshopTimeDirection } from '~/utils/constants/filters'

  const {
    timeDirection = FilterWorkshopTimeDirection.Future,
    isFiltered = false
  } = defineProps<{
    timeDirection?: FilterWorkshopTimeDirection
    isFiltered?: boolean
  }>()
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .workshops-empty-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;

    .workshops-empty-content {
      text-align: left;
    }

    @include dsfr-media-query.respond-from('md') {
      flex-direction: row;

      .workshops-empty-image {
        min-width: 280px;
      }
    }
  }

  .info-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 1rem;
  }

  img.fr-responsive-img {
    max-width: 280px;
  }

  hr {
    margin: 2rem 0 1.25rem;
  }

  // custom order list
  $circle-size: 2rem;
  $circle-color: var(--color-workshop);
  $circle-bg: white;
  $circle-border: 1px solid $circle-color;
  $font-size: 0.875rem;

  .ol-custom {
    list-style: none;
    counter-reset: item;
    padding-left: 0;

    li {
      counter-increment: item;
      position: relative;
      padding-left: calc(#{$circle-size} + 1rem);
      margin-bottom: 1.5rem;

      &::marker {
        content: var(--ol-content);
        font-size: 0;
      }

      &::before {
        content: counter(item);
        position: absolute;
        top: 0;
        left: 0;
        width: $circle-size;
        height: $circle-size;
        line-height: $circle-size;
        border: $circle-border;
        background-color: $circle-bg;
        color: $circle-color;
        border-radius: 50%;
        text-align: center;
        font-weight: 700;
      }
    }
  }
</style>
