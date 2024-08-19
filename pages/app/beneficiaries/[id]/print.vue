<!--
  This page allows to easily print the beneficiary details in a valid design.
  It improves cross-browser compatibility that is not easily reachable with print media queries.
-->

<template>
  <div>
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
      <h1>{{ formatBeneficiaryDisplayName(beneficiary.general) }}</h1>
      <BeneficiaryDetailsMetas
        :beneficiary-id="beneficiary.id"
        :general="beneficiary.general"
      />
      <BeneficiaryDetailsStatus :status="beneficiary.status" />
      <BeneficiaryInfoHeader :beneficiary="beneficiary" />
      <template v-if="socialSupportSubjects.length">
        <p class="fr-text--bold">Accompagnements</p>
        <p>{{ socialSupportSubjects }}</p>
      </template>
      <BeneficiaryInfoGeneralContent :general="beneficiary.general" />
      <BeneficiaryInfoTaxHouseholdsContent
        v-if="beneficiary.taxHouseholds"
        :beneficiary-id="beneficiaryId"
        :tax-households="beneficiary.taxHouseholds"
      />
      <BeneficiaryInfoEntouragesContent
        v-if="beneficiary.entourages"
        :entourages="beneficiary.entourages"
      />
      <BeneficiaryInfoHealthContent
        v-if="beneficiary.health"
        :health="beneficiary.health"
      />
      <BeneficiaryInfoOccupationIncomeContent
        v-if="beneficiary.occupationIncome"
        :occupation-income="beneficiary.occupationIncome"
      />
      <BeneficiaryInfoExternalOrganisationsContent
        v-if="beneficiary.externalOrganisations"
        :external-organisations="beneficiary.externalOrganisations"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'

  definePageMeta({
    layout: false
  })

  const route = useRoute()
  const trpcClient = useTrpcClient()

  const beneficiaryId = route.params.id as string

  const {
    data,
    pending: beneficiaryPending,
    error: beneficiaryError
  } = await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
    id: beneficiaryId
  })

  const pending = computed(() => beneficiaryPending.value)
  const error = computed(() => beneficiaryError.value)

  const beneficiary = computed(() => data.value?.beneficiary || null)

  useHead({
    title: routes.beneficiary.AppBeneficiaryPrint.title(
      beneficiary.value?.general || null
    )
  })

  const socialSupportSubjects = computed(() =>
    (data.value?.beneficiary.history.subjects || [])
      .map(({ name }) => name)
      .join(', ')
  )

  onMounted(() => {
    window.addEventListener('afterprint', onAfterPrint)
    window.print()
  })

  onUnmounted(() => {
    window.removeEventListener('afterprint', onAfterPrint)
  })

  function onAfterPrint() {
    navigateTo(
      routes.file.AppFile.path(beneficiary.value?.familyFileId, {
        beneficiaryId
      })
    )
  }
</script>

<style lang="scss" scoped>
  @media print {
    :deep(.fr-icon-success-line::before) {
      content: '✅';
    }

    :deep(.fr-icon-close-circle-line::before) {
      content: '❌';
    }

    :deep(.fr-container) {
      max-width: none;
      padding: 0;
    }
  }
</style>
