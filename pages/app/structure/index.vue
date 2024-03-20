<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppStructure()" />

    <PageTitle :title="title" />

    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />

    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les informations de votre structure n'ont pas pu être chargées."
    />

    <div v-else-if="data">
      <StructureInfo
        class="fr-mb-5w"
        :structure="data.structure"
        @edit="onEdit"
      />

      <SocialSupportSubjects
        :subjects="data.socialSupportSubjects"
        :structure-id="data.structure.id"
        :can-edit="application.edit.structure"
        @refresh="refresh"
      />
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import StructureInfoForm from '~/components/Structure/StructureInfoForm.vue'
  import { EditCurrentUserStructureInfoInput } from '~/server/schema'
  import { RouteTitle, Breadcrumb } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'

  const title = RouteTitle.AppStructure()

  useHead({ title })

  const trpcClient = useTrpcClient()
  const modal = useModal()
  const snackbar = useSnackbar()
  const { application } = usePermissions()

  const isSubmitting = ref(false)

  const { data, pending, error, refresh } =
    await trpcClient.structure.getStructure.useQuery()

  function onEdit() {
    if (!data || !data.value) {
      return
    }

    modal.open({
      title: 'Modifier les informations de ma structure',
      contentComponent: StructureInfoForm,
      contentComponentProps: { structure: data.value.structure },
      contentComponentEvents: { updateStructureInfo: onUpdateStructureInfo }
    })
  }

  function onUpdateStructureInfo(values: EditCurrentUserStructureInfoInput) {
    useTrpcMutation({
      mutation: () => trpcClient.structure.updateStructureInfo.mutate(values),
      isSubmitting,
      onSuccess: () => {
        modal.close()
        refresh()
        snackbar.success(
          'Les informations de votre structure ont été mises à jour.'
        )
      },
      onFailure: () => {
        snackbar.error(
          'La modification des informations de votre structure a échoué.'
        )
      }
    })
  }
</script>
