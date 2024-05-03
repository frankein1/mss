<template>
  <div
    v-if="jobs?.length"
    ref="tableContainer"
    class="table-container fr-mt-3w"
    tabindex="0"
  >
    <div
      class="fr-table fr-table--bordered fr-table--no-caption fr-mb-0 fr-pt-0"
    >
      <table>
        <caption>
          Résultats des jobs d'import de structures Data Inclusion
        </caption>

        <thead>
          <tr>
            <th scope="col">Lancement automatique</th>
            <th scope="col">Statut</th>
            <TableSortableHeader
              :sort="sort.startDate"
              label="Début de l'exécution"
              @update:sort="emit('update:sort', { startDate: $event })"
            />
            <th scope="col">Fin de l'exécution</th>
            <th scope="col">Durée en secondes</th>
            <th scope="col">Importées</th>
            <th scope="col">Créées</th>
            <th scope="col">Mises à jour</th>
            <th scope="col">Total</th>
            <th scope="col">Erreurs</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="job in jobs"
            :key="job.id"
          >
            <td>
              {{ (job.name.match('cron')?.length || 0) > 0 ? 'Oui' : 'Non' }}
            </td>
            <td>
              <span
                class="fr-badge"
                :class="[badgeClass[job.status]]"
                >{{ jobResultStatusKeys.value(job.status) }}</span
              >
            </td>
            <td>{{ formatDate(job.startDate, 'DD/MM/YYYY HH:mm') }}</td>
            <td>{{ formatDate(job.endDate, 'DD/MM/YYYY HH:mm') }}</td>
            <td>{{ job.durationInSeconds }}</td>
            <td>{{ job.result.nImported }}</td>
            <td>{{ job.result.nCreated }}</td>
            <td>{{ job.result.nUpdated }}</td>
            <td>{{ count }}</td>
            <td>{{ job.errors.length }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { JobStatus } from '@prisma/client'
  import type { JobResultAdminSort } from '~/types/table'
  import { jobResultStatusKeys } from '~/client/options'
  import { JobResult } from '~/server/schema'

  const props = defineProps<{
    jobs: JobResult[]
    count: number
    pending: boolean
    sort: JobResultAdminSort
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: JobResultAdminSort]
  }>()

  const { tableContainer } = useTable(toRef(() => props.pending))

  const badgeClass: {
    [key in JobStatus]: string
  } = {
    [JobStatus.Created]: 'fr-badge--new',
    [JobStatus.Ongoing]: 'fr-badge--info',
    [JobStatus.Failure]: 'fr-badge--error',
    [JobStatus.Success]: 'fr-badge--success'
  }
</script>
