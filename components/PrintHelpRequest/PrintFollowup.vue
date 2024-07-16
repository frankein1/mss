<template>
  <div class="fr-container">
    <div class="fr-grid-column">
      <div class="fr-col-12 fr-mt-4w">
<<<<<<< HEAD
        <PrintFollowupHeader
          title="Entretien"
          :beneficiary-firstname="followup.beneficiary.firstName"
          :beneficiary-usualname="followup.beneficiary.usualName"
          :date="followup.date ? formatDate(followup.date, 'DD/MM/YYYY') : null"
          :status="followup.status"
=======
        <PrintFollowUpHeader
          title="Entretien"
          :beneficiary-firstname="followUp.beneficiary.firstName"
          :beneficiary-usualname="followUp.beneficiary.usualName"
          :date="followUp.date ? formatDate(followUp.date, 'DD/MM/YYYY') : null"
          :status="followUp.status"
>>>>>>> f4a4e063 (feat(historique): imprimer un entretien -wip)
        />
      </div>
      <div class="fr-col-12">
        <ul>
          <PrintHelpRequestDetailItem
            title="1 er entretien"
<<<<<<< HEAD
            :content="followup.firstFollowup ? 'OUI' : null"
=======
            :content="followUp.firstFollowup ? 'OUI' : null"
>>>>>>> f4a4e063 (feat(historique): imprimer un entretien -wip)
          />

          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.numeroPegase"
<<<<<<< HEAD
            :content="followup.numeroPegase"
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.medium"
            :content="followupMediumKeys.value(followup.medium)"
=======
            :content="followUp.numeroPegase"
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.medium"
            :content="followupMediumKeys.value(followUp.medium)"
>>>>>>> f4a4e063 (feat(historique): imprimer un entretien -wip)
          />

          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.thirdPersonName"
            :content="followup.thirdPersonName"
          />
          <PrintHelpRequestDetailItem
            title="Rendez-vous à l'extérieur"
            :content="
              followup.medium === FollowupMedium.ExternalAppointment
                ? 'OUI'
                : null
            "
          />

          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.ministre"
            :content="followup.ministre"
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
            :title="followupFieldLabels.dueDate"
            :content="
              followup.dueDate ? formatDate(followup.date, 'DD/MM/YYYY') : null
            "
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
  import { followupMediumKeys } from '~/client/options'

  defineProps<{
    followup: FollowupOutput
  }>()
</script>
