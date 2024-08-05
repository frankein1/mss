<template>
  <div class="beneficiarydetailshistoryactions_container">
    <span class="fr-text--bold fr-mr-2w"> Créer :</span>
    <ul
      class="fr-btns-group fr-btns-group--inline-sm fr-btns-group--icon-left benficiarydetailshistoryactions_btns-group"
    >
      <li>
        <NuxtLink
          :to="routes.followup.AppBeneficiaryFollowupAdd.path(familyFileId)"
          class="fr-btn fr-icon-file-add-line followup-btn"
          title="Ajouter une synthèse d'entretien"
        >
          Synthèse d'entretien
        </NuxtLink>
      </li>
      <li v-if="permissions?.create.helpRequest">
        <button
          class="fr-btn fr-icon-file-add-line help-request-btn"
          title="Instruire un dossier"
          data-fr-opened="false"
          aria-controls="global-modal"
          @click="onAddHelpRequest"
        >
          Instruction de dossier
        </button>
      </li>
      <li class="mesdroitssociaux-btn-container">
        <NuxtLink
          to="https://www.mesdroitssociaux.gouv.fr/dd1pnds-ria/#destination/simu-foyer"
          class="fr-link"
          title="Accéder à l'outil de simulation de droits sociaux mesdroitssociaux.gouv.fr - nouvelle fenêtre"
          target="_blank"
          rel="noopener external"
          >Simulation de droits sociaux</NuxtLink
        >
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { FamilyFilePermissions } from '~/server/security'
  import HelpRequestModal from '~/components/HelpRequestModal/HelpRequestModal.vue'

  const props = defineProps<{
    familyFileId: string
    beneficiaryId: string
    permissions: FamilyFilePermissions | undefined
  }>()

  function onAddHelpRequest() {
    useModal().open(HelpRequestModal, {
      title: 'Nouvelle instruction de dossier',
      beneficiaryId: props.beneficiaryId
    })
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .beneficiarydetailshistoryactions_container {
    display: flex;
    align-items: center;
  }

  .benficiarydetailshistoryactions_btns-group {
    flex: 1;

    .fr-btn {
      margin-bottom: 0;
    }
  }

  .followup-btn {
    background-color: var(--color-followup);

    &:hover {
      background-color: var(--color-followup-hover);
    }
  }

  .help-request-btn {
    background-color: var(--color-help-request);

    &:hover {
      background-color: var(--color-help-request-hover);
    }
  }

  .mesdroitssociaux-btn-container {
    align-items: center;
    margin-right: 0.5rem;
    margin-left: 0;
    margin-top: 1rem;

    > .fr-link {
      height: fit-content;
    }

    @include dsfr-media-query.respond-from('lg') {
      margin-left: auto;
      margin-top: 0;
    }
  }
</style>
