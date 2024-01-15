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
              v-if="application.module.helpRequestDetail"
              :label="helpRequestFieldLabels.dueDate"
              numeric
              @update:sort="onSort({ socialSupport: { dueDate: $event } })"
            />
            <TableSortableHeader
              :label="helpRequestFieldLabels.beneficiaryId"
              @update:sort="
                onSort({
                  socialSupport: { beneficiary: { usualName: $event } }
                })
              "
            />
            <TableSortableHeader
              v-if="application.module.helpRequestDetail"
              :label="helpRequestFieldLabels.instructorOrganizationId"
              @update:sort="
                onSort({ instructorOrganization: { name: $event } })
              "
            />
            <th
              v-if="application.module.helpRequestDetail"
              scope="col"
            >
              {{ helpRequestFieldLabels.examinationDate }}
            </th>
            <th
              v-if="application.module.helpRequestDetail"
              scope="col"
            >
              {{ helpRequestFieldLabels.askedAmount }}
            </th>
            <th
              v-if="application.module.helpRequestDetail"
              id="allocated-amount-col"
              scope="col"
            >
              {{ helpRequestFieldLabels.allocatedAmount }}
            </th>
            <th
              v-if="application.module.helpRequestDetail"
              id="payment-method-col"
              scope="col"
            >
              {{ helpRequestFieldLabels.paymentMethod }}
            </th>
            <th
              v-if="application.module.helpRequestDetail"
              id="payment-date-col"
              scope="col"
            >
              {{ helpRequestFieldLabels.paymentDate }}
            </th>
            <th
              v-if="application.module.helpRequestDetail"
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
            v-for="item in items"
            :key="item.helpRequest.id"
            :item="item"
            @updated="emit('helpRequestUpdated', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { HelpRequestPageItems, HelpRequestPageItem } from './types'
  import { helpRequestFieldLabels } from '~/client/labels'
  import type { HelpRequestSort } from '~/types/table'

  const props = defineProps<{
    items: HelpRequestPageItems
    sort: HelpRequestSort[]
    pending: boolean
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: HelpRequestSort[]]
    'helpRequestUpdated': [helpRequest: HelpRequestPageItem]
  }>()

  const { application } = usePermissions()

  const { onSort, tableContainer } = useTable<HelpRequestSort>(
    toRef(() => props.sort),
    toRef(() => props.pending),
    emit
  )
</script>
