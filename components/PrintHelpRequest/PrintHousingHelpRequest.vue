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
          :created-date="
            formatDate(housingHelpRequest.firstOpeningDate, 'DD/MM/YYYY')
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
            title="En commission le"
            :content="
              housingHelpRequest.fileInstruction.examinationDate
                ? (formatDate(
                    housingHelpRequest.fileInstruction.examinationDate
                  ),
                  'DD/MM/YYYY')
                : null
            "
          />

          <PrintHelpRequestDetailItem
            title="Organisme instructeur"
            :content="
              housingHelpRequest.fileInstruction.instructorOrganization?.name
            "
          />

          <PrintHelpRequestDetailItem
            title="Date d'envoi du dossier"
            :content="
              formatDate(
                housingHelpRequest.fileInstruction.dispatchDate,
                'DD/MM/YYYY'
              )
            "
          />
        </ul>
        <hr class="fr-mt-4w" />
        <h3>Informations sur la demande de logement</h3>
        <ul>
          <PrintHelpRequestDetailItem
            :title="housingHelpRequestFieldLabels.reason"
            :content="housingHelpRequest.reason"
          />
          <PrintHelpRequestDetailItem
            :title="housingHelpRequestFieldLabels.uniqueId"
            :content="housingHelpRequest.uniqueId"
          />

          <hr class="fr-mt-4w" />
          <h3>Caractéristiques du logement demandé</h3>

          <PrintHelpRequestDetailItem
            :title="
              housingHelpRequestFieldLabels.taxHouseholdAdditionalInformation
            "
            :content="housingHelpRequest.taxHouseholdAdditionalInformation"
          />
          <PrintHelpRequestDetailItem
            :title="housingHelpRequestFieldLabels.maxRent"
            :content="prismaDecimalToNumber(housingHelpRequest.maxRent) + ' €'"
          />
          <PrintHelpRequestDetailItem
            :title="housingHelpRequestFieldLabels.maxCharges"
            :content="
              prismaDecimalToNumber(housingHelpRequest.maxCharges) + ' €'
            "
          />
          <PrintHelpRequestDetailItem
            :title="housingHelpRequestFieldLabels.housingType"
            :content="housingType"
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
            title="Compte-rendu"
            :content="
              housingHelpRequest.fileInstruction.socialSupport.synthesis
            "
          />
        </ul>
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
    housingTypeKeys,
    roomCountKeys
  } from '~/client/options'
  import { housingHelpRequestFieldLabels } from '~/client/labels'

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

  const roomCount = computed(() => {
    if (!props.housingHelpRequest.roomCount?.length) {
      return undefined
    }

    return props.housingHelpRequest.roomCount
      .map(rC => roomCountKeys.value(rC))
      .join(', ')
  })
</script>
