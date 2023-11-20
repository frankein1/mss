<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppStructureEdit()" />
    <PageTitle :title="title" />
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
  import { TRPCClientError } from '@trpc/client'
  import { EditCurrentUserStructureInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { RouteTitle, Breadcrumb } from '~/utils/routing'
  import { AppRouterTRPCClientError } from '~/server/trpc/routers'

  const title = RouteTitle.AppStructureEdit()

  useHead({ title })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)
  const formContainer = ref<HTMLFormElement | null>(null)

  const {
    data: structure,
    pending: structurePending,
    error: structureError
  } = await trpcClient.structure.getCurrentUserStructure.useQuery({})

  function onUpdateStructure(updatedStructure: EditCurrentUserStructureInput) {
    useTrpcMutation({
      mutation: () =>
        trpcClient.structure.editCurrentUserStructure.mutate(updatedStructure),
      isSubmitting,
      onSuccess: res => {
        structure.value = res
        snackbar.success(
          'Les informations de votre structure ont été mises à jour.'
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
