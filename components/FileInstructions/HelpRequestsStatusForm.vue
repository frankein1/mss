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
  import { FileInstructionPageItem, HelpRequestData } from './types'
  import {
    QuickEditHelpRequestStatusInput,
    quickEditHelpRequestStatusSchema
  } from '~/server/schema'
  import { helpRequestFieldLabels } from '~/client/labels'

  const snackbar = useSnackbar()
  const { socialSupportStatusOptions } = useSocialSupportStatus()

  const props = defineProps<{
    item: FileInstructionPageItem
    helpRequest: HelpRequestData
  }>()

  const emit = defineEmits<{
    updated: [item: FileInstructionPageItem]
  }>()

  const { handleSubmit } = useForm<QuickEditHelpRequestStatusInput>({
    validationSchema: toTypedSchema(quickEditHelpRequestStatusSchema),
    initialValues: {
      id: props.helpRequest.id,
      status: props.item.fileInstruction.socialSupport.status
    }
  })

  const onUpdateStatus = handleSubmit(helpRequest => {
    useTrpcMutation({
      mutation: () =>
        useTrpcClient().helpRequest.quickUpdate.mutate(helpRequest),
      onSuccess: res => {
        snackbar.success("Le statut de l'instruction de dossier a été modifié.")

        const item = props.item
        const socialSupport = item.fileInstruction.socialSupport
        socialSupport.status = res.fileInstruction.socialSupport.status
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
