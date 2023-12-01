<template>
  <form
    novalidate
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

  const onUpdatePaymentDate = handleSubmit(helpRequest => {
    useTrpcMutation({
      mutation: () =>
        useTrpcClient().helpRequest.quickUpdate.mutate(helpRequest),
      onSuccess: updatedHelpRequest => {
        snackbar.success(
          "La date de paiement de l'instruction de dossier a été modifié."
        )
        emit('updated', updatedHelpRequest)
      },
      onFailure: () => {
        snackbar.error(
          "La modification de la date de paiement de l'instruction de dossier a échoué."
        )
      }
    })
  })
</script>
