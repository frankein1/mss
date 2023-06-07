<!--
  This page allows to easily print the beneficiary details in a valid design.
  It improves cross-browser compatibility that is not easily reachable with print media queries.
-->

<template>
  <div>
    <NuxtLink
      :to="backLink"
      class="fr-link fr-icon-arrow-left-line fr-link--icon-left no-print"
      target="_self"
    >
      Retour
    </NuxtLink>

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
      <h1>{{ getBeneficiaryDisplayName(beneficiary) }}</h1>
      <BeneficiaryDetailsTitle :beneficiary="beneficiary" />
      <BeneficiaryDetailsGeneral :beneficiary="beneficiary" />
      <BeneficiaryDetailsHealth :beneficiary="beneficiary" />
      <BeneficiaryDetailsOccupationIncome :beneficiary="beneficiary" />
      <BeneficiaryDetailsRelatives
        v-if="canAccessRelatives && houseHoldSection"
        :beneficiary="beneficiary"
        :relatives="taxHouseholds"
        household
      />
      <BeneficiaryDetailsRelatives
        v-if="canAccessRelatives && entourages.length"
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
  import { Routes } from '~/utils/routing/routes'
  import { useAuthStore } from '~/store/auth'

  definePageMeta({
    layout: false
  })

  const route = useRoute()
  const authStore = useAuthStore()

  const beneficiaryId = route.params.id as string
  const backLink = Routes.Beneficiary(beneficiaryId)

  const { data, pending, error } =
    await useTrpcClient().beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const canAccessRelatives = computed(() => !authStore.isAgentDAccueil)

  const beneficiary = computed(() => data.value?.beneficiary)
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
