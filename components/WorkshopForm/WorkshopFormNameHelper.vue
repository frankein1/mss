<template>
  <DsfrAccordionsGroup class="fr-mt-2w fr-grid-row--gutters">
    <DsfrAccordion
      id="workshop-form-accordion-1"
      title="L'atelier a plusieurs séances : comment faire ?"
      :title-tag="'p' as TitleTag"
    >
      <p>
        Vous pourrez dupliquer cet atelier à la prochaine étape. Le nom de
        l'atelier sera alors conjoint à toutes les séances et vous permettra de
        générer facilement des statistiques. Si vous souhaitez différencier les
        séances en plus de la date, vous pouvez utiliser le champ “Nom ou numéro
        de la séance” dans la description de votre atelier ci-dessous.
      </p>
      <p>
        <span
          class="bulb-icon fr-mr-1v"
          aria-hidden="true"
        />
        Conseil : en nom d’atelier, restez générique (par exemple “atelier
        numérique”).
      </p>
    </DsfrAccordion>
  </DsfrAccordionsGroup>
</template>

<script setup lang="ts">
  import type { TitleTag } from '@gouvminint/vue-dsfr'
</script>

<style scoped>
  .bulb-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M9.97308 18H11V13H13V18H14.0269C14.1589 16.7984 14.7721 15.8065 15.7676 14.7226C15.8797 14.6006 16.5988 13.8564 16.6841 13.7501C17.5318 12.6931 18 11.385 18 10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10C6 11.3843 6.46774 12.6917 7.31462 13.7484C7.40004 13.855 8.12081 14.6012 8.23154 14.7218C9.22766 15.8064 9.84103 16.7984 9.97308 18ZM10 20V21H14V20H10ZM5.75395 14.9992C4.65645 13.6297 4 11.8915 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 11.8925 19.3428 13.6315 18.2443 15.0014C17.624 15.7748 16 17 16 18.5V21C16 22.1046 15.1046 23 14 23H10C8.89543 23 8 22.1046 8 21V18.5C8 17 6.37458 15.7736 5.75395 14.9992Z'%3E%3C/path%3E%3C/svg%3E");
    width: 1em;
    height: 1em;
    display: inline-block;
  }
</style>
