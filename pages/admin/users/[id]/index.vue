<template>
  <PageContainer>
    <PageTitle :title="user ? formatUserDisplayName(user) : '-'" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main
          ref="formContainer"
          class="main-container fr-p-5w"
        >
          <AtomAlert
            v-if="error"
            :alert-type="AlertType.Error"
            message="Les informations de l'utilisateur n'ont pas pu être chargées."
          />

          <AtomLoader
            v-if="pending"
            class="fr-mx-auto"
          />
          <UserFormAdmin
            v-else-if="user"
            :user="user"
            :is-submitting="isSubmitting"
            @update-user="onUpdateUser($event as AdminEditUserInput)"
          />
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { AdminEditUserInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { formatUserDisplayName } from '~/utils/user'

  const route = useRoute()
  const userId = route.params.id as string
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)
  const formContainer = ref<HTMLFormElement | null>(null)

  const {
    data: user,
    pending,
    error
  } = await trpcClient.admin.getUser.useQuery({
    id: userId
  })

  function onUpdateUser(updatedUser: AdminEditUserInput) {
    useTrpcMutation({
      mutation: () => trpcClient.admin.editUser.mutate(updatedUser),
      isSubmitting,
      onSuccess: res => {
        user.value = res
        snackbar.success(
          "Les informations de l'utilisateur ont été mises à jour."
        )
      },
      onFailure: () => {
        snackbar.error("La mise à jour de l'utilisateur a échoué.", () =>
          formContainer.value?.querySelector('select')?.focus()
        )
      }
    })
  }
</script>
