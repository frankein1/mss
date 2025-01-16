<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <PageContainer
    v-else
    class="max-width"
  >
    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="Le dossier n'a pas pu être chargé."
    />
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
    <template v-if="beneficiary?.id && beneficiaryIdentification">
      <PageTitle
        :title="pageTitle"
        icon="fr-icon-folder-2-line"
      />
      <RequiredFields />
      <ArchiveChoiceForm
        :permissions="permissions"
        :pending="downloadPending"
        @change-value="changeStatus($event)"
        @delay-archive="openDelayModal"
      />
      <section ref="deleteSection">
        <ArchiveDelete
          v-if="archiveFormStatus == 'delete' && deletpermission"
          class="fr-mt-4w"
          @delete-file="deleteFile"
        />
      </section>
      <section ref="archiveSection">
        <ArchiveForm
          v-if="archiveFormStatus == 'archive'"
          class="fr-mt-4w"
          :download-received="downloadReceived"
          :beneficiary-id="beneficiaryId"
          :pending="downloadPending"
          @download-archive="onDownloadArchive"
          @delete-file="openDeleteModal"
        />
      </section>
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
  import ArchiveQuitPageModal from '~/components/Archive/ArchiveQuitPageModal.vue'
  import { ExportBeneficiaryInput } from '~/server/schema/beneficiary/exportbeneficiary.schema'

  const title = routes.beneficiary.AppBeneficiaryArchive.title
  useHead({ title })
  definePageMeta({
    name: routes.beneficiary.AppBeneficiaryArchive.name
  })

  const route = useRoute()
  const snackbar = useSnackbar()
  const modal = useModal()
  const beneficiaryId = route.params.id as string
  const archiveFormStatus = ref<ArchiveFormStatus>(null)
  const downloadReceived = ref<boolean>(false)
  const downloadPending = ref<boolean>(false)
  const trpcClient = useTrpcClient()
  type ArchiveFormStatus = 'delete' | 'archive' | 'delay' | null
  const deleteSection = ref<HTMLElement | null>(null)
  const archiveSection = ref<HTMLElement | null>(null)

  const {
    beneficiary,
    permissions,
    beneficiaryIdentification,
    familyIdentification,
    pending,
    error
  } = await useBeneficiaryDetails(beneficiaryId)

  const familyFileId: ComputedRef<string | null> = computed(
    () => beneficiary?.value?.familyFileId || null
  )
  const deletpermission: ComputedRef<boolean> = computed(
    () => permissions.value?.delete || false
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

  const pageTitle = computed(() => {
    if (beneficiary.value) {
      return 'Gérer le dossier de ' + beneficiaryName.value
    }
    return 'Gérer le dossier'
  })

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

  const deleteFile = () => {
    if (permissions.value?.delete) {
      // TODO api request
      console.log('DELETE!')
      snackbar.success('Le dossier a bien été supprimé de Mon Suivi Social.')
      navigateTo(routes.user.AppOverview.path())
    } else {
      snackbar.error("Vous n'avez pas le droit de supprimer ce dossier.")
    }
  }

  const onDownloadArchive = async (values: ExportBeneficiaryInput) => {
    downloadPending.value = true
    try {
      const response =
        await trpcClient.beneficiary.exportBeneficiary.query(values)
      if (!response?.archiveFile) {
        throw new Error('no data')
      }
      const archiveFile = response.archiveFile
      const downloadLink = document.createElement('a')
      downloadLink.href = archiveFile
      const date = new Date()
      downloadLink.download = `Archive_dossier_${beneficiaryName.value}_${date.toISOString()}.zip`
      downloadLink.click()
      downloadLink.remove()
      downloadReceived.value = true
    } catch (error) {
      snackbar.error("L'export de l'archive à échoué.")
      throw error
    } finally {
      downloadPending.value = false
    }
  }

  const onDelayArchive = () => {
    console.log('DELAY!')
  }

  const openDelayModal = () => {
    modal.open(ArchiveDelayModal, {
      triggerOpen: true,
      title: 'Conserver le dossier 1 an supplémentaire',
      validate: () => onDelayArchive()
    })
  }

  const openDeleteModal = () => {
    modal.open(ArchiveDeleteModal, {
      triggerOpen: true,
      title:
        'Vérifiez que le téléchargement a bien fonctionné et que le dossier est complet avant de le supprimer',
      validate: () => deleteFile()
    })
  }

  const openQuitPageModal = () => {
    modal.open(ArchiveQuitPageModal, {
      triggerOpen: true,
      title:
        'Attention, vous devez supprimer le bénéficiaire après avoir téléchargé son dossier',
      validate: () => deleteFile()
    })
  }

  onBeforeRouteLeave((_, __, next) => {
    if (!downloadReceived.value) {
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
