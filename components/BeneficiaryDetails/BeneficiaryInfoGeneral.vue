<template>
  <BeneficiaryInfoSection
    title="Informations générales"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoGeneralContent :general="general" />
    </div>
  </BeneficiaryInfoSection>
</template>

<script lang="ts" setup>
  import { GetBeneficiaryGeneral } from '~/types/beneficiary'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    beneficiaryId: string
    general: GetBeneficiaryGeneral
  }>()

  const editLink = computed(() =>
    routes.beneficiary.AppBeneficiaryEditInfo.path(props.beneficiaryId)
  )
</script>
