<template>
  <AtomLazyComponent
    :error="Boolean(error)"
    message="Les informations de votre stucture n'ont pas pu être chargées."
    :pending="status === 'pending'"
  >
    <StructureInfo
      v-if="data"
      class="fr-mb-5w"
      :structure="data.structure"
      @edit="onEdit"
    />
  </AtomLazyComponent>
</template>

<script lang="ts" setup>
  import StructureInfoForm from '~/components/Structure/StructureInfoForm.vue'
  import type { EditStructureInfoInput } from '~~/server/schema'

  const trpcClient = useTrpcClient()
  const modal = useModal()
  const snackbar = useSnackbar()
  const isSubmitting = ref(false)

  const { data, error, status, refresh } =
    await trpcClient.structure.getStructure.useQuery()

  function onEdit() {
    if (!data || !data.value) {
      return
    }

    modal.open(StructureInfoForm, {
      title: 'Modifier les informations de ma structure',
      structure: data.value.structure,
      validate: onUpdateStructureInfo
    })
  }

  function onUpdateStructureInfo(values: EditStructureInfoInput) {
    useTrpcMutation({
      mutation: () => trpcClient.structure.updateStructureInfo.mutate(values),
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
