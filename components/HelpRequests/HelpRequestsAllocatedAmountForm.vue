<template>
  <form
    novalidate
    @change="onUpdateAllocatedAmount"
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
  import { HelpRequestPageItem } from './types'
  import {
    QuickEditHelpRequestAllocatedAmountInput,
    quickEditHelpRequestAllocatedAmountSchema
  } from '~/server/schema'
  import { helpRequestFieldLabels } from '~/client/labels'
  import { INPUT_DEFER_DURATION } from '~/utils/constants'

  const snackbar = useSnackbar()

  const props = defineProps<{
    item: HelpRequestPageItem
  }>()

  const emit = defineEmits<{
    updated: [item: HelpRequestPageItem]
  }>()

  const { handleSubmit } = useForm<QuickEditHelpRequestAllocatedAmountInput>({
    validationSchema: toTypedSchema(quickEditHelpRequestAllocatedAmountSchema),
    initialValues: {
      id: props.item.helpRequest.id,
      allocatedAmount: new Prisma.Decimal(
        props.item.helpRequest.allocatedAmount || 0
      ).toNumber()
    }
  })

  const onUpdateAllocatedAmount = handleSubmit(
    useDefer(INPUT_DEFER_DURATION, helpRequest => {
      useTrpcMutation({
        mutation: () =>
          useTrpcClient().helpRequest.updatePageItem.mutate(helpRequest),
        onSuccess: item => {
          snackbar.success(
            "Le montant alloué de l'instruction de dossier a été modifié."
          )
          emit('updated', item)
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
