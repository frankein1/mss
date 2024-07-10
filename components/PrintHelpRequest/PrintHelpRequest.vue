<template>
  <div class="fr-container">
    <div class="fr-grid-column">
      <div
        v-if="fileInstructionType === 'Financial'"
        class="fr-col-12"
      >
        <PrintFinancialHelpRequest :help-request="helpRequest" />
      </div>
      <div
        v-else-if="fileInstructionType === 'Other'"
        class="fr-col-12"
      >
        <PrintOtherHelpRequest :help-request="helpRequest" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { FileInstructionType } from '@prisma/client'
  import PrintFinancialHelpRequest from './PrintFinancialHelpRequest.vue'
  import PrintOtherHelpRequest from './PrintOtherHelpRequest.vue'
  import { HelpRequestOutput } from './types'

  defineProps<{
    helpRequest: HelpRequestOutput
    fileInstructionType: FileInstructionType
  }>()
</script>
