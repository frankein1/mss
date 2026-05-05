<template>
  <BeneficiaryFormSection :section-title="`Dispositif ${index + 1}`">
    <template #titleAction>
      <button
        class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-delete-line"
        type="button"
        @click="emit('removeDevice')"
      >
        Supprimer ce dispositif
      </button>
    </template>

    <div class="fr-col-12">
      <VeeCombobox
        :name="`devices[${index}].name`"
        label="Nom dispositif"
        required
        :options="deviceNameOptions"
        :with-creation="true"
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
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import { useFieldValue } from 'vee-validate'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    index: number
    deviceNameOptions: Options
    partnerOrganisationOptions: Options
  }>()

  const endDate = useFieldValue<string | null | undefined>(
    () => `devices[${props.index}].endDate`
  )

  const emit = defineEmits<{
    removeDevice: []
  }>()
</script>
