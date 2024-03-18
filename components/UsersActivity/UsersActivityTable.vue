<template>
  <div class="fr-table fr-table--bordered fr-table--no-caption fr-mb-0">
    <table>
      <caption>
        Historique des changements
      </caption>
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Auteur</th>
          <th scope="col">Action</th>
          <th
            v-if="routeWithParams"
            scope="col"
          >
            Élément
          </th>
        </tr>
      </thead>
      <tfoot v-if="hasNextPage">
        <td colspan="100%">
          <button
            class="fr-btn fr-btn--secondary see-all-btn"
            @click="emit('nextPage')"
          >
            Voir plus
          </button>
        </td>
      </tfoot>
      <tbody>
        <tr
          v-for="userActivity in usersActivity"
          :key="userActivity.id"
        >
          <td>{{ formatDate(userActivity.date, 'DD/MM/YYYY HH:mm') }}</td>
          <td>
            {{
              userActivity.user
                ? formatUserDisplayName(userActivity.user)
                : '(inconnu)'
            }}
          </td>
          <td>{{ userActivityTypeKeys.value(userActivity.activity) }}</td>
          <td v-if="routeWithParams">
            <NuxtLink
              :to="routeWithParams(userActivity.objectId)"
              class="fr-link"
              >Voir la fiche</NuxtLink
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { GetBeneficiariesUsersActivityOutput } from '~/server/trpc/routers'
  import { formatDate } from '~/utils/formatDate'
  import { RoutePath } from '~/utils/routing'
  import { formatUserDisplayName } from '~/utils/user'
  import { userActivityTypeKeys } from '~/client/options'

  withDefaults(
    defineProps<{
      usersActivity: GetBeneficiariesUsersActivityOutput['activity']
      /**
       * Used for the mutation logs of a collection
       * It defines the URL base to access the item within the application
       */
      routeWithParams?: typeof RoutePath.AppBeneficiary
      hasNextPage: boolean
    }>(),
    { routeWithParams: undefined }
  )

  const emit = defineEmits<{
    nextPage: []
  }>()
</script>

<style scoped>
  .fr-table > table {
    display: table;
  }

  .see-all-btn {
    display: block;
    margin: 0 auto;
  }
</style>
