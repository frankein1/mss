<template>
  <div
    v-if="emails?.length"
    ref="tableContainer"
    class="table-container fr-mt-3w"
    tabindex="0"
  >
    <div
      class="fr-table fr-table--bordered fr-table--no-caption fr-mb-0 fr-pt-0"
    >
      <table>
        <caption>
          Liste des emails
        </caption>
        <thead>
          <tr>
            <th scope="col">Destinataire</th>
            <th scope="col">Objet</th>
            <th scope="col">Statut</th>
            <TableSortableHeader
              label="Date d'envoi"
              @update:sort="onSort({ sentDate: $event })"
            />
            <th scope="col">Nombre d'essais</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="email in emails"
            :key="email.id"
          >
            <td>{{ email.to }}</td>
            <td>{{ email.subject }}</td>
            <td>{{ EmailStatusLabels[email.status] }}</td>
            <td>{{ formatDate(email.sentDate) }}</td>
            <td>{{ email.retryNumber }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Emails } from './types'
  import { EmailStatusLabels } from '~/client/options/email'
  import type { EmailAdminSort } from '~/types/table'

  const props = defineProps<{
    emails: Emails
    pending: boolean
    sort: EmailAdminSort[]
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: EmailAdminSort[]]
  }>()

  const { onSort, tableContainer } = useTable<EmailAdminSort>(
    toRef(() => props.sort),
    toRef(() => props.pending),
    emit
  )
</script>
