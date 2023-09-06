<template>
  <PageContainer v-if="beneficiary">
    <DsfrBreadcrumb
      :links="Breadcrumb.AppBeneficiary(beneficiary, originPage)"
    />
    <div class="beneficiarytitle__container">
      <PageTitle :title="title" />
      <BeneficiaryDetailsHeader
        :beneficiary-id="beneficiaryId"
        :can-delete="canDelete"
        @deleted="onBeneficiaryDeleted"
      />
    </div>

    <BeneficiaryDetailsTitle :beneficiary="beneficiary" />

    <hr />
    <BeneficiaryDetailsActions
      :beneficiary="beneficiary"
      class="fr-pb-3w"
    />
    <hr />

    <AtomTabsV2
      tab-list-name="Détails de la fiche bénéficiaire"
      :tab-titles="[
        {
          tabId: BeneficiaryTab.Details,
          panelId: panelId(BeneficiaryTab.Details),
          title: 'Informations',
          icon: 'fr-icon-information-fill'
        },
        {
          tabId: BeneficiaryTab.Documents,
          panelId: panelId(BeneficiaryTab.Documents),
          title: 'Documents',
          icon: 'fr-icon-folder-2-line'
        },
        {
          tabId: BeneficiaryTab.History,
          panelId: panelId(BeneficiaryTab.History),
          title: 'Historique',
          icon: 'fr-icon-history-line'
        }
      ]"
    >
      <AtomTabV2
        :tab-id="BeneficiaryTab.Details"
        :panel-id="panelId(BeneficiaryTab.Details)"
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
        <BeneficiaryDetails
          v-else
          :beneficiary="beneficiary"
          :entourages="entourages"
          :tax-households="taxHouseholds"
          :followup-types="followupTypes"
        />
      </AtomTabV2>
      <AtomTabV2
        :tab-id="BeneficiaryTab.Documents"
        :panel-id="panelId(BeneficiaryTab.Documents)"
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
      </AtomTabV2>
      <AtomTabV2
        :tab-id="BeneficiaryTab.History"
        :panel-id="panelId(BeneficiaryTab.History)"
      >
        <BeneficiaryHistory :beneficiary-id="beneficiaryId" />
      </AtomTabV2>
    </AtomTabsV2>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { canDeleteBeneficiary } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { Route, Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'

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
  const followupTypes = computed(
    () =>
      followupTypesData.value || { legallyRequired: [], legallyNotRequired: [] }
  )

  const authStore = useAuthStore()
  const canDelete = computed(() => {
    return beneficiary.value
      ? canDeleteBeneficiary(authStore.getAuthUser, beneficiary.value)
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

  function panelId(tab: BeneficiaryTab) {
    return `${tab}-panel`
  }
</script>

<style lang="scss" scoped>
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

  :deep(.beneficiary-details-section) {
    background-color: #fff;
    border-radius: 0.5rem;
    border: 1px solid var(--border-default-grey);
    padding: 40px;
  }

  :deep(.beneficiary-details-section):not(:last-child) {
    margin-bottom: 1.5rem;
  }
</style>
