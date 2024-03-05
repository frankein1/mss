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
          Entretiens
        </caption>
        <thead>
          <tr>
            <th
              id="status-col"
              scope="col"
            >
              {{ followupFieldLabels.status }}
            </th>
            <TableSortableHeader
              :label="followupFieldLabels.date"
              :sort="sort.socialSupport.date"
              numeric
              @update:sort="
                emit('update:sort', { socialSupport: { date: $event } })
              "
            />
            <TableSortableHeader
              :label="followupFieldLabels.beneficiaryId"
              :sort="sort.socialSupport.beneficiary?.usualName"
              @update:sort="
                emit('update:sort', {
                  socialSupport: {
                    beneficiary: {
                      usualName: $event
                    }
                  }
                })
              "
            />
            <th scope="col">Objet de l'accompagnement</th>
            <TableSortableHeader
              :label="followupFieldLabels.dueDate"
              :sort="sort.socialSupport.dueDate"
              numeric
              @update:sort="
                emit('update:sort', { socialSupport: { dueDate: $event } })
              "
            />
            <th scope="col">Agent</th>
          </tr>
        </thead>
        <tbody>
          <FollowupsRow
            v-for="item in items"
            :key="item.followup.id"
            :data="item"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { FollowupPageItems } from '~/server/trpc/routers'
  import { FollowupSort } from '~/types/table'
  import { followupFieldLabels } from '~/client/labels'

  const props = defineProps<{
    items: FollowupPageItems
    sort: FollowupSort
    pending: boolean
  }>()

  const emit = defineEmits<{
    'update:sort': [sort: FollowupSort]
  }>()

  const { tableContainer } = useTable(toRef(() => props.pending))
</script>
