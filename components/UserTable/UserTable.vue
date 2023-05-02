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
                  <form>
                    <AtomSelect
                      name="role"
                      label="Rôle"
                      :options="nonAdminUserRoleOptions"
                      :model-value="user.role"
                      required
                      :no-label="true"
                      labelled-by="role-col"
                      @change-value="
                        onUpdateRole($event as UserRole, user.id, user.email)
                      "
                    />
                  </form>
                </template>
                <template v-else>{{
                  NonAdminUserRoleLabels[user.role as NonAdminUserRole]
                }}</template>
              </td>
              <td>
                <form>
                  <AtomCheckbox
                    :name="`aidant-connect-${user.id}`"
                    label="Aidant Connect"
                    :no-label="true"
                    :model-value="!!user.aidantConnectAuthorisation"
                    labelled-by="authorisation-col"
                    @update:model-value="
                      onUpdateAidantConnect($event, user.id, user.email)
                    "
                  />
                </form>
              </td>
              <td>
                <form v-if="authUserId !== user.id">
                  <AtomToggle
                    :name="`status-${user.id}`"
                    label="Statut"
                    :no-label="true"
                    :checked-label="false"
                    labelled-by="status-col"
                    :checked="user.status === UserStatus.Active"
                    @toggle="onUpdateStatus($event, user.id, user.email)"
                  />
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { User, UserRole, UserStatus } from '@prisma/client'
  import { TRPCClientErrorBase } from '@trpc/client'
  import { DefaultErrorShape } from '@trpc/server'
  import { useAuthStore } from '~/store/auth'
  import { AlertType } from '~/utils/constants/alert'
  import {
    NonAdminUserRole,
    NonAdminUserRoleLabels,
    nonAdminUserRoleOptions
  } from '~/client/options/user'
  import { userFieldLabels } from '~/client/labels/user.labels'

  defineProps<{
    users: User[] | null
    pending: boolean
    error: TRPCClientErrorBase<DefaultErrorShape> | null
  }>()

  const trpcClient = useTrpcClient()
  const authStore = useAuthStore()
  const snackbar = useSnackbar()

  const authUserId = computed(() => {
    return authStore.userId
  })

  async function onUpdateStatus(
    userActive: boolean,
    userId: string,
    userEmail: string
  ) {
    const status = userActive ? UserStatus.Active : UserStatus.Disabled
    try {
      await trpcClient.user.update.mutate({ id: userId, status })

      if (userActive) {
        snackbar.success(`L'utilisateur ${userEmail} a été activé`)
      } else snackbar.success(`L'utilisateur ${userEmail} a été désactivé`)
    } catch {
      snackbar.error('La modification du statut a échoué.')
    }
  }

  async function onUpdateRole(
    role: UserRole,
    userId: string,
    userEmail: string
  ) {
    try {
      await trpcClient.user.update.mutate({ id: userId, role })

      snackbar.success(`Le rôle de l'utilisateur ${userEmail} a été modifié`)
    } catch {
      snackbar.error('La modification du rôle a échoué.')
    }
  }

  async function onUpdateAidantConnect(
    aidantConnectAuthorisation: boolean,
    userId: string,
    userEmail: string
  ) {
    try {
      await trpcClient.user.update.mutate({
        id: userId,
        aidantConnectAuthorisation
      })

      if (aidantConnectAuthorisation) {
        snackbar.success(
          `L'habilitation Aidant Connect a été ajoutée à l'utilisateur ${userEmail}`
        )
      } else {
        snackbar.success(
          `L'habilitation Aidant Connect a été retirée de l'utilisateur ${userEmail}`
        )
      }
    } catch {
      snackbar.error(
        "La modification de l'habilitation Aidant Connect a échoué."
      )
    }
  }
</script>
