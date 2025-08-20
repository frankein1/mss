<template>
  <div class="beneficiarydetailshistoryactions_container">
    <span class="fr-text--bold fr-mr-2w"> Créer&nbsp;:</span>
    <ul
      class="fr-btns-group fr-btns-group--inline-sm fr-btns-group--icon-left benficiarydetailshistoryactions_btns-group"
    >
      <li>
        <NuxtLink
          :to="
            routes.followup.AppBeneficiaryFollowupAdd.path(familyFileId, {
              beneficiaryId
            })
          "
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
      <li
        v-if="application.module.rdv"
        id="action-rdv"
      >
        <button
          class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-calendar-event-line fr-mb-0"
          type="button"
          title="Rendez-vous"
          :data-fr-opened="familyFile ? 'false' : ''"
          :aria-controls="familyFile ? 'global-modal' : ''"
          :submitting="isSubmittingAppointmentPlan"
          :readonly="isSubmittingAppointmentPlan"
          @click="emit('planAppointment')"
        >
          Rendez-vous
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
    isSubmittingAppointmentPlan: boolean
    familyFile: boolean
  }>()

  const emit = defineEmits<{ planAppointment: [] }>()

  const { application } = usePermissions()

  function onAddHelpRequest() {
    useModal().open(HelpRequestModal, {
      title: 'Nouvelle instruction de dossier',
      familyFileId: props.familyFileId,
      beneficiaryId: props.beneficiaryId
    })
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .beneficiarydetailshistoryactions_container {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-direction: column;

    @include dsfr-media-query.respond-from('sm') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  .benficiarydetailshistoryactions_btns-group {
    flex: 1;
    gap: 1rem;
    align-items: baseline;

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
    color: #fff;

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
