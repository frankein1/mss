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
      <li>
        <button
          class="fr-btn fr-btn fr-btn--secondary"
          title="Inscrire à un atelier"
          data-fr-opened="false"
          aria-controls="global-modal"
          @click="onWorkshopRegistration"
        >
          Inscrire à un atelier
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
          :disabled="isSubmittingAppointmentPlan"
          :readonly="isSubmittingAppointmentPlan"
          @click="emit('planAppointment')"
        >
          Rendez-vous
        </button>
      </li>
      <li>
        <button
          class="fr-btn fr-btn--secondary fr-btn--icon-left fr-mb-0"
          type="button"
          title="Simulation"
          @click="emit('prefillSimulation')"
        >
          Simulation préremplie
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import type { FamilyFilePermissions } from '~/server/security'
  import HelpRequestModal from '~/components/HelpRequestModal/HelpRequestModal.vue'
  import WorkshopAddBeneficiaryModal from '~/components/Workshop/WorkshopAddBeneficiaryModal.vue'

  const props = defineProps<{
    familyFileId: string
    beneficiaryId: string
    permissions: FamilyFilePermissions | undefined
    isSubmittingAppointmentPlan: boolean
    familyFile: boolean
  }>()

  const emit = defineEmits<{ planAppointment: [], prefillSimulation: [] }>()
  const modal = useModal()
  const { application } = usePermissions()

  function onAddHelpRequest() {
    modal.open(HelpRequestModal, {
      title: 'Nouvelle instruction de dossier',
      familyFileId: props.familyFileId,
      beneficiaryId: props.beneficiaryId
    })
  }

  const onWorkshopRegistration = () => {
    modal.open(WorkshopAddBeneficiaryModal, {
      title: 'Inscrire à un ou plusieurs atelier(s)',
      beneficiaryId: props.beneficiaryId,
      familyFileId: props.familyFileId
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
      align-items: baseline;
    }
  }

  .benficiarydetailshistoryactions_btns-group {
    flex: 1;
    row-gap: 0.5rem;
    align-items: center;

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

    @include dsfr-media-query.respond-from('sm') {
      margin-left: auto;
      margin-top: 0;
    }
  }
</style>
