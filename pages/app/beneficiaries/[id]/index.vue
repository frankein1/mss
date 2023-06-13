<template>
  <PageContainer v-if="beneficiary">
    <PageBreadcrumb :links="Breadcrumb.Beneficiary(beneficiary, originPage)" />
    <div class="beneficiarytitle__container">
      <PageTitle :title="RouteTitle.Beneficiary(beneficiary || null)" />
      <BeneficiaryDetailsHeader
        :beneficiary-id="beneficiaryId"
        :can-delete="canDelete"
        @deleted="onBeneficiaryDeleted"
      />
    </div>

    <BeneficiaryDetailsTitle :beneficiary="beneficiary" />

    <hr />
    <BeneficiaryDetailsActions
      :beneficiary-id="beneficiaryId"
      class="fr-pb-3w"
    />
    <hr />

    <AtomTabs>
      <Tab
        :id="BeneficiaryTab.Details"
        name="Infos"
      >
        <BeneficiaryDetails
          :beneficiary="beneficiary"
          :entourages="entourages"
          :tax-households="taxHouseholds"
        />
      </Tab>
      <Tab
        :id="BeneficiaryTab.Documents"
        name="Documents"
      >
        <BeneficiaryDocumentList
          :beneficiary-id="beneficiaryId"
        ></BeneficiaryDocumentList>
      </Tab>
      <Tab
        :id="BeneficiaryTab.History"
        name="Historique"
      >
        <BeneficiaryHistory :beneficiary-id="beneficiaryId" />
      </Tab>
    </AtomTabs>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { Tab } from 'vue3-tabs-component'
  import { canDeleteBeneficiary } from '~/server/query/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary-tabs'
  import { Route, Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'

  const route = useRoute()
  const beneficiaryId = route.params.id as string
  const originPage = route.query.originPage as
    | Route.Overview
    | Route.Beneficiaries
    | Route.History
    | undefined
  const originTab = route.query.hash as string | undefined

  const { data } =
    await useTrpcClient().beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const beneficiary = computed(() => data.value?.beneficiary)
  const taxHouseholds = computed(() => data.value?.taxHouseholds || [])
  const entourages = computed(() => data.value?.entourages || [])

  const authUser = useAuthStore().getAuthUser
  const canDelete = computed(() => {
    return beneficiary.value
      ? canDeleteBeneficiary(authUser, beneficiary.value)
      : false
  })

  const backLink = computed(() => {
    if (originPage) {
      const tabParam = originTab ? `?tab=${originTab}` : ''
      return `${originPage}${tabParam}`
    }
    return RoutePath.Beneficiaries()
  })

  function onBeneficiaryDeleted() {
    navigateTo(backLink.value)
    useSnackbar().success('Le bénéficiaire a été supprimé.')
  }
</script>

<style lang="scss">
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  @include dsfr-media-query.respond-from('lg') {
    .beneficiary-details-col:nth-of-type(2) {
      border-left: 1px solid rgb(151 151 151 / 30%);
    }
  }

  .beneficiarytitle__container {
    display: flex;
    justify-items: center;
  }

  .beneficiary-details-section {
    --title-spacing: 0 0 0.75rem;

    &:not(:last-child) {
      margin-bottom: 2rem;
    }
  }
</style>
