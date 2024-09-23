<template>
  <div class="fr-grid-row">
    <div class="fr-col-12 fr-pb-1w">
      <h5 class="fr-text--md">{{ name }}</h5>
    </div>
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.relationship"
      :value="relativeRelationshipKeys.value(relative.relationship)"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.birthDate"
      :value="formatDate(relative.birthDate)"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.city"
      :value="relative.city"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.email"
      :value="relative.email"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.phone"
      :value="relative.phone"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <div
      v-if="relative.caregiver"
      class="fr-icon-success-line fr-pb-2w fr-col-lg-6 fr-col-12"
    >
      {{ relativeFieldLabels.caregiver }}
    </div>
    <div
      v-if="relative.hosted"
      class="fr-icon-success-line fr-pb-2w fr-col-lg-6 fr-col-12"
    >
      {{ relativeFieldLabels.hosted }}
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
  import { relativeRelationshipKeys } from '~/client/options'
  import { relativeFieldLabels } from '~/client/labels'

  const props = defineProps<{
    relative: GetBeneficiaryRelative
  }>()

  const name = computed(() => {
    const relative = props.relative
    return (relative.firstName || '') + ' ' + (relative.lastName || '')
  })
</script>

<style scoped lang="scss">
  .fr-icon-success-line {
    &::before {
      margin-right: 0.35rem;
    }
  }
</style>
