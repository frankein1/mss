<template>
  <PageContainer v-if="beneficiary">
    <DsfrBreadcrumb
      :links="Breadcrumb.AppBeneficiary(beneficiary, originPage)"
    />

    <BeneficiaryDetailsHeader
      :beneficiary="beneficiary"
      :title="title"
      :can-delete="canDelete"
      @deleted="onBeneficiaryDeleted"
    />

    <hr />
    <BeneficiaryDetailsHistoryActions
      :beneficiary="beneficiary"
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
          v-else
          :beneficiary="beneficiary"
          :entourages="entourages"
          :tax-households="taxHouseholds"
          :followup-types="followupTypes"
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
          :beneficiary="beneficiary"
        />
      </AtomTab>
      <AtomTab
        :tab-id="BeneficiaryTab.History"
        title="Historique"
        icon="fr-icon-history-line"
      >
        <BeneficiaryHistory :beneficiary-id="beneficiaryId" />
      </AtomTab>
    </AtomTabs>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { useAuthStore } from '~/store/auth'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { Route, Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'
  import { BeneficiaryRules } from '~/server/security'

  definePageMeta({
    middleware: 'is-beneficiary-referent'
  })

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

  const {
    data: followupTypesData,
    pending: followupTypesPending,
    error: followupTypesError
  } = await trpcClient.beneficiary.getBeneficiaryFollowupTypes.useQuery({
    id: beneficiaryId
  })

  const beneficiary = computed(() => data.value?.beneficiary)

  const title = RouteTitle.AppBeneficiary(beneficiary.value || null)

  useHead({ title })

  const taxHouseholds = computed(() => data.value?.taxHouseholds || [])
  const entourages = computed(() => data.value?.entourages || [])
  const followupTypes = computed(() => followupTypesData.value || [])

  const authStore = useAuthStore()
  const canDelete = computed(() => {
    return beneficiary.value
      ? BeneficiaryRules.delete(authStore.getAuthUser, beneficiary.value)
      : false
  })

  const backLink = computed(() => {
    if (originPage) {
      const tabParam = originTab ? `?tab=${originTab}` : ''
      return `${originPage}${tabParam}`
    }
    return RoutePath.AppBeneficiaries()
  })

  const pending = computed(
    () => beneficiaryPending.value || followupTypesPending.value
  )

  const error = computed(
    () => beneficiaryError.value || followupTypesError.value
  )

  function onBeneficiaryDeleted() {
    navigateTo(backLink.value)
    useSnackbar().success('Le bénéficiaire a été supprimé.')
  }
</script>
