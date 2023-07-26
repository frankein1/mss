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
    QuickEditHelpRequestPaymentDateInput,
    quickEditHelpRequestPaymentDateSchema
  } from '~/server/schema'
  import { helpRequestFieldLabels } from '~/client/labels'

  const snackbar = useSnackbar()

  const props = defineProps<{
    helpRequest: HelpRequestItem
  }>()

  const emit = defineEmits<{
    updated: [helpRequest: HelpRequestItem]
  }>()

  const { handleSubmit } = useForm<QuickEditHelpRequestPaymentDateInput>({
    validationSchema: toTypedSchema(quickEditHelpRequestPaymentDateSchema),
    initialValues: {
      id: props.helpRequest.id,
      paymentDate: props.helpRequest.paymentDate
    }
  })

  const onUpdatePaymentDate = handleSubmit(async helpRequest => {
    try {
      const updatedHelpRequest =
        await useTrpcClient().helpRequest.quickUpdate.mutate(helpRequest)

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
