<template>
  <section class="fr-accordion big-accordion feature-section">
    <h3 class="fr-accordion__title">
      <button
        type="button"
        class="fr-accordion__btn big-accordion__btn"
        aria-expanded="true"
        aria-controls="accordion-user"
      >
        Gérer les utilisateurs et utilisatrices
      </button>
    </h3>
    <div
      id="accordion-user"
      class="fr-collapse fr-collapse--expanded big"
    >
      <div class="title-btn-container">
        <h4 class="fr-h6">Comptes actifs</h4>
        <NuxtLink
          class="fr-btn fr-btn-primary fr-btn--icon-left fr-icon-add-line"
          :to="routes.structure.AppStructureUserAdd.path()"
          >Ajouter un utilisateur</NuxtLink
        >
      </div>
      <UserTable
        :users="activeUsers || null"
        :pending="status === 'pending'"
        :error="usersError"
      />

      <!-- disabled users -->
      <section
        v-if="disabledUsers && disabledUsers.length > 0"
        class="fr-accordion"
      >
        <h3 class="fr-accordion__title">
          <button
            type="button"
            class="fr-accordion__btn"
            aria-expanded="false"
            aria-controls="accordion-disabled-users"
          >
            Voir les comptes inactifs
          </button>
        </h3>
        <div
          id="accordion-disabled-users"
          class="fr-collapse"
        >
          <h4 class="fr-h6 fr-mb-0">Comptes inactifs</h4>
          <UserTable
            :users="disabledUsers || null"
            :pending="status === 'pending'"
            :error="usersError"
          />
        </div>
      </section>
    </div>
  </section>

  <section class="fr-accordion big-accordion feature-section fr-mt-4v">
    <h3 class="fr-accordion__title">
      <button
        type="button"
        class="fr-accordion__btn big-accordion__btn"
        aria-expanded="true"
        aria-controls="accordion-roles"
      >
        Rôles et habilitations
      </button>
    </h3>
    <div
      id="accordion-roles"
      class="fr-collapse fr-collapse--expanded"
    >
      <RoleTable
        id="roles-details"
        class="fr-p-4v"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
  import type { SructureUserList } from '~/types/user'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()

  const {
    data: users,
    status,
    error: usersError
  } = await trpcClient.user.getUsers.useQuery()

  const activeUsers: ComputedRef<SructureUserList> = computed(() => {
    if (!users.value) {
      return []
    }
    return users.value.filter(user => user.status === 'Active')
  })

  const disabledUsers = computed(() => {
    return users.value?.filter(user => user.status === 'Disabled')
  })
</script>

<style lang="scss" scoped>
  // @use '~/assets/style/variables' as *;
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .title-btn-container {
    h4 {
      margin-bottom: 0;
    }

    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;

    @include dsfr-media-query.respond-from('md') {
      flex-direction: row;
      align-items: baseline;
      justify-content: space-between;
    }
  }

  .big-accordion {
    --default-padding: 1.5rem;

    .big-accordion__btn {
      padding: var(--default-padding);
      font-size: 1.25rem;
      font-weight: 700;

      &[aria-expanded='true'] {
        background: none;
        border-bottom: 1px solid var(--border-default-grey);
      }
    }

    .fr-collapse--expanded {
      padding: var(--default-padding);
    }

    @include dsfr-media-query.respond-from('md') {
      // FROM MD breakpoint
      --default-padding: 2.5rem;

      .big-accordion__btn {
        font-size: 1.5rem;
      }

      .fr-collapse--expanded {
        padding: var(--default-padding);
      }
    }
  }
</style>
