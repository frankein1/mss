<template>
  <div
    v-if="users?.length"
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
          </tr>
        </thead>
        <tbody>
          <NuxtLink
            v-for="user in users"
            :key="user.id"
            v-slot="{ navigate }"
            custom
            :to="routes.admin.AdminUser.path(user.id)"
          >
            <tr
              class="clickable-row"
              @click="navigate"
            >
              <td>{{ formatUserDisplayName(user) }}</td>
              <td>{{ user.structure?.name || '-' }}</td>
              <td>{{ userRoleKeys.value(user.role) }}</td>
              <td>{{ user.email }}</td>
            </tr>
          </NuxtLink>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { AdminUsersOutput } from './types'
  import { userRoleKeys } from '~/client/options'
  import { formatUserDisplayName } from '~/utils/user'
  import { routes } from '~/routes'

  defineProps<{
    users: AdminUsersOutput
    pending: boolean
  }>()
</script>
