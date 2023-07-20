<template>
  <div
    class="table-container"
    tabindex="0"
  >
    <div class="fr-table fr-table--bordered">
      <table>
        <caption>
          Gérer les utilisateurs
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ userFieldLabels.lastName }}</th>
            <th scope="col">{{ userFieldLabels.firstName }}</th>
            <th scope="col">{{ userFieldLabels.email }}</th>
            <th
              id="role-col"
              scope="col"
            >
              {{ userFieldLabels.role }}
            </th>
            <th
              id="authorisation-col"
              scope="col"
            >
              {{ userFieldLabels.aidantConnectAuthorisation }}
            </th>
            <th
              id="status-col"
              scope="col"
            >
              {{ userFieldLabels.status }}
            </th>
          </tr>
        </thead>
        <tbody>
          <NuxtLink
            v-for="user in structure.users"
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
              <td>{{ user.lastName }}</td>
              <td>{{ user.firstName }}</td>
              <td>{{ user.email }}</td>
              <td>
                {{ NonAdminUserRoleLabels[user.role as NonAdminUserRole] }}
              </td>
              <td>
                <span
                  v-if="!!user.aidantConnectAuthorisation"
                  class="fr-icon-checkbox-line"
                  aria-hidden="true"
                ></span>
                <span
                  v-else
                  class="fr-icon-close-circle-line"
                  aria-hidden="true"
                ></span>
              </td>
              <td>
                <span
                  v-if="user.status === UserStatus.Active"
                  class="fr-icon-checkbox-line"
                  aria-hidden="true"
                ></span>
                <span
                  v-else
                  class="fr-icon-close-circle-line"
                  aria-hidden="true"
                ></span>
              </td></tr
          ></NuxtLink>
        </tbody>
      </table>
    </div>
    <NuxtLink
      :to="{
        path: RoutePath.AdminUsersAdd(),
        query: { structureId: structure.id }
      }"
      class="fr-btn fr-mt-2w fr-btn--icon-left fr-icon-user-add-line"
      target="_self"
    >
      Ajouter un utilisateur
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
  import { UserStatus } from '@prisma/client'
  import { userFieldLabels } from '~/client/labels'
  import { NonAdminUserRoleLabels } from '~/client/options/user'
  import { AdminStructureOutput } from '~/server/routers'
  import { RoutePath } from '~/utils/routing'
  import type { NonAdminUserRole } from '~/types/user'

  defineProps<{
    structure: AdminStructureOutput
  }>()
</script>
