<template>
  <div class="fr-col-12">
    <h3 class="fr-h4 title-blue">
      {{ `Dispositif ${index + 1}` }}
    </h3>
  </div>

  <div class="fr-col-12 fr-col-lg-6">
    <VeeSelect
      class="fr-mb-2v"
      :name="`supportPrograms[${index}].supportProgramNameId`"
      :label="supportProgramFieldLabels.name"
      required
      :options="
        withEmptyValue(supportProgramNameOptions, 'Sélectionner un dispositif')
      "
    />
    <NuxtLink
      :to="routes.structure.AppStructureCustomObjects.path()"
      class="fr-link fr-icon-info-fill fr-link--icon-left fr-text--sm"
    >
      Je personnalise les dispositifs de ma structure
    </NuxtLink>
    <AtomAlert
      v-if="showDuplicateAlert"
      :alert-type="AlertType.Info"
      message="Attention, ce bénéficiaire semble déjà être inscrit dans un dispositif similaire"
      :closeable="true"
      class="fr-mt-2w"
      @close="closeDuplicateAlert"
    />
  </div>

  <div class="fr-col-12 fr-col-lg-6">
    <MultiSelect
      class="fr-mb-2v"
      :name="`supportPrograms[${index}].partnerOrganisationIds`"
      :label="supportProgramFieldLabels.partnerOrganisationIds"
      :options="partnerOrganisationOptions"
    />
    <NuxtLink
      :to="routes.structure.AppPartners.path()"
      class="fr-link fr-icon-info-fill fr-link--icon-left fr-text--sm"
    >
      Données issues de l'annuaire de partenaires
    </NuxtLink>
  </div>

  <div class="fr-col-12 fr-col-lg-6">
    <VeeInput
      :name="`supportPrograms[${index}].startDate`"
      :label="supportProgramFieldLabels.startDate"
      type="date"
    />
  </div>

  <div class="fr-col-12 fr-col-lg-6">
    <VeeInput
      :name="`supportPrograms[${index}].endDate`"
      :label="supportProgramFieldLabels.endDate"
      type="date"
    />
  </div>

  <div class="fr-col-12">
    <VeeInput
      :name="`supportPrograms[${index}].exitReason`"
      :label="supportProgramFieldLabels.exitReason"
      disabled
      hint="Bientôt disponible"
    />
  </div>

  <div
    v-if="endDate"
    class="fr-col-12"
  >
    <VeeSelect
      :name="`supportPrograms[${index}].outcome`"
      :label="supportProgramFieldLabels.outcome"
      :options="withEmptyValue(supportProgramOutcomeKeys.options)"
    />
  </div>

  <div class="fr-col-12">
    <button
      class="fr-btn fr-btn--secondary fr-btn--icon-left fr-btn--sm fr-icon-delete-line btn-delete-action"
      data-fr-opened="false"
      aria-controls="global-modal"
      type="button"
      aria-label="Supprimer ce dispositif"
      @click="$emit('removeSupportProgram')"
    >
      Supprimer ce dispositif
    </button>
    <hr class="fr-mt-3w" />
  </div>
</template>

<script setup lang="ts">
  import { useFieldValue } from 'vee-validate'
  import { routes } from '~/utils/routes'
  import { AlertType } from '~/utils/constants/alert'
  import { supportProgramFieldLabels } from '~/client/labels'
  import { supportProgramOutcomeKeys } from '~/client/options'

  defineEmits<{
    removeSupportProgram: []
  }>()

  const props = defineProps<{
    index: number
    isDuplicate: boolean
    supportProgramNameOptions: Options
    partnerOrganisationOptions: Options
  }>()

  const endDate = useFieldValue<string | null | undefined>(
    () => `supportPrograms[${props.index}].endDate`
  )

  const dismissed = ref(false)
  const showDuplicateAlert = ref(false)

  watch(
    () => props.isDuplicate,
    isDuplicate => {
      if (isDuplicate && !dismissed.value) {
        showDuplicateAlert.value = true
      } else if (!isDuplicate) {
        showDuplicateAlert.value = false
        dismissed.value = false
      }
    }
  )

  function closeDuplicateAlert() {
    showDuplicateAlert.value = false
    dismissed.value = true
  }
</script>
