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
            <th scope="col">{{ followupFieldLabels.medium }}</th>
            <th scope="col">Objet de l'entretien</th>
            <th scope="col">
              {{ followupFieldLabels.dueDate }}
              <AtomSortButton @sort="emit('sort', { dueDate: $event })" />
            </th>
            <th scope="col">
              {{ followupFieldLabels.beneficiaryId }}
              <AtomSortButton
                @sort="
                  emit('sort', {
                    beneficiary: {
                      usualName: $event
                    }
                  })
                "
              />
            </th>
            <th scope="col">Agent</th>
            <th scope="col">N° de dossier</th>
          </tr>
        </thead>
        <tbody>
          <FollowupsTabPanelTableRow
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
  import { Followups } from './types'
  import { FollowupSort } from '~/types/table'
  import { followupFieldLabels } from '~/client/labels'

  defineProps<{
    followups: Followups
  }>()

  const emit = defineEmits<{
    (e: 'sort', sort: FollowupSort): void
  }>()
</script>
