<template>
  <div class="fr-p-2w">
    <div>
      <div>
        <label class="fr-label"> Recherche </label>
        <input
          class="fr-input"
          placeholder="nom, email"
          @change="onSearch"
        />
      </div>
      <NuxtLink
        :to="RoutePath.AdminUsersAdd()"
        class="fr-btn fr-mt-2w fr-btn--icon-left fr-icon-user-add-line"
      >
        Ajouter un utilisateur
      </NuxtLink>
    </div>
    <UserFiltersAdmin
      class="fr-px-5v fr-mt-2w"
      @filter="filters = $event"
    />
    <UserTableAdmin
      v-show="!pending"
      v-model:sort="orderBy"
      :users="users"
      :pending="pending"
    />
  </div>
</template>
<script lang="ts" setup>
  import { UserAdminSort } from '~/types/table'
  import type { UserAdminFilterInput } from '~/server/schema'
  import { RoutePath } from '~/utils/routing'

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
