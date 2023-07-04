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
    <div
      v-if="data?.users?.length"
      class="table-container fr-mt-3w"
      tabindex="0"
    >
      <div
        class="fr-table fr-table--bordered fr-table--no-caption fr-mb-0 fr-pt-0"
      >
        <table>
          <caption>
            Liste des utilisateurs
          </caption>
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Structure</th>
              <th scope="col">Rôle</th>
              <th scope="col">Email</th>
              <th scope="col">Dernière connexion</th>
            </tr>
          </thead>
          <tbody>
            <!-- FIXME: user edit link -->
            <NuxtLink
              v-for="user in data.users"
              :key="user.id"
              v-slot="{ navigate }"
              custom
              :to="RoutePath.AdminOverview()"
              target="_self"
            >
              <tr
                class="clickable-row"
                @click="navigate"
              >
                <td>{{ getUserDisplayName(user) }}</td>
                <td>{{ user.structure?.name || '-' }}</td>
                <td>{{ UserRoleLabels[user.role] }}</td>
                <td>{{ user.email }}</td>
                <td>{{ formatDate(user.lastAccess) }}</td>
              </tr>
            </NuxtLink>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { RoutePath } from '~/utils/routing'
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
