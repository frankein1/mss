<template>
  <div class="fr-container">
    <div class="fr-grid-column">
      <div
        v-if="fileInstructionType === 'Financial'"
        class="fr-col-12"
      >
        <PrintFinancialHelpRequest
          :help-request="helpRequest"
          @on-updated="onUpdated"
        />
      </div>
      <div
        v-else-if="fileInstructionType === 'Other'"
        class="fr-col-12"
      >
        <PrintOtherHelpRequest
          :help-request="helpRequest"
          @on-updated="onUpdated"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { FileInstructionType } from '~/prisma/generated/client'
  import PrintFinancialHelpRequest from './PrintFinancialHelpRequest.vue'
  import PrintOtherHelpRequest from './PrintOtherHelpRequest.vue'
  import type { HelpRequestOutput } from './types'

  defineProps<{
    helpRequest: HelpRequestOutput
    fileInstructionType: FileInstructionType
  }>()

  const emit = defineEmits<{
    onUpdated: []
  }>()
  const onUpdated = () => {
    emit('onUpdated')
  }
</script>
