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
      v-else-if="helpRequestPending || housingHelpRequestPending"
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
  const router = useRouter()

  const trpcClient = useTrpcClient()
  const helpRequestId = route.params.id as string

  definePageMeta({
    layout: false
  })

  let fileInstructionType: FileInstructionType | undefined

  // Get helpRequest data
  const {
    data: helpRequestData,
    pending: helpRequestPending,
    error: helpRequestError
  } = await trpcClient.helpRequest.getOne.useQuery({
    id: helpRequestId
  })
  const helpRequest = helpRequestData.value?.helpRequest
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
  if (housingHelpRequest) {
    fileInstructionType = housingHelpRequest?.fileInstruction.type // 'Houssing'
  }

  // Define page title
  useHead({
    title: RouteTitle.AppHistoryPrint()
  })

  // Print actions
  onMounted(() => {
    window.addEventListener('afterprint', onAfterPrint)
    window.print()
  })
  onUnmounted(() => {
    window.removeEventListener('afterprint', onAfterPrint)
  })
  function onAfterPrint() {
    router.back()
  }
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
