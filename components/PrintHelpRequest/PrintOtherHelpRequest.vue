<template>
  <div class="fr-container">
    <div class="fr-grid-column">
      <div class="fr-col-12">
        <PrintHelpRequestHeader
          title="Autre demande"
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
            helpRequest.fileInstruction.socialSupport.numeroPegase ||
            ministre ||
            helpRequest.subject?.name ||
            helpRequest.prescribingOrganization?.name ||
            helpRequest.prescribingOrganizationContact?.name ||
            helpRequest.fileInstruction.externalStructure ||
            helpRequest.fileInstruction.examinationDate ||
            helpRequest.fileInstruction.instructorOrganization?.name ||
            helpRequest.fileInstruction.instructorOrganizationContact?.name ||
            helpRequest.fileInstruction.dispatchDate ||
            helpRequest.fileInstruction.fullFile
          "
        >
          <PrintDetailItem
            :title="helpRequestFieldLabels.numeroPegase"
            :content="helpRequest.fileInstruction.socialSupport.numeroPegase"
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.ministre"
            :content="ministre"
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.subjectId"
            :content="helpRequest.subject?.name"
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.prescribingOrganizationId"
            :content="helpRequest.prescribingOrganization?.name"
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.prescribingOrganizationContactId"
            :content="helpRequest.prescribingOrganizationContact?.name"
          />
          <PrintDetailItem
            title="Le dossier est instruit"
            :content="
              helpRequest.fileInstruction.externalStructure
                ? 'en externe'
                : 'en interne'
            "
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.examinationDate"
            :content="
              helpRequest.fileInstruction.examinationDate
                ? formatDate(helpRequest.fileInstruction.examinationDate)
                : null
            "
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.instructorOrganizationId"
            :content="helpRequest.fileInstruction.instructorOrganization?.name"
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.instructorOrganizationContactId"
            :content="
              helpRequest.fileInstruction.instructorOrganizationContact?.name
            "
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.dispatchDate"
            :content="
              helpRequest.fileInstruction.dispatchDate
                ? formatDate(helpRequest.fileInstruction.dispatchDate)
                : null
            "
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.fullFile"
            :content="helpRequest.fileInstruction.fullFile ? 'OUI' : null"
          />
        </ul>
        <template
          v-if="
            helpRequest.fileInstruction.decisionDate ||
            helpRequest.handlingDate ||
            refusalReason ||
            helpRequest.fileInstruction.socialSupport.dueDate
          "
        >
          <hr class="fr-mt-4w" />
          <h3>Information sur le dossier</h3>
          <ul>
            <PrintDetailItem
              :title="helpRequestFieldLabels.decisionDate"
              :content="
                helpRequest.fileInstruction.decisionDate
                  ? formatDate(helpRequest.fileInstruction.decisionDate)
                  : null
              "
            />
            <PrintDetailItem
              :title="helpRequestFieldLabels.handlingDate"
              :content="
                helpRequest.handlingDate
                  ? formatDate(helpRequest.handlingDate)
                  : null
              "
            />
            <PrintDetailItem
              :title="helpRequestFieldLabels.refusalReasonOther"
              :content="refusalReason"
            />
            <PrintDetailItem
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
          </ul>
        </template>
        <template
          v-if="
            helpRequest.fileInstruction.socialSupport.synthesis ||
            helpRequest.fileInstruction.fullFile
          "
        >
          <hr class="fr-mt-4w" />
          <h3>{{ helpRequestFieldLabels.synthesis }}</h3>
          <ul>
            <PrintDetailItem
              :title="helpRequestFieldLabels.synthesis"
              :content="helpRequest.fileInstruction.socialSupport.synthesis"
            />
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { HelpRequestOutput } from './types'
  import { formatDate } from '~/utils/formatDate'
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
