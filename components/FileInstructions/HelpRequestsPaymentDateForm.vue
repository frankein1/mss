<template>
  <form
    novalidate
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
  import { FileInstructionPageItem, HelpRequestData } from './types'
  import {
    QuickEditHelpRequestPaymentDateInput,
    quickEditHelpRequestPaymentDateSchema
  } from '~/server/schema'
  import { helpRequestFieldLabels } from '~/client/labels'

  const snackbar = useSnackbar()

  const props = defineProps<{
    item: FileInstructionPageItem
    helpRequest: HelpRequestData
  }>()

  const emit = defineEmits<{
    updated: [item: FileInstructionPageItem]
  }>()

  const { handleSubmit, values } =
    useForm<QuickEditHelpRequestPaymentDateInput>({
      validationSchema: toTypedSchema(quickEditHelpRequestPaymentDateSchema),
      initialValues: {
        id: props.helpRequest.id,
        paymentDate: props.helpRequest.paymentDate
      }
    })

  // Date input behave differently as they only change values on blur so the submission is only done once the values change
  watch(values, () => {
    onUpdatePaymentDate()
  })

  const onUpdatePaymentDate = handleSubmit(helpRequest => {
    useTrpcMutation({
      mutation: () =>
        useTrpcClient().helpRequest.quickUpdate.mutate(helpRequest),
      onSuccess: res => {
        snackbar.success(
          "La date de paiement de l'instruction de dossier a été modifié."
        )
        const item = props.item
        const helpRequest = item.fileInstruction.helpRequest
        if (helpRequest) {
          helpRequest.paymentDate = res.paymentDate
          emit('updated', item)
        }
      },
      onFailure: () => {
        snackbar.error(
          "La modification de la date de paiement de l'instruction de dossier a échoué."
        )
      }
    })
  })
</script>
