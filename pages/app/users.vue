<template>
  <PageContainer>
    <PageBreadcrumb :links="Breadcrumb.Users()" />
    <PageTitle :title="RouteTitle.Users()" />
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
  import { canCreateUser as canCreateUserRule } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'

  definePageMeta({ middleware: 'can-list-users' })

  const authStore = useAuthStore()

  const {
    data: users,
    pending: usersPending,
    refresh: usersRefresh,
    error: usersError
  } = await useTrpcClient().user.getUsers.useQuery()

  const canCreateUser = computed(() => canCreateUserRule(authStore.getAuthUser))
</script>
