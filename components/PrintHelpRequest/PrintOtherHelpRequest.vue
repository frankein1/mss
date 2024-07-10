<template>
  <!-- TODO; improve Titles and create a component -->
  <h1>Autre demande</h1>
  <h2>
    Instruction du dossier de
    {{ helpRequest.fileInstruction.socialSupport.beneficiary.firstName }}&nbsp;
    {{ helpRequest.fileInstruction.socialSupport.beneficiary.usualName }}
    <br />Ouverture :
    {{ formatDate(helpRequest.subject?.created, 'DD/MM/YYYY') }}
    <br />
  </h2>

  <PrintHelpRequestDetailItem
    title="Objet de l'accompagnement"
    :content="helpRequest.subject?.name"
  />
  <PrintHelpRequestDetailItem
    title="Organisme prescripteur"
    :content="helpRequest.prescribingOrganization?.name"
  />
  <PrintHelpRequestDetailItem
    title="Le dossier est instruit"
    :content="
      helpRequest.fileInstruction.externalStructure
        ? 'en externe'
        : 'en interne'
    "
  />
  <PrintHelpRequestDetailItem
    title="En commission le"
    :content="
      helpRequest.fileInstruction.examinationDate
        ? (formatDate(helpRequest.fileInstruction.examinationDate),
          'DD/MM/YYYY')
        : null
    "
  />
  <PrintHelpRequestDetailItem
    title="Organisme instructeur"
    :content="helpRequest.fileInstruction.instructorOrganization?.name"
  />
  <PrintHelpRequestDetailItem
    title="Date d'envoi du dossier"
    :content="
      formatDate(helpRequest.fileInstruction.dispatchDate, 'DD/MM/YYYY')
    "
  />
  <hr class="fr-mt-4w" />
  <h3>Information sur le dossier</h3>
  <!-- TOOD: trouver Date de décision -->
  <PrintHelpRequestDetailItem
    title="Date de la décision"
    content="???? handlingDate ?"
  />
  <PrintHelpRequestDetailItem
    title="Date de fin de prise en charge"
    :content="formatDate(helpRequest.handlingDate, 'DD/MM/YYYY')"
  />
  <PrintHelpRequestDetailItem
    title="Motif du refus"
    :content="helpRequest.fileInstruction.refusalReason"
  />
  <!-- TOOD: trouver Date d'échéance -->
  <PrintHelpRequestDetailItem
    title="Date d'échéance"
    content="???"
  />
  <PrintHelpRequestDetailItem
    title="Compte rendu"
    :content="helpRequest.fileInstruction.socialSupport.synthesis"
  />
</template>

<script setup lang="ts">
  import { HelpRequestOutput } from './types'
  import { formatDate } from '~/utils/formatDate'
  // import { helpRequestFieldLabels } from '~/client/labels/helpRequest.labels'

  defineProps<{
    helpRequest: HelpRequestOutput
  }>()
</script>
