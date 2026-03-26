<template>
  <div class="fr-container">
    <div class="fr-grid-column">
      <div class="fr-col-12">
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
            helpRequest.fileInstruction.socialSupport.numeroPegase ||
            ministerName ||
            helpRequest.subject?.name ||
            helpRequest.prescribingOrganization?.name ||
            helpRequest.prescribingOrganizationContact?.name ||
            helpRequest.fileInstruction.externalStructure ||
            helpRequest.fileInstruction.instructorOrganization?.name ||
            helpRequest.fileInstruction.instructorOrganizationContact?.name ||
            helpRequest.fileInstruction.dispatchDate
          "
        >
          <PrintDetailItem
            :title="helpRequestFieldLabels.numeroPegase"
            :content="helpRequest.fileInstruction.socialSupport.numeroPegase"
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.minister"
            :content="ministerName"
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
              helpRequest.fileInstruction.dispatchDate != null
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
            helpRequest.isRefundable ||
            helpRequest.askedAmount ||
            helpRequest.allocatedAmount ||
            helpRequest.fileInstruction.decisionDate ||
            helpRequest.handlingDate ||
            paymentMethod ||
            helpRequest.paymentDate ||
            helpRequest.fileInstruction.socialSupport.dueDate ||
            refusalReason
          "
        >
          <hr class="fr-mt-4w" />
          <h3>Informations sur l'aide financière</h3>
          <ul>
            <PrintDetailItem
              :title="helpRequestFieldLabels.isRefundable"
              :content="helpRequest.isRefundable ? 'Oui' : 'Non'"
            />
            <PrintDetailItem
              :title="helpRequestFieldLabels.askedAmount"
              :content="
                helpRequest.askedAmount
                  ? helpRequest.askedAmount + '&nbsp;€'
                  : null
              "
            />
            <PrintDetailItem
              :title="helpRequestFieldLabels.allocatedAmount"
              :content="
                helpRequest.allocatedAmount
                  ? prismaDecimalToNumber(helpRequest.allocatedAmount) +
                    '&nbsp;€'
                  : null
              "
            />
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
              :title="helpRequestFieldLabels.paymentMethod"
              :content="paymentMethod"
            />
            <PrintDetailItem
              :title="helpRequestFieldLabels.paymentDate"
              :content="
                helpRequest.paymentDate
                  ? formatDate(helpRequest.paymentDate)
                  : null
              "
            />
            <PrintDetailItem
              :title="helpRequestFieldLabels.dueDate"
              :content="
                helpRequest.fileInstruction.socialSupport.dueDate
                  ? formatDate(
                      helpRequest.fileInstruction.socialSupport.dueDate
                    )
                  : null
              "
            />
            <PrintDetailItem
              :title="helpRequestFieldLabels.refusalReason"
              :content="refusalReason"
            />
          </ul>
        </template>
        <template
          v-if="
            helpRequest.fileInstruction.socialSupport.socialSupportRedirections
              ?.length
          "
        >
          <hr class="fr-mt-4w" />
          <h3>Réorientations</h3>
          <ul
            v-for="redirection in helpRequest.fileInstruction.socialSupport
              .socialSupportRedirections"
            :key="redirection.id"
          >
            <PrintDetailItem
              :title="socialSupportRedirectionLabels.type"
              :content="
                socialSupportRedirectionTypeKeys.value(redirection.type)
              "
            />
            <PrintDetailItem
              :title="socialSupportRedirectionLabels.partnerOrganizationId"
              :content="redirection.partnerOrganization?.name"
            />
            <PrintDetailItem
              :title="
                socialSupportRedirectionLabels.partnerOrganizationContactId
              "
              :content="redirection.partnerOrganizationContact?.name"
            />
            <PrintDetailItem
              :title="socialSupportRedirectionLabels.externalStructureName"
              :content="redirection.externalStructureName"
            />
            <PrintDetailItem
              :title="socialSupportRedirectionLabels.motif"
              :content="redirection.motif"
            />
          </ul>
        </template>
        <template
          v-if="
            helpRequest.fileInstruction.socialSupport.synthesisRichText ||
            helpRequest.fileInstruction.socialSupport.synthesis
          "
        >
          <hr class="fr-mt-4w" />
          <h3>{{ helpRequestFieldLabels.synthesis }}</h3>
          <AtomTextEditorReader
            :value="helpRequest.fileInstruction.socialSupport.synthesisRichText"
            :raw-text="helpRequest.fileInstruction.socialSupport.synthesis"
            @on-create="$emit('onCreate')"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { HelpRequestOutput } from './types'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { helpRequestFieldLabels } from '~/client/labels/helpRequest.labels'
  import { socialSupportRedirectionLabels } from '~/client/labels/redirection.labels'
  import { baseRefusalReasonKeys, paymentMethodKeys } from '~/client/options'
  import { socialSupportRedirectionTypeKeys } from '~/client/options/redirection'
  import { formatMinisterName } from '~/utils/minister'

  const props = defineProps<{
    helpRequest: HelpRequestOutput
  }>()
  defineEmits<{ onCreate: [] }>()

  const refusalReason = computed(() => {
    if (!props.helpRequest.fileInstruction.refusalReason) {
      return null
    }
    return baseRefusalReasonKeys.value(
      props.helpRequest.fileInstruction.refusalReason
    )
  })
  const ministerName = computed(() => {
    if (!props.helpRequest.fileInstruction.socialSupport.minister) {
      return null
    }
    return formatMinisterName(
      props.helpRequest.fileInstruction.socialSupport.minister
    )
  })

  const paymentMethod = computed(() => {
    if (!props.helpRequest.paymentMethod) {
      return null
    }
    return paymentMethodKeys.value(props.helpRequest.paymentMethod)
  })
</script>
