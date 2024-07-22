<template>
  <PageContainer>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main
          ref="formContainer"
          class="main-container fr-p-5w"
        >
          <UserFormAdmin
            :is-submitting="isSubmitting"
            @update-user="onAddUser($event as AdminCreateUserInput)"
          />
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { TRPCClientError } from '@trpc/client'
  import { AdminCreateUserInput } from '~/server/schema'
  import { routes } from '~/utils/routes'
  import { getUserCreationMessage } from '~/utils/user'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)
  const formContainer = ref<HTMLFormElement | null>(null)

  function onAddUser(user: AdminCreateUserInput) {
    useTrpcMutation({
      mutation: () => trpcClient.admin.createUser.mutate(user),
      isSubmitting,
      onSuccess: ({ email }) => {
        snackbar.success(getUserCreationMessage(email))
        navigateTo(routes.admin.AdminUsers.path())
      },
      onFailure: err => {
        if (err instanceof TRPCClientError && err.data.code === 'CONFLICT') {
          snackbar.error('Cet email est déjà associé à un utilisateur.')
        } else {
          snackbar.error("La création de l'utilisateur a échoué.")
        }
      }
    })
  }
</script>
