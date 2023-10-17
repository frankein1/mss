<template>
  <form
    novalidate
    @change="onUpdatePaymentMethod"
    @submit.prevent
  >
    <VeeSelect
      name="paymentMethod"
      :label="helpRequestFieldLabels.paymentMethod"
      :options="withEmptyValue(paymentMethodOptions)"
      no-label
      labelled-by="payment-method-col"
    />
  </form>
</template>

<script setup lang="ts">
  import { HelpRequestItem } from './types'
  import { paymentMethodOptions } from '~/client/options/helpRequest'
  import {
    QuickEditHelpRequestPaymentMethodInput,
    quickEditHelpRequestPaymentMethodSchema
  } from '~/server/schema'
  import { helpRequestFieldLabels } from '~/client/labels'
  import { withEmptyValue } from '~/utils/options'

  const snackbar = useSnackbar()

  const props = defineProps<{
    helpRequest: HelpRequestItem
  }>()

  const emit = defineEmits<{
    updated: [helpRequest: HelpRequestItem]
  }>()

  const { handleSubmit } = useForm<QuickEditHelpRequestPaymentMethodInput>({
    validationSchema: toTypedSchema(quickEditHelpRequestPaymentMethodSchema),
    initialValues: {
      id: props.helpRequest.id,
      paymentMethod: props.helpRequest.paymentMethod
    }
  })

  const onUpdatePaymentMethod = handleSubmit(helpRequest => {
    useTrpcMutation({
      mutation: () =>
        useTrpcClient().helpRequest.quickUpdate.mutate(helpRequest),
      onSuccess: updatedHelpRequest => {
        snackbar.success(
          "Le mode de paiment de l'instruction de demande d'aide a été modifié."
        )
        emit('updated', updatedHelpRequest)
      },
      onFailure: () => {
        snackbar.error(
          "La modification du mode de paiment de l'instruction de demande d'aide a échoué."
        )
      }
    })
  })
</script>
