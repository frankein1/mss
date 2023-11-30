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
            v-if="error"
            :alert-type="AlertType.Error"
            message="Les informations de votre structure n'ont pas pu être chargées."
          />

          <AtomLoader
            v-if="pending"
            class="fr-mx-auto"
          />
          <StructureForm
            v-if="data"
            :structure="data.structure"
            :optional-types="data.optionalTypes"
            :required-types="data.requiredTypes"
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

  const title = RouteTitle.AppStructureEdit()

  useHead({ title })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)
  const formContainer = ref<HTMLFormElement | null>(null)

  const { data, pending, error } =
    await trpcClient.structure.getCurrentUserStructure.useQuery()

  function onUpdateStructure(updatedStructure: EditCurrentUserStructureInput) {
    useTrpcMutation({
      mutation: () =>
        trpcClient.structure.editCurrentUserStructure.mutate(updatedStructure),
      isSubmitting,
      onSuccess: () => {
        snackbar.success(
          'Les informations de votre structure ont été mises à jour.'
        )
      },
      onFailure: () => {
        snackbar.error(
          'La mise à jour de votre structure a échoué.',
          () => formContainer.value?.querySelector('select')?.focus()
        )
      }
    })
  }
</script>
