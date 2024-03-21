<template>
  <PageContainer>
    <PageTitle :title="data?.structure?.name || '-'" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main
          ref="formContainer"
          class="main-container fr-p-5w"
        >
          <AtomAlert
            v-if="error"
            :alert-type="AlertType.Error"
            message="Les informations de la structure n'ont pas pu être chargées."
          />

          <AtomLoader
            v-if="pending"
            class="fr-mx-auto"
          />
          <StructureForm
            v-else-if="data"
            :structure="data.structure"
            :users="data.users"
            :is-submitting="isSubmitting"
            @update-structure="onUpdateStructure"
          />
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { AdminEditStructureInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'

  const route = useRoute()
  const structureId = route.params.id as string
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)
  const formContainer = ref<HTMLFormElement | null>(null)

  const { data, pending, error, refresh } =
    await trpcClient.admin.getStructure.useQuery({
      id: structureId
    })

  function onUpdateStructure(updatedStructure: AdminEditStructureInput) {
    useTrpcMutation({
      mutation: () => trpcClient.admin.editStructure.mutate(updatedStructure),
      isSubmitting,
      onSuccess: () => {
        refresh()
        snackbar.success(
          'Les informations de la structure ont été mises à jour.'
        )
      },
      onFailure: () => {
        snackbar.error('La mise à jour de la structure a échoué.', () =>
          formContainer.value?.querySelector('select')?.focus()
        )
      }
    })
  }
</script>
