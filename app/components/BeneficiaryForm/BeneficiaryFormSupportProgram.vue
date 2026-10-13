<template>
  <div class="fr-col-12">
    <h3 class="fr-h4 title-blue">
      {{ `Dispositif ou axe d'intervention ${index + 1}` }}
    </h3>
  </div>

  <div
    ref="supportProgramNameGroup"
    data-field-group
    class="fr-col-12 fr-col-lg-6"
  >
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
      Je personnalise les dispositifs ou axe d'intervention de ma structure
    </NuxtLink>
  </div>

  <div class="fr-col-12 fr-col-lg-6">
    <MultiSelect
      class="fr-mb-2v"
      :name="`supportPrograms[${index}].partnerOrganisationIds`"
      :label="supportProgramFieldLabels.partnerOrganisationIds"
      :disabled="partnerOrganisationOptions.length === 0"
      :options="partnerOrganisationOptions"
    />
    <NuxtLink
      v-if="partnerOrganisationOptions.length > 0"
      :to="routes.structure.AppPartners.path()"
      class="fr-link fr-icon-info-fill fr-link--icon-left fr-text--sm"
    >
      Données issues de l'annuaire de partenaires
    </NuxtLink>
    <p
      v-else
      class="fr-text--sm text--muted"
    >
      Aucune données issues de l'annuaire de partenaires
    </p>
  </div>

  <div
    v-if="showDuplicateAlert"
    class="fr-col-12"
  >
    <AtomAlert
      :alert-type="AlertType.Info"
      message="Attention, ce bénéficiaire semble déjà être inscrit dans un dispositif ou axe d'intervention similaire."
      :closeable="true"
      class="fr-mt-2w"
      @close="closeDuplicateAlert"
    />
  </div>

  <template v-if="hasLifecycle">
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
      <VeeCombobox
        :name="`supportPrograms[${index}].exitReason`"
        :label="supportProgramFieldLabels.exitReason"
        :options="exitReasonOptions"
        :with-creation="true"
      />
    </div>
  </template>

  <div class="fr-col-12">
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
      aria-label="Supprimer ce dispositif ou axe d'intervention"
      @click="$emit('removeSupportProgram')"
    >
      Supprimer ce dispositif
    </button>
    <hr class="fr-mt-3w" />
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { AlertType } from '~/utils/constants/alert'
  import { supportProgramFieldLabels } from '~~/client/labels'
  import { supportProgramOutcomeKeys } from '~~/client/options'

  defineEmits<{
    removeSupportProgram: []
  }>()

  const props = defineProps<{
    index: number
    isDuplicate: boolean
    hasLifecycle: boolean
    supportProgramNameOptions: Options
    partnerOrganisationOptions: Options
    exitReasonOptions: Options
  }>()

  const supportProgramNameGroup = useTemplateRef<HTMLElement>(
    'supportProgramNameGroup'
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
    supportProgramNameGroup.value?.querySelector<HTMLElement>('select')?.focus()
  }
</script>
