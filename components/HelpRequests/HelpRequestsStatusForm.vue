<template>
  <form
    novalidate
    @change="onUpdateStatus"
    @submit.prevent
  >
    <VeeSelect
      name="status"
      :label="helpRequestFieldLabels.status"
      :options="helpRequestStatusOptions"
      required
      no-label
      labelled-by="status-col"
    />
  </form>
</template>

<script setup lang="ts">
  import { HelpRequestPageItem } from './types'
  import {
    QuickEditHelpRequestStatusInput,
    quickEditHelpRequestStatusSchema
  } from '~/server/schema'
  import { helpRequestFieldLabels } from '~/client/labels'

  const snackbar = useSnackbar()
  const { helpRequestStatusOptions } = useHelpRequestStatus()

  const props = defineProps<{
    item: HelpRequestPageItem
  }>()

  const emit = defineEmits<{
    updated: [item: HelpRequestPageItem]
  }>()

  const { handleSubmit } = useForm<QuickEditHelpRequestStatusInput>({
    validationSchema: toTypedSchema(quickEditHelpRequestStatusSchema),
    initialValues: {
      id: props.item.helpRequest.id,
      status: props.item.helpRequest.status
    }
  })

  const onUpdateStatus = handleSubmit(helpRequest => {
    useTrpcMutation({
      mutation: () =>
        useTrpcClient().helpRequest.updatePageItem.mutate(helpRequest),
      onSuccess: item => {
        snackbar.success("Le statut de l'instruction de dossier a été modifié.")
        emit('updated', item)
      },
      onFailure: () => {
        snackbar.error(
          "La modification du statut de l'instruction de dossier a échoué."
        )
      }
    })
  })
</script>
