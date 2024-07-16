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
      :date="
        helpRequest.fileInstruction.socialSupport.date
          ? formatDate(helpRequest.fileInstruction.socialSupport.date)
          : null
      "
      :status="helpRequest.fileInstruction.socialSupport.status"
    />
  </div>

  <div class="fr-col-12">
    <ul
      v-if="
        helpRequest.subject?.name ||
        helpRequest.fileInstruction.externalStructure ||
        helpRequest.fileInstruction.examinationDate ||
        helpRequest.fileInstruction.instructorOrganization?.name ||
        helpRequest.fileInstruction.dispatchDate ||
        helpRequest.fileInstruction.fullFile ||
        helpRequest.fileInstruction.socialSupport.numeroPegase ||
        ministre
      "
    >
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
        :title="helpRequestFieldLabels.numeroPegase"
        :content="helpRequest.fileInstruction.socialSupport.numeroPegase"
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.ministre"
        :content="ministre"
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.examinationDate"
        :content="
          helpRequest.fileInstruction.examinationDate
            ? formatDate(helpRequest.fileInstruction.examinationDate)
            : null
        "
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.instructorOrganizationId"
        :content="helpRequest.fileInstruction.instructorOrganization?.name"
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.instructorOrganizationContactId"
        :content="
          helpRequest.fileInstruction.instructorOrganizationContact?.name
        "
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.dispatchDate"
        :content="
          helpRequest.fileInstruction.dispatchDate != null
            ? formatDate(helpRequest.fileInstruction.dispatchDate)
            : null
        "
      />
      <PrintHelpRequestDetailItem
        :title="helpRequestFieldLabels.fullFile"
        :content="helpRequest.fileInstruction.fullFile ? 'OUI' : null"
      />
    </ul>
    <template
      v-if="
        helpRequest.isRefundable ||
        helpRequest.askedAmount ||
        helpRequest.allocatedAmount ||
        helpRequest.fileInstruction.decisionDate ||
        helpRequest.paymentMethod ||
        helpRequest.paymentDate ||
        helpRequest.handlingDate ||
        refusalReason ||
        helpRequest.fileInstruction.socialSupport.dueDate ||
        helpRequest.fileInstruction.socialSupport.synthesis
      "
    >
      <hr class="fr-mt-4w" />
      <h3>Informations sur l'aide financière</h3>
      <ul>
        <PrintHelpRequestDetailItem
          :title="helpRequestFieldLabels.isRefundable"
          :content="helpRequest.isRefundable ? 'Oui' : 'Non'"
        />
        <PrintHelpRequestDetailItem
          :title="helpRequestFieldLabels.askedAmount"
          :content="
            helpRequest.askedAmount ? helpRequest.askedAmount + '&nbsp;€' : null
          "
        />
        <PrintHelpRequestDetailItem
          :title="helpRequestFieldLabels.allocatedAmount"
          :content="
            helpRequest.allocatedAmount
              ? prismaDecimalToNumber(helpRequest.allocatedAmount) + '&nbsp;€'
              : null
          "
        />
        <PrintHelpRequestDetailItem
          :title="helpRequestFieldLabels.decisionDate"
          :content="
            helpRequest.fileInstruction.decisionDate
              ? formatDate(helpRequest.fileInstruction.decisionDate)
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
            helpRequest.paymentDate ? formatDate(helpRequest.paymentDate) : null
          "
        />
        <PrintHelpRequestDetailItem
          :title="helpRequestFieldLabels.handlingDate"
          :content="
            helpRequest.handlingDate
              ? formatDate(helpRequest.handlingDate)
              : null
          "
        />
        <PrintHelpRequestDetailItem
          :title="helpRequestFieldLabels.refusalReason"
          :content="refusalReason"
        />
        <PrintHelpRequestDetailItem
          :title="helpRequestFieldLabels.dueDate"
          :content="
            helpRequest.fileInstruction.socialSupport.dueDate
              ? formatDate(helpRequest.fileInstruction.socialSupport.dueDate)
              : null
          "
        />
        <PrintHelpRequestDetailItem
          :title="helpRequestFieldLabels.synthesis"
          :content="helpRequest.fileInstruction.socialSupport.synthesis"
        />
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { HelpRequestOutput } from './types'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { helpRequestFieldLabels } from '~/client/labels/helpRequest.labels'
  import { baseRefusalReasonKeys, ministerKeys } from '~/client/options'

  const props = defineProps<{
    helpRequest: HelpRequestOutput
  }>()

  const refusalReason = computed(() => {
    if (!props.helpRequest.fileInstruction.refusalReason) {
      return null
    }
    return baseRefusalReasonKeys.value(
      props.helpRequest.fileInstruction.refusalReason
    )
  })
  const ministre = computed(() => {
    if (!props.helpRequest.fileInstruction.socialSupport.ministre) {
      return null
    }
    return ministerKeys.value(
      props.helpRequest.fileInstruction.socialSupport.ministre
    )
  })
</script>
