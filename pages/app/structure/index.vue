<template>
  <PageContainer no-max-width>
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

    <StructureConfigurationInfoHeader
      v-else-if="data"
      :structure="data.structure"
      @edit="onEdit"
    />
  </PageContainer>
</template>

<script lang="ts" setup>
  import StructureConfigurationInfoForm from '~/components/StructureConfiguration/StructureConfigurationInfoForm.vue'
  import { EditCurrentUserStructureInfoInput } from '~/server/schema'
  import { RouteTitle, Breadcrumb } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'

  const title = RouteTitle.AppStructure()

  useHead({ title })

  const trpcClient = useTrpcClient()
  const modal = useModal()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)

  const { data, pending, error, refresh } =
    await trpcClient.structure.getCurrentUserStructure.useQuery()

  function onEdit() {
    if (!data || !data.value) {
      return
    }

    modal.open({
      title: 'Modifier les informations de ma structure',
      contentComponent: StructureConfigurationInfoForm,
      contentComponentProps: { structure: data.value.structure },
      contentComponentEvents: { updateStructureInfo: onUpdateStructureInfo }
    })
  }

  function onUpdateStructureInfo(values: EditCurrentUserStructureInfoInput) {
    useTrpcMutation({
      mutation: () =>
        trpcClient.structure.editCurrentUserStructureInfo.mutate(values),
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
