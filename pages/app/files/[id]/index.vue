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
        @open-modal="openAddBeneficiaryModal"
      />
      <hr />
      <BeneficiaryDetailsHistoryActions
        v-if="selectedBeneficiary"
        :beneficiary-id="selectedBeneficiary.id"
        :family-file-id="familyFileId"
        :permissions="selectedPermissions"
        :family-file="familyFileIdentification.length > 1"
        :is-submitting-appointment-plan
        class="fr-pb-3w"
        @plan-appointment="handleAppointmentPlan"
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
          >
            <template #actions>
              <BeneficiaryDetailsActions
                :beneficiary-id="selectedBeneficiary.id"
                :permissions="selectedPermissions"
                :family-file="familyFileIdentification.length > 1"
                @delete="openDeleteModal"
                @split="openSplitModal"
                @archive="handleClickArchiveBeneficiary"
              />
            </template>
          </BeneficiaryInfo>
        </template>

        <template #[tabTitles.at(1)?.panelId]>
          <BeneficiaryDocumentList
            :family-file-id="familyFileId"
            :family-file-identification="familyFileIdentification"
          />
        </template>

        <template #[tabTitles.at(2)?.panelId]>
          <BeneficiaryHistory
            v-if="selectedPermissions"
            :family-file-id="familyFileId"
            :family-file-identification="familyFileIdentification"
            :family-file-permissions="selectedPermissions"
            @refresh="getBeneficiaryDetails(selectedBeneficiary.id)"
          />
        </template>

        <template
          v-if="application?.module.budget"
          #[tabTitles.at(3)?.panelId]
        >
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
  import {
    useGetStructureInfo,
    getStructureInfoInjectionKey
  } from '~/composables/useGetStructureInfoForBeneficiary'
  import { TRPCClientError, TRPCClientErrorLike } from '@trpc/client'
  import { apiRoutes, routes } from '~/utils/routes'
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
  import { BeneficiaryHistoryAction, EventCategory } from '~/types/matomo'
  import BeneficiaryPlanAppointmentModal from '~/components/BeneficiaryPlanAppointment/BeneficiaryPlanAppointmentModal.vue'

  const route = useRoute()
  const snackbar = useSnackbar()
  const modal = useModal()
  const trpcClient = useTrpcClient()
  const { application } = usePermissions()
  const matomo = useMatomo()

  const familyFileId = route.params.id as string

  const { data: beneficiaries, error } =
    await trpcClient.beneficiary.getByFamilyFileId.useQuery(
      { familyFileId },
      { queryKey: 'beneficiary.getByFamilyFileId' }
    )

  const familyFileIdentification = computed(() => beneficiaries.value ?? [])

  const si = await useGetStructureInfo()
  provide(getStructureInfoInjectionKey, si)
  const title = routes.file.AppFile.title(
    familyFileIdentification.value ?? null
  )
  useHead({ title })

  // Tabs
  enum FamilyFileTab {
    Details = 'Details',
    Documents = 'Documents',
    History = 'History',
    Budget = 'Budget'
  }

  const tabTitles = computed(() => {
    const tabs = [
      {
        tabId: FamilyFileTab.Details,
        panelId: panelId(FamilyFileTab.Details),
        title: 'Informations',
        icon: 'fr-icon-information-line'
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
      }
    ]
    if (application.value.module.budget) {
      tabs.push({
        tabId: FamilyFileTab.Budget,
        panelId: panelId(FamilyFileTab.Budget),
        title: 'Budget',
        icon: 'fr-icon-money-euro-circle-line'
      })
    }
    return tabs
  })

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

  watch(
    () => route.query.beneficiaryId,
    async () => {
      if (!route.query.beneficiaryId) {
        await navigateTo(
          routes.file.AppFile.path(familyFileId, {
            beneficiaryId: familyFileIdentification.value[0].id
          })
        )
        return
      }
      if (typeof route.query.beneficiaryId === 'string') {
        // Fetch new data based on the beneficiary id
        getBeneficiaryDetails(route.query.beneficiaryId)
      }
    },
    { immediate: true }
  )

  // Segmented Family
  const openBeneficiary = (beneficiaryId: string): void => {
    const navRoute = routes.file.AppFile.path(familyFileId, {
      beneficiaryId
    })
    navigateTo(navRoute)
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
        const beneficiaryCount = familyFileIdentification.value?.length ?? 0
        if (beneficiaryCount > 1) {
          // Refresh family file data: beneficiaries, budget etc...
          // We have to do this because deleting a beneficiary changes
          // family file data, and the client can't detect it by itself.
          await reloadData()
          await navigateTo(routes.file.AppFile.path(familyFileId))
        } else {
          await navigateTo(routes.beneficiary.AppBeneficiaries.path())
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
        size: 'lg',
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
          // Refresh family file data so that the new beneficiary can be
          // visible in the UI (and refresh data like the budget, socialSupports...)
          await reloadData()
          await navigateTo(
            routes.file.AppFile.path(familyFileId, { beneficiaryId: id })
          )
        },
        onFailure: () => {
          snackbar.error("L'ajout d'un membre au foyer a échoué.")
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
      reloadData
    })
  }

  /** Take an appointment with RDV Service Public for a beneficiary */
  async function handleAppointmentPlan() {
    const id = selectedBeneficiary.value?.id || ''
    if ((familyFileIdentification.value || []).length > 1) {
      openAppointmentModal(id)
    } else {
      await planAppointment(id)
    }
  }

  const isSubmittingAppointmentPlan = ref(false)

  function openAppointmentModal(beneficiaryId: string) {
    const beneficiaryOptions = (familyFileIdentification.value || []).map(
      m => ({
        label: formatBeneficiaryDisplayName(m),
        value: m.id
      })
    )

    modal.open(BeneficiaryPlanAppointmentModal, {
      title: 'Pour quel bénéficiaire souhaitez-vous prendre rendez-vous ?',
      id: beneficiaryId,
      beneficiaryOptions,
      planAppointment,
      isSubmittingAppointmentPlan: isSubmittingAppointmentPlan.value
    })
  }

  async function planAppointment(beneficiaryId: string, fromModal = false) {
    matomo.trackEvent(
      EventCategory.Beneficiary,
      BeneficiaryHistoryAction.PlanAppointment
    )

    await useTrpcMutation({
      mutation: () =>
        trpcClient.rdvsp.planAppointment.mutate({ beneficiaryId }),
      isSubmitting: isSubmittingAppointmentPlan,
      onSuccess: url => {
        window.location.href = url
      },
      onFailure: (e: unknown) =>
        handleAppointmentPlanningFailure(e, beneficiaryId, fromModal)
    })
  }

  function handleAppointmentPlanningFailure(
    e: unknown,
    id: string,
    fromModal: boolean
  ) {
    if (fromModal) {
      modal.close()
      setFocusAfterClose('#action-rdv', 'button')
    }
    if (e instanceof TRPCClientError) {
      switch (e.data.code) {
        case 'UNAUTHORIZED': {
          snackbar.info(
            'Authentification sur RDVSP en cours. Veuillez patienter.'
          )
          const options = { action: 'planAppointment', id }
          navigateTo(apiRoutes.rdvsp.ApiSignIn.path(options), {
            external: true
          })
          break
        }
        case 'FORBIDDEN':
          snackbar.error(
            "Cette fonctionnalité n'est pas disponible. Veuillez vous rapprocher de votre responsable de structure."
          )
          break
        case 'BAD_REQUEST':
        default:
          snackbar.error('La prise de rendez-vous a échoué.')
          break
      }
    } else {
      snackbar.error(
        'La prise de rendez-vous a échoué pour une raison inconnue.'
      )
    }
  }

  const handleClickArchiveBeneficiary = () => {
    if (selectedBeneficiary.value?.id) {
      navigateTo(
        routes.beneficiary.AppBeneficiariesArchive.path(
          selectedBeneficiary.value.id
        )
      )
    }
  }

  async function reloadData() {
    await refreshNuxtData(['beneficiary.getByFamilyFileId'])
  }
</script>
