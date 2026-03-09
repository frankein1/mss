<template>
  <AtomAlert
    v-if="!familyFile"
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
        @open-modal="openAddBeneficiaryModal"
      />
      <hr />
      <BeneficiaryDetailsHistoryActions
        v-if="beneficiaryId"
        :beneficiary-id="beneficiaryId"
        :family-file-id="familyFileId"
        :permissions="familyFile?.permissions"
        :family-file="familyFileIdentification.length > 1"
        :is-submitting-appointment-plan="
          statusAppointment === 'pending' || isSubmittingAppointmentPlan
        "
        class="fr-pb-3w"
        @plan-appointment="handleAppointmentPlan"
      />
      <hr />

      <AtomTabs
        tab-list-name="Détails du dossier foyer"
        :tab-titles="tabTitles"
        :heading-level="2"
      >
        <template #[tabTitles.at(0)?.panelId]>
          <AtomAlert
            v-if="selectedError || !beneficiaryId"
            :alert-type="AlertType.Error"
            message="Les informations du bénéficiaire n'ont pas pu être chargées."
          />
          <template v-else>
            <FamilyFileSegmentedControl
              v-if="familyFileIdentification.length > 1"
              :members="familyFileIdentification"
              :model-value="beneficiaryId"
              @update:model-value="openBeneficiary"
            />
            <BeneficiaryInfo :beneficiary-id>
              <template #actions>
                <BeneficiaryDetailsActions
                  :beneficiary-id
                  :permissions="familyFile?.permissions"
                  :family-file="familyFileIdentification.length > 1"
                  :beneficiary-relationship="selectedBeneficiary?.relationship"
                  @delete="openDeleteModal"
                  @split="openSplitModal"
                  @archive="handleClickArchiveBeneficiary"
                />
              </template>
            </BeneficiaryInfo>
          </template>
        </template>

        <template #[tabTitles.at(1)?.panelId]>
          <BeneficiaryDocumentList
            :family-file-id="familyFileId"
            :family-file-identification="familyFileIdentification"
          />
        </template>

        <template #[tabTitles.at(2)?.panelId]>
          <AtomAlert
            v-if="!familyFile?.permissions || !beneficiaryId"
            :alert-type="AlertType.Error"
            message="L'historique du bénéficiaire n'a pas pu être chargé."
          />
          <BeneficiaryHistory
            v-else
            :family-file-id="familyFileId"
            :family-file-identification="familyFileIdentification"
            :family-file-permissions="familyFile.permissions"
            @refresh="getBeneficiaryDetails(beneficiaryId)"
          />
        </template>

        <template #[tabTitles.at(3)?.panelId]>
          <template v-if="application?.module.budget">
            <FamilyFileBudget
              :family-file-id="familyFileId"
              :family-file-identification="familyFileIdentification"
            />
          </template>
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
  import type { TRPCClientErrorLike } from '@trpc/client'
  import { TRPCClientError } from '@trpc/client'
  import { apiRoutes, routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import type { GetBeneficiaryOutput } from '~/types/beneficiary'
  import { AlertType } from '~/utils/constants/alert'
  import BeneficiaryAddForm from '~/components/BeneficiaryAddForm/BeneficiaryAddForm.vue'
  import BeneficiaryDeleteForm from '~/components/BeneficiaryDeleteForm/BeneficiaryDeleteForm.vue'
  import type {
    CreateFamilyFileMemberInput,
    UpdateBeneficiaryTaxHouseholdInput
  } from '~/server/schema'
  import FamilyFileSplitActionModal from '~/components/FamilyFileSplit/FamilyFileSplitActionModal.vue'
  import { BeneficiaryHistoryAction, EventCategory } from '~/types/matomo'
  import BeneficiaryPlanAppointmentModal from '~/components/BeneficiaryPlanAppointment/BeneficiaryPlanAppointmentModal.vue'

  const router = useRouter()
  const route = useRoute()
  const snackbar = useSnackbar()
  const modal = useModal()
  const trpcClient = useTrpcClient()
  const { application } = usePermissions()
  const matomo = useMatomo()

  const familyFileId = computed(() => route.params.id as string)
  const beneficiaryId = computed(
    () => route.query.beneficiaryId as string | null
  )

  const { data: familyFile } =
    await trpcClient.file.getFamilyFileMinimalInfo.useQuery(
      { id: familyFileId.value },
      { queryKey: 'file.getFamilyFileMinimalInfo' }
    )

  const familyFileIdentification = computed(
    () => familyFile.value?.beneficiaries ?? []
  )

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

  const tabTitles = [
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
    },
    ...((application.value.module.budget && [
      {
        tabId: FamilyFileTab.Budget,
        panelId: panelId(FamilyFileTab.Budget),
        title: 'Budget',
        icon: 'fr-icon-money-euro-circle-line'
      }
    ]) ||
      [])
  ]

  // states
  const selectedBeneficiary = ref<GetBeneficiaryOutput | null>(null)
  const selectedPending = ref(true)
  const selectedError = ref<TRPCClientErrorLike<any> | null>(null)

  // Get beneficiaryDetails
  const getBeneficiaryDetails = async (id: string): Promise<void> => {
    const { beneficiary, pending, error } = await useBeneficiaryDetails(id)
    selectedBeneficiary.value = beneficiary.value
    selectedPending.value = pending.value
    selectedError.value = error.value
  }

  watch(
    () => route.query.beneficiaryId,
    async () => {
      if (!route.query.beneficiaryId) {
        if (!familyFileIdentification.value[0]) {
          // eslint-disable-next-line no-console
          console.warn('no beneficiary retrieved')
          return
        }
        await router.replace({
          query: {
            ...route.query,
            beneficiaryId: familyFileIdentification.value[0].id
          }
        })
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
    const navRoute = routes.file.AppFile.path(familyFileId.value, {
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
          await navigateTo(routes.file.AppFile.path(familyFileId.value))
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
    if (familyFileId.value) {
      modal.open(BeneficiaryAddForm, {
        size: 'lg',
        title: 'Ajouter un membre au dossier',
        isSubmitting: isSubmitting.value,
        familyFileId: familyFileId.value,
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
    if (familyFileId.value) {
      const payload = {
        familyFileId: familyFileId.value,
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
            routes.file.AppFile.path(familyFileId.value, { beneficiaryId: id })
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

  const {
    mutate: mutateAppointment,
    status: statusAppointment,
    error
  } = trpcClient.rdvsp.planAppointment.useMutation()
  async function planAppointment(beneficiaryId: string, fromModal = false) {
    matomo.trackEvent(
      EventCategory.Beneficiary,
      BeneficiaryHistoryAction.PlanAppointment
    )

    const url = await mutateAppointment({ beneficiaryId })

    if (!url || error.value) {
      handleAppointmentPlanningFailure(error.value, beneficiaryId, fromModal)
      return
    }
    navigateTo(url, { external: true, open: { target: '_blank' } })
  }

  function handleAppointmentPlanningFailure(
    e: any,
    id: string,
    fromModal: boolean
  ) {
    if (fromModal) {
      modal.close()
      setFocusAfterClose('#action-rdv', 'button')
    }
    if (e.data.code) {
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
    await refreshNuxtData(['file.getFamilyFileMinimalInfo'])
  }
</script>
