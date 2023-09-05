<template>
  <div class="fr-p-2w">
    <div>
      <div>
        <label class="fr-label"> Recherche </label>
        <input
          class="fr-input"
          placeholder="nom, code postal"
          @input="onSearch"
        />
      </div>
      <NuxtLink
        :to="RoutePath.AdminStructuresAdd()"
        class="fr-btn fr-mt-2w fr-btn--icon-left fr-icon-home-4-line"
        target="_self"
      >
        Ajouter une structure
      </NuxtLink>
    </div>
    <StructureTableAdmin
      v-show="!pending"
      v-model:sort="orderBy"
      :structures="structures"
      :pending="pending"
    />
  </div>
</template>
<script lang="ts" setup>
  import { StructureAdminSort, SortOrder } from '~/types/table'
  import { RoutePath } from '~/utils/routing'

  const trpcClient = useTrpcClient()

  const search = ref<string>()
  const orderBy = ref<StructureAdminSort[]>([
    { beneficiaries: { _count: SortOrder.Desc } }
  ])

  const queryInput = computed(() => ({
    orderBy: orderBy.value,
    search: search.value
  }))

  const { data, pending } =
    await trpcClient.admin.getStructures.useQuery(queryInput)

  const structures = computed(() => data.value?.structures || [])

  function onSearch(event: Event) {
    const input = event.target as HTMLInputElement
    const value = input.value.trim()
    search.value = value
  }
</script>

<style lang="scss" scoped>
  .structures__row {
    padding: 1rem;
    border-bottom: 1px blue solid;
  }

  .structures__infos {
    display: flex;
  }

  .structures__name {
    width: 200px;
    padding-left: 0.5rem;
    overflow-wrap: break-word;
    font-weight: bold;

    .type {
      font-size: x-small;
    }
  }

  .structures__address {
    width: 200px;
    padding-left: 0.5rem;
    overflow-wrap: break-word;
  }

  .structures__last {
    width: 200px;
    padding-left: 0.5rem;
    overflow-wrap: break-word;
  }

  .structures__count {
    width: 200px;
    padding-left: 0.5rem;
    overflow-wrap: break-word;
  }
</style>
