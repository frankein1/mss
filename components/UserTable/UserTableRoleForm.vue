<template>
  <form @change="onUpdateRole">
    <VeeSelect
      name="role"
      label="Rôle"
      :options="nonAdminUserRoleOptions"
      required
      :no-label="true"
      labelled-by="role-col"
    />
  </form>
</template>

<script setup lang="ts">
  import { User } from '@prisma/client'
  import { nonAdminUserRoleOptions } from '~/client/options/user'
  import { editUserRoleSchema, UserRoleEditionInput } from '~/server/schema'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const props = defineProps<{
    user: User
  }>()

  const { handleSubmit } = useForm<UserRoleEditionInput>({
    validationSchema: toTypedSchema(editUserRoleSchema),
    initialValues: {
      id: props.user.id,
      role: props.user.role
    }
  })

  const onUpdateRole = handleSubmit(async user => {
    try {
      await trpcClient.user.update.mutate(user)

      snackbar.success(
        `Le rôle de l'utilisateur ${props.user.email} a été modifié.`
      )
    } catch {
      snackbar.error('La modification du rôle a échoué.')
    }
  })
</script>
