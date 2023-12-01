<template>
  <form
    novalidate
    @input="onUpdateAllocatedAmount"
    @submit.prevent
  >
    <VeeCurrencyInput
      name="allocatedAmount"
      :label="helpRequestFieldLabels.allocatedAmount"
      no-label
      labelled-by="allocated-amount-col"
    />
  </form>
</template>

<script setup lang="ts">
  import { Prisma } from '@prisma/client'
  import { HelpRequestItem } from './types'
  import {
    QuickEditHelpRequestAllocatedAmountInput,
    quickEditHelpRequestAllocatedAmountSchema
  } from '~/server/schema'
  import { helpRequestFieldLabels } from '~/client/labels'
  import { INPUT_DEFER_DURATION } from '~/utils/constants'

  const snackbar = useSnackbar()

  const props = defineProps<{
    helpRequest: HelpRequestItem
  }>()

  const emit = defineEmits<{
    updated: [helpRequest: HelpRequestItem]
  }>()

  const { handleSubmit } = useForm<QuickEditHelpRequestAllocatedAmountInput>({
    validationSchema: toTypedSchema(quickEditHelpRequestAllocatedAmountSchema),
    initialValues: {
      id: props.helpRequest.id,
      allocatedAmount: new Prisma.Decimal(
        props.helpRequest.allocatedAmount || 0
      ).toNumber()
    }
  })

  const onUpdateAllocatedAmount = handleSubmit(
    useDefer(INPUT_DEFER_DURATION, helpRequest => {
      useTrpcMutation({
        mutation: () =>
          useTrpcClient().helpRequest.quickUpdate.mutate(helpRequest),
        onSuccess: updatedHelpRequest => {
          snackbar.success(
            "Le montant alloué de l'instruction de dossier a été modifié."
          )
          emit('updated', updatedHelpRequest)
        },
        onFailure: () => {
          snackbar.error(
            "La modification du montant alloué de l'instruction de dossier a échoué."
          )
        }
      })
    })
  )
</script>
