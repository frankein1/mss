<template>
  <form
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
      :disabled-options="pastStatuses"
    />
  </form>
</template>

<script setup lang="ts">
  import { HelpRequestItem } from './types'
  import {
    QuickEditHelpRequestStatusInput,
    quickEditHelpRequestStatusSchema
  } from '~/server/schema'
  import { pastStatusesFromStatus } from '~/utils/helpRequest'
  import { helpRequestFieldLabels } from '~/client/labels'

  const snackbar = useSnackbar()
  const { helpRequestStatusOptions } = useHelpRequestStatus()

  const props = defineProps<{
    helpRequest: HelpRequestItem
  }>()

  const emit = defineEmits<{
    (e: 'updated', helpRequest: HelpRequestItem): void
  }>()

  const { handleSubmit } = useForm<QuickEditHelpRequestStatusInput>({
    validationSchema: toTypedSchema(quickEditHelpRequestStatusSchema),
    initialValues: {
      id: props.helpRequest.id,
      status: props.helpRequest.status
    }
  })

  const pastStatuses = computed(() =>
    pastStatusesFromStatus(props.helpRequest.status)
  )

  const onUpdateStatus = handleSubmit(async helpRequest => {
    try {
      const updatedHelpRequest =
        await useTrpcClient().helpRequest.quickUpdate.mutate(helpRequest)

      snackbar.success(
        "Le statut de l'instruction de demande d'aide a été modifié."
      )
      emit('updated', updatedHelpRequest)
    } catch {
      snackbar.error(
        "La modification du statut de l'instruction de demande d'aide a échoué."
      )
    }
  })
</script>
