<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppUsers()" />
    <PageTitle :title="RouteTitle.AppUsers()" />
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
            <!-- FIXME: Delete once Brevo issue is fixed -->
            <AtomAlert
              :alert-type="AlertType.Warning"
              message="Problème d'envoi de mail"
              class="fr-mb-2w"
            >
              <template #detailedMessage>
                <p>
                  En raison d'un incidant sur notre plateforme d'envoi d'email,
                  l'email d'invitation ne parviendra pas aux utilisateurs
                  nouvellement créés. Merci de leur transmettre le lien
                  d'inscription de compte InclusionConnect :
                  <NuxtLink
                    :to="registrationUrl || ''"
                    class="registration-link"
                    >{{ registrationUrl }}</NuxtLink
                  >
                  afin de pouvoir finaliser le processur de création
                  d'utilisateur une fois le formulaire ci-dessous rempli. En cas
                  de difficulté, contactez-nous à
                  <NuxtLink :to="`mailto:${supportEmail}`">{{
                    supportEmail
                  }}</NuxtLink
                  >.
                </p>
              </template>
            </AtomAlert>
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
  import { AlertType } from '~/utils/constants/alert'

  definePageMeta({ middleware: 'can-list-users' })

  const authStore = useAuthStore()
  const trpcClient = useTrpcClient()
  const {
    public: {
      email: { from: supportEmail }
    }
  } = useRuntimeConfig()

  const {
    data: users,
    pending: usersPending,
    refresh: usersRefresh,
    error: usersError
  } = await trpcClient.user.getUsers.useQuery()

  const { data: registrationUrl } =
    await trpcClient.config.getInclusionConnectRegistrationUrl.useQuery()

  const canCreateUser = computed(() => canCreateUserRule(authStore.getAuthUser))
</script>

<style scoped lang="scss">
  .registration-link {
    word-break: break-all;
  }
</style>
