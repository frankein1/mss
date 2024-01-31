<template>
  <div class="fr-grid-row">
    <div class="fr-col-12 fr-text--bold fr-pb-1w">
      {{ name }}
    </div>
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.relationship"
      :value="RelativeRelationshipKeys.value(relative.relationship)"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.birthDate"
      :value="formatDate(birthDate)"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.email"
      :value="email"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.phone"
      :value="phone"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <div
      v-if="relative.caregiver"
      class="field-value fr-icon-success-line fr-pb-2w fr-col-12"
    >
      {{ relativeFieldLabels.caregiver }}
    </div>
  </div>
  <div class="fr-grid-row">
    <div class="fr-col-12">
      <BeneficiaryInfoLabel
        :label="relativeFieldLabels.additionalInformation"
        :value="relative.additionalInformation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GetBeneficiaryRelative } from '~/types/beneficiary'
  import { RelativeRelationshipKeys } from '~/client/options/beneficiary'
  import { relativeFieldLabels } from '~/client/labels/relative.labels'

  const props = defineProps<{
    relative: GetBeneficiaryRelative
  }>()

  const name = computed(() => {
    const relative = props.relative
    return (relative.firstName || '') + ' ' + (relative.lastName || '')
  })

  const email = computed(() => {
    const relative = props.relative
    return relative.email
  })

  const phone = computed(() => {
    const relative = props.relative
    return relative.phone
  })

  const birthDate = computed(() => {
    const relative = props.relative
    return relative.birthDate
  })
</script>
