<template>
  <PageContainer v-if="beneficiary">
    <AtomBreadcrumb
      :links="
        breadcrumbs.beneficiary.AppBeneficiary(
          beneficiaryIdentification,
          originPage
        )
      "
    />

    <BeneficiaryDetailsHeader
      :beneficiary="beneficiary"
      :title="title"
      :permissions="permissions"
    />

    <hr />
    <BeneficiaryDetailsHistoryActions
      :beneficiary-id="beneficiary.id"
      :permissions="permissions"
      class="fr-pb-3w"
    />
    <hr />

    <AtomLoader
      v-if="isDeleting"
      class="loading-state"
    />
    <AtomTabs
      v-else
      tab-list-name="Détails de la fiche bénéficiaire"
    >
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
          :permissions="permissions"
          @toggle-delete="toggleDelete"
          @deleted="onBeneficiaryDeleted"
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
          :family-file-id="beneficiary.familyFileId"
        />
      </AtomTab>
      <AtomTab
        :tab-id="BeneficiaryTab.History"
        title="Historique"
        icon="fr-icon-history-line"
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
        <BeneficiaryHistory
          v-else-if="permissions"
          :family-file-id="beneficiary.familyFileId"
          :family-file-permissions="permissions"
        />
      </AtomTab>
      <AtomTab
        v-if="application.module.budget"
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
          :family-file-id="beneficiary.familyFileId"
          :beneficiary-identification="beneficiaryIdentification"
        />
      </AtomTab>
    </AtomTabs>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { AlertType } from '~/utils/constants/alert'
  import { useBeneficiaryDetails } from '~/composables/useBeneficiaryDetails'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const route = useRoute()

  const beneficiaryId = route.params.id as string
  const originPage = route.query.originPage as
    | typeof routes.user.AppOverview.name
    | typeof routes.beneficiary.AppBeneficiaries.name
    | typeof routes.beneficiary.AppHistory.name
    | undefined
  const originTab = route.query.hash as string | undefined

  const {
    beneficiary,
    permissions,
    beneficiaryIdentification,
    pending,
    error
  } = await useBeneficiaryDetails(beneficiaryId)

  const { application } = usePermissions()

  const title = routes.beneficiary.AppBeneficiary.title(
    beneficiary.value?.general || null
  )

  useHead({ title })

  const socialSupportSubjects = computed(
    () => beneficiary.value?.history.subjects || []
  )

  const backLink = computed(() => {
    if (originPage) {
      const tabParam = originTab ? `?tab=${originTab}` : ''
      return `${originPage}${tabParam}`
    }
    return routes.beneficiary.AppBeneficiaries.path()
  })

  /** Deleting status is used temporarily to hide the tab BeneficiaryHistory
   * when the beneficiary is deleted.
   * 1. because the filters for BeneficiaryHistory are reactive
   * the deletion triggers a new fetch of beneficiary.getSocialSupports
   * 2. The API call is performed in batch mode and fails
   * 3. The whole batch calls which includes call for loading /app/beneficiaries fails
   * 4. No filter can be displayed on the page /app/beneficiaries
   * See [#427](https://gitlab.com/incubateur-territoires/startups/monsuivisocial/monsuivisocial-v2/-/issues/427)
   */
  const isDeleting = ref(false)

  function toggleDelete() {
    isDeleting.value = !isDeleting.value
  }

  function onBeneficiaryDeleted() {
    navigateTo(backLink.value)
    useSnackbar().success('Le bénéficiaire a été supprimé.')
  }
</script>

<style scoped>
  .loading-state {
    width: 100%;
    margin: 0 auto;
  }
</style>
