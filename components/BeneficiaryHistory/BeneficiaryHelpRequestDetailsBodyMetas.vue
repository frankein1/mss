<template>
  <li v-if="helpRequest.prescribingOrganization?.name">
    <span class="information-label"
      >{{ helpRequestFieldLabels.prescribingOrganizationId }} :</span
    >
    {{ helpRequest.prescribingOrganization.name }}
  </li>
  <li v-if="instructorOrganization">
    <span class="information-label">Instruction :</span>
    {{ instructorOrganization }}
  </li>
  <li v-if="helpRequest.isRefundable !== null">
    <span class="information-label"
      >{{ helpRequestFieldLabels.isRefundable }} :</span
    >
    {{ isRefundableLabels[helpRequest.isRefundable ? 'true' : 'false'] }}
  </li>
  <li v-if="helpRequest.askedAmount">
    <span class="information-label"
      >{{ helpRequestFieldLabels.askedAmount }} :</span
    >
    {{ euros(helpRequest.askedAmount) }}
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
  <template v-if="status === SocialSupportStatus.Accepted">
    <li v-if="allocatedAmount">
      <span class="information-label"
        >{{ helpRequestFieldLabels.allocatedAmount }} :</span
      >
      {{ allocatedAmount }}
    </li>
    <li v-if="helpRequest.handlingDate">
      <span class="information-label"
        >{{ helpRequestFieldLabels.handlingDate }} :</span
      >
      {{ formatDate(helpRequest.handlingDate) }}
    </li>
  </template>
  <li v-if="hasRefusalReason">
    <span class="information-label"
      >{{ helpRequestFieldLabels.refusalReason }} :</span
    >
    {{ refusalReason }}
  </li>
</template>

<script setup lang="ts">
  import { SocialSupportStatus } from '@prisma/client'
  import { FileInstructionData, HelpRequestData } from './types'
  import {
    paymentMethodLabels,
    isRefundableLabels,
    fileInstructionRefusalReasonLabels
  } from '~/client/options'
  import { euros } from '~/utils/euros'
  import { formatDate } from '~/utils/formatDate'
  import { helpRequestFieldLabels } from '~/client/labels'

  const props = defineProps<{
    fileInstruction: FileInstructionData
    helpRequest: HelpRequestData
    status: SocialSupportStatus
  }>()

  const instructorOrganization = computed(() => {
    return props.fileInstruction.externalStructure
      ? props.fileInstruction.instructorOrganization?.name || ''
      : 'Interne'
  })

  const allocatedAmount = computed(() => {
    let allocatedAmount = ''
    if (props.helpRequest.allocatedAmount) {
      allocatedAmount += euros(props.helpRequest.allocatedAmount)
    }
    if (props.helpRequest.paymentDate || props.helpRequest.paymentMethod) {
      if (allocatedAmount) {
        allocatedAmount += ' '
      }
      allocatedAmount += '('
    }
    if (props.helpRequest.paymentDate) {
      allocatedAmount += formatDate(props.helpRequest.paymentDate)
      if (props.helpRequest.paymentMethod) {
        allocatedAmount += ' - '
      } else {
        allocatedAmount += ')'
      }
    }
    if (props.helpRequest.paymentMethod) {
      allocatedAmount += `${
        paymentMethodLabels[props.helpRequest.paymentMethod]
      })`
    }
    return allocatedAmount
  })

  const refusalReason = computed(() => {
    const { refusalReason, refusalReasonOther } = props.fileInstruction
    return (
      refusalReasonOther ||
      (refusalReason ? fileInstructionRefusalReasonLabels[refusalReason] : '')
    )
  })

  const hasRefusalReason = computed(
    () => props.status === SocialSupportStatus.Refused && refusalReason.value
  )
</script>
