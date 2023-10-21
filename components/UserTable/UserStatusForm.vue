<template>
  <form
    novalidate
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

  const onUpdateStatus = handleSubmit(user => {
    useTrpcMutation({
      mutation: () => trpcClient.user.update.mutate(user),
      onSuccess: ({ email }) => {
        if (user.status) {
          snackbar.success(`L'utilisateur ${email} a été activé`)
        } else {
          snackbar.success(`L'utilisateur ${email} a été désactivé`)
        }
      },
      onFailure: () => {
        snackbar.error('La modification du statut a échoué.')
      }
    })
  })
</script>
