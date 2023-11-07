<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppUsers()" />
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main class="main-container fr-p-5w">
          <UserTable
            :users="users"
            :pending="usersPending"
            :error="usersError"
          />
          <button
            class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-question-line fr-mb-3w fr-mt-1w"
            aria-expanded="false"
            aria-controls="roles-details"
          >
            En savoir plus sur les rôles et habilitations
          </button>
          <RoleTable id="roles-details" />
          <template v-if="canCreateUser">
            <hr />
            <UserForm @users-refresh="usersRefresh" />
          </template>
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { Breadcrumb, RouteTitle } from '~/utils/routing'
  import { canCreateUser as canCreateUserRule } from '~/server/security'
  import { useAuthStore } from '~/store/auth'

  const title = RouteTitle.AppUsers()

  useHead({ title })

  const authStore = useAuthStore()
  const trpcClient = useTrpcClient()

  const {
    data: users,
    pending: usersPending,
    refresh: usersRefresh,
    error: usersError
  } = await trpcClient.user.getUsers.useQuery({})

  const canCreateUser = computed(() => canCreateUserRule(authStore.getAuthUser))
</script>
