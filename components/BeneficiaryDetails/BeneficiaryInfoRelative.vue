<template>
  <div class="fr-grid-row">
    <div class="fr-col-12 text-bold fr-pb-1w">
      {{ name }}
    </div>
    <div class="fr-col-6">
      <BeneficiaryInfoLabel
        label="Statut"
        :value="relative.relationship"
      />
      <BeneficiaryInfoLabel
        label="Email"
        :value="email"
      />
      <div
        v-if="relative.caregiver"
        class="field-value fr-icon-success-line fr-pb-2w"
      >
        Aidant familial
      </div>
      <div class="fr-col-6">
        <BeneficiaryInfoLabel
          label="Date de naissance"
          :value="formatDate(relative.linkedBeneficiary?.birthDate)"
        />
        <BeneficiaryInfoLabel
          label="Téléphone"
          :value="phone"
        />
      </div>
      <div class="fr-col-12">
        <BeneficiaryInfoLabel
          label="Informations complémentaires"
          :value="relative.additionalInformation"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'

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
