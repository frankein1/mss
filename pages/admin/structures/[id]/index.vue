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
        @disable="disableStructure"
      />

      <StructureAdminUsers
        :structure-id="data.structure.id"
        :users="data.users"
      ></StructureAdminUsers>

      <SocialSupportSubjects
        :subjects="data.socialSupportSubjects"
        :edit-path="routes.admin.AdminStructureSubjects.path(structureId)"
        @refresh="refresh"
      />
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import StructureAdminInfoForm from '~/components/Structure/StructureAdminInfoForm.vue'
  import { CreateStructureInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import StructureDisableAlert from '~/components/Structure/StructureDisableAlert.vue'
  import { routes } from '~/utils/routes'

  const title = routes.structure.AppStructure.title

  useHead({ title })

  const route = useRoute()
  const trpcClient = useTrpcClient()
  const modal = useModal()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)

  const structureId = route.params.id as string

  const { data, pending, error, refresh } =
    await trpcClient.admin.getStructure.useQuery({ id: structureId })

  function disableStructure() {
    if (!data || !data.value) {
      return
    }

    modal.open(StructureDisableAlert, {
      title: 'Désactiver une structure',
      structure: data.value.structure,
      finish: onDisable,
      cancel: onCancel
    })
  }

  function onCancel() {
    modal.close()
  }

  function onDisable(id: string) {
    useTrpcMutation({
      isSubmitting,
      mutation: () => trpcClient.admin.disableStructure.mutate({ id }),
      onSuccess: () => {
        modal.close()
        snackbar.success('Structure désactivé')
        navigateTo(routes.admin.AdminStructures.path())
      },
      onFailure: () => {
        snackbar.error('La désactivation a échoué')
      }
    })
  }

  function editAdminInfo() {
    if (!data || !data.value) {
      return
    }

    modal.open(StructureAdminInfoForm, {
      title: 'Modifier les informations de ma structure',
      structure: data.value.structure,
      validate: updateInfo
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
