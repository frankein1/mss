<template>
  <ul class="body-metas information-list">
    <li v-if="helpRequest.reason">
      <span class="information-label">Motif :</span>
      {{ helpRequestReasonLabels[helpRequest.reason] }}
    </li>
    <template v-if="isMinistryAgent">
      <li v-if="helpRequest.numeroPegase">
        <span class="information-label">Numéro Pégase :</span>
        {{ helpRequest.numeroPegase }}
      </li>
      <li v-if="helpRequest.ministre">
        <span class="information-label">Ministre :</span>
        {{ ministerLabels[helpRequest.ministre] }}
      </li>
    </template>
    <li v-if="helpRequest.dueDate">
      <span class="information-label">Date d'échéance :</span>
      {{ formatDate(helpRequest.dueDate) }}
    </li>
    <li v-if="helpRequest.prescribingOrganization?.name">
      <span class="information-label">Organisme prescripteur :</span>
      {{ helpRequest.prescribingOrganization.name }}
    </li>
    <li v-if="instructorOrganization">
      <span class="information-label">Instruction :</span>
      {{ instructorOrganization }}
    </li>
    <li v-if="helpRequest.askedAmount">
      <span class="information-label">Montant demandé :</span>
      {{ euros(helpRequest.askedAmount) }}
    </li>
    <li
      v-if="helpRequest.fullFile"
      class="fr-icon-success-line"
    >
      Dossier complet
    </li>
    <li v-if="helpRequest.dispatchDate">
      <span class="information-label">Date d'envoi du dossier :</span>
      {{ formatDate(helpRequest.dispatchDate) }}
    </li>
    <li v-if="helpRequest.examinationDate">
      <span class="information-label"> Date de passage en commission : </span>
      {{ formatDate(helpRequest.examinationDate) }}
    </li>
    <li v-if="helpRequest.decisionDate">
      <span class="information-label">Date de la décision :</span>
      {{ formatDate(helpRequest.decisionDate) }}
    </li>
    <template v-if="helpRequest.status === HelpRequestStatus.Accepted">
      <li v-if="allocatedAmount">
        <span class="information-label">Montant attribué :</span>
        {{ allocatedAmount }}
      </li>
      <li v-if="helpRequest.handlingDate">
        <span class="information-label">Date de fin de prise en charge :</span>
        {{ formatDate(helpRequest.handlingDate) }}
      </li>
    </template>
    <li v-if="hasRefusalReason">
      <span class="information-label">Motif du refus :</span>
      {{ helpRequest.refusalReason }}
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { HelpRequestStatus } from '@prisma/client'
  import { HistoryItem } from './types'
  import {
    helpRequestReasonLabels,
    paymentMethodLabels
  } from '~/client/options/helpRequest'
  import { euros } from '~/utils/euros'
  import { formatDate } from '~/utils/formatDate'
  import { ministerLabels } from '~/client/options/ministry'

  const isMinistryAgent = useMinistryAgent()

  const props = defineProps<{
    helpRequest: HistoryItem
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

  const hasRefusalReason = computed(
    () =>
      props.helpRequest.status === HelpRequestStatus.Refused &&
      props.helpRequest.refusalReason
  )
</script>

<style scoped>
  .information-list {
    column-gap: 2rem;
    margin-bottom: 0.5rem;
    column-count: 2;
  }
</style>
