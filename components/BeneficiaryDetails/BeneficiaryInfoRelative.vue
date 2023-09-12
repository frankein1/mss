<template>
  <div class="fr-grid-row">
    <div class="fr-col-12 fr-text--bold fr-pb-1w">
      {{ name }}
    </div>
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      label="Statut"
      :value="RelativeRelationshipKeys.value(relative.relationship)"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      label="Date de naissance"
      :value="formatDate(relative.linkedBeneficiary?.birthDate)"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      label="Email"
      :value="email"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      label="Téléphone"
      :value="phone"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <div
      v-if="relative.caregiver"
      class="field-value fr-icon-success-line fr-pb-2w fr-col-12"
    >
      Aidant familial
    </div>
  </div>
  <div class="fr-grid-row">
    <div class="fr-col-12">
      <BeneficiaryInfoLabel
        label="Informations complémentaires"
        :value="relative.additionalInformation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'
  import { RelativeRelationshipKeys } from '~/client/options/beneficiary'

  const props = defineProps<{
    relative: BeneficiaryRelativeWithLinkedBeneficiary
  }>()

  const name = computed(() => {
    const relative = props.relative
    if (relative.linkedBeneficiary) {
      return formatBeneficiaryName(relative.linkedBeneficiary)
    }
    return (relative.firstName || '') + ' ' + (relative.lastName || '')
  })

  const email = computed(() => {
    const relative = props.relative
    return relative.linkedBeneficiary
      ? relative.linkedBeneficiary.email
      : relative.email
  })

  const phone = computed(() => {
    const relative = props.relative
    return relative.linkedBeneficiary
      ? relative.linkedBeneficiary.phone1
      : relative.phone
  })
</script>
