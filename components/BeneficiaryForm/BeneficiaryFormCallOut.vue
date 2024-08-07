<template>
  <aside class="mss-callout">
    <div class="icon">
      <span
        class="fr-icon-group-line"
        aria-hidden="true"
      ></span>
    </div>
    <div class="content">
      <p class="fr-text--bold fr-mb-1w">
        Pour suivre plusieurs personnes d’un même foyer, ajoutez-les comme
        bénéficiaires à ce dossier.
      </p>
      <p class="fr-mb-1w">
        Utilisez le bouton “ajouter un membre au dossier” en haut à droite de la
        fiche (après avoir quitté le formulaire).
      </p>

      <button
        data-fr-opened="false"
        aria-controls="global-modal"
        class="plus-button fr-link fr-link--sm fr-icon-information-line fr-link--icon-left"
        title="En savoir plus"
        @click.prevent="openModal"
      >
        En savoir plus
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import BeneficiaryFormFamilySituationModale from './BeneficiaryFormFamilySituationModale.vue'

  const modal = useModal()
  const openModal = () => {
    modal.open(BeneficiaryFormFamilySituationModale, {
      title:
        'Un dossier foyer permet de suivre plusieurs personnes au sein d’un même ménage.'
    })
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .mss-callout {
    background-color: var(--primary);
    color: white;
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;

    .icon {
      display: none;
      padding: 1rem;

      @include dsfr-media-query.respond-from('lg') {
        display: block;
      }
    }

    .plus-button {
      color: white;

      &:hover {
        background-color: var(--primary-hover);
      }
    }
  }
</style>
