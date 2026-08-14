<template>
  <AtomLazyComponent
    :error="Boolean(error) || !users"
    message="La liste des utilisateurs n'a pas pu être chargée."
    :pending="pending"
  >
    <div
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
              <th scope="col">Nom et prénom</th>
              <th scope="col">{{ userFieldLabels.email }}</th>
              <th
                id="role-col"
                scope="col"
              >
                {{ userFieldLabels.role }}
              </th>
              <th scope="col">Aidants <br />Connect</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
            >
              <td>{{ user.lastName || '' }} {{ user.firstName || '' }}</td>
              <td>{{ user.email }}</td>
              <td>
                {{ nonAdminUserRoleKeys.value(user.role || '') }}
              </td>
              <td>
                <i
                  v-if="user.aidantConnectAuthorisation"
                  class="fr-icon-check-line text--success"
                  title="Oui"
                ></i>
              </td>
              <td>
                <NuxtLink
                  class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-edit-line fr-btn--sm"
                  :to="routes.structure.AppStructureUserEdit.path(user.id)"
                  >Modifier
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AtomLazyComponent>
</template>

<script lang="ts" setup>
  import type { TRPCClientErrorBase } from '@trpc/client'
  import type { TRPCDefaultErrorShape } from '@trpc/server'
  import { nonAdminUserRoleKeys } from '~~/client/options'
  import { userFieldLabels } from '~~/client/labels'
  import { routes } from '~/utils/routes'
  import type { SructureUserList } from '~~/types/user'

  const { users, pending, error } = defineProps<{
    users: SructureUserList
    pending: boolean
    error: TRPCClientErrorBase<TRPCDefaultErrorShape> | null
  }>()
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .table-container,
  .fr-table {
    width: 100%;
    max-width: 100%;
    min-width: 200px;
  }

  .fr-icon-delete-bin-6-line {
    max-height: 2rem;
    max-width: 2rem;
    overflow: hidden;
    white-space: nowrap;
  }

  .fr-icon-delete-bin-6-line::before {
    color: var(--text-default-error);
  }

  .fr-table > table thead {
    background-size: 100% 2px;
    min-height: 24px;
  }

  .fr-table--bordered > table tbody tr {
    background-image: linear-gradient(
      0deg,
      var(--border-contrast-grey),
      var(--border-contrast-grey)
    );

    td {
      @include dsfr-media-query.respond-from('md') {
        padding: 0.75rem;
      }
    }
  }
</style>
