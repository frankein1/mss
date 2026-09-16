<template>
  <div class="feature-section bg-color-white">
    <h2 class="fr-h4">Informations utilisateurs</h2>
    <div
      class="table-container"
      tabindex="0"
    >
      <div class="fr-table fr-table--bordered">
        <table aria-label="Détails des informations administrateur">
          <thead>
            <tr>
              <th scope="col">{{ userFieldLabels.lastName }}</th>
              <th scope="col">{{ userFieldLabels.firstName }}</th>
              <th scope="col">{{ userFieldLabels.email }}</th>
              <th scope="col">{{ userFieldLabels.role }}</th>
              <th scope="col">
                {{ userFieldLabels.aidantConnectAuthorisation }}
              </th>
              <th scope="col">{{ userFieldLabels.status }}</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="clickable-row"
            >
              <td>
                <NuxtLink
                  class="table-row-link"
                  :to="routes.admin.AdminUser.path(user.id)"
                >
                  {{ user.lastName }}
                </NuxtLink>
              </td>
              <td>{{ user.firstName }}</td>
              <td>{{ user.email }}</td>
              <td>
                {{ userRoleKeys.value(user.role) }}
              </td>
              <td>
                <span
                  :class="
                    user.aidantConnectAuthorisation
                      ? 'fr-icon-checkbox-line'
                      : 'fr-icon-close-circle-line'
                  "
                  aria-hidden="true"
                ></span>
                <span class="fr-sr-only">{{
                  user.aidantConnectAuthorisation ? 'Oui' : 'Non'
                }}</span>
              </td>
              <td>
                <span
                  :class="
                    user.status === UserStatus.Active
                      ? 'fr-icon-checkbox-line'
                      : 'fr-icon-close-circle-line'
                  "
                  aria-hidden="true"
                ></span>
                <span class="fr-sr-only">{{
                  user.status === UserStatus.Active ? 'Oui' : 'Non'
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="fr-grid-row fr-grid-row--right fr-mt-6v">
      <NuxtLink
        :to="{
          path: routes.admin.AdminUsersAdd.path(),
          query: { structureId }
        }"
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-user-add-line"
      >
        Ajouter un utilisateur
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { UserStatus } from '@prisma/client'
  import type { StructureUsers } from './types'
  import { userFieldLabels } from '~~/client/labels'
  import { userRoleKeys } from '~~/client/options'
  import { routes } from '~/utils/routes'

  defineProps<{
    structureId: string
    users: StructureUsers
  }>()
</script>
