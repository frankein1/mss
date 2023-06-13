<template>
  <PageContainer>
    <PageBreadcrumb :links="Breadcrumb.StructureEdit()" />
    <PageTitle :title="RouteTitle.StructureEdit()" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main
          ref="formContainer"
          class="main-container fr-p-5w"
        >
          <AtomAlert
            v-if="structureError"
            :alert-type="AlertType.Error"
            message="Les informations de votre structure n'ont pas pu être chargées."
          />

          <AtomLoader
            v-if="structurePending"
            class="fr-mx-auto"
          />
          <StructureForm
            v-else-if="structure"
            :structure="structure"
            :is-submitting="isSubmitting"
            @update-structure="onUpdateStructure"
          />

          <!-- TODO: Add mutation logs -->
          <!-- <HistoryItem
            :id="organisationId"
            class="fr-mt-4w"
          /> -->
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { EditCurrentUserStructureInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { RouteTitle, Breadcrumb } from '~/utils/routing'

  // TODO
  // definePageMeta({ middleware: 'can-edit-organisation' })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)
  const formContainer = ref<HTMLFormElement | null>(null)

  const {
    data: structure,
    pending: structurePending,
    error: structureError
  } = trpcClient.structure.getCurrentUserStructure.useQuery()

  async function onUpdateStructure(
    updatedStructure: EditCurrentUserStructureInput
  ) {
    isSubmitting.value = true
    try {
      const res = await trpcClient.structure.editCurrentUserStructure.mutate(
        updatedStructure
      )

      structure.value = res
      snackbar.success(
        'Les informations de votre structure ont été mises à jour.'
      )
    } catch {
      snackbar.error('La mise à jour de votre structure a échoué.', () =>
        formContainer.value?.querySelector('select')?.focus()
      )
    }
    isSubmitting.value = false
  }
</script>
