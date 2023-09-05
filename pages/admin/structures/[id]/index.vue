<template>
  <PageContainer>
    <PageTitle :title="structure?.name || '-'" />
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
            v-else-if="structure"
            :structure="structure"
            :is-submitting="isSubmitting"
            :admin-view="true"
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

  const {
    data: structure,
    pending,
    error
  } = await trpcClient.admin.getStructure.useQuery({
    id: structureId
  })

  async function onUpdateStructure(updatedStructure: AdminEditStructureInput) {
    isSubmitting.value = true
    try {
      const res = await trpcClient.admin.editStructure.mutate(updatedStructure)

      structure.value = res
      snackbar.success('Les informations de la structure ont été mises à jour.')
    } catch {
      snackbar.error(
        'La mise à jour de la structure a échoué.',
        () => formContainer.value?.querySelector('select')?.focus()
      )
    }
    isSubmitting.value = false
  }
</script>
