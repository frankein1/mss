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
      <tfoot v-if="shownRevisionsNb && shownRevisionsNb < mutationLogs.length">
        <td colspan="100%">
          <button
            class="fr-btn fr-btn--secondary see-all-btn"
            @click="shownRevisionsNb = null"
          >
            Tout voir
          </button>
        </td>
      </tfoot>
      <tbody>
        <tr
          v-for="mutationLog in displayedMutationLogs"
          :key="mutationLog.id"
        >
          <td>{{ formatDate(mutationLog.date, 'DD/MM/YYYY HH:mm') }}</td>
          <td>
            {{
              mutationLog.author
                ? getUserDisplayName(mutationLog.author)
                : '(inconnu)'
            }}
          </td>
          <td>{{ mutationLogActionLabels[mutationLog.action] }}</td>
          <td v-if="routeWithParams">
            <NuxtLink
              :to="routeWithParams(mutationLog.itemId)"
              class="fr-link"
              target="_self"
            >
              Voir la fiche
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { GetBeneficiariesMutationLogsOutput } from '~/server/routers'
  import { formatDate } from '~/utils/formatDate'
  import { RoutePath } from '~/utils/routing'
  import { getUserDisplayName } from '~/utils/user'
  import { mutationLogActionLabels } from '~/client/options/mutationLog'

  const DEFAULT_SHOWN_REVISIONS_NB = 5

  const props = withDefaults(
    defineProps<{
      mutationLogs: GetBeneficiariesMutationLogsOutput
      /**
       * Used for the mutation logs of a collection
       * It defines the URL base to access the item within the application
       */
      routeWithParams?: typeof RoutePath.Beneficiary
    }>(),
    { routeWithParams: undefined }
  )

  const shownRevisionsNb = ref<number | null>(DEFAULT_SHOWN_REVISIONS_NB)

  const displayedMutationLogs = computed(() => {
    return shownRevisionsNb.value
      ? props.mutationLogs.slice(0, shownRevisionsNb.value)
      : props.mutationLogs
  })
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
