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
  import { FileInstructionPageItem, HelpRequestData } from './types'
  import { paymentMethodOptions } from '~/client/options'
  import {
    QuickEditHelpRequestPaymentMethodInput,
    quickEditHelpRequestPaymentMethodSchema
  } from '~/server/schema'
  import { helpRequestFieldLabels } from '~/client/labels'
  import { withEmptyValue } from '~/utils/options'
  import { EventCategory, HistoryQuickEditEventAction } from '~/types/matomo'

  const snackbar = useSnackbar()

  const props = defineProps<{
    item: FileInstructionPageItem
    helpRequest: HelpRequestData
  }>()

  const emit = defineEmits<{
    updated: [item: FileInstructionPageItem]
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
      onSuccess: res => {
        snackbar.success(
          "Le mode de paiment de l'instruction de dossier a été modifié."
        )

        useMatomo().trackEvent(
          EventCategory.HistoryQuickEdit,
          HistoryQuickEditEventAction.HelpRequestPaymentMethod
        )

        const item = props.item
        const helpRequest = item.fileInstruction.helpRequest
        if (helpRequest) {
          helpRequest.paymentMethod = res.paymentMethod
          emit('updated', item)
        }
      },
      onFailure: () => {
        snackbar.error(
          "La modification du mode de paiment de l'instruction de dossier a échoué."
        )
      }
    })
  })
</script>
