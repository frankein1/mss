<template>
  <div
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
            <th scope="col">
              {{ followupFieldLabels.date }}
              <AtomSortButton
                :sort="dateSort"
                @update:sort="onSort({ date: $event })"
              />
            </th>
            <th scope="col">
              {{ followupFieldLabels.beneficiaryId }}
              <AtomSortButton
                @update:sort="
                  onSort({
                    beneficiary: {
                      usualName: $event
                    }
                  })
                "
              />
            </th>
            <th scope="col">Objet de l'entretien</th>
            <th scope="col">
              {{ followupFieldLabels.dueDate }}
              <AtomSortButton @update:sort="onSort({ dueDate: $event })" />
            </th>
            <th scope="col">Agent</th>
            <th scope="col">N° de dossier</th>
          </tr>
        </thead>
        <tbody>
          <FollowupsTableRow
            v-for="followup in followups"
            :key="followup.id"
            :followup="followup"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { GetFollowupsOutput } from '~/server/routers'
  import { FollowupSort } from '~/types/table'
  import { followupFieldLabels } from '~/client/labels'

  const props = defineProps<{
    followups: GetFollowupsOutput
    sort: FollowupSort[]
  }>()

  const emit = defineEmits<{
    (e: 'update:sort', sort: FollowupSort[]): void
  }>()

  const innerSort = ref(props.sort)

  const { onSort } = useSort<FollowupSort>(innerSort)

  const dateSort = computed(() => props.sort?.find(s => s.date)?.date)

  watch(
    () => props.sort,
    sort => {
      innerSort.value = sort
    }
  )

  watch(innerSort, sort => {
    emit('update:sort', sort)
  })
</script>
