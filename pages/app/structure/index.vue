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
      <OpenModalHack />

      <SocialSupportSubjects
        :subjects="data.socialSupportSubjects"
        :edit-path="RoutePath.AppStructureSubjects()"
        @refresh="refresh"
      />
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import StructureInfoForm from '~/components/Structure/StructureInfoForm.vue'
  import { EditStructureInfoInput } from '~/server/schema'
  import { RouteTitle, Breadcrumb, RoutePath } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'

  const title = RouteTitle.AppStructure()

  useHead({ title })

  const trpcClient = useTrpcClient()
  const modal = useModal()
  const snackbar = useSnackbar()
  const route = useRoute()

  const isSubmitting = ref(false)

  const { data, pending, error, refresh } =
    await trpcClient.structure.getStructure.useQuery()

  function onEdit() {
    if (!data || !data.value) {
      return
    }

    modal.open(StructureInfoForm, {
      title: 'Modifier les informations de ma structure',
      structure: data.value.structure,
      validate: onUpdateStructureInfo
    })
  }

  if (route.query.modifyStructure === 'true' && data && data.value) {
    console.log(data.value.structure)
    modal.open(StructureInfoForm, {
      title: 'Modifier les informations de ma structure',
      structure: data.value.structure,
      validate: onUpdateStructureInfo,
      triggerOpen: true
    })
  }

  function onUpdateStructureInfo(values: EditStructureInfoInput) {
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
