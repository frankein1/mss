<template>
  <BeneficiaryInfoSection
    title="Parcours et dispositifs"
    :edit-link="editLink"
  >
    <BeneficiaryInfoSupportProgramsContent
      :support-programs="supportPrograms"
    />
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import type { GetBeneficiarySupportPrograms } from '~/types/beneficiary'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    beneficiaryId: string
    supportPrograms: GetBeneficiarySupportPrograms
  }>()

  const editLink = computed(() =>
    routes.beneficiary.AppBeneficiaryEditSupportPrograms.path(
      props.beneficiaryId
    )
  )
</script>
