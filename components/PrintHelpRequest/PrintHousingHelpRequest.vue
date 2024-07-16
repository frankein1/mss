<template>
  <!-- TODO; improve Titles and create a component -->
  <div class="fr-container">
    <div class="fr-grid-column">
      <div class="fr-col-12 fr-mt-4w">
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
        <ul>
          <PrintHelpRequestDetailItem
            title="1ère demande ou renouvellement"
            :content="
              housingHelpRequest.isFirst ? '1ère demande' : 'renouvellement'
            "
          />
          <PrintHelpRequestDetailItem
            :title="housingHelpRequestFieldLabels.askedHousing"
            :content="askedHousing"
          />
          <PrintHelpRequestDetailItem
            title="Le dossier est instruit"
            :content="
              housingHelpRequest.fileInstruction.externalStructure
                ? 'en externe'
                : 'en interne'
            "
          />
          <PrintHelpRequestDetailItem
            :title="helpRequestFieldLabels.numeroPegase"
            :content="
              housingHelpRequest.fileInstruction.socialSupport.numeroPegase
            "
          />
          <PrintHelpRequestDetailItem
            :title="helpRequestFieldLabels.ministre"
            :content="ministre"
          />
          <PrintHelpRequestDetailItem
            :title="helpRequestFieldLabels.examinationDate"
            :content="
              housingHelpRequest.fileInstruction.examinationDate
                ? formatDate(housingHelpRequest.fileInstruction.examinationDate)
                : null
            "
          />

          <PrintHelpRequestDetailItem
            :title="helpRequestFieldLabels.instructorOrganizationId"
            :content="
              housingHelpRequest.fileInstruction.instructorOrganization?.name
            "
          />
          <PrintHelpRequestDetailItem
            :title="helpRequestFieldLabels.instructorOrganizationContactId"
            :content="
              housingHelpRequest.fileInstruction.instructorOrganizationContact
                ?.name
            "
          />

          <PrintHelpRequestDetailItem
            :title="helpRequestFieldLabels.dispatchDate"
            :content="
              housingHelpRequest.fileInstruction.dispatchDate
                ? formatDate(housingHelpRequest.fileInstruction.dispatchDate)
                : null
            "
          />
          <PrintHelpRequestDetailItem
            :title="helpRequestFieldLabels.refusalReason"
            :content="refusalReason"
          />
          <PrintHelpRequestDetailItem
            :title="helpRequestFieldLabels.decisionDate"
            :content="
              housingHelpRequest.fileInstruction.decisionDate
                ? formatDate(housingHelpRequest.fileInstruction.decisionDate)
                : null
            "
          />
          <PrintHelpRequestDetailItem
            :title="helpRequestFieldLabels.fullFile"
            :content="
              housingHelpRequest.fileInstruction.fullFile ? 'OUI' : null
            "
          />
        </ul>
        <template v-if="housingReason || housingHelpRequest.uniqueId">
          <hr class="fr-mt-4w" />
          <h3>Informations sur la demande de logement</h3>
          <ul>
            <PrintHelpRequestDetailItem
              :title="housingHelpRequestFieldLabels.reason"
              :content="housingReason"
            />
            <PrintHelpRequestDetailItem
              :title="housingHelpRequestFieldLabels.uniqueId"
              :content="housingHelpRequest.uniqueId"
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
            housingHelpRequest.isPmr ||
            housingHelpRequest.fileInstruction.socialSupport.synthesis
          "
        >
          <hr class="fr-mt-4w" />
          <h3>Caractéristiques du logement demandé</h3>
          <ul>
            <!-- TODO: request benificiary -->
            <PrintHelpRequestDetailItem
              title="Composition du foyer fiscal"
              content="[INFO RENSEIGNEES DANS LE PROFIL + champs PRECISIONS SUR LA COMPOSITION DI FOYER] (si renseignés)"
            />
            <PrintHelpRequestDetailItem
              :title="
                housingHelpRequestFieldLabels.taxHouseholdAdditionalInformation
              "
              :content="housingHelpRequest.taxHouseholdAdditionalInformation"
            />
            <PrintHelpRequestDetailItem
              :title="housingHelpRequestFieldLabels.maxRent"
              :content="
                housingHelpRequest.maxRent
                  ? prismaDecimalToNumber(housingHelpRequest.maxRent) +
                    '&nbsp;€'
                  : null
              "
            />
            <PrintHelpRequestDetailItem
              :title="housingHelpRequestFieldLabels.maxCharges"
              :content="
                housingHelpRequest.maxCharges
                  ? prismaDecimalToNumber(housingHelpRequest.maxCharges) +
                    ' &nbsp;€'
                  : null
              "
            />
            <PrintHelpRequestDetailItem
              :title="housingHelpRequestFieldLabels.housingType"
              :content="housingType"
            />
            <PrintHelpRequestDetailItem
              :title="housingHelpRequestFieldLabels.lowIncomeHousingType"
              :content="lowIncomeHousingType"
            />
            <PrintHelpRequestDetailItem
              :title="housingHelpRequestFieldLabels.roomCount"
              :content="roomCount"
            />
            <PrintHelpRequestDetailItem
              :title="housingHelpRequestFieldLabels.isPmr"
              :content="housingHelpRequest.isPmr ? 'OUI' : null"
            />
            <PrintHelpRequestDetailItem
              :title="helpRequestFieldLabels.synthesis"
              :content="
                housingHelpRequest.fileInstruction.socialSupport.synthesis
              "
            />
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { HousingHelpRequestOutput } from './types'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { formatDate } from '~/utils/formatDate'
  import {
    askedHousingKeys,
    housingReasonKeys,
    lowIncomeHousingKeys,
    housingTypeKeys,
    roomCountKeys,
    baseRefusalReasonKeys,
    ministerKeys
  } from '~/client/options'
  import {
    housingHelpRequestFieldLabels,
    helpRequestFieldLabels
  } from '~/client/labels'

  const props = defineProps<{
    housingHelpRequest: HousingHelpRequestOutput
  }>()

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
  const ministre = computed(() => {
    if (!props.housingHelpRequest.fileInstruction.socialSupport.ministre) {
      return null
    }
    return ministerKeys.value(
      props.housingHelpRequest.fileInstruction.socialSupport.ministre
    )
  })
</script>
