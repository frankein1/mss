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
  import { TRPCClientError } from '@trpc/client'
  import { AdminEditStructureInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { AppRouterTRPCClientError } from '~/server/trpc/routers'

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

  function onUpdateStructure(updatedStructure: AdminEditStructureInput) {
    useTrpcMutation({
      mutation: () => trpcClient.admin.editStructure.mutate(updatedStructure),
      isSubmitting,
      onSuccess: res => {
        structure.value = res
        snackbar.success(
          'Les informations de la structure ont été mises à jour.'
        )
      },
      onFailure: err => {
        let errorMessage = 'La mise à jour de votre structure a échoué.'

        if (
          err instanceof TRPCClientError &&
          (err as AppRouterTRPCClientError).data?.code === 'CONFLICT'
        ) {
          errorMessage = `${errorMessage} ${err.message}`
        }

        snackbar.error(
          errorMessage,
          () => formContainer.value?.querySelector('select')?.focus()
        )
      }
    })
  }
</script>
