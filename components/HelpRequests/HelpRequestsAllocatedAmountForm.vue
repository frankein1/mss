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
  import { INPUT_DEFER_TIME } from '~/utils/constants'

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

  const timeout = ref<NodeJS.Timeout | null>(null)

  const onUpdateAllocatedAmount = handleSubmit(helpRequest => {
    if (timeout.value) {
      clearTimeout(timeout.value)
      timeout.value = null
    }

    timeout.value = setTimeout(async () => {
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
    }, INPUT_DEFER_TIME)
  })
</script>
