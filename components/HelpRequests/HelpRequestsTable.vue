<template>
  <div
    ref="tableContainer"
    class="table-container fr-pb-0"
    tabindex="0"
  >
    <div
      class="fr-table fr-table--bordered fr-mb-0 fr-pt-0 fr-table--no-caption"
    >
      <table>
        <caption>
          Instructions
        </caption>
        <thead>
          <tr>
            <th
              id="status-col"
              scope="col"
            >
              {{ helpRequestFieldLabels.status }}
            </th>
            <th scope="col">Objet d'accompagnement</th>
            <TableSortableHeader
              v-if="permissions?.get.anyDueDate"
              :label="helpRequestFieldLabels.dueDate"
              numeric
              @update:sort="onSort({ dueDate: $event })"
            />
            <TableSortableHeader
              :label="helpRequestFieldLabels.beneficiaryId"
              @update:sort="onSort({ beneficiary: { usualName: $event } })"
            />
            <TableSortableHeader
              v-if="permissions?.get.anyInstructorOrganization"
              :label="helpRequestFieldLabels.instructorOrganizationId"
              @update:sort="
                onSort({ instructorOrganization: { name: $event } })
              "
            />
            <th
              v-if="permissions?.get.anyExaminationDate"
              scope="col"
            >
              {{ helpRequestFieldLabels.examinationDate }}
            </th>
            <th
              v-if="permissions?.get.anyAskedAmount"
              scope="col"
            >
              {{ helpRequestFieldLabels.askedAmount }}
            </th>
            <th
              v-if="permissions?.get.anyAllocatedAmount"
              id="allocated-amount-col"
              scope="col"
            >
              {{ helpRequestFieldLabels.allocatedAmount }}
            </th>
            <th
              v-if="permissions?.get.anyPaymentMethod"
              id="payment-method-col"
              scope="col"
            >
              {{ helpRequestFieldLabels.paymentMethod }}
            </th>
            <th
              v-if="permissions?.get.anyPaymentDate"
              id="payment-date-col"
              scope="col"
            >
              {{ helpRequestFieldLabels.paymentDate }}
            </th>
            <th
              v-if="permissions?.get.anyHandlingDate"
              scope="col"
            >
              {{ helpRequestFieldLabels.handlingDate }}
            </th>
            <th scope="col">Agent</th>
            <th scope="col">N° de dossier</th>
          </tr>
        </thead>
        <tbody>
          <HelpRequestsRow
            v-for="helpRequest in helpRequests"
            :key="helpRequest.id"
            :help-request="helpRequest"
            @updated="emit('helpRequestUpdated', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { HelpRequests, HelpRequestItem } from './types'
  import { helpRequestFieldLabels } from '~/client/labels'
  import type { HelpRequestSort } from '~/types/table'
  import { HelpRequestPermissions } from '~/server/security'

  const props = defineProps<{
    helpRequests: HelpRequests
    sort: HelpRequestSort[]
    pending: boolean
    permissions: HelpRequestPermissions | null
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: HelpRequestSort[]]
    'helpRequestUpdated': [helpRequest: HelpRequestItem]
  }>()

  const { onSort, tableContainer } = useTable<HelpRequestSort>(
    toRef(() => props.sort),
    toRef(() => props.pending),
    emit
  )
</script>
