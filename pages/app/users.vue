<template>
  <PageContainer>
    <AtomBreadcrumb :links="breadcrumbs.structure.AppUsers()" />
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <div class="main-container fr-p-5w">
          <UserTable
            :users="users"
            :pending="usersPending"
            :error="usersError"
          />

          <DsfrAccordionsGroup>
            <li>
              <DsfrAccordion
                id="accordion-1"
                title="En savoir plus sur les rôles et habilitations"
                :expanded-id="undefined"
              >
                <RoleTable id="roles-details" />
              </DsfrAccordion>
            </li>
          </DsfrAccordionsGroup>
        </div>

        <div class="main-container fr-p-5w fr-mt-4w">
          <template v-if="application.module.users">
            <UserForm @users-refresh="usersRefresh" />
          </template>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import type { DsfrAccordionsGroup, DsfrAccordion } from '@gouvminint/vue-dsfr'
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

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  .fr-accordion {
    &::before {
      box-shadow: none;
      border: solid var(--border-default-grey);
      border-width: 1px 0;
    }

    .fr-accordion__btn {
      color: $primary;
    }
  }
</style>
