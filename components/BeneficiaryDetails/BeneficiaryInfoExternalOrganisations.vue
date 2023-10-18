<template>
  <BeneficiaryInfoSection
    v-if="hasOtherInformationSection"
    title="Structures extérieures"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoExternalOrganisationsContent :beneficiary="beneficiary" />
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import { RoutePath } from '~/utils/routing'

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
