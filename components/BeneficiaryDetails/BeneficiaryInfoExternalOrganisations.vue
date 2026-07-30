<template>
  <BeneficiaryInfoSection
    title="Partenaires"
    :edit-link="editLink"
  >
    <BeneficiaryInfoExternalOrganisationsContent
      :external-organisations="externalOrganisations"
    />
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryExternalOrganisations } from '~/types/beneficiary'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    beneficiaryId: string
    externalOrganisations: GetBeneficiaryExternalOrganisations
  }>()

  const editLink = computed(() =>
    routes.beneficiary.AppBeneficiaryEditExternalOrganisations.path(
      props.beneficiaryId
    )
  )
</script>
