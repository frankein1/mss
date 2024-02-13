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
              v-if="application.module.helpRequest"
              :label="helpRequestFieldLabels.dueDate"
              :sort="sort.socialSupport?.dueDate"
              numeric
              @update:sort="
                emit('update:sort', { socialSupport: { dueDate: $event } })
              "
            />
            <TableSortableHeader
              :label="helpRequestFieldLabels.beneficiaryId"
              :sort="sort.socialSupport?.beneficiary?.usualName"
              @update:sort="
                emit('update:sort', {
                  socialSupport: { beneficiary: { usualName: $event } }
                })
              "
            />
            <TableSortableHeader
              v-if="application.module.helpRequest"
              :label="helpRequestFieldLabels.instructorOrganizationId"
              :sort="sort.instructorOrganization?.name"
              @update:sort="
                emit('update:sort', {
                  instructorOrganization: { name: $event }
                })
              "
            />
            <th
              v-if="application.module.helpRequest"
              scope="col"
            >
              {{ helpRequestFieldLabels.examinationDate }}
            </th>
            <th
              v-if="application.module.helpRequest"
              scope="col"
            >
              {{ helpRequestFieldLabels.askedAmount }}
            </th>
            <th
              v-if="application.module.helpRequest"
              id="allocated-amount-col"
              scope="col"
            >
              {{ helpRequestFieldLabels.allocatedAmount }}
            </th>
            <th
              v-if="application.module.helpRequest"
              id="payment-method-col"
              scope="col"
            >
              {{ helpRequestFieldLabels.paymentMethod }}
            </th>
            <th
              v-if="application.module.helpRequest"
              id="payment-date-col"
              scope="col"
            >
              {{ helpRequestFieldLabels.paymentDate }}
            </th>
            <th
              v-if="application.module.helpRequest"
              scope="col"
            >
              {{ helpRequestFieldLabels.handlingDate }}
            </th>
            <th scope="col">Agent</th>
            <th scope="col">N° de dossier</th>
          </tr>
        </thead>
        <tbody>
          <FileInstructionRow
            v-for="item in items"
            :key="item.fileInstruction.id"
            :item="item"
            @updated="emit('fileInstructionUpdated', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type {
    FileInstructionPageItems,
    FileInstructionPageItem
  } from './types'
  import { helpRequestFieldLabels } from '~/client/labels'
  import type { FileInstructionSort } from '~/types/table'

  const props = defineProps<{
    items: FileInstructionPageItems
    sort: FileInstructionSort
    pending: boolean
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: FileInstructionSort]
    'fileInstructionUpdated': [fileInstruction: FileInstructionPageItem]
  }>()

  const { application } = usePermissions()

  const { tableContainer } = useTable(toRef(() => props.pending))
</script>
