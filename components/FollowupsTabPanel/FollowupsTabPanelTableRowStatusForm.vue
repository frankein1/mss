<template>
  <form
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
  import { FollowupItem } from './types'
  import { followupStatusOptions } from '~/client/options/followup'
  import {
    EditFollowupStatusInput,
    editFollowupStatusSchema
  } from '~/server/schema'
  import { followupFieldLabels } from '~/client/labels'

  const snackbar = useSnackbar()

  const props = defineProps<{
    followup: FollowupItem
  }>()

  const { handleSubmit } = useForm<EditFollowupStatusInput>({
    validationSchema: toTypedSchema(editFollowupStatusSchema),
    initialValues: {
      id: props.followup.id,
      status: props.followup.status
    }
  })

  const onUpdateStatus = handleSubmit(async followup => {
    try {
      await useTrpcClient().followup.update.mutate(followup)

      snackbar.success("Le statut de la synthèse d'entretien a été modifié.")
    } catch {
      snackbar.error(
        "La modification du statut de la synthèse d'entretien a échoué."
      )
    }
  })
</script>
