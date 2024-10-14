<template>
  <AtomAlert
    v-if="error"
    :alert-type="AlertType.Error"
    message="Le dossier n'a pas pu être chargé."
  />
  <PageContainer v-else-if="familyFileIdentification">
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
      <AtomAlert
        v-if="selectedError"
        :alert-type="AlertType.Error"
        message="Le bénéficiaire n'a pas pu être chargé."
      />

      <AtomTabs
        v-else-if="selectedBeneficiary"
        tab-list-name="Détails du dossier foyer"
        :tab-titles="tabTitles"
        :heading-level="2"
      >
        <template #[tabTitles.at(0)?.panelId]>
          <FamilyFileSegmentedControl
            v-if="familyFileIdentification.length > 1"
            :members="familyFileIdentification"
            :model-value="selectedBeneficiary.id"
            @update:model-value="openBeneficiary"
          />
          <BeneficiaryInfo
            :beneficiary="selectedBeneficiary"
            :social-support-subjects="socialSupportSubjects"
            :permissions="selectedPermissions"
            :family-file="familyFileIdentification.length > 1"
            @delete="openDeleteModal"
            @split="openSplitModal"
          />
        </template>

        <template #[tabTitles.at(1)?.panelId]>
          <BeneficiaryDocumentList
            :family-file-id="selectedBeneficiary.familyFileId"
            :family-file-identification="familyFileIdentification || []"
          />
        </template>

        <template #[tabTitles.at(2)?.panelId]>
          <BeneficiaryHistory
            v-if="selectedPermissions"
            :family-file-id="familyFileId"
            :family-file-permissions="selectedPermissions"
            :family-file-identification="familyFileIdentification"
            @refresh="getBeneficiaryDetails(selectedBeneficiary.id)"
          />
        </template>

        <template #[tabTitles.at(3)?.panelId]>
          <FamilyFileBudget
            :family-file-id="familyFileId"
            :family-file-identification="familyFileIdentification"
          />
        </template>
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
  import {
    CreateFamilyFileMemberInput,
    UpdateBeneficiaryTaxHouseholdInput
  } from '~/server/schema'
  import FamilyFileSplitActionModal from '~/components/FamilyFileSplit/FamilyFileSplitActionModal.vue'

  const route = useRoute()
  const snackbar = useSnackbar()
  const modal = useModal()
  const trpcClient = useTrpcClient()

  const familyFileId = route.params.id as string

  const {
    familyFileIdentification,
    error,
    getBeneficiaryIdOnPageLoad,
    refreshFamilyFile
  } = await useFamilyFileMinimalInfo(familyFileId)

  const title = routes.file.AppFile.title(familyFileIdentification.value)
  useHead({ title })

  // Tabs
  enum FamilyFileTab {
    Details = 'Details',
    Documents = 'Documents',
    History = 'History',
    Budget = 'Budget'
  }

  const tabTitles = [
    {
      tabId: FamilyFileTab.Details,
      panelId: panelId(FamilyFileTab.Details),
      title: 'Informations',
      icon: 'fr-icon-information-fill'
    },
    {
      tabId: FamilyFileTab.Documents,
      panelId: panelId(FamilyFileTab.Documents),
      title: 'Documents',
      icon: 'fr-icon-folder-2-line'
    },
    {
      tabId: FamilyFileTab.History,
      panelId: panelId(FamilyFileTab.History),
      title: 'Historique',
      icon: 'fr-icon-history-line'
    },
    {
      tabId: FamilyFileTab.Budget,
      panelId: panelId(FamilyFileTab.Budget),
      title: 'Budget',
      icon: 'fr-icon-money-euro-circle-line'
    }
  ]

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
  const openBeneficiary = (beneficiaryId: string): void => {
    const navRoute = routes.file.AppFile.path(familyFileId, {
      beneficiaryId
    })
    navigateTo(navRoute)
    getBeneficiaryDetails(beneficiaryId)
  }

  function openDeleteModal() {
    const fn = setFocusAfterClose('#Details-panel', 'button')
    modal.open(BeneficiaryDeleteForm, {
      title: 'Supprimer la fiche bénéficiaire',
      beneficiaryId: selectedBeneficiary.value?.id || '',
      cancel: fn,
      failure: () => {
        snackbar.error('La suppression a échoué.', fn)
      },
      success: async () => {
        await refreshFamilyFile()
        if (!familyFileIdentification.value?.length) {
          await navigateTo(routes.beneficiary.AppBeneficiaries.path())
        } else {
          await reloadData(familyFileIdentification.value[0].id)
        }
        snackbar.success('Le bénéficiaire a été supprimé.')
      }
    })
  }

  // Open modal to add beneficiary
  const isSubmitting = ref(false)
  const openAddBeneficiaryModal = (): void => {
    if (familyFileId) {
      modal.open(BeneficiaryAddForm, {
        title: 'Ajouter un membre au dossier',
        isSubmitting: isSubmitting.value,
        familyFileId,
        add: onAddBeneficiary,
        editBeneficiary: async (newBeneficiaryId: string) => {
          await navigateTo(
            routes.beneficiary.AppBeneficiaryEditInfo.path(newBeneficiaryId)
          )
        }
      })
    }
  }

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
        onSuccess: async ({ id }) => {
          beneficiaryID = id
          await reloadData(id)
        },
        onFailure: () => {
          snackbar.error("L'ajout d'un membre au foyer à échoué.")
        }
      })
    }
    return beneficiaryID
  }

  /** Split the selected beneficiary from family file */
  function openSplitModal() {
    if (
      !selectedBeneficiary.value?.id ||
      !selectedBeneficiary.value?.general ||
      !selectedBeneficiary.value?.taxHouseholds
    ) {
      snackbar.error('Bénéficiaire inconnu')
      return
    }

    const id = selectedBeneficiary.value.id
    const beneficiaryName = formatBeneficiaryDisplayName({
      firstName: selectedBeneficiary.value.general.firstName || '',
      usualName: selectedBeneficiary.value.general.usualName || '',
      birthName: selectedBeneficiary.value.general.birthName || ''
    })

    modal.open(FamilyFileSplitActionModal, {
      id,
      beneficiaryName,
      household: selectedBeneficiary.value.taxHouseholds,
      mutationSplit: () => trpcClient.file.split.mutate({ id }),
      mutationFamilySituation: (values: UpdateBeneficiaryTaxHouseholdInput) =>
        trpcClient.beneficiary.updateTaxHousehold.mutate(values),
      reloadData: () =>
        reloadData(familyFileIdentification.value?.[0]?.id || '')
    })
  }

  async function reloadData(id: string) {
    await refreshFamilyFile()
    openBeneficiary(id)
    await refreshNuxtData(['getDocuments', 'getHistory', 'getBudget'])
  }
</script>
