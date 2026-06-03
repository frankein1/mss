<template>
  <div class="fr-col-12">
    <h3 class="fr-h4 title-blue">
      {{ `Dispositif ${index + 1}` }}
    </h3>
  </div>

  <div class="fr-col-12">
    <VeeCombobox
      :name="`devices[${index}].name`"
      label="Nom dispositif"
      required
      :options="deviceNameOptions"
      :with-creation="true"
    />
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
    <VeeInput
      :name="`devices[${index}].startDate`"
      label="Date d'entrée"
      type="date"
    />
  </div>

  <div class="fr-col-12 fr-col-lg-6">
    <VeeInput
      :name="`devices[${index}].endDate`"
      label="Date de sortie"
      type="date"
    />
  </div>

  <div
    v-if="endDate"
    class="fr-col-12"
  >
    <VeeInput
      :name="`devices[${index}].exitReason`"
      label="Motif de sortie"
    />
  </div>

  <div class="fr-col-12">
    <VeeCombobox
      :name="`devices[${index}].partnerOrganisationName`"
      label="Organisme partenaire"
      placeholder="Saisir le nom de l'organisme"
      :options="withEmptyValue(partnerOrganisationOptions)"
    />
    <NuxtLink
      :to="routes.structure.AppPartners.path()"
      class="fr-link fr-icon-info-fill fr-link--icon-left fr-text--sm fr-mt-1w"
    >
      Données issues de l'annuaire de partenaires
    </NuxtLink>
  </div>

  <div class="fr-col-12">
    <VeeInput
      :name="`devices[${index}].precisions`"
      label="Précisions"
      hint="Personne intervenante, horaires..."
    />
  </div>

  <div class="fr-col-12">
    <button
      type="button"
      class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-delete-line btn-delete-action fr-ml-auto"
      @click="emit('removeDevice')"
    >
      Supprimer ce dispositif
    </button>
  </div>
  <div class="fr-col-12">
    <hr class="fr-mt-3w" />
  </div>
</template>

<script setup lang="ts">
  import { useFieldValue } from 'vee-validate'
  import { routes } from '~/utils/routes'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    index: number
    isDuplicate: boolean
    deviceNameOptions: Options
    partnerOrganisationOptions: Options
  }>()

  const endDate = useFieldValue<string | null | undefined>(
    () => `devices[${props.index}].endDate`
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

  const emit = defineEmits<{
    removeDevice: []
  }>()
</script>
