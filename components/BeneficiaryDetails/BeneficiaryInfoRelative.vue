<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12 fr-pb-1w">
      <h5 class="fr-text--md fr-mb-0">{{ name }}</h5>
    </div>
  </div>
  <div class="fr-grid-row fr-grid-row--gutters">
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.relationship"
      :value="relativeRelationshipKeys.value(relative.relationship)"
      class="fr-col-12 fr-col-lg-6"
    />
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.birthDate"
      :value="formatDate(relative.birthDate)"
      class="fr-col-12 fr-col-lg-6"
    />
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.city"
      :value="relative.city"
      class="fr-col-12 fr-col-lg-6"
    />
  </div>
  <div class="fr-grid-row fr-grid-row--gutters">
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.email"
      :value="relative.email"
      class="fr-col-12 fr-col-lg-6"
    />
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.phone"
      :value="relative.phone"
      class="fr-col-12 fr-col-lg-6"
    />
  </div>
  <div class="fr-grid-row fr-grid-row--gutters">
    <p
      v-if="relative.caregiver"
      class="fr-pb-2w fr-col-lg-6 fr-col-12"
    >
      <span
        class="fr-icon-success-line"
        aria-hidden="true"
      ></span
      >{{ relativeFieldLabels.caregiver }}
    </p>
    <p
      v-if="relative.hosted"
      class="fr-pb-2w fr-col-lg-6 fr-col-12"
    >
      <span
        class="fr-icon-success-line"
        aria-hidden="true"
      ></span>
      {{ relativeFieldLabels.hosted }}
    </p>
  </div>
  <div class="fr-grid-row fr-grid-row--gutters">
    <BeneficiaryInfoLabel
      :label="relativeFieldLabels.additionalInformation"
      :value="relative.additionalInformation"
      class="fr-col-12"
    />
  </div>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryRelative } from '~/types/beneficiary'
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
