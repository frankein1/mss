<!--
  This page allows to easily print the history details in a valid design.
  It improves cross-browser compatibility that is not easily reachable with print media queries.
-->

<template>
  <div>
    <AtomAlert
      v-if="helpRequestError && housingHelpRequestError"
      :alert-type="AlertType.Error"
      message="Les informations du bénéficiaire n'ont pas pu être chargées."
    />
    <AtomLoader
      v-else-if="pending"
      class="fr-mx-auto"
    />
    <template v-else-if="helpRequest && fileInstructionType">
      <PrintHelpRequest
        :help-request="helpRequest"
        :file-instruction-type="fileInstructionType"
      />
    </template>

    <template v-else-if="housingHelpRequest && fileInstructionType">
      <PrintHousingHelpRequest :housing-help-request="housingHelpRequest" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { FileInstructionType } from '@prisma/client'
  import { AlertType } from '~/utils/constants/alert'
  import { RouteTitle } from '~/utils/routing'

  const route = useRoute()
  const trpcClient = useTrpcClient()
  const helpRequestId = route.params.hrid as string

  definePageMeta({
    layout: false
  })

  let fileInstructionType: FileInstructionType | undefined
  let pending: boolean = false

  // Get helpRequest data
  const {
    data: helpRequestData,
    pending: helpRequestPending,
    error: helpRequestError
  } = await trpcClient.helpRequest.getOne.useQuery({
    id: helpRequestId
  })
  const helpRequest = helpRequestData.value?.helpRequest
  pending = helpRequestPending.value
  fileInstructionType = helpRequest?.fileInstruction.type // 'Other' | 'Financial'

  // Get housing help request data
  const {
    data: housingHelpRequestData,
    pending: housingHelpRequestPending,
    error: housingHelpRequestError
  } = await trpcClient.housingHelpRequest.getOne.useQuery({
    id: helpRequestId
  })
  const housingHelpRequest = housingHelpRequestData.value?.housingHelpRequest
  pending = housingHelpRequestPending.value
  if (housingHelpRequest) {
    fileInstructionType = housingHelpRequest?.fileInstruction.type // 'Houssing'
  }

  // Define page title
  useHead({
    // TODO: use dynamic page title
    title: RouteTitle.AppHistoryPrint()
  })
</script>

<style lang="scss" scoped>
  @media print {
    :deep(.fr-icon-success-line::before) {
      content: '✅';
    }

    :deep(.fr-icon-close-circle-line::before) {
      content: '❌';
    }

    :deep(.fr-container) {
      max-width: none;
      padding: 0;
    }
  }
</style>
