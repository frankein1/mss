<template>
  <BeneficiaryInfoSection
    v-if="occupationIncome"
    id="occupationIncome"
    title="Activité/Revenu"
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
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiaryId: string
    occupationIncome?: GetBeneficiaryOccupationIncome
  }>()

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditOccupation(props.beneficiaryId)
  )
</script>
