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
        class="fr-btn fr-mt-2w"
        target="_self"
      >
        Ajouter une structure
      </NuxtLink>
    </div>
    <div v-if="data?.structures?.length">
      <div
        v-for="structure in data.structures"
        :key="structure.id"
        class="structures__row"
      >
        <div class="structures__infos">
          <div class="structures__name">
            <div>{{ structure.name }}</div>
            <div class="type">{{ structure.type }}</div>
            <div>{{ structure.siret }}</div>
          </div>
          <div class="structures__detail">
            <div>
              {{ structure.inhabitantsNumber }}
              {{ structure.inseeCode }}
            </div>
          </div>
          <div class="structures__address">
            <div>
              {{ structure.zipcode }}
            </div>
            <div>
              {{ structure.city }}
            </div>
          </div>
          <div class="structures__count">
            <div>
              {{ `${structure._count.beneficiaries} bénéficiaires` }}
            </div>
            <div>
              {{ `${structure._count.users || 0} utilisateurs` }}
            </div>
          </div>
          <div class="structures__last">
            <div v-if="structure.userActivities.length">
              <div>
                {{ formatDate(structure.userActivities[0].date) }}
              </div>
              <div>
                {{
                  `${structure.userActivities[0].activity} ${structure.userActivities[0].object}`
                }}
              </div>
            </div>
          </div>
        </div>
        <NuxtLink
          :to="RoutePath.AdminStructure(structure.id)"
          class="fr-link"
          >Modifier</NuxtLink
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { AdminStructuresOutput } from '~/server/routers'
  import { RoutePath } from '~/utils/routing'

  const search = ref<string>()

  const { data } = useAsyncData<AdminStructuresOutput>(
    () =>
      useTrpcClient().admin.getStructures.query({
        search: search.value
      }),
    {
      watch: [search]
    }
  )

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
