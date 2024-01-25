<template>
  <ul class="body-metas information-list">
    <template v-if="application.module.ministere">
      <li v-if="socialSupport.numeroPegase">
        <span class="information-label"
          >{{ helpRequestFieldLabels.numeroPegase }} :</span
        >
        {{ socialSupport.numeroPegase }}
      </li>
      <li v-if="socialSupport.ministre">
        <span class="information-label"
          >{{ helpRequestFieldLabels.ministre }} :</span
        >
        {{ ministerLabels[socialSupport.ministre] }}
      </li>
    </template>
    <li v-if="socialSupport.dueDate">
      <span class="information-label"
        >{{ helpRequestFieldLabels.dueDate }} :</span
      >
      {{ formatDate(socialSupport.dueDate) }}
    </li>
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
      v-if="helpRequest.fullFile"
      class="fr-icon-success-line"
    >
      Ce dossier est complet
    </li>
    <li v-if="helpRequest.dispatchDate">
      <span class="information-label"
        >{{ helpRequestFieldLabels.dispatchDate }} :</span
      >
      {{ formatDate(helpRequest.dispatchDate) }}
    </li>
    <li v-if="helpRequest.examinationDate">
      <span class="information-label"
        >{{ helpRequestFieldLabels.examinationDate }} :</span
      >
      {{ formatDate(helpRequest.examinationDate) }}
    </li>
    <li v-if="helpRequest.decisionDate">
      <span class="information-label"
        >{{ helpRequestFieldLabels.decisionDate }} :</span
      >
      {{ formatDate(helpRequest.decisionDate) }}
    </li>
    <template v-if="socialSupport.status === SocialSupportStatus.Accepted">
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
  </ul>
</template>

<script setup lang="ts">
  import { SocialSupportStatus } from '@prisma/client'
  import { SocialSupportData, HelpRequestData } from '~/server/trpc/routers'
  import {
    paymentMethodLabels,
    isRefundableLabels,
    anyRefusalReasonLabels
  } from '~/client/options/helpRequest'
  import { euros } from '~/utils/euros'
  import { formatDate } from '~/utils/formatDate'
  import { ministerLabels } from '~/client/options/ministry'
  import { helpRequestFieldLabels } from '~/client/labels'

  const { application } = usePermissions()

  const props = defineProps<{
    socialSupport: SocialSupportData
    helpRequest: HelpRequestData
  }>()

  const instructorOrganization = computed(() => {
    return props.helpRequest.externalStructure
      ? props.helpRequest.instructorOrganization?.name || ''
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
    const { refusalReason, refusalReasonOther } = props.helpRequest
    return (
      refusalReasonOther ||
      (refusalReason ? anyRefusalReasonLabels[refusalReason] : '')
    )
  })

  const hasRefusalReason = computed(
    () =>
      props.socialSupport.status === SocialSupportStatus.Refused &&
      refusalReason.value
  )
</script>

<style scoped>
  .information-list {
    column-gap: 2rem;
    margin-bottom: 0.5rem;
    column-count: 2;
  }
</style>
