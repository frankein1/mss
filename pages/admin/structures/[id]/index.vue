<template>
  <PageContainer>
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
      <StructureAdminInfo
        class="fr-mb-5w"
        :structure="data.structure"
        @edit="editAdminInfo"
      />

      <SocialSupportSubjects
        :subjects="data.socialSupportSubjects"
        @refresh="refresh"
      />
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import StructureAdminInfoForm from '~/components/Structure/StructureAdminInfoForm.vue'
  import { EditStructureAdminInfoInput } from '~/server/schema'
  import { RouteTitle } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'

  const title = RouteTitle.AppStructure()

  useHead({ title })

  const route = useRoute()
  const trpcClient = useTrpcClient()
  const modal = useModal()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)

  const structureId = route.params.id as string

  const { data, pending, error, refresh } =
    await trpcClient.admin.getStructure.useQuery({ id: structureId })

  function editAdminInfo() {
    if (!data || !data.value) {
      return
    }

    modal.open({
      title: 'Modifier les informations de ma structure',
      contentComponent: StructureAdminInfoForm,
      contentComponentProps: { structure: data.value.structure },
      contentComponentEvents: { updateStructureInfo: updateInfo }
    })
  }

  function updateInfo(values: EditStructureAdminInfoInput) {
    useTrpcMutation({
      mutation: () => trpcClient.admin.updateStructureInfo.mutate(values),
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
