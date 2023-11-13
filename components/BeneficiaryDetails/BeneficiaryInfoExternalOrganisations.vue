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
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiaryId: string
    externalOrganisations: GetBeneficiaryExternalOrganisations
  }>()

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditExternalOrganisations(props.beneficiaryId)
  )
</script>
