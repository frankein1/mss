<template>
  <PageContainer>
    <AtomBreadcrumb :links="breadcrumbs.structure.AppUsers()" />
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
          <template v-if="application.module.users">
            <hr />
            <UserForm @users-refresh="usersRefresh" />
          </template>
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.structure.AppUsers.title

  useHead({ title })

  const { application } = usePermissions()
  const trpcClient = useTrpcClient()

  const {
    data: users,
    pending: usersPending,
    refresh: usersRefresh,
    error: usersError
  } = await trpcClient.user.getUsers.useQuery()
</script>
