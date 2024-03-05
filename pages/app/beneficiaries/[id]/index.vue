<template>
  <PageContainer v-if="beneficiary">
    <DsfrBreadcrumb
      :links="Breadcrumb.AppBeneficiary(beneficiary, originPage)"
    />

    <BeneficiaryDetailsHeader
      :beneficiary="beneficiary"
      :title="title"
      :permissions="permissions"
      @deleted="onBeneficiaryDeleted"
    />

    <hr />
    <BeneficiaryDetailsHistoryActions
      :beneficiary-id="beneficiary.id"
      :permissions="permissions"
      class="fr-pb-3w"
    />
    <hr />

    <AtomTabs tab-list-name="Détails de la fiche bénéficiaire">
      <AtomTab
        :tab-id="BeneficiaryTab.Details"
        title="Informations"
        icon="fr-icon-information-fill"
        selected
      >
        <AtomLoader
          v-if="pending"
          class="fr-mx-auto"
        />
        <AtomAlert
          v-else-if="error"
          :alert-type="AlertType.Error"
          message="La fiche bénéficiaire n'a pas pu être chargée."
        />
        <BeneficiaryInfo
          :beneficiary="beneficiary"
          :social-support-subjects="socialSupportSubjects"
        />
      </AtomTab>
      <AtomTab
        :tab-id="BeneficiaryTab.Documents"
        title="Documents"
        icon="fr-icon-folder-2-line"
      >
        <AtomLoader
          v-if="pending"
          class="fr-mx-auto"
        />
        <AtomAlert
          v-else-if="error"
          :alert-type="AlertType.Error"
          message="La fiche bénéficiaire n'a pas pu être chargée."
        />
        <BeneficiaryDocumentList
          v-else
          :beneficiary-id="beneficiary.id"
        />
      </AtomTab>
      <AtomTab
        :tab-id="BeneficiaryTab.History"
        title="Historique"
        icon="fr-icon-history-line"
      >
        <BeneficiaryHistory
          v-if="permissions"
          :beneficiary-id="beneficiaryId"
          :beneficiary-permissions="permissions"
        />
      </AtomTab>
    </AtomTabs>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { Route, Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'

  const route = useRoute()
  const trpcClient = useTrpcClient()
  const beneficiaryId = route.params.id as string
  const originPage = route.query.originPage as
    | Route.AppOverview
    | Route.AppBeneficiaries
    | Route.AppHistory
    | undefined
  const originTab = route.query.hash as string | undefined

  const {
    data,
    pending: beneficiaryPending,
    error: beneficiaryError
  } = await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
    id: beneficiaryId
  })

  const beneficiary = computed(() => data.value?.beneficiary || null)
  const permissions = computed(() => data.value?.permissions)
  const title = RouteTitle.AppBeneficiary(beneficiary.value?.general || null)

  useHead({ title })

  const socialSupportSubjects = computed(
    () => data.value?.beneficiary.history.subjects || []
  )

  const backLink = computed(() => {
    if (originPage) {
      const tabParam = originTab ? `?tab=${originTab}` : ''
      return `${originPage}${tabParam}`
    }
    return RoutePath.AppBeneficiaries()
  })

  const pending = computed(() => beneficiaryPending.value)

  const error = computed(() => beneficiaryError.value)

  function onBeneficiaryDeleted() {
    navigateTo(backLink.value)
    useSnackbar().success('Le bénéficiaire a été supprimé.')
  }
</script>
