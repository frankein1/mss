<template>
  <div class="fr-container fr-p-0">
    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="La liste des utilisateurs n'a pas pu être chargée."
    />
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <div
      v-else-if="users"
      class="table-container"
      tabindex="0"
    >
      <div class="fr-table fr-table--bordered fr-table--no-caption">
        <table>
          <caption>
            Liste des utilisateurs
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
            <tr
              v-for="user in users"
              :key="user.id"
            >
              <td>{{ user.lastName }}</td>
              <td>{{ user.firstName }}</td>
              <td>{{ user.email }}</td>
              <td>
                <template v-if="authUserId !== user.id">
                  <UserRoleForm :user="user" />
                </template>
                <template v-else>{{
                  NonAdminUserRoleLabels[user.role as NonAdminUserRole]
                }}</template>
              </td>
              <td>
                <UserAidantConnectForm :user="user" />
              </td>
              <td>
                <UserStatusForm
                  v-if="authUserId !== user.id"
                  :user="user"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { User } from '@prisma/client'
  import { TRPCClientErrorBase } from '@trpc/client'
  import { DefaultErrorShape } from '@trpc/server'
  import { AlertType } from '~/utils/constants/alert'
  import { NonAdminUserRoleLabels } from '~/client/options'
  import { userFieldLabels } from '~/client/labels'
  import type { NonAdminUserRole } from '~/types/user'
  import { useAuthState } from '~/composables/useAuthState'

  defineProps<{
    users: User[] | null
    pending: boolean
    error: TRPCClientErrorBase<DefaultErrorShape> | null
  }>()

  const authState = useAuthState()

  const authUserId = authState.getUserId
</script>
