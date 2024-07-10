<template>
  <h1>Aide Financière</h1>
  <h2>
    Instruction du dossier de
    {{ helpRequest.fileInstruction.socialSupport.beneficiary.firstName }}&nbsp;
    {{ helpRequest.fileInstruction.socialSupport.beneficiary.usualName }}
    <br />Ouverture :
    {{ formatDate(helpRequest.subject?.created, 'DD/MM/YYYY') }}
    <br />
    {{ helpRequestFieldLabels.status }} :
    {{ helpRequest.fileInstruction.socialSupport.status }}
  </h2>
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
  <hr class="fr-mt-4w" />
  <h3>Informations sur l'aide financière</h3>
  <PrintHelpRequestDetailItem
    :title="helpRequestFieldLabels.isRefundable"
    :content="helpRequest.isRefundable ? 'Oui' : 'Non'"
  />
  <PrintHelpRequestDetailItem
    :title="helpRequestFieldLabels.askedAmount"
    :content="helpRequest.askedAmount + ' €'"
  />
  <PrintHelpRequestDetailItem
    :title="helpRequestFieldLabels.allocatedAmount"
    :content="prismaDecimalToNumber(helpRequest.allocatedAmount)"
  />
  <PrintHelpRequestDetailItem
    :title="helpRequestFieldLabels.decisionDate"
    :content="
      formatDate(helpRequest.fileInstruction.decisionDate, 'DD/MM/YYYY')
    "
  />
  <PrintHelpRequestDetailItem
    :title="helpRequestFieldLabels.paymentMethod"
    :content="helpRequest.paymentMethod"
  />
  <PrintHelpRequestDetailItem
    :title="helpRequestFieldLabels.paymentDate"
    :content="formatDate(helpRequest.paymentDate, 'DD/MM/YYYY')"
  />
  <PrintHelpRequestDetailItem
    :title="helpRequestFieldLabels.handlingDate"
    :content="formatDate(helpRequest.handlingDate, 'DD/MM/YYYY')"
  />
  <PrintHelpRequestDetailItem
    :title="helpRequestFieldLabels.refusalReason"
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
