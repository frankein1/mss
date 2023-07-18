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
                  En raison d'un incident sur notre plateforme d'envoi d'email,
                  l'email d'invitation normalement reçu par les utilisateurs
                  nouvelle créé ne parviendra jusqu'à eux. Vous pouvez leur
                  transmettre le lien d'inscription suivant après avoir finalisé
                  la création dans le formulaire ci-dessous :
                  <NuxtLink
                    :to="registrationUrl || ''"
                    class="registration-link"
                    >{{ registrationUrl }}</NuxtLink
                  >. En cas de difficulté, contactez-nous à
                  <NuxtLink :to="`mailto:${supportEmail}`">{{
                    supportEmail
                  }}</NuxtLink
                  >. Nous nous excusons pour la gêne occasionnée.
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
