<!--
  This page allows to easily print the beneficiary details in a valid design.
  It improves cross-browser compatibility that is not easily reachable with print media queries.
-->

<template>
  <div>
    <DsfrBreadcrumb
      :links="Breadcrumb.AppBeneficiaryPrint(beneficiary)"
      class="no-print"
    />
    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="Les informations du bénéficiaire n'ont pas pu être chargées."
    />
    <AtomLoader
      v-else-if="pending"
      class="fr-mx-auto"
    />
    <template v-else-if="beneficiary">
      <h1>{{ formatBeneficiaryDisplayName(beneficiary) }}</h1>
      <BeneficiaryDetailsTitle :beneficiary="beneficiary" />
      <BeneficiaryDetailsGeneral :beneficiary="beneficiary" />
      <BeneficiaryDetailsHealth :beneficiary="beneficiary" />
      <BeneficiaryDetailsOccupationIncome :beneficiary="beneficiary" />
      <BeneficiaryDetailsRelatives
        v-if="houseHoldSection"
        :beneficiary="beneficiary"
        :relatives="taxHouseholds"
        household
      />
      <BeneficiaryDetailsRelatives
        v-if="entourages.length"
        :beneficiary="beneficiary"
        :relatives="entourages"
      />
      <!-- TODO: Follow-up types -->
      <BeneficiaryDetailsOtherInformation :beneficiary="beneficiary" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { Breadcrumb, RouteTitle } from '~/utils/routing'

  definePageMeta({
    layout: false
  })

  const route = useRoute()

  const beneficiaryId = route.params.id as string

  const { data, pending, error } =
    await useTrpcClient().beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const beneficiary = computed(() => data.value?.beneficiary || null)

  useHead({
    title: RouteTitle.AppBeneficiaryPrint(beneficiary.value)
  })

  const taxHouseholds = computed(() => data.value?.taxHouseholds || [])
  const entourages = computed(() => data.value?.entourages || [])

  const houseHoldSection = computed(
    () =>
      taxHouseholds.value.length ||
      beneficiary.value?.familySituation ||
      beneficiary.value?.minorChildren ||
      beneficiary.value?.majorChildren
  )

  onMounted(() => {
    window.print()
  })
</script>

<style lang="scss" scoped>
  :deep(.beneficiary-details-section) {
    --title-spacing: 0 0 0.75rem;

    &:not(:last-child) {
      margin-bottom: 2rem;
    }
  }

  @media print {
    :deep(.fr-icon-success-line::before) {
      content: '✅';
    }

    :deep(.fr-icon-close-circle-line::before) {
      content: '❌';
    }
  }
</style>
