<template>
  <div class="fr-container">
    <div class="fr-grid-column">
      <div class="fr-col-12">
        <PrintFollowupHeader
          title="Entretien"
          :beneficiary-firstname="followup.beneficiary.firstName"
          :beneficiary-usualname="followup.beneficiary.usualName"
          :date="followup.date ? formatDate(followup.date, 'DD/MM/YYYY') : null"
          :status="followup.status"
        />
      </div>
      <div class="fr-col-12">
        <ul>
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.firstFollowup"
            :content="followup.firstFollowup ? 'OUI' : null"
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.duration"
            :content="followupDurationKeys.value(followup.duration)"
          />

          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.numeroPegase"
            :content="followup.numeroPegase"
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.ministre"
            :content="followup.ministre"
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.medium"
            :content="followupMediumKeys.value(followup.medium)"
          />

          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.thirdPersonName"
            :content="followup.thirdPersonName"
          />
          <PrintHelpRequestDetailItem
            :title="FollowupMedium.ExternalAppointment"
            :content="
              followup.medium === FollowupMedium.ExternalAppointment
                ? 'OUI'
                : null
            "
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.subjects"
            :content="followup.subjects.map(({ name }) => name).join(', ')"
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.prescribingOrganizationId"
            :content="followup.prescribingOrganization?.name"
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.prescribingOrganizationContactId"
            :content="followup.prescribingOrganizationContact?.name"
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.dueDate"
            :content="followup.dueDate ? formatDate(followup.date) : null"
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.synthesis"
            :content="followup.synthesis"
          />
          <li v-if="followup.redirected || followup.helpRequested">
            <span class="fr-text--bold">Actions entreprises&nbsp;:</span>
            <ul>
              <li v-if="followup.redirected">
                Réorienté après l'entretien<span v-if="followup.structureName"
                  >&nbsp;: {{ followup.structureName }}</span
                >
              </li>
              <li v-if="followup.helpRequested">
                {{ followupFieldLabels.helpRequested }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { FollowupMedium } from '@prisma/client'
  import { FollowupOutput } from './types'
  import { formatDate } from '~/utils/formatDate'
  import { followupFieldLabels } from '~/client/labels'
  import { followupMediumKeys, followupDurationKeys } from '~/client/options'

  defineProps<{
    followup: FollowupOutput
  }>()
</script>
