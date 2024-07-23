<template>
  <BeneficiaryInfoSection
    title="Activité"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoOccupationIncomeContent
        :occupation-income="occupationIncome"
      />
    </div>
  </BeneficiaryInfoSection>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOccupationIncome } from '~/types/beneficiary'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    beneficiaryId: string
    occupationIncome: GetBeneficiaryOccupationIncome
  }>()

  const editLink = computed(() =>
    routes.beneficiary.AppBeneficiaryEditOccupation.path(props.beneficiaryId)
  )
</script>
