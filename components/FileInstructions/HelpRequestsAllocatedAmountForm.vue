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
  import {
    FileInstructionPageItem,
    HelpRequestData
  } from '~/server/trpc/routers'
  import {
    QuickEditHelpRequestAllocatedAmountInput,
    quickEditHelpRequestAllocatedAmountSchema
  } from '~/server/schema'
  import { helpRequestFieldLabels } from '~/client/labels'
  import { INPUT_DEFER_DURATION } from '~/utils/constants'
  import { EventCategory, HistoryQuickEditEventAction } from '~/types/matomo'

  const snackbar = useSnackbar()

  const props = defineProps<{
    item: FileInstructionPageItem
    helpRequest: HelpRequestData
  }>()

  const emit = defineEmits<{
    updated: [item: FileInstructionPageItem]
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
        onSuccess: res => {
          snackbar.success(
            "Le montant alloué de l'instruction de dossier a été modifié."
          )

          useMatomo().trackEvent(
            EventCategory.HistoryQuickEdit,
            HistoryQuickEditEventAction.HelpRequestAllocatedAmount
          )

          const item = props.item
          const helpRequest = item.fileInstruction.helpRequest
          if (helpRequest) {
            helpRequest.allocatedAmount = res.allocatedAmount
            emit('updated', item)
          }
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
