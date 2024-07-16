<!--
  This page allows to easily print the history details in a valid design.
  It improves cross-browser compatibility that is not easily reachable with print media queries.
-->

<template>
  <div>
    <AtomAlert
      v-if="printInformations?.error"
      :alert-type="AlertType.Error"
      message="Les informations du bénéficiaire n'ont pas pu être chargées."
    />
    <AtomLoader
      v-else-if="printInformations?.pending"
      class="fr-mx-auto"
    />
    <template
      v-else-if="
        printInformations?.helpRequest && printInformations?.fileInstructionType
      "
    >
      <PrintHelpRequest
        :help-request="printInformations.helpRequest"
        :file-instruction-type="printInformations.fileInstructionType"
      />
    </template>

    <template v-else-if="printInformations?.housingHelpRequest">
      <PrintHousingHelpRequest
        :housing-help-request="printInformations.housingHelpRequest"
      />
    </template>

    <template v-else-if="printInformations?.followup">
      <PrintFollowup :followup="printInformations.followup" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { FileInstructionType } from '@prisma/client'
  import { AlertType } from '~/utils/constants/alert'
  import { RouteTitle } from '~/utils/routing'
  import { TypeSuivi } from '~/client/options'
  import {
    HousingHelpRequestOutput,
    HelpRequestOutput,
    FollowupOutput
  } from '~/components/PrintHelpRequest/types'

  const route = useRoute()
  const router = useRouter()

  const trpcClient = useTrpcClient()
  const helpRequestId = route.params.id as string

  definePageMeta({
    layout: false
  })
  // Define page title
  useHead({
    title: RouteTitle.AppHistoryPrint()
  })

  const historyType = route.query.type

  type PrintInformations =
    | {
        pending?: any
        error?: any
        helpRequest?: HelpRequestOutput
        housingHelpRequest?: HousingHelpRequestOutput
        followup?: FollowupOutput
        fileInstructionType?: FileInstructionType
      }
    | undefined

  const getPrintInformations = async (): Promise<PrintInformations> => {
    // Get helpRequest data
    if (historyType === TypeSuivi.AllHelpRequest) {
      const { data, pending, error } =
        await trpcClient.helpRequest.getOne.useQuery({
          id: helpRequestId
        })
      return {
        pending: pending.value ? pending : undefined,
        error: error.value ? error : undefined,
        helpRequest: data.value?.helpRequest,
        fileInstructionType: data.value?.helpRequest.fileInstruction.type // 'Other' | 'Financial'
      }
    }

    if (historyType === TypeSuivi.HousingHelpRequest) {
      const { data, pending, error } =
        await trpcClient.housingHelpRequest.getOne.useQuery({
          id: helpRequestId
        })
      return {
        pending: pending.value ? pending : undefined,
        error: error.value ? error : undefined,
        housingHelpRequest: data.value?.housingHelpRequest,
        fileInstructionType: data.value?.housingHelpRequest.fileInstruction.type // 'Housing'
      }
    }

    if (historyType === TypeSuivi.Followup) {
      const { data, pending, error } =
        await trpcClient.followup.getOne.useQuery({ id: helpRequestId })
      return {
        pending: pending.value ? pending : undefined,
        error: error.value ? error : undefined,
        followup: data.value?.followup
      }
    }
  }

  const printInformations = await getPrintInformations()

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
