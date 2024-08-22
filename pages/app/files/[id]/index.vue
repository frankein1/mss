<template>
  <AtomAlert
    v-if="error || !familyFileIdentification"
    :alert-type="AlertType.Error"
    message="Le dossier n'a pas pu être chargé."
  />
  <PageContainer v-else>
    <AtomBreadcrumb
      :links="breadcrumbs.file.AppFile(familyFileId, familyFileIdentification)"
    />
    <div>
      <FamilyFileDetailsHeader
        :beneficiaries="familyFileIdentification"
        :title="title"
        @open-modal="openAddBeneficiaryModal"
      />
      <hr />
      <BeneficiaryDetailsHistoryActions
        v-if="selectedBeneficiary"
        :beneficiary-id="selectedBeneficiary.id"
        :family-file-id="familyFileId"
        :permissions="selectedPermissions"
        class="fr-pb-3w"
      />
      <hr />
      <AtomTabs
        v-if="selectedBeneficiary"
        tab-list-name="Détails du dossier foyer"
      >
        <AtomTab
          :tab-id="FamilyFileTab.Details"
          title="Informations"
          icon="fr-icon-information-fill"
          selected
        >
          <FamilyFileSegmentedControl
            v-if="familyFileIdentification.length > 1"
            :members="familyFileIdentification"
            :model-value="selectedBeneficiary.id"
            @update:model-value="onChange"
          />
          <AtomLoader
            v-if="selectedPending"
            class="fr-mx-auto"
          />
          <AtomAlert
            v-else-if="selectedError || !selectedBeneficiary"
            :alert-type="AlertType.Error"
            message="La fiche bénéficiaire n'a pas pu être chargée."
          />
          <BeneficiaryInfo
            v-else
            :beneficiary="selectedBeneficiary"
            :social-support-subjects="socialSupportSubjects"
            :permissions="selectedPermissions"
            :family-file="familyFileIdentification.length > 1"
            @delete="openDeleteModal"
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
            v-else-if="selectedError || !selectedBeneficiary"
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
            v-else-if="selectedError || !selectedBeneficiary"
            :alert-type="AlertType.Error"
            message="La fiche bénéficiaire n'a pas pu être chargée."
          />
          <BeneficiaryHistory
            v-else-if="selectedPermissions"
            :family-file-id="familyFileId"
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
            v-else-if="selectedError || !selectedBeneficiary"
            :alert-type="AlertType.Error"
            message="La fiche bénéficiaire n'a pas pu être chargée."
          />
          <FamilyFileBudget
            v-else
            :family-file-id="familyFileId"
            :beneficiary-id="selectedBeneficiary.id"
          />
        </AtomTab>
      </AtomTabs>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { TRPCClientErrorLike } from '@trpc/client'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { FamilyFilePermissions } from '~/server/security'
  import { GetBeneficiaryOutput } from '~/types/beneficiary'
  import { AlertType } from '~/utils/constants/alert'
  import BeneficiaryAddForm from '~/components/BeneficiaryAddForm/BeneficiaryAddForm.vue'
  import BeneficiaryDeleteForm from '~/components/BeneficiaryDeleteForm/BeneficiaryDeleteForm.vue'
  import { CreateFamilyFileMemberInput } from '~/server/schema'

  const route = useRoute()
  const snackbar = useSnackbar()

  const originPage = route.query.originPage as
    | typeof routes.user.AppOverview.name
    | typeof routes.beneficiary.AppBeneficiaries.name
    | typeof routes.file.AppHistory.name
    | undefined
  const originTab = route.query.hash as string | undefined

  const familyFileId = route.params.id as string

  const { familyFileIdentification, error, getBeneficiaryIdOnPageLoad } =
    await useFamilyFileMinimalInfo(familyFileId)

  const title = routes.file.AppFile.title(familyFileIdentification.value)
  useHead({ title })

  // states
  const selectedBeneficiary = ref<GetBeneficiaryOutput | null>(null)
  const selectedPermissions = ref<FamilyFilePermissions | undefined>(undefined)
  const selectedPending = ref(true)
  const selectedError = ref<TRPCClientErrorLike<any> | null>(null)
  const socialSupportSubjects = computed(
    () => selectedBeneficiary?.value?.history?.subjects || []
  )

  // Get beneficiaryDetails
  const getBeneficiaryDetails = async (id: string): Promise<void> => {
    const { beneficiary, permissions, pending, error } =
      await useBeneficiaryDetails(id)
    selectedBeneficiary.value = beneficiary.value
    selectedPermissions.value = permissions.value
    selectedPending.value = pending.value
    selectedError.value = error.value
  }

  if (familyFileIdentification && familyFileIdentification.value?.length) {
    getBeneficiaryDetails(getBeneficiaryIdOnPageLoad())
  }

  // Segmented Family
  const onChange = (beneficiaryId: string): void => {
    const navRoute = routes.file.AppFile.path(familyFileId, {
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

  function openDeleteModal() {
    const fn = setFocusAfterClose('#Details-panel', 'button')
    useModal().open(BeneficiaryDeleteForm, {
      title: 'Supprimer la fiche bénéficiaire',
      beneficiaryId: selectedBeneficiary.value?.id || '',
      cancel: fn,
      failure: () => {
        snackbar.error('La suppression a échoué.', fn)
      },
      success: () => {
        navigateTo(backLink.value)
        snackbar.success('Le bénéficiaire a été supprimé.')
      }
    })
  }

  const backLink = computed(() => {
    if (originPage) {
      const tabParam = originTab ? `?tab=${originTab}` : ''
      return `${originPage}${tabParam}`
    }
    return routes.beneficiary.AppBeneficiaries.path()
  })

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
  const onAddBeneficiary = async (
    newBeneficiary: CreateFamilyFileMemberInput
  ) => {
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
          trpcClient.beneficiary.createFamilyFileMember.mutate(payload),
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
