<template>
  <div
    v-if="users?.length"
    ref="tableContainer"
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
            <TableSortableHeader
              label="Dernière connexion"
              numeric
              @update:sort="onSort({ lastAccess: $event })"
            />
          </tr>
        </thead>
        <tbody>
          <NuxtLink
            v-for="user in users"
            :key="user.id"
            v-slot="{ navigate }"
            custom
            :to="RoutePath.AdminUser(user.id)"
            target="_self"
          >
            <tr
              class="clickable-row"
              @click="navigate"
            >
              <td>{{ formatUserDisplayName(user) }}</td>
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
</template>

<script setup lang="ts">
  import { Users } from './types'
  import { UserRoleLabels } from '~/client/options/user'
  import type { UserAdminSort } from '~/types/table'
  import { formatUserDisplayName } from '~/utils/user'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    users: Users
    pending: boolean
    sort: UserAdminSort[]
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: UserAdminSort[]]
  }>()

  const { onSort, tableContainer } = useTable<UserAdminSort>(
    toRef(() => props.sort),
    toRef(() => props.pending),
    emit
  )
</script>
