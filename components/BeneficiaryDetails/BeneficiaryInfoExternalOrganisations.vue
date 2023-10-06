<template>
  <BeneficiaryInfoSection
    v-if="hasOtherInformationSection"
    title="Structures extérieures"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <div class="fr-grid-row">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.protectionMeasure"
          :value="
            BeneficiaryProtectionMeasureKeys.value(
              beneficiary.protectionMeasure
            )
          "
          class="fr-col-6"
        />
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.representative"
          :value="beneficiary.representative"
          class="fr-col-6"
        />
      </div>
      <div class="fr-grid-row">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.prescribingStructure"
          :value="beneficiary.prescribingStructure"
          class="fr-col-6"
        />
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.orientationType"
          :value="
            BeneficiaryOrientationTypeKeys.value(beneficiary.orientationType)
          "
          class="fr-col-6"
        />
      </div>
      <div class="fr-grid-row">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.orientationStructure"
          :value="beneficiary.orientationStructure"
          class="fr-col-6"
        />
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.serviceProviders"
          :value="beneficiary.serviceProviders"
          class="fr-col-6"
        />
      </div>
      <div class="fr-grid-row">
        <BeneficiaryInfoLabel
          :label="beneficiaryFieldLabels.involvedPartners"
          :value="beneficiary.involvedPartners"
          class="fr-col-6"
        />
      </div>
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import {
    BeneficiaryOrientationTypeKeys,
    BeneficiaryProtectionMeasureKeys
  } from '~/client/options/beneficiary'
  import { RoutePath } from '~/utils/routing'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditExternalOrganisations(props.beneficiary.id)
  )

  const hasOtherInformationSection = computed(
    () =>
      props.beneficiary.protectionMeasure ||
      props.beneficiary.representative ||
      props.beneficiary.prescribingStructure ||
      props.beneficiary.orientationType ||
      props.beneficiary.orientationStructure ||
      props.beneficiary.serviceProviders ||
      props.beneficiary.involvedPartners
  )
</script>
~/server/trpc/routers
