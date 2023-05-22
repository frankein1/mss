<template>
  <PageContainer>
    <PageTitle title="Gérer les utilisateurs" />
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
          <hr />
          <UserForm @users-refresh="usersRefresh" />
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  // TODO
  // definePageMeta({ middleware: 'can-add-users' })

  const {
    data: users,
    pending: usersPending,
    refresh: usersRefresh,
    error: usersError
  } = await useTrpcClient().user.getUsers.useQuery()
</script>
