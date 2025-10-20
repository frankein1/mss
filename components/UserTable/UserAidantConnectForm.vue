<template>
  <form
    novalidate
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
  import type { UserAidantConnectAuthorisationEditionInput } from '~/server/schema'
  import { editUserAidantConnectAuthorisationSchema } from '~/server/schema'
  import { userFieldLabels } from '~/client/labels'
  import type { UsersOutput } from './types'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const props = defineProps<{
    user: UsersOutput[0]
  }>()

  const { handleSubmit } = useForm<UserAidantConnectAuthorisationEditionInput>({
    validationSchema: toTypedSchema(editUserAidantConnectAuthorisationSchema),
    initialValues: {
      id: props.user.id,
      aidantConnectAuthorisation: !!props.user.aidantConnectAuthorisation
    }
  })

  const onUpdateAidantConnectAuthorisation = handleSubmit(user => {
    useTrpcMutation({
      mutation: () => trpcClient.user.update.mutate(user),
      onSuccess: () => {
        if (user.aidantConnectAuthorisation) {
          snackbar.success(
            `L'habilitation Aidants Connect a été ajoutée à l'utilisateur ${props.user.email}.`
          )
        } else {
          snackbar.success(
            `L'habilitation Aidants Connect a été retirée de l'utilisateur ${props.user.email}.`
          )
        }
      },
      onFailure: () => {
        snackbar.error(
          "La modification de l'habilitation Aidants Connect a échoué."
        )
      }
    })
  })
</script>
