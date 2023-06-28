<template>
  <div>
    <hr />
    <section class="fr-accordion">
      <div class="fr-accordion__title">
        <button
          class="fr-accordion__btn"
          aria-expanded="false"
          :aria-controls="mutationLogsId"
        >
          Historique des changements
        </button>
      </div>
      <div
        :id="mutationLogsId"
        class="fr-collapse"
      >
        <MutationLogsTable
          v-if="mutationLogs"
          :mutation-logs="mutationLogs"
          :route-with-params="routeWithParams"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    id?: string
    collection?: 'beneficiaries'
    /**
     * Used for the mutation logs of a collection
     * It defines the URL base to access the item within the application
     */
    routeWithParams?: typeof RoutePath.AppBeneficiary
  }>()

  const mutationLogsId = computed(
    () => `mutation-logs-${props.id || props.collection}`
  )

  const { data: mutationLogs } = useAsyncData(loadMutationLogs)

  async function loadMutationLogs() {
    if (props.collection) {
      return await loadCollectionMutationLogs(props.collection)
    }
    return []
  }

  function loadCollectionMutationLogs(collection: 'beneficiaries') {
    return useTrpcClient().mutationLogs[collection].query()
  }
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  $border-radius: 1.5rem;

  .fr-accordion {
    &::before {
      box-shadow: none;
      border: solid 1px var(--border-default-grey);
      border-radius: $border-radius;
    }

    .fr-accordion__btn {
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
      transition: border-radius 0.3s;
      color: $primary;

      &[aria-expanded='false'] {
        border-bottom-left-radius: $border-radius;
        border-bottom-right-radius: $border-radius;
      }
    }

    .fr-collapse {
      padding: 0;
      margin: 0;
    }
  }
</style>
