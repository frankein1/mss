<template>
  <div class="fr-col-12 fr-mt-4w">
    <PrintHelpRequestHeader
      title="Autre demande"
      :beneficiary-firstname="
        helpRequest.fileInstruction.socialSupport.beneficiary.firstName
      "
      :beneficiary-usualname="
        helpRequest.fileInstruction.socialSupport.beneficiary.usualName
      "
      :created-date="formatDate(helpRequest.subject?.created, 'DD/MM/YYYY')"
      :status="helpRequest.fileInstruction.socialSupport.status"
    />
  </div>

  <div class="fr-col-12">
    <ul>
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.subjectId"
        :content="helpRequest.subject?.name"
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.prescribingOrganizationId"
        :content="helpRequest.prescribingOrganization?.name"
      />
      <PrintHelpRequestDetailItem
        title="Le dossier est instruit"
        :content="
          helpRequest.fileInstruction.externalStructure
            ? 'en externe'
            : 'en interne'
        "
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.examinationDate"
        :content="
          helpRequest.fileInstruction.examinationDate
            ? (formatDate(helpRequest.fileInstruction.examinationDate),
              'DD/MM/YYYY')
            : null
        "
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.instructorOrganizationId"
        :content="helpRequest.fileInstruction.instructorOrganization?.name"
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.dispatchDate"
        :content="
          formatDate(helpRequest.fileInstruction.dispatchDate, 'DD/MM/YYYY')
        "
      />
    </ul>
    <hr class="fr-mt-4w" />
    <h3>Information sur le dossier</h3>
    <ul>
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.decisionDate"
        :content="
          formatDate(helpRequest.fileInstruction.decisionDate, 'DD/MM/YYYY')
        "
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.handlingDate"
        :content="formatDate(helpRequest.handlingDate, 'DD/MM/YYYY')"
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.refusalReasonOther"
        :content="helpRequest.fileInstruction.refusalReason"
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.dueDate"
        :content="
          formatDate(
            helpRequest.fileInstruction.socialSupport.dueDate,
            'DD/MM/YYYY'
          )
        "
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.synthesis"
        :content="helpRequest.fileInstruction.socialSupport.synthesis"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { HelpRequestOutput } from './types'
  import { formatDate } from '~/utils/formatDate'
  import { helpRequestFieldLabels } from '~/client/labels/helpRequest.labels'

  defineProps<{
    helpRequest: HelpRequestOutput
  }>()
</script>
