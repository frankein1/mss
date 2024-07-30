<template>
  <PageContainer v-if="familyFileIdentification">
    <AtomBreadcrumb
      :links="breadcrumbs.file.AppFile(familyFileId, familyFileIdentification)"
    />
    <AtomLoader
      v-if="pending"
      class="loading-state"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="La fiche foyer n'a pas pu être chargée."
    />
    <template v-else>
      <FamilyFileDetailsHeader
        :permissions="selectedPermissions"
        :beneficiaries="familyFileIdentification"
        :title="title"
        @open-modal="openAddBeneficiaryModal"
      />
      <hr />
      <BeneficiaryDetailsHistoryActions
        :beneficiary-id="familyFileIdentification[0].id"
        :permissions="selectedPermissions"
        class="fr-pb-3w"
      />
      <hr />
      <AtomLoader
        v-if="isDeleting"
        class="loading-state"
      />
      <AtomTabs
        v-else-if="selectedBeneficiary"
        tab-list-name="Détails de la fiche bénéficiaire"
      >
        <AtomTab
          :tab-id="FamilyFileTab.Details"
          title="Informations"
          icon="fr-icon-information-fill"
          selected
        >
          <FamilyFileSegmentedControl
            v-if="selectedBeneficiary"
            :members="familyFileIdentification"
            :model-value="selectedBeneficiary.id"
            @on-change="onChange"
          />
          <AtomLoader
            v-if="selectedPending"
            class="fr-mx-auto"
          />
          <AtomAlert
            v-else-if="selectedError"
            :alert-type="AlertType.Error"
            message="La fiche bénéficiaire n'a pas pu être chargée."
          />
          <BeneficiaryInfo
            v-else
            :beneficiary="selectedBeneficiary"
            :social-support-subjects="socialSupportSubjects"
            :permissions="selectedPermissions"
            :family-file="true"
            @toggle-delete="toggleDelete"
            @deleted="onBeneficiaryDeleted"
            @split="onSplit"
          />
        </AtomTab>
        <AtomTab
          :tab-id="FamilyFileTab.Documents"
          title="Documents"
          icon="fr-icon-folder-2-line"
          selected
        >
          <AtomLoader
            v-if="selectedPending"
            class="fr-mx-auto"
          />
          <AtomAlert
            v-else-if="selectedError"
            :alert-type="AlertType.Error"
            message="La fiche bénéficiaire n'a pas pu être chargée."
          />
          <BeneficiaryDocumentList
            v-else
            :family-file-id="selectedBeneficiary.familyFileId"
            :family-file-identification="familyFileIdentification || []"
          />
        </AtomTab>
        <AtomTab
          :tab-id="FamilyFileTab.History"
          title="Historique"
          icon="fr-icon-history-line"
          selected
        >
          <AtomLoader
            v-if="selectedPending"
            class="fr-mx-auto"
          />
          <AtomAlert
            v-else-if="selectedError"
            :alert-type="AlertType.Error"
            message="La fiche bénéficiaire n'a pas pu être chargée."
          />
          <BeneficiaryHistory
            v-else-if="selectedPermissions"
            :family-file-id="selectedBeneficiary.familyFileId"
            :family-file-permissions="selectedPermissions"
          />
        </AtomTab>
        <AtomTab
          :tab-id="FamilyFileTab.Budget"
          title="Budget"
          icon="fr-icon-money-euro-circle-line"
          selected
        >
          <AtomLoader
            v-if="selectedPending"
            class="fr-mx-auto"
          />
          <AtomAlert
            v-else-if="selectedError"
            :alert-type="AlertType.Error"
            message="La fiche bénéficiaire n'a pas pu être chargée."
          />
          <BeneficiaryBudget
            v-else-if="selectedBeneficiary && selectedBeneficiaryIdentification"
            :family-file-id="selectedBeneficiary.familyFileId"
            :beneficiary-identification="selectedBeneficiaryIdentification"
          />
        </AtomTab>
      </AtomTabs>
    </template>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { FamilyFilePermissions } from '~/server/security'
  import {
    BeneficiaryIdentification,
    GetBeneficiaryOutput
  } from '~/types/beneficiary'
  import { AlertType } from '~/utils/constants/alert'
  import BeneficiaryAddForm from '~/components/BeneficiaryAddForm/BeneficiaryAddForm.vue'
  import { AddFamilyFileMemberInput } from '~/server/schema'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'

  const route = useRoute()
  const originPage = route.query.originPage as
    | typeof routes.user.AppOverview.name
    | typeof routes.beneficiary.AppBeneficiaries.name
    | typeof routes.beneficiary.AppHistory.name
    | undefined
  const originTab = route.query.hash as string | undefined

  // states
  const selectedBeneficiary = useState(
    'selectedBeneficiary',
    (): GetBeneficiaryOutput | null => null
  )
  const selectedPermissions = useState(
    'selectedPermissions',
    (): FamilyFilePermissions | undefined => undefined
  )
  const selectedBeneficiaryIdentification = useState(
    'selectedBeneficiaryIdentification',
    (): BeneficiaryIdentification | null => null
  )
  const selectedPending = useState('selectedPending', (): boolean => true)
  const selectedError = useState('selectedError', (): any | null => null) // TODO: find a type for error
  const socialSupportSubjects = computed(
    () => selectedBeneficiary?.value?.history?.subjects || []
  )

  // Get family informations
  const familyFileId = route.params.id as string
  const { familyFileIdentification, pending, error } =
    await useFamilyFileMinimalInfo(familyFileId)
  const title = routes.file.AppFile.title(familyFileIdentification.value)

  // Get beneficiaryDetails
  const getBeneficiaryDetails = async (id: string): Promise<void> => {
    const {
      beneficiary,
      permissions,
      beneficiaryIdentification,
      pending,
      error
    } = await useBeneficiaryDetails(id)
    selectedBeneficiary.value = beneficiary.value
    selectedPermissions.value = permissions.value
    selectedBeneficiaryIdentification.value = beneficiaryIdentification.value
    selectedPending.value = pending.value
    selectedError.value = error.value
  }

  if (familyFileIdentification && familyFileIdentification.value?.length) {
    getBeneficiaryDetails(familyFileIdentification.value[0].id)
  }

  // Segmented Family
  const onChange = (beneficiaryId: string): void => {
    const navRoute = routes.file.AppFile.path(familyFileId, {
      tab: BeneficiaryTab.History,
      beneficiaryId
    })
    navigateTo(navRoute)
    getBeneficiaryDetails(beneficiaryId)
  }
  enum FamilyFileTab {
    Details = 'Details',
    Documents = 'Documents',
    History = 'History',
    Budget = 'Budget'
  }

  // Deleting
  const isDeleting = ref(false)
  const toggleDelete = () => {
    isDeleting.value = !isDeleting.value
  }
  const backLink = computed(() => {
    if (originPage) {
      const tabParam = originTab ? `?tab=${originTab}` : ''
      return `${originPage}${tabParam}`
    }
    return routes.beneficiary.AppBeneficiaries.path()
  })
  const onBeneficiaryDeleted = () => {
    navigateTo(backLink.value)
    useSnackbar().success('Le bénéficiaire a été supprimé.')
  }

  // Open modal to add beneficiary
  const isSubmitting = ref(false)
  const openAddBeneficiaryModal = (): void => {
    if (familyFileId) {
      useModal().open(BeneficiaryAddForm, {
        title: 'Ajouter un membre au dossier',
        isSubmitting: isSubmitting.value,
        familyFileId,
        add: onAddBeneficiary
      })
    }
  }
  const trpcClient = useTrpcClient()
  const onAddBeneficiary = async (newBeneficiary: AddFamilyFileMemberInput) => {
    let beneficiaryID
    if (familyFileId) {
      const payload = {
        familyFileId,
        title: newBeneficiary.title,
        usualName: newBeneficiary.usualName,
        firstName: newBeneficiary.firstName,
        birthDate: newBeneficiary.birthDate
          ? new Date(newBeneficiary.birthDate)
          : undefined,
        relationship: newBeneficiary.relationship
      }
      await useTrpcMutation({
        mutation: () =>
          trpcClient.beneficiary.addFamilyFileMember.mutate(payload),
        isSubmitting,
        onSuccess: ({ id }) => {
          beneficiaryID = id
        },
        onFailure: () => {
          useSnackbar().error("L'ajout d'un membre au foyer à échoué.")
        }
      })
    }
    return beneficiaryID
  }

  // TODO Split
  const onSplit = () => {
    console.log('split dossier')
  }
</script>

<style scoped>
  .loading-state {
    width: 100%;
    margin: 0 auto;
  }
</style>
