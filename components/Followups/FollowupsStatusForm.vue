<template>
  <form
    novalidate
    @change="onUpdateStatus"
    @submit.prevent
  >
    <VeeSelect
      name="status"
      :label="followupFieldLabels.status"
      :options="followupStatusOptions"
      required
      no-label
      labelled-by="status-col"
    />
  </form>
</template>

<script setup lang="ts">
  import { FollowupPageItem } from '~/server/trpc/routers'
  import { followupStatusOptions } from '~/client/options'
  import {
    QuickEditFollowupInput,
    quickEditFollowupSchema
  } from '~/server/schema'
  import { followupFieldLabels } from '~/client/labels'
  import { EventCategory, HistoryQuickEditEventAction } from '~/types/matomo'

  const snackbar = useSnackbar()

  const props = defineProps<{
    data: FollowupPageItem
  }>()

  const { handleSubmit } = useForm<QuickEditFollowupInput>({
    validationSchema: toTypedSchema(quickEditFollowupSchema),
    initialValues: {
      id: props.data.followup.id,
      status: props.data.followup.status
    }
  })

  const onUpdateStatus = handleSubmit(followup => {
    useTrpcMutation({
      mutation: () => useTrpcClient().followup.quickUpdate.mutate(followup),
      onSuccess: () => {
        snackbar.success("Le statut de la synthèse d'entretien a été modifié.")
        useMatomo().trackEvent(
          EventCategory.HistoryQuickEdit,
          HistoryQuickEditEventAction.FollowupStatus
        )
      },
      onFailure: () => {
        snackbar.error(
          "La modification du statut de la synthèse d'entretien a échoué."
        )
      }
    })
  })
</script>
