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
              :sort="sort.beneficiaries?._count"
              numeric
              @update:sort="
                emit('update:sort', { beneficiaries: { _count: $event } })
              "
            />
            <th scope="col">Inst. dossier + Entretiens</th>
            <th scope="col">Utilisateurs</th>
            <TableSortableHeader
              label="Dernière activité"
              :sort="sort.lastActivity"
              numeric
              @update:sort="emit('update:sort', { lastActivity: $event })"
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
              <td>{{ structure._count.socialSupports }}</td>
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
    sort: StructureAdminSort
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: StructureAdminSort]
  }>()

  const { tableContainer } = useTable(toRef(() => props.pending))
</script>
