<template>
  <form
    @change="onUpdateAidantConnectAuthorisation"
    @submit.prevent
  >
    <VeeCheckbox
      name="aidantConnectAuthorisation"
      :label="userFieldLabels.aidantConnectAuthorisation"
      no-label
      labelled-by="authorisation-col"
    />
  </form>
</template>

<script setup lang="ts">
  import { User } from '@prisma/client'
  import {
    editUserAidantConnectAuthorisationSchema,
    UserAidantConnectAuthorisationEditionInput
  } from '~/server/schema'
  import { userFieldLabels } from '~/client/labels'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const props = defineProps<{
    user: User
  }>()

  const { handleSubmit } = useForm<UserAidantConnectAuthorisationEditionInput>({
    validationSchema: toTypedSchema(editUserAidantConnectAuthorisationSchema),
    initialValues: {
      id: props.user.id,
      aidantConnectAuthorisation: !!props.user.aidantConnectAuthorisation
    }
  })

  const onUpdateAidantConnectAuthorisation = handleSubmit(async user => {
    try {
      await trpcClient.user.update.mutate(user)

      if (user.aidantConnectAuthorisation) {
        snackbar.success(
          `L'habilitation Aidant Connect a été ajoutée à l'utilisateur ${props.user.email}.`
        )
      } else {
        snackbar.success(
          `L'habilitation Aidant Connect a été retirée de l'utilisateur ${props.user.email}.`
        )
      }
    } catch {
      snackbar.error(
        "La modification de l'habilitation Aidant Connect a échoué."
      )
    }
  })
</script>
