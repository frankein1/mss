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
      <PageTitle title="Gérer le dossier" />
      <ArchiveChoiceForm
        :beneficiary-identification="beneficiaryIdentification"
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

  const title = routes.beneficiary.AppBeneficiaryArchive.title
  useHead({ title })
  definePageMeta({
    name: routes.beneficiary.AppBeneficiaryArchive.name
  })

  const route = useRoute()
  const snackbar = useSnackbar()
  const modal = useModal()
  const beneficiaryId = route.params.id as string
  type ArchiveFormStatus = 'delete' | 'archive' | 'delay' | null
  const archiveFormStatus = ref<ArchiveFormStatus>(null)
  const downloadReceived = ref<boolean>(false)

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

  const onDownloadArchive = (values: any) => {
    console.log('ARCHIVE!')
    console.log(values)
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
