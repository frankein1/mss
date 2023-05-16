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
              Statut
            </th>
            <th scope="col">Type d'entretien</th>
            <th scope="col">Objet de l'entretien</th>
            <th scope="col">
              Date d'échéance
              <AtomSortButton @sort="emit('sort', { dueDate: $event })" />
            </th>
            <th scope="col">
              Bénéficiaire
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

  defineProps<{
    followups: Followups
  }>()

  const emit = defineEmits<{
    (e: 'sort', sort: FollowupSort): void
  }>()
</script>

<style lang="scss" scoped>
  .table-container {
    // 21.5rem seems to come up out of the box. It corresponds to the total height of elements existing above and under the table
    max-height: calc(100vh - 23.5rem);
  }
</style>
