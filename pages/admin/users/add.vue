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
  import { AdminCreateUserInput } from '~/server/schema'
  import { RoutePath } from '~/utils/routing'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)
  const formContainer = ref<HTMLFormElement | null>(null)

  async function onAddUser(user: AdminCreateUserInput) {
    isSubmitting.value = true
    try {
      await trpcClient.admin.createUser.mutate(user)

      navigateTo(RoutePath.AdminUsers())
      snackbar.success("L'utilisateur a été ajouté.")
    } catch {
      snackbar.error("L'ajout de l'utilisateur a échoué.", () =>
        formContainer.value?.querySelector('select')?.focus()
      )
    }
    isSubmitting.value = false
  }
</script>
