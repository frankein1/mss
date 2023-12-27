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
  import { HelpRequestItem } from './types'
  import {
    QuickEditHelpRequestStatusInput,
    quickEditHelpRequestStatusSchema
  } from '~/server/schema'
  import { helpRequestFieldLabels } from '~/client/labels'

  const snackbar = useSnackbar()
  const { helpRequestStatusOptions } = useHelpRequestStatus()

  const props = defineProps<{
    helpRequest: HelpRequestItem
  }>()

  const emit = defineEmits<{
    updated: [helpRequest: HelpRequestItem]
  }>()

  const { handleSubmit } = useForm<QuickEditHelpRequestStatusInput>({
    validationSchema: toTypedSchema(quickEditHelpRequestStatusSchema),
    initialValues: {
      id: props.helpRequest.id,
      status: props.helpRequest.status
    }
  })

  const onUpdateStatus = handleSubmit(helpRequest => {
    useTrpcMutation({
      mutation: () =>
        useTrpcClient().helpRequest.quickUpdate.mutate(helpRequest),
      onSuccess: updatedHelpRequest => {
        snackbar.success("Le statut de l'instruction de dossier a été modifié.")
        emit('updated', updatedHelpRequest)
      },
      onFailure: () => {
        snackbar.error(
          "La modification du statut de l'instruction de dossier a échoué."
        )
      }
    })
  })
</script>
