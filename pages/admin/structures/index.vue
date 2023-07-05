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
    <div
      v-if="data?.structures?.length"
      class="table-container fr-mt-3w"
      tabindex="0"
    >
      <div
        class="fr-table fr-table--bordered fr-table--no-caption fr-mb-0 fr-pt-0"
      >
        <table>
          <caption>
            Liste des structures
          </caption>
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Type</th>
              <th scope="col">SIRET</th>
              <th scope="col">Nombre d'habitants</th>
              <th scope="col">Code INSEE</th>
              <th scope="col">Code postal</th>
              <th scope="col">Ville</th>
              <th scope="col">Bénéficiaires</th>
              <th scope="col">Utilisateurs</th>
              <th scope="col">Dernière activité</th>
            </tr>
          </thead>
          <tbody>
            <NuxtLink
              v-for="structure in data.structures"
              :key="structure.id"
              v-slot="{ navigate }"
              custom
              :to="RoutePath.AdminStructure(structure.id)"
              target="_self"
            >
              <tr
                class="clickable-row"
                @click="navigate"
              >
                <td>{{ structure.name }}</td>
                <td>{{ StructureTypeLabels[structure.type] }}</td>
                <td>{{ structure.siret }}</td>
                <td>{{ structure.inhabitantsNumber }}</td>
                <td>{{ structure.inseeCode }}</td>
                <td>{{ structure.zipcode }}</td>
                <td>{{ structure.city }}</td>
                <td>{{ structure._count.beneficiaries }}</td>
                <td>{{ structure._count.users || 0 }}</td>
                <td>
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
                </td>
              </tr>
            </NuxtLink>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { StructureTypeLabels } from '~/client/options/structure'
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
