<template>
  <div class="fr-container">
    <div class="fr-grid-column">
      <div class="fr-col-12 fr-mt-4w">
        <PrintFollowUpHeader
          title="Entretien"
          :beneficiary-firstname="followUp.beneficiary.firstName"
          :beneficiary-usualname="followUp.beneficiary.usualName"
          :date="followUp.date ? formatDate(followUp.date, 'DD/MM/YYYY') : null"
          :status="followUp.status"
        />
      </div>
      <div class="fr-col-12">
        <ul>
          <PrintHelpRequestDetailItem
            title="1 er entretien"
            :content="followUp.firstFollowup ? 'OUI' : null"
          />

          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.numeroPegase"
            :content="followUp.numeroPegase"
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.medium"
            :content="followupMediumKeys.value(followUp.medium)"
          />

          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.thirdPersonName"
            :content="followUp.thirdPersonName"
          />
          <PrintHelpRequestDetailItem
            title="Rendez-vous à l'extérieur"
            :content="
              followUp.medium === FollowupMedium.ExternalAppointment
                ? 'OUI'
                : null
            "
          />

          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.ministre"
            :content="followUp.ministre"
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.subjects"
            :content="subjects"
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.prescribingOrganizationId"
            :content="followUp.prescribingOrganization?.name"
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.dueDate"
            :content="
              followUp.dueDate ? formatDate(followUp.date, 'DD/MM/YYYY') : null
            "
          />
          <PrintHelpRequestDetailItem
            :title="followupFieldLabels.synthesis"
            :content="followUp.synthesis"
          />
          <PrintHelpRequestDetailItem
            title="Actions entreprise"
            content="TODO (si cochées, détailler les case cochées et nom de l'organisme si rempli)"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { FollowupMedium } from '@prisma/client'
  import { FollowUpOutput } from './types'
  // import { formatDate } from '~/utils/formatDate'
  import { followupFieldLabels } from '~/client/labels'
  import { followupMediumKeys } from '~/client/options'

  const props = defineProps<{
    followUp: FollowUpOutput
  }>()

  console.log(props.followUp)
  const subjects = props.followUp.subjects.map(({ name }) => name).join(', ')
</script>
