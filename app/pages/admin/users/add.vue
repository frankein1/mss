<template>
  <PageContainer class="fr-p-5w">
    <PageTitle :title="routes.admin.AdminUsersAdd.title" />

    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <div class="main-container fr-p-5w">
          <UserFormAdmin
            :is-submitting="isSubmitting"
            :structure-options="structureOptions"
            @update-user="onAddUser($event as AdminCreateUserInput)"
          />
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { TRPCClientError } from '@trpc/client'
  import type { AdminCreateUserInput } from '~~/server/schema'
  import { routes } from '~/utils/routes'
  import { getUserCreationMessage } from '~/utils/user'
  import { toOptions } from '~/utils/options'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)

  const { data: structures } = await trpcClient.admin.getStructures.useQuery()

  const structureOptions = computed(() =>
    structures.value?.structures.length
      ? toOptions(structures.value.structures, 'id', 'name')
      : []
  )

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
