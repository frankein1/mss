<template>
  <div class="fr-p-2w">
    <div>
      <div>
        <label class="fr-label"> Recherche </label>
        <input
          class="fr-input"
          placeholder="nom"
          @input="onSearch"
        />
      </div>
    </div>
    <div v-if="data?.users?.length">
      <div
        v-for="user in data.users"
        :key="user.id"
        class="users__row"
      >
        <div class="users__name">
          <div>{{ getUserDisplayName(user) }}</div>
        </div>
        <div class="users__structure">
          <div>{{ user.structure?.name || '-' }}</div>
          <div class="role">{{ UserRoleLabels[user.role] }}</div>
        </div>
        <div class="users__contact">
          <div>{{ user.email }}</div>
        </div>
        <div class="users__lastAccess">
          <div>{{ formatDate(user.lastAccess) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { UserRoleLabels } from '~/client/options/user'

  const search = ref<string>()

  const queryInput = computed(() => ({ search: search.value }))

  const { data } = await useTrpcClient().admin.getUsers.useQuery(queryInput)

  function onSearch(event: Event) {
    const input = event.target as HTMLInputElement
    const value = input.value.trim()
    search.value = value
  }
</script>

<style lang="scss" scoped>
  .users__row {
    display: flex;
    padding: 1rem;
    border-bottom: 1px blue solid;
  }

  .users__name {
    width: 200px;
    padding-left: 0.5rem;
    overflow-wrap: break-word;
    font-weight: bold;
  }

  .users__structure {
    width: 300px;
    padding-left: 0.5rem;
    overflow-wrap: break-word;

    .role {
      font-size: x-small;
    }
  }

  .users__contact {
    width: 300px;
    padding-left: 0.5rem;
    overflow-wrap: break-word;
  }
</style>
