<template>
  <form @change="onUpdateStatus">
    <VeeToggle
      name="status"
      label="Statut"
      :no-label="true"
      :checked-label="false"
      labelled-by="status-col"
    />
  </form>
</template>

<script setup lang="ts">
  import { User, UserStatus } from '@prisma/client'
  import { editUserStatusSchema, UserStatusEditionInput } from '~/server/schema'

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
