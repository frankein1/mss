<template>
  <BeneficiaryInfoSection
    v-if="hasOccupationIncomeSection"
    title="Activité/Revenu"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoOccupationIncomeContent :beneficiary="beneficiary" />
    </div>
  </BeneficiaryInfoSection>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const isMinistryAgent = useMinistryAgent()

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditOccupation(props.beneficiary.id)
  )

  const hasOccupationIncomeSection = computed(
    () =>
      props.beneficiary.socioProfessionalCategory ||
      props.beneficiary.occupation ||
      props.beneficiary.employer ||
      props.beneficiary.employerSiret ||
      props.beneficiary.mainIncomeSource?.length ||
      props.beneficiary.mainIncomeAmount ||
      props.beneficiary.partnerMainIncomeSource?.length ||
      props.beneficiary.partnerMainIncomeAmount ||
      props.beneficiary.majorChildrenMainIncomeSource?.length ||
      props.beneficiary.majorChildrenMainIncomeAmount ||
      props.beneficiary.unemploymentNumber ||
      props.beneficiary.pensionOrganisations?.length ||
      props.beneficiary.cafNumber ||
      props.beneficiary.bank ||
      props.beneficiary.funeralContract ||
      (isMinistryAgent.value &&
        (props.beneficiary.ministereCategorie ||
          props.beneficiary.ministereDepartementServiceAc ||
          props.beneficiary.ministereStructure))
  )
</script>
