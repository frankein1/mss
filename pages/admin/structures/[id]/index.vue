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

      <StructureAdminUsers
        :structure-id="data.structure.id"
        :users="data.users"
      ></StructureAdminUsers>

      <SocialSupportSubjects
        :subjects="data.socialSupportSubjects"
        :edit-path="RoutePath.AdminStructureSubjects(structureId)"
        @refresh="refresh"
      />
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import StructureAdminInfoForm from '~/components/Structure/StructureAdminInfoForm.vue'
  import { CreateStructureInput } from '~/server/schema'
  import { RoutePath, RouteTitle } from '~/utils/routing'
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
      contentComponentEvents: { validate: updateInfo }
    })
  }

  function updateInfo(values: CreateStructureInput) {
    useTrpcMutation({
      mutation: () =>
        trpcClient.admin.updateStructureInfo.mutate({
          id: structureId,
          ...values
        }),
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
