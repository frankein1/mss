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
            <th scope="col">Objet de la demande</th>
            <th
              v-if="canAccessRestrictedFieldsInHelpRequest"
              scope="col"
            >
              {{ helpRequestFieldLabels.dueDate }}
              <AtomSortButton @sort="emit('sort', { dueDate: $event })" />
            </th>
            <th scope="col">
              {{ helpRequestFieldLabels.beneficiaryId }}
              <AtomSortButton
                @sort="emit('sort', { beneficiary: { usualName: $event } })"
              />
            </th>
            <template v-if="canAccessRestrictedFieldsInHelpRequest">
              <th scope="col">
                {{ helpRequestFieldLabels.examiningOrganisation }}
                <!-- TODO: Add organisme instructeur -->
                <!-- <AtomSortButton
                      @sort="onSort($event, 'organisme_instructeur.name')"
                    /> -->
              </th>
              <th scope="col">{{ helpRequestFieldLabels.examinationDate }}</th>
              <th scope="col">{{ helpRequestFieldLabels.askedAmount }}</th>
              <th
                id="allocated-amount-col"
                scope="col"
              >
                {{ helpRequestFieldLabels.allocatedAmount }}
              </th>
              <th
                id="payment-method-col"
                scope="col"
              >
                {{ helpRequestFieldLabels.paymentMethod }}
              </th>
              <th
                id="payment-date-col"
                scope="col"
              >
                {{ helpRequestFieldLabels.paymentDate }}
              </th>
              <th scope="col">{{ helpRequestFieldLabels.handlingDate }}</th>
            </template>
            <th scope="col">Agent</th>
            <th scope="col">N° de dossier</th>
          </tr>
        </thead>
        <tbody>
          <HelpRequestsTabPanelTableRow
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

  defineProps<{
    helpRequests: HelpRequests
  }>()

  const emit = defineEmits<{
    (e: 'sort', sort: HelpRequestSort): void
    (e: 'helpRequestUpdated', helpRequest: HelpRequestItem): void
  }>()

  const canAccessRestrictedFieldsInHelpRequest = computed(
    () => true
    // () => permissionsStore.canAccessRestrictedFieldsInHelpRequest
  )
</script>
