<template>
  <form
    novalidate
    @change="onUpdateStatus"
    @submit.prevent
  >
    <VeeSelect
      name="status"
      :label="helpRequestFieldLabels.status"
      :options="socialSupportStatusOptions"
      required
      no-label
      labelled-by="status-col"
    />
  </form>
</template>

<script setup lang="ts">
  import { FileInstructionPageItem } from './types'
  import {
    EditFileInstructionStatusInput,
    editFileInstructionStatusSchema
  } from '~/server/schema'
  import { helpRequestFieldLabels } from '~/client/labels'
  import { EventCategory, HistoryQuickEditEventAction } from '~/types/matomo'

  const snackbar = useSnackbar()
  const { socialSupportStatusOptions } = useSocialSupportStatus()

  const props = defineProps<{
    item: FileInstructionPageItem
  }>()

  const emit = defineEmits<{
    updated: [item: FileInstructionPageItem]
  }>()

  const { handleSubmit } = useForm<EditFileInstructionStatusInput>({
    validationSchema: toTypedSchema(editFileInstructionStatusSchema),
    initialValues: {
      id: props.item.fileInstruction.id,
      status: props.item.fileInstruction.socialSupport.status
    }
  })

  const onUpdateStatus = handleSubmit(fileInstruction => {
    useTrpcMutation({
      mutation: () =>
        useTrpcClient().fileInstruction.updateStatus.mutate(fileInstruction),
      onSuccess: res => {
        snackbar.success("Le statut de l'instruction de dossier a été modifié.")

        const item = props.item
        const socialSupport = item.fileInstruction.socialSupport
        socialSupport.status = res.socialSupport.status

        useMatomo().trackEvent(
          EventCategory.HistoryQuickEdit,
          HistoryQuickEditEventAction.FileInstructionStatus
        )

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
