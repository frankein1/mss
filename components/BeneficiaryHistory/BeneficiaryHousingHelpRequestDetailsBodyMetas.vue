<template>
  <li
    v-if="housingHelpRequest.isFirst != null"
    class="fr-icon-success-line"
  >
    <span class="information-label"
      >{{ helpRequestFieldLabels.isFirst }}&nbsp;:</span
    >
    {{ isFirstKeys.value(housingHelpRequest.isFirst ? 'true' : 'false') }}
  </li>
  <li v-if="askedHousing">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.askedHousing }}&nbsp;:</span
    >
    {{ askedHousing }}
  </li>
  <li v-if="housingHelpRequest.prescribingOrganization?.name">
    <span class="information-label"
      >{{ helpRequestFieldLabels.prescribingOrganizationId }}&nbsp;:</span
    >
    {{ housingHelpRequest.prescribingOrganization.name }}
  </li>
  <li v-if="housingHelpRequest.prescribingOrganizationContact?.name">
    <span class="information-label"
      >{{
        helpRequestFieldLabels.prescribingOrganizationContactId
      }}&nbsp;:</span
    >
    {{ housingHelpRequest.prescribingOrganizationContact.name }}
  </li>
  <li v-if="instructorOrganization">
    <span class="information-label">Instruction&nbsp;:</span>
    {{ instructorOrganization }}
  </li>
  <li v-if="fileInstruction.instructorOrganizationContact">
    <span class="information-label"
      >{{
        housingHelpRequestFieldLabels.instructorOrganizationContactId
      }}
      &nbsp;:</span
    >
    {{ fileInstruction.instructorOrganizationContact.name }}
  </li>
  <li v-if="housingHelpRequest.reason">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.reason }}&nbsp;:</span
    >
    {{ housingReasonKeys.value(housingHelpRequest.reason) }}
  </li>
  <li v-if="housingHelpRequest.uniqueId">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.uniqueId }}&nbsp;:</span
    >
    {{ housingHelpRequest.uniqueId }}
  </li>
  <li v-if="housingHelpRequest.maxRent">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.maxRent }}&nbsp;:</span
    >
    <span class="euro-symbol fr-ml-1v">{{
      euros(housingHelpRequest.maxRent)
    }}</span>
  </li>
  <li v-if="housingHelpRequest.maxCharges">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.maxCharges }}&nbsp;:</span
    >
    <span class="euro-symbol fr-ml-1v">{{
      euros(housingHelpRequest.maxCharges)
    }}</span>
  </li>
  <li v-if="housingType">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.housingType }}&nbsp;:</span
    >
    {{ housingType }}
  </li>
  <li v-if="roomCount">
    <span class="information-label"
      >{{ housingHelpRequestFieldLabels.roomCount }}&nbsp;:</span
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
      &nbsp;:</span
    >
    {{ housingHelpRequest.taxHouseholdAdditionalInformation }}
  </li>
  <li
    v-if="fileInstruction.fullFile"
    class="fr-icon-success-line"
  >
    Ce dossier est complet
  </li>
  <li v-if="housingHelpRequest.handlingDate">
    <span class="information-label"
      >{{ helpRequestFieldLabels.handlingDate }} :</span
    >
    {{ formatDate(housingHelpRequest.handlingDate) }}
  </li>
  <li v-if="fileInstruction.dispatchDate">
    <span class="information-label"
      >{{ helpRequestFieldLabels.dispatchDate }}&nbsp;:</span
    >
    {{ formatDate(fileInstruction.dispatchDate) }}
  </li>
  <li v-if="fileInstruction.examinationDate">
    <span class="information-label"
      >{{ helpRequestFieldLabels.examinationDate }}&nbsp;:</span
    >
    {{ formatDate(fileInstruction.examinationDate) }}
  </li>
  <li v-if="fileInstruction.decisionDate">
    <span class="information-label"
      >{{ helpRequestFieldLabels.decisionDate }}&nbsp;:</span
    >
    {{ formatDate(fileInstruction.decisionDate) }}
  </li>
  <template v-if="status === SocialSupportStatus.Accepted"> </template>
  <li v-if="hasRefusalReason">
    <span class="information-label"
      >{{ helpRequestFieldLabels.refusalReason }}&nbsp;:</span
    >
    {{ refusalReason }}
  </li>
</template>

<script setup lang="ts">
  import { SocialSupportStatus } from '@prisma/client'
  import type { FileInstructionData, HousingHelpRequestData } from './types'
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
    if (!props.fileInstruction.externalStructure) {
      return 'Interne'
    }
    return props.fileInstruction.instructorOrganization
      ? props.fileInstruction.instructorOrganization.name
      : 'Externe'
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
