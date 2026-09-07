<template>
  <PageContainer class="fr-p-5w">
    <PageTitle :title="routes.admin.AdminUsers.title" />

    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom fr-mb-6v">
      <div class="fr-col-12 fr-col-lg-8 fr-col-xl-9">
        <div class="fr-input-group">
          <label
            class="fr-label"
            for="search-strucuture"
          >
            Recherche un utilisateur
            <span class="fr-hint-text">Par nom ou e-mail</span>
          </label>
          <div class="fr-input-wrap fr-input-wrap--addon">
            <input
              id="search-user"
              class="fr-input"
              aria-describedby="search-user-messages"
              type="text"
              @change="onSearch"
            />
            <button
              type="submit"
              class="fr-btn"
            >
              Chercher
            </button>
          </div>

          <div
            id="search-user-messages"
            class="fr-messages-group"
            aria-live="polite"
          ></div>
        </div>
      </div>

      <div class="fr-col-12 fr-col-lg-4 fr-col-xl-3">
        <NuxtLink
          :to="routes.admin.AdminUsersAdd.path()"
          class="fr-btn fr-mt-2w fr-btn--icon-left fr-icon-user-add-line"
        >
          Ajouter un utilisateur
        </NuxtLink>
      </div>
    </div>

    <div class="feature-section">
      <UserFiltersAdmin
        class="fr-px-5v fr-mt-2w"
        @filter="filters = $event"
      />
      <UserTableAdmin
        v-show="!pending"
        v-model:sort="orderBy"
        :users="users"
      />
    </div>
  </PageContainer>
</template>
<script lang="ts" setup>
  import type { UserAdminSort } from '~~/types/table'
  import type { UserAdminFilterInput } from '~~/server/schema'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()

  const search = ref<string>()
  const filters = ref<UserAdminFilterInput | undefined>(undefined)
  const orderBy = ref<UserAdminSort | undefined>(undefined)

  const queryInput = computed(() => ({
    search: search.value,
    filters: filters.value,
    orderBy: orderBy.value
  }))

  const { data, pending } = await trpcClient.admin.getUsers.useQuery(queryInput)

  const users = computed(() => data.value?.users || [])

  function onSearch(event: Event) {
    const input = event.target as HTMLInputElement
    const value = input.value.trim()
    search.value = value
  }
</script>
