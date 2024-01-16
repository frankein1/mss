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
  import { HelpRequestPageItem } from './types'
  import { paymentMethodOptions } from '~/client/options/helpRequest'
  import {
    QuickEditHelpRequestPaymentMethodInput,
    quickEditHelpRequestPaymentMethodSchema
  } from '~/server/schema'
  import { helpRequestFieldLabels } from '~/client/labels'
  import { withEmptyValue } from '~/utils/options'

  const snackbar = useSnackbar()

  const props = defineProps<{
    item: HelpRequestPageItem
  }>()

  const emit = defineEmits<{
    updated: [item: HelpRequestPageItem]
  }>()

  const { handleSubmit } = useForm<QuickEditHelpRequestPaymentMethodInput>({
    validationSchema: toTypedSchema(quickEditHelpRequestPaymentMethodSchema),
    initialValues: {
      id: props.item.helpRequest.id,
      paymentMethod: props.item.helpRequest.paymentMethod
    }
  })

  const onUpdatePaymentMethod = handleSubmit(helpRequest => {
    useTrpcMutation({
      mutation: () =>
        useTrpcClient().helpRequest.updatePageItem.mutate(helpRequest),
      onSuccess: item => {
        snackbar.success(
          "Le mode de paiment de l'instruction de dossier a été modifié."
        )
        emit('updated', item)
      },
      onFailure: () => {
        snackbar.error(
          "La modification du mode de paiment de l'instruction de dossier a échoué."
        )
      }
    })
  })
</script>
