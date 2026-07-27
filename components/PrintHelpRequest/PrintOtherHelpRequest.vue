<template>
  <div class="fr-container">
    <div class="fr-grid-column">
      <div class="fr-col-12">
        <PrintHelpRequestHeader
          title="Autre demande"
          :beneficiary="helpRequest.fileInstruction.socialSupport.beneficiary"
          :date="
            helpRequest.fileInstruction.socialSupport.date
              ? formatDate(helpRequest.fileInstruction.socialSupport.date)
              : null
          "
          :created-by="helpRequest.fileInstruction.socialSupport.createdBy"
          :last-updated-by="
            helpRequest.fileInstruction.socialSupport.lastUpdatedBy
          "
          :updated="
            helpRequest.fileInstruction.socialSupport.updated
              ? formatDate(
                  helpRequest.fileInstruction.socialSupport.updated,
                  'DD/MM/YYYY'
                )
              : null
          "
          :status="helpRequest.fileInstruction.socialSupport.status"
        />
      </div>

      <div class="fr-col-12">
        <ul
          v-if="
            helpRequest.fileInstruction.socialSupport.numeroPegase ||
            helpRequest.fileInstruction.socialSupport.minister ||
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
            <!-- <PrintDetailItem
              :title="helpRequestFieldLabels.endOfSocialSupport"
              :content="
                helpRequest.fileInstruction.socialSupport.endOfSocialSupport
                  ? 'OUI'
                  : null
              "
            /> -->
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
            helpRequest.fileInstruction.socialSupport.socialSupportRedirections
              ?.length
          "
        >
          <hr class="fr-mt-4w" />
          <h3>Réorientations</h3>
          <ul>
            <li
              v-for="redirection in helpRequest.fileInstruction.socialSupport
                .socialSupportRedirections"
              :key="redirection.id"
            >
              <span class="fr-text--bold">Réorientation&nbsp;:</span>
              {{ socialSupportRedirectionTypeKeys.value(redirection.type) }}
              <ul>
                <li v-if="redirection.partnerOrganization?.name">
                  <span class="fr-text--bold"
                    >{{
                      socialSupportRedirectionLabels.partnerOrganizationId
                    }}&nbsp;:</span
                  >
                  {{ redirection.partnerOrganization.name }}
                </li>
                <li v-if="redirection.partnerOrganizationContact?.name">
                  <span class="fr-text--bold"
                    >{{
                      socialSupportRedirectionLabels.partnerOrganizationContactId
                    }}&nbsp;:</span
                  >
                  {{ redirection.partnerOrganizationContact.name }}
                </li>
                <li v-if="redirection.externalStructureName">
                  <span class="fr-text--bold"
                    >{{
                      socialSupportRedirectionLabels.externalStructureName
                    }}&nbsp;:</span
                  >
                  {{ redirection.externalStructureName }}
                </li>
              </ul>
            </li>
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
  import { formatDate } from '~/utils/formatDate'
  import { helpRequestFieldLabels } from '~/client/labels/helpRequest.labels'
  import { socialSupportRedirectionLabels } from '~/client/labels/redirection.labels'
  import { baseRefusalReasonKeys } from '~/client/options'
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
</script>
