<template>
  <div class="fr-col-12 fr-mt-4w">
    <PrintHelpRequestHeader
      title="Aide Financière"
      :beneficiary-firstname="
        helpRequest.fileInstruction.socialSupport.beneficiary.firstName
      "
      :beneficiary-usualname="
        helpRequest.fileInstruction.socialSupport.beneficiary.usualName
      "
      :created-date="
        helpRequest.subject?.created
          ? formatDate(helpRequest.subject?.created, 'DD/MM/YYYY')
          : null
      "
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
          helpRequest.fileInstruction.dispatchDate
            ? formatDate(helpRequest.fileInstruction.dispatchDate, 'DD/MM/YYYY')
            : null
        "
      />
    </ul>

    <hr class="fr-mt-4w" />
    <h3>Informations sur l'aide financière</h3>
    <ul>
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.isRefundable"
        :content="helpRequest.isRefundable ? 'Oui' : 'Non'"
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.askedAmount"
        :content="helpRequest.askedAmount + '&nbsp;€'"
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.allocatedAmount"
        :content="
          helpRequest.allocatedAmount
            ? prismaDecimalToNumber(helpRequest.allocatedAmount)
            : null
        "
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.decisionDate"
        :content="
          helpRequest.fileInstruction.decisionDate
            ? formatDate(helpRequest.fileInstruction.decisionDate, 'DD/MM/YYYY')
            : null
        "
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.paymentMethod"
        :content="helpRequest.paymentMethod"
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.paymentDate"
        :content="
          helpRequest.paymentDate
            ? formatDate(helpRequest.paymentDate, 'DD/MM/YYYY')
            : null
        "
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.handlingDate"
        :content="
          helpRequest.handlingDate
            ? formatDate(helpRequest.handlingDate, 'DD/MM/YYYY')
            : null
        "
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.refusalReason"
        :content="helpRequest.fileInstruction.refusalReason"
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.dueDate"
        :content="
          helpRequest.fileInstruction.socialSupport.dueDate
            ? formatDate(
                helpRequest.fileInstruction.socialSupport.dueDate,
                'DD/MM/YYYY'
              )
            : null
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
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { formatDate } from '~/utils/formatDate'
  import { helpRequestFieldLabels } from '~/client/labels/helpRequest.labels'

  defineProps<{
    helpRequest: HelpRequestOutput
  }>()
</script>
