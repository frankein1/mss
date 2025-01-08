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
        @change-value="changeStatus($event)"
        @delay-archive="openDelayModal"
      />
      <ArchiveDelete
        v-if="archiveFormStatus == 'delete' && deletpermission"
        class="fr-mt-4w"
        @delete-file="deleteFile"
      />
      <ArchiveForm
        v-if="archiveFormStatus == 'archive'"
        class="fr-mt-4w"
        :download-received="downloadReceived"
        :beneficiary-id="beneficiaryId"
        @download-archive="onDownloadArchive"
        @delete-file="openDeleteModal"
      />
      <OpenModalHack />
    </template>
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
  const trpcClient = useTrpcClient()
  type ArchiveFormStatus = 'delete' | 'archive' | 'delay' | null

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
  const pageTitle = computed(() => {
    if (beneficiary.value) {
      return (
        'Gérer le dossier de ' +
        formatBeneficiaryName(beneficiary.value.general)
      )
    }
    return 'Gérer le dossier'
  })

  const changeStatus = (value: string) => {
    archiveFormStatus.value = value as ArchiveFormStatus
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

  // TODO: au pending, afficher un loader dans le bouton de téléchargement
  // + try catch + mettre le  dans finally
  const onDownloadArchive = async (values: ExportBeneficiaryInput) => {
    const response =
      await trpcClient.beneficiary.exportBeneficiary.query(values)
    console.log(response.beneficiaryDetails)
    if (!response?.archiveFile) {
      throw new Error('no data')
    }
    const downloadLink = document.createElement('a')
    downloadLink.href = response.archiveFile
    downloadLink.download = 'archiveFile.zip'
    downloadLink.click()
    downloadLink.remove()
    downloadReceived.value = true
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
