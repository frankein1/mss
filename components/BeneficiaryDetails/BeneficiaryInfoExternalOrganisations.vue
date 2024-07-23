<template>
  <BeneficiaryInfoSection
    title="Structures extérieures"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoExternalOrganisationsContent
        :external-organisations="externalOrganisations"
      />
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import { GetBeneficiaryExternalOrganisations } from '~/types/beneficiary'
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
