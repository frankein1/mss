<template>
  <PageContainer v-if="beneficiary">
    <DsfrBreadcrumb
      :links="Breadcrumb.AppBeneficiary(beneficiaryIdentification, originPage)"
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
      <AtomTab
        :tab-id="BeneficiaryTab.Budget"
        title="Budget"
        icon="fr-icon-money-euro-circle-line"
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
        <BeneficiaryBudget
          v-else-if="beneficiaryIdentification"
          :beneficiary-identification="beneficiaryIdentification"
          :tax-household="beneficiary.taxHouseholds?.taxHouseholds || []"
        />
      </AtomTab>
    </AtomTabs>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { Route, Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'
  import { useBeneficiaryDetails } from '~/composables/useBeneficiaryDetails'

  const route = useRoute()

  const beneficiaryId = route.params.id as string
  const originPage = route.query.originPage as
    | Route.AppOverview
    | Route.AppBeneficiaries
    | Route.AppHistory
    | undefined
  const originTab = route.query.hash as string | undefined

  const {
    beneficiary,
    permissions,
    beneficiaryIdentification,
    pending,
    error
  } = await useBeneficiaryDetails(beneficiaryId)

  const title = RouteTitle.AppBeneficiary(beneficiary.value?.general || null)

  useHead({ title })

  const socialSupportSubjects = computed(
    () => beneficiary.value?.history.subjects || []
  )

  const backLink = computed(() => {
    if (originPage) {
      const tabParam = originTab ? `?tab=${originTab}` : ''
      return `${originPage}${tabParam}`
    }
    return RoutePath.AppBeneficiaries()
  })

  function onBeneficiaryDeleted() {
    navigateTo(backLink.value)
    useSnackbar().success('Le bénéficiaire a été supprimé.')
  }
</script>
