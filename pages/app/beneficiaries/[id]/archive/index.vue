<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <PageContainer
    v-else
    class="max-width"
  >
    <AtomBreadcrumb
      v-if="familyFileId && familyIdentification"
      :links="
        breadcrumbs.beneficiary.AppBeneficiaryArchive(
          beneficiaryIdentification,
          familyFileId,
          familyIdentification
        )
      "
    />
    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="Le dossier n'a pas pu être chargé."
    />
    <template v-if="beneficiary?.id && beneficiaryIdentification">
      <PageTitle
        :title="pageTitle"
        icon="fr-icon-folder-2-line"
      />
      <p class="fr-text--bold fr-mb-1w">
        Agent(s) référent(s)&nbsp;: {{ referentNames }}
      </p>
      <BeneficiaryStatusBadge
        class="fr-mb-4v"
        :status="beneficiary.status"
      />

      <template v-if="socialSupportSubjects.length > 0">
        <hr class="fr-mt-4v" />
        <p class="fr-text--bold fr-mb-1w">Accompagnements&nbsp;:</p>
        <ul class="fr-tags-group">
          <li
            v-for="subject in socialSupportSubjects.slice(
              0,
              maxSocialSupportSubjects
            )"
            :key="subject.id"
          >
            <p class="fr-tag fr-mb-0">{{ subject.name }}</p>
          </li>
          <li v-if="socialSupportSubjects.length > maxSocialSupportSubjects">
            <button
              type="button"
              class="fr-tag"
              @click="maxSocialSupportSubjects = socialSupportSubjects.length"
            >
              Voir plus
            </button>
          </li>
        </ul>
      </template>

      <p class="fr-mt-4w"><RequiredFields /></p>
      <ArchiveChoiceForm
        :pending="downloadPending"
        :archive-due-date-history="archiveDueDateHistory"
        :archive-permission="archivePermission"
        :delete-permission="deletepermission"
        :delay-permission="!downloadReceived"
        @change-value="changeStatus($event)"
        @delay-archive="openDelayModal"
      />
      <div ref="deleteSection">
        <ArchiveDelete
          v-if="archiveFormStatus == 'delete'"
          class="fr-mt-4w"
          @delete-file="openDeleteModal()"
        />
      </div>
      <div ref="archiveSection">
        <ArchiveForm
          v-if="archiveFormStatus == 'archive'"
          class="fr-mt-4w"
          :download-received="downloadReceived"
          :beneficiary-id="beneficiaryId"
          :pending="downloadPending"
          @download-archive="onDownloadArchive"
          @delete-file="openArchiveDeleteModal"
        />
      </div>
    </template>
    <OpenModalHack />
  </PageContainer>
</template>

<script lang="ts" setup>
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { routes } from '~/utils/routes'
  import { AlertType } from '~/utils/constants/alert'
  import ArchiveDelayModal from '~/components/Archive/ArchiveDelayModal.vue'
  import ArchiveDeleteModal from '~/components/Archive/ArchiveDeleteModal.vue'
  import DeleteModal from '~/components/Archive/DeleteModal.vue'
  import ArchiveQuitPageModal from '~/components/Archive/ArchiveQuitPageModal.vue'
  import type { ExportBeneficiaryInput } from '~/server/schema/beneficiary/exportbeneficiary.schema'
  import { BeneficiaryArchiveAction, EventCategory } from '~/types/matomo'
  import { formatUserDisplayName } from '~/utils/user'

  const title = routes.beneficiary.AppBeneficiaryArchive.title
  useHead({ title })
  definePageMeta({
    name: routes.beneficiary.AppBeneficiaryArchive.name
  })

  const trpcClient = useTrpcClient()
  const route = useRoute()
  const snackbar = useSnackbar()
  const modal = useModal()
  const matomo = useMatomo()
  const beneficiaryId = route.params.id as string
  const archiveFormStatus = ref<ArchiveFormStatus>(null)
  const downloadReceived = ref<boolean>(false)
  const downloadPending = ref<boolean>(false)
  const deleteSection = ref<HTMLElement | null>(null)
  const archiveSection = ref<HTMLElement | null>(null)
  const exportBeneficiaryInput = ref<ExportBeneficiaryInput | null>(null)
  const maxSocialSupportSubjects = ref(10)

  type ArchiveFormStatus = 'delete' | 'archive' | 'delay' | null

  const {
    beneficiary,
    beneficiaryIdentification,
    familyIdentification,
    pending,
    permissions,
    error
  } = await useBeneficiaryDetails(beneficiaryId)

  const { data: archivePermissionData } =
    await trpcClient.beneficiary.getBeneficiaryArchivePermission.useQuery({
      id: beneficiaryId
    })
  const archivePermission = computed(
    () => archivePermissionData?.value?.archive
  )

  const deletepermission: ComputedRef<boolean> = computed(
    () => permissions.value?.delete || false
  )
  const familyFileId: ComputedRef<string | null> = computed(
    () => beneficiary?.value?.familyFileId || null
  )
  const socialSupportSubjects = computed(
    () => beneficiary.value?.history.subjects || []
  )

  const beneficiaryName = computed(() => {
    if (!beneficiary.value) {
      return '[inconnu]'
    }
    return formatBeneficiaryName({
      firstName: beneficiary.value.general.firstName,
      usualName: beneficiary.value.general.usualName,
      title: null
    })
  })
  const referentNames = computed(() => {
    if (!beneficiary?.value) {
      return ''
    }
    return beneficiary.value.referents
      .map(referent => formatUserDisplayName(referent))
      .join(', ')
  })
  const archiveDueDateHistory = computed(() => {
    const history = beneficiary?.value?.archiveDueDateHistory || []
    return history.length
  })

  const pageTitle = computed(() => {
    if (beneficiary.value) {
      return 'Gérer le dossier de ' + beneficiaryName.value
    }
    return 'Gérer le dossier'
  })

  // Form actions
  const changeStatus = (value: string) => {
    archiveFormStatus.value = value as ArchiveFormStatus
    if (archiveFormStatus.value === 'delete') {
      setTimeout(() => {
        deleteSection?.value?.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        })
      }, 100)
    } else if (archiveFormStatus.value === 'archive') {
      setTimeout(() => {
        archiveSection?.value?.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        })
      }, 100)
    }
  }
  const resetValues = () => {
    downloadReceived.value = false
    exportBeneficiaryInput.value = null
  }

  // User actions
  const deletFile = (beneficiaryId: string) => {
    useTrpcMutation({
      mutation: () => {
        matomo.trackEvent(
          EventCategory.BeneficiaryArchive,
          BeneficiaryArchiveAction.DeleteWithoutArchive
        )
        return useTrpcClient().beneficiary.delete.mutate({
          id: beneficiaryId
        })
      },
      onSuccess: () => {
        snackbar.success('Le dossier a bien été supprimé de Mon Suivi Social.')
        resetValues()
        modal.close() // ferme toutes les modales
        navigateTo(routes.user.AppOverview.path({ filter: 'archivage' }))
      },
      onFailure: () => {
        modal.close()
        snackbar.error(
          'Une erreur est apparu lors de la suppression de ce bénéficiaire.'
        )
      }
    })
  }

  const archiveAndDeleteFile = async (values: ExportBeneficiaryInput) => {
    if (archivePermission.value) {
      try {
        matomo.trackEvent(
          EventCategory.BeneficiaryArchive,
          values.keepName
            ? BeneficiaryArchiveAction.DeleteWithArchiveAndKeepName
            : BeneficiaryArchiveAction.DeleteWithArchive
        )
        await trpcClient.beneficiary.archiveBeneficiary.query(values)
        snackbar.success('Le dossier a bien été supprimé de Mon Suivi Social.')
        resetValues()
        modal.close() // ferme toutes les modales
        navigateTo(routes.user.AppOverview.path({ filter: 'archivage' }))
      } catch {
        modal.close() // ferme toutes les modales
        snackbar.error(
          'Une erreur est apparu lors de la suppression de ce bénéficiaire.'
        )
      }
    } else {
      snackbar.error("Vous n'avez pas le droit de supprimer ce dossier.")
    }
  }

  const onDownloadArchive = async (values: ExportBeneficiaryInput) => {
    downloadPending.value = true
    try {
      await downloadArchive(values)
      downloadReceived.value = true
      exportBeneficiaryInput.value = values
    } catch (error) {
      snackbar.error("L'export de l'archive a échoué.")
      throw error
    } finally {
      downloadPending.value = false
    }
  }

  const downloadArchive = async (values: ExportBeneficiaryInput) => {
    matomo.trackEvent(
      EventCategory.BeneficiaryArchive,
      BeneficiaryArchiveAction.ExportArchive
    )
    const response =
      await trpcClient.beneficiary.exportBeneficiary.query(values)
    if (!response?.archiveFile) {
      throw new Error('no data')
    }
    const downloadLink = document.createElement('a')
    downloadLink.href = response.archiveFile
    const date = new Date()
    downloadLink.download = `Archive ${beneficiaryName.value} ${date.toLocaleDateString()} Mon-Suivi-Social.zip`
    downloadLink.click()
    downloadLink.remove()
  }

  const router = trpcClient.beneficiary
  const updateBeneficiary = router.updateArchiveDate.useMutation()

  const onDelayArchive = () => {
    matomo.trackEvent(
      EventCategory.BeneficiaryArchive,
      BeneficiaryArchiveAction.DelayArchive
    )
    useTrpcMutation({
      mutation: () =>
        updateBeneficiary.mutate({
          id: beneficiaryId
        }),
      onSuccess: () => {
        snackbar.success(
          'Votre demande de conservation a bien été prise en compte.'
        )
        modal.close() // ferme toute les modales
        navigateTo(routes.user.AppOverview.path({ filter: 'archivage' }))
      },
      onFailure: () => {
        snackbar.error("Impossible de modifier la date d'archivage.")
      }
    })
  }

  // modales
  const openDelayModal = () => {
    modal.open(ArchiveDelayModal, {
      triggerOpen: true,
      title: 'Conserver le dossier 1 an supplémentaire',
      validate: () => onDelayArchive()
    })
  }

  const openDeleteModal = () => {
    modal.open(DeleteModal, {
      triggerOpen: true,
      title: 'Attention, toute suppression est définitive',
      validate: () => {
        deletFile(beneficiaryId)
        modal.close()
      }
    })
  }
  const openArchiveDeleteModal = (values: ExportBeneficiaryInput) => {
    modal.open(ArchiveDeleteModal, {
      triggerOpen: true,
      title:
        'Vérifiez que le téléchargement a bien fonctionné et que le dossier est complet avant de le supprimer',
      validate: () => {
        archiveAndDeleteFile(values)
        modal.close()
      }
    })
  }

  const openQuitPageModal = () => {
    modal.open(ArchiveQuitPageModal, {
      triggerOpen: true,
      title:
        'Attention, vous devez supprimer le bénéficiaire après avoir téléchargé son dossier',
      validate: () =>
        exportBeneficiaryInput.value
          ? archiveAndDeleteFile(exportBeneficiaryInput.value)
          : null
    })
  }

  onBeforeRouteLeave((_, __, next) => {
    if (!downloadReceived.value || !exportBeneficiaryInput.value) {
      return next()
    }
    openQuitPageModal()
  })
</script>

<style lang="scss" scoped>
  .max-width {
    max-width: 792px;
  }
</style>
