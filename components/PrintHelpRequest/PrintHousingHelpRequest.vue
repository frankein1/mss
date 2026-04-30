<template>
  <div class="fr-container">
    <div class="fr-grid-column">
      <div class="fr-col-12">
        <PrintHelpRequestHeader
          title="Demande de logement"
          :beneficiary-firstname="
            housingHelpRequest.fileInstruction.socialSupport.beneficiary
              .firstName
          "
          :beneficiary-usualname="
            housingHelpRequest.fileInstruction.socialSupport.beneficiary
              .usualName
          "
          :date="
            housingHelpRequest.fileInstruction.socialSupport.date
              ? formatDate(
                  housingHelpRequest.fileInstruction.socialSupport.date
                )
              : null
          "
          :status="housingHelpRequest.fileInstruction.socialSupport.status"
        />
      </div>
      <div class="fr-col-12">
        <ul
          v-if="
            housingHelpRequest.fileInstruction.socialSupport.numeroPegase ||
            housingHelpRequest.fileInstruction.socialSupport.minister ||
            housingHelpRequest.isFirst ||
            housingHelpRequest.firstOpeningDate ||
            askedHousing ||
            housingHelpRequest.fileInstruction.externalStructure ||
            housingHelpRequest.fileInstruction.instructorOrganization?.name ||
            housingHelpRequest.prescribingOrganizationContact?.name ||
            housingHelpRequest.prescribingOrganization?.name ||
            housingHelpRequest.fileInstruction.instructorOrganizationContact
              ?.name ||
            housingHelpRequest.fileInstruction.examinationDate ||
            housingHelpRequest.fileInstruction.dispatchDate
          "
        >
          <PrintDetailItem
            :title="helpRequestFieldLabels.numeroPegase"
            :content="
              housingHelpRequest.fileInstruction.socialSupport.numeroPegase
            "
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.minister"
            :content="ministerName"
          />
          <PrintDetailItem
            v-if="housingHelpRequest.isFirst != null"
            :title="helpRequestFieldLabels.isFirst"
            :content="
              isFirstKeys.value(housingHelpRequest.isFirst ? 'true' : 'false')
            "
          />
          <PrintDetailItem
            :title="housingHelpRequestFieldLabels.firstOpeningDate"
            :content="
              housingHelpRequest.firstOpeningDate
                ? formatDate(housingHelpRequest.firstOpeningDate)
                : null
            "
          />
          <PrintDetailItem
            :title="housingHelpRequestFieldLabels.askedHousing"
            :content="askedHousing"
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.prescribingOrganizationId"
            :content="housingHelpRequest.prescribingOrganization?.name"
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.prescribingOrganizationContactId"
            :content="housingHelpRequest.prescribingOrganizationContact?.name"
          />
          <PrintDetailItem
            title="Le dossier est instruit"
            :content="
              housingHelpRequest.fileInstruction.externalStructure
                ? 'en externe'
                : 'en interne'
            "
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.instructorOrganizationId"
            :content="
              housingHelpRequest.fileInstruction.instructorOrganization?.name
            "
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.instructorOrganizationContactId"
            :content="
              housingHelpRequest.fileInstruction.instructorOrganizationContact
                ?.name
            "
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.examinationDate"
            :content="
              housingHelpRequest.fileInstruction.examinationDate
                ? formatDate(housingHelpRequest.fileInstruction.examinationDate)
                : null
            "
          />
          <PrintDetailItem
            :title="helpRequestFieldLabels.dispatchDate"
            :content="
              housingHelpRequest.fileInstruction.dispatchDate
                ? formatDate(housingHelpRequest.fileInstruction.dispatchDate)
                : null
            "
          />
        </ul>
        <template
          v-if="
            housingReason ||
            housingHelpRequest.uniqueId ||
            housingHelpRequest.fileInstruction.decisionDate ||
            refusalReason ||
            housingHelpRequest.fileInstruction.socialSupport.dueDate
          "
        >
          <hr class="fr-mt-4w" />
          <h3>Informations sur la demande de logement</h3>
          <ul>
            <PrintDetailItem
              :title="housingHelpRequestFieldLabels.reason"
              :content="housingReason"
            />
            <PrintDetailItem
              :title="housingHelpRequestFieldLabels.uniqueId"
              :content="housingHelpRequest.uniqueId"
            />
            <PrintDetailItem
              :title="helpRequestFieldLabels.decisionDate"
              :content="
                housingHelpRequest.fileInstruction.decisionDate
                  ? formatDate(housingHelpRequest.fileInstruction.decisionDate)
                  : null
              "
            />
            <PrintDetailItem
              :title="helpRequestFieldLabels.refusalReason"
              :content="refusalReason"
            />
            <PrintDetailItem
              title="Date d'échéance"
              :content="
                housingHelpRequest.fileInstruction.socialSupport.dueDate
                  ? formatDate(
                      housingHelpRequest.fileInstruction.socialSupport.dueDate
                    )
                  : null
              "
            />
            <PrintDetailItem
              :title="helpRequestFieldLabels.fullFile"
              :content="
                housingHelpRequest.fileInstruction.fullFile ? 'OUI' : null
              "
            />
          </ul>
        </template>
        <template
          v-if="
            housingHelpRequest.taxHouseholdAdditionalInformation ||
            housingHelpRequest.maxRent ||
            housingHelpRequest.maxCharges ||
            housingType ||
            roomCount ||
            lowIncomeHousingType ||
            housingHelpRequest.isPmr
          "
        >
          <hr class="fr-mt-4w" />
          <h3>Caractéristiques du logement demandé</h3>
          <ul>
            <!-- TODO: request benificiary and print Composition du foyer fiscal -->
            <PrintDetailItem
              :title="
                housingHelpRequestFieldLabels.taxHouseholdAdditionalInformation
              "
              :content="housingHelpRequest.taxHouseholdAdditionalInformation"
            />
            <PrintDetailItem
              :title="housingHelpRequestFieldLabels.maxRent"
              :content="
                housingHelpRequest.maxRent
                  ? prismaDecimalToNumber(housingHelpRequest.maxRent) +
                    '&nbsp;€'
                  : null
              "
            />
            <PrintDetailItem
              :title="housingHelpRequestFieldLabels.maxCharges"
              :content="
                housingHelpRequest.maxCharges
                  ? prismaDecimalToNumber(housingHelpRequest.maxCharges) +
                    ' &nbsp;€'
                  : null
              "
            />
            <PrintDetailItem
              :title="housingHelpRequestFieldLabels.housingType"
              :content="housingType"
            />
            <PrintDetailItem
              :title="housingHelpRequestFieldLabels.roomCount"
              :content="roomCount"
            />
            <PrintDetailItem
              :title="housingHelpRequestFieldLabels.lowIncomeHousingType"
              :content="lowIncomeHousingType"
            />
            <PrintDetailItem
              :title="housingHelpRequestFieldLabels.isPmr"
              :content="housingHelpRequest.isPmr ? 'OUI' : null"
            />
          </ul>
        </template>
        <template
          v-if="
            housingHelpRequest.fileInstruction.socialSupport
              .socialSupportRedirections?.length
          "
        >
          <hr class="fr-mt-4w" />
          <h3>Réorientations</h3>
          <ul>
            <li
              v-for="redirection in housingHelpRequest.fileInstruction
                .socialSupport.socialSupportRedirections"
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
                <li v-if="redirection.motif">
                  <span class="fr-text--bold"
                    >{{ socialSupportRedirectionLabels.motif }}&nbsp;:</span
                  >
                  {{ redirection.motif }}
                </li>
              </ul>
            </li>
          </ul>
        </template>
        <template
          v-if="
            housingHelpRequest.fileInstruction.socialSupport
              .synthesisRichText ||
            housingHelpRequest.fileInstruction.socialSupport.synthesis
          "
        >
          <hr class="fr-mt-4w" />
          <h3>{{ helpRequestFieldLabels.synthesis }}</h3>
          <AtomTextEditorReader
            :value="
              housingHelpRequest.fileInstruction.socialSupport.synthesisRichText
            "
            :raw-text="
              housingHelpRequest.fileInstruction.socialSupport.synthesis
            "
            @on-create="$emit('onCreate')"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { HousingHelpRequestOutput } from './types'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { formatDate } from '~/utils/formatDate'
  import {
    askedHousingKeys,
    housingReasonKeys,
    lowIncomeHousingKeys,
    housingTypeKeys,
    roomCountKeys,
    baseRefusalReasonKeys,
    isFirstKeys
  } from '~/client/options'
  import {
    housingHelpRequestFieldLabels,
    helpRequestFieldLabels
  } from '~/client/labels'
  import { socialSupportRedirectionLabels } from '~/client/labels/redirection.labels'
  import { socialSupportRedirectionTypeKeys } from '~/client/options/redirection'
  import { formatMinisterName } from '~/utils/minister'

  const props = defineProps<{
    housingHelpRequest: HousingHelpRequestOutput
  }>()

  defineEmits<{ onCreate: [] }>()

  const askedHousing = computed(() => {
    if (!props.housingHelpRequest.askedHousing?.length) {
      return undefined
    }

    return props.housingHelpRequest.askedHousing
      .map(aH => askedHousingKeys.value(aH))
      .join(', ')
  })

  const housingType = computed(() => {
    if (!props.housingHelpRequest.housingType?.length) {
      return undefined
    }

    return props.housingHelpRequest.housingType
      .map(hT => housingTypeKeys.value(hT))
      .join(', ')
  })
  const lowIncomeHousingType = computed(() => {
    if (!props.housingHelpRequest.lowIncomeHousingType?.length) {
      return undefined
    }

    return props.housingHelpRequest.lowIncomeHousingType
      .map(type => lowIncomeHousingKeys.value(type))
      .join(', ')
  })

  const roomCount = computed(() => {
    if (!props.housingHelpRequest.roomCount?.length) {
      return undefined
    }

    return props.housingHelpRequest.roomCount
      .map(rC => roomCountKeys.value(rC))
      .join(', ')
  })

  const housingReason = computed(() => {
    if (!props.housingHelpRequest.reason) {
      return null
    }
    return housingReasonKeys.value(props.housingHelpRequest.reason)
  })

  const refusalReason = computed(() => {
    if (!props.housingHelpRequest.fileInstruction.refusalReason) {
      return null
    }
    return baseRefusalReasonKeys.value(
      props.housingHelpRequest.fileInstruction.refusalReason
    )
  })

  const ministerName = computed(() => {
    if (!props.housingHelpRequest.fileInstruction.socialSupport.minister) {
      return null
    }
    return formatMinisterName(
      props.housingHelpRequest.fileInstruction.socialSupport.minister
    )
  })
</script>
