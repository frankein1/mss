<template>
  <div
    v-if="structures?.length"
    ref="tableContainer"
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
            <th scope="col">Code postal</th>
            <th scope="col">Ville</th>
            <TableSortableHeader
              label="Bénéficiaires"
              :sort="beneficiariesSort"
              numeric
              @update:sort="onSort({ beneficiaries: { _count: $event } })"
            />
            <th scope="col">Instructions de dossier</th>
            <th scope="col">Entretiens</th>
            <th scope="col">Utilisateurs</th>
            <TableSortableHeader
              label="Dernière activité"
              numeric
              @update:sort="onSort({ lastActivity: $event })"
            />
          </tr>
        </thead>
        <tbody>
          <NuxtLink
            v-for="structure in structures"
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
              <td>{{ structure.zipcode }}</td>
              <td>{{ structure.city }}</td>
              <td>{{ structure._count.beneficiaries }}</td>
              <td>{{ structure._count.helpRequests }}</td>
              <td>{{ structure._count.followups }}</td>
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
</template>

<script setup lang="ts">
  import { Structures } from './types'
  import { StructureTypeLabels } from '~/client/options/structure'
  import type { StructureAdminSort } from '~/types/table'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    structures: Structures
    pending: boolean
    sort: StructureAdminSort[]
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: StructureAdminSort[]]
  }>()

  const { onSort, tableContainer } = useTable<StructureAdminSort>(
    toRef(() => props.sort),
    toRef(() => props.pending),
    emit
  )

  const beneficiariesSort = computed(
    () => props.sort?.find(s => s?.beneficiaries?._count)?.beneficiaries?._count
  )
</script>
