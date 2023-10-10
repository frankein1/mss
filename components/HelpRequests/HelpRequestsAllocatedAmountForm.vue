<template>
  <form
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
    useDefer(INPUT_DEFER_DURATION, async helpRequest => {
      try {
        const updateHelpRequest =
          await useTrpcClient().helpRequest.quickUpdate.mutate(helpRequest)

        snackbar.success(
          "Le montant alloué de l'instruction de demande d'aide a été modifié."
        )
        emit('updated', updateHelpRequest)
      } catch {
        snackbar.error(
          "La modification du montant alloué de l'instruction de demande d'aide a échoué."
        )
      }
    })
  )
</script>
