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

      <DsfrTabs
        v-if="selectedBeneficiary && selectedPermissions"
        tab-list-name="Détails du dossier foyer"
        :tab-titles="tabTitles"
        :initial-selected-index="selected"
        @select-tab="select"
      >
        <DsfrTabContent
          :tab-id="BeneficiaryTab.Details"
          :selected="selected === 0"
          :asc="ascendant"
        >
          <FamilyFileSegmentedControl
            v-if="familyFileIdentification.length > 1"
            :members="familyFileIdentification"
            :model-value="selectedBeneficiary.id"
            @update:model-value="openBeneficiary"
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
        </DsfrTabContent>
        <DsfrTabContent
          :tab-id="BeneficiaryTab.Documents"
          :selected="selected === 1"
          :asc="ascendant"
        >
          <BeneficiaryDocumentList
            :family-file-id="selectedBeneficiary.familyFileId"
            :family-file-identification="familyFileIdentification || []"
          />
        </DsfrTabContent>
        <DsfrTabContent
          :tab-id="BeneficiaryTab.History"
          :selected="selected === 2"
          :asc="ascendant"
        >
          <BeneficiaryHistory
            :family-file-id="familyFileId"
            :family-file-permissions="selectedPermissions"
            :family-file-identification="familyFileIdentification"
          />
        </DsfrTabContent>
        <DsfrTabContent
          :tab-id="BeneficiaryTab.Budget"
          :selected="selected === 3"
          :asc="ascendant"
        >
          <FamilyFileBudget
            kv-else
            :family-file-id="familyFileId"
            :family-file-identification="familyFileIdentification"
          />
        </DsfrTabContent>
      </DsfrTabs>
      <AtomLoader
        v-if="selectedPending"
        class="fr-mx-auto"
      />
      <AtomAlert
        v-else-if="selectedError || !selectedBeneficiary"
        :alert-type="AlertType.Error"
        message="La fiche bénéficiaire n'a pas pu être chargée."
      />
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
  import { DsfrTabsProps, useTabs } from '@gouvminint/vue-dsfr'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'

  const snackbar = useSnackbar()

  const route = useRoute()
  const familyFileId = route.params.id as string

  const {
    familyFileIdentification,
    error,
    getBeneficiaryIdOnPageLoad,
    refreshFamilyFile
  } = await useFamilyFileMinimalInfo(familyFileId)

  const title = routes.file.AppFile.title(familyFileIdentification.value)
  useHead({ title })

  const { ascendant, selected, select } = useTabs(true, currentTab())

  function currentTab() {
    const hash = route.hash.slice(1)
    if (!hash) {
      return 0
    }
    return hash ? Object.keys(BeneficiaryTab).indexOf(hash) : undefined
  }

  const tabTitles: DsfrTabsProps['tabTitles'] = [
    {
      title: 'Informations',
      icon: 'fr-icon-information-fill'
    },
    {
      title: 'Document(s)',
      icon: 'fr-icon-folder-2-line'
    },
    {
      title: 'Historique',
      icon: 'fr-icon-history-tab-list-name'
    },
    {
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
    useModal().open(BeneficiaryDeleteForm, {
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
          await openBeneficiary(familyFileIdentification.value[0].id)
          await refreshNuxtData(['getDocuments', 'getHistory', 'getBudget'])
        }
        snackbar.success('Le bénéficiaire a été supprimé.')
      }
    })
  }

  // Open modal to add beneficiary
  const isSubmitting = ref(false)
  const openAddBeneficiaryModal = (): void => {
    if (familyFileId) {
      useModal().open(BeneficiaryAddForm, {
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
        onSuccess: async ({ id }) => {
          beneficiaryID = id
          await refreshNuxtData([
            'getFamilyFileMinimalInfo',
            'getDocuments',
            'getHistory',
            'getBudget'
          ])
          await openBeneficiary(id)
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
