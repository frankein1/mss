<template>
  <form
    @change="onUpdateStatus"
    @submit.prevent
  >
    <VeeToggle
      name="status"
      :label="userFieldLabels.status"
      no-label
      :checked-label="false"
      labelled-by="status-col"
    />
  </form>
</template>

<script setup lang="ts">
  import { User, UserStatus } from '@prisma/client'
  import { editUserStatusSchema, UserStatusEditionInput } from '~/server/schema'
  import { userFieldLabels } from '~/client/labels'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const props = defineProps<{
    user: User
  }>()

  const { handleSubmit } = useForm<UserStatusEditionInput>({
    validationSchema: toTypedSchema(editUserStatusSchema),
    initialValues: {
      id: props.user.id,
      status: props.user.status === UserStatus.Active
    }
  })

  const onUpdateStatus = handleSubmit(async user => {
    try {
      await trpcClient.user.update.mutate(user)

      if (user.status) {
        snackbar.success(`L'utilisateur ${props.user.email} a été activé`)
      } else {
        snackbar.success(`L'utilisateur ${props.user.email} a été désactivé`)
      }
    } catch {
      snackbar.error('La modification du statut a échoué.')
    }
  })
</script>
