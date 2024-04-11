<template>
  <li
    v-if="
      housingHelpRequest.isFirst !== undefined &&
      housingHelpRequest.isFirst !== null
    "
    class="fr-icon-success-line"
  >
    {{ isFirstKeys.value(housingHelpRequest.isFirst ? 'true' : 'false') }}
  </li>
  <li v-if="askedHousing">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.askedHousing }} :</span
    >
    {{ askedHousing }}
  </li>
  <li v-if="instructorOrganization">
    <span class="information-label">Instruction :</span>
    {{ instructorOrganization }}
  </li>
  <li v-if="fileInstruction.instructorOrganizationContact">
    <span class="information-label"
      >{{
        housingHelpRequestFieldLabels.instructorOrganizationContactId
      }}
      :</span
    >
    {{ fileInstruction.instructorOrganizationContact.name }}
  </li>
  <li v-if="housingHelpRequest.reason">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.reason }} :</span
    >
    {{ housingReasonKeys.value(housingHelpRequest.reason) }}
  </li>
  <li v-if="housingHelpRequest.uniqueId">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.uniqueId }} :</span
    >
    {{ housingHelpRequest.uniqueId }}
  </li>
  <li v-if="housingHelpRequest.maxRent">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.maxRent }} :</span
    >
    {{ euros(housingHelpRequest.maxRent) }}
  </li>
  <li v-if="housingHelpRequest.maxCharges">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.maxCharges }} :</span
    >
    {{ euros(housingHelpRequest.maxCharges) }}
  </li>
  <li v-if="housingType">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.housingType }} :</span
    >
    {{ housingType }}
  </li>
  <li v-if="roomCount">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.roomCount }} :</span
    >
    {{ roomCount }}
  </li>
  <li
    v-if="housingHelpRequest.isPmr"
    class="fr-icon-success-line"
  >
    {{ housingHelpRequestFieldLabels.isPmr }}
  </li>
  <li v-if="housingHelpRequest.taxHouseholdAdditionalInformation">
    <span class="information-label"
      >{{
        housingHelpRequestFieldLabels.taxHouseholdAdditionalInformation
      }}
      :</span
    >
    {{ housingHelpRequest.taxHouseholdAdditionalInformation }}
  </li>
  <li
    v-if="fileInstruction.fullFile"
    class="fr-icon-success-line"
  >
    Ce dossier est complet
  </li>
  <li v-if="fileInstruction.dispatchDate">
    <span class="information-label"
      >{{ helpRequestFieldLabels.dispatchDate }} :</span
    >
    {{ formatDate(fileInstruction.dispatchDate) }}
  </li>
  <li v-if="fileInstruction.examinationDate">
    <span class="information-label"
      >{{ helpRequestFieldLabels.examinationDate }} :</span
    >
    {{ formatDate(fileInstruction.examinationDate) }}
  </li>
  <li v-if="fileInstruction.decisionDate">
    <span class="information-label"
      >{{ helpRequestFieldLabels.decisionDate }} :</span
    >
    {{ formatDate(fileInstruction.decisionDate) }}
  </li>
  <template v-if="status === SocialSupportStatus.Accepted"> </template>
  <li v-if="hasRefusalReason">
    <span class="information-label"
      >{{ helpRequestFieldLabels.refusalReason }} :</span
    >
    {{ refusalReason }}
  </li>
</template>

<script setup lang="ts">
  import { SocialSupportStatus } from '@prisma/client'
  import { FileInstructionData, HousingHelpRequestData } from './types'
  import {
    fileInstructionRefusalReasonKeys,
    askedHousingKeys,
    housingReasonKeys,
    housingTypeKeys,
    roomCountKeys,
    isFirstKeys
  } from '~/client/options'
  import { formatDate } from '~/utils/formatDate'
  import {
    helpRequestFieldLabels,
    housingHelpRequestFieldLabels
  } from '~/client/labels'
  import { euros } from '~/utils/euros'

  const props = defineProps<{
    fileInstruction: FileInstructionData
    housingHelpRequest: HousingHelpRequestData
    status: SocialSupportStatus
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

  const instructorOrganization = computed(() => {
    return props.fileInstruction.externalStructure
      ? props.fileInstruction.instructorOrganization?.name || ''
      : 'Interne'
  })

  const refusalReason = computed(() => {
    const { refusalReason } = props.fileInstruction
    return refusalReason
      ? fileInstructionRefusalReasonKeys.value(refusalReason)
      : ''
  })

  const hasRefusalReason = computed(
    () => props.status === SocialSupportStatus.Refused && refusalReason.value
  )
</script>
