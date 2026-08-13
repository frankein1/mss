<template>
  <div class="empty-attendee feature-section">
    <p class="fr-mb-0">
      Vous n’avez inscrit personne pour le moment. Ajoutez des participants et
      participantes à l'atelier&nbsp;: recherchez parmi vos bénéficiaires
      enregistrés sur Mon Suivi Social ou ajoutez une nouvelle personne.
    </p>
    <img
      src="~/assets/img/empty-attendee.svg"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
  //
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .empty-attendee {
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      max-width: 200px;
      margin-top: 2rem;
    }

    @include dsfr-media-query.respond-from('lg') {
      flex-direction: row;

      img {
        margin-top: 0;
        margin-left: 2rem;
        margin-right: 5rem;
      }
    }
  }
</style>
