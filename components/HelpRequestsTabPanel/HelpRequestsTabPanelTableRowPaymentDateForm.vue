<template>
  <form
    @change="onUpdatePaymentDate"
    @submit.prevent
  >
    <VeeInput
      name="paymentDate"
      :label="helpRequestFieldLabels.paymentDate"
      type="date"
      no-label
      labelled-by="payment-date-col"
    />
  </form>
</template>

<script setup lang="ts">
  import { HelpRequestItem } from './types'
  import {
    EditHelpRequestPaymentDateInput,
    editHelpRequestPaymentDateSchema
  } from '~/server/schema'
  import { helpRequestFieldLabels } from '~/client/labels'

  const snackbar = useSnackbar()

  const props = defineProps<{
    helpRequest: HelpRequestItem
  }>()

  const emit = defineEmits<{
    (e: 'updated', helpRequest: HelpRequestItem): void
  }>()

  const { handleSubmit } = useForm<EditHelpRequestPaymentDateInput>({
    validationSchema: toTypedSchema(editHelpRequestPaymentDateSchema),
    initialValues: {
      id: props.helpRequest.id,
      paymentDate: props.helpRequest.paymentDate
    }
  })

  const onUpdatePaymentDate = handleSubmit(async helpRequest => {
    try {
      const updatedHelpRequest =
        await useTrpcClient().helpRequest.update.mutate(helpRequest)

      snackbar.success(
        "La date de paiement de l'instruction de demande d'aide a été modifié."
      )
      emit('updated', updatedHelpRequest)
    } catch {
      snackbar.error(
        "La modification de la date de paiement de l'instruction de demande d'aide a échoué."
      )
    }
  })
</script>
