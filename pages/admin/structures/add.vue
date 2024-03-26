<template>
  <PageContainer>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main
          ref="formContainer"
          class="main-container fr-p-5w"
        >
          <StructureCreationForm
            :is-submitting="isSubmitting"
            @add-structure="onAddStructure"
          />
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { CreateStructureInput } from '~/server/schema'
  import { RoutePath } from '~/utils/routing'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)
  const formContainer = ref<HTMLFormElement | null>(null)

  function onAddStructure(structure: CreateStructureInput) {
    useTrpcMutation({
      mutation: () => trpcClient.admin.createStructure.mutate(structure),
      isSubmitting,
      onSuccess: () => {
        snackbar.success('La structure a été ajoutée.')
        navigateTo(RoutePath.AdminStructures())
      },
      onFailure: () => {
        snackbar.error("L'ajout de la structure a échoué.", () =>
          formContainer.value?.querySelector('select')?.focus()
        )
      }
    })
  }
</script>
