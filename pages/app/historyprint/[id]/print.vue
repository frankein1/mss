<!--
  This page allows to easily print the history details in a valid design.
  It improves cross-browser compatibility that is not easily reachable with print media queries.
-->

<template>
  <AtomAlert
    v-if="instruction.error || !instruction.support"
    :alert-type="AlertType.Error"
    message="Les informations de l'accompagnement n'ont pas pu être chargées."
  />
  <PrintOtherHelpRequest
    v-else-if="instruction.type === 'Other'"
    :help-request="instruction.support"
    @on-create="onSynthesisRendered"
  />
  <PrintFinancialHelpRequest
    v-else-if="instruction.type === 'Financial'"
    :help-request="instruction.support"
    @on-create="onSynthesisRendered"
  />
  <PrintHousingHelpRequest
    v-else-if="instruction.type === 'Housing'"
    :housing-help-request="instruction.support"
    @on-create="onSynthesisRendered"
  />
  <PrintFollowup
    v-else-if="instruction.type === 'Followup'"
    :followup="instruction.support"
    @on-create="onSynthesisRendered"
  />
  <AtomAlert
    v-else
    :alert-type="AlertType.Error"
    :message="`Type d'accompagnement inconnu. L'impression ne peut pas être effectuée (${instruction.type})`"
  />
</template>

<script setup lang="ts">
  import type { FileInstructionType } from '@prisma/client'
  import { AlertType } from '~/utils/constants/alert'
  import { TypeSuivi } from '~/client/options'
  import type {
    HousingHelpRequestOutput,
    HelpRequestOutput,
    FollowupOutput
  } from '~/components/PrintHelpRequest/types'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { routes } from '~/utils/routes'
  import { BeneficiaryHistoryAction, EventCategory } from '~/types/matomo'
  import type { BeneficiaryNames } from '~/types/beneficiary'

  const route = useRoute()

  const trpcClient = useTrpcClient()
  const helpRequestId = route.params.id as string

  definePageMeta({
    layout: false
  })

  const historyType = route.query.type as TypeSuivi

  const trackWithMatomo = (historyType: string | undefined) => {
    const getHistoryAction = (historyType: string | undefined) => {
      switch (historyType) {
        case 'Financial':
          return BeneficiaryHistoryAction.PrintFinancialHelpRequest
        case 'Housing':
          return BeneficiaryHistoryAction.PrintHousingHelpRequest
        case 'Other':
          return BeneficiaryHistoryAction.PrintOtherHelpRequest
        case 'Followup':
          return BeneficiaryHistoryAction.PrintFollowup
        case TypeSuivi.AllHelpRequest:
          return BeneficiaryHistoryAction.PrintAllHelpRequest
        default:
          return BeneficiaryHistoryAction.Print
      }
    }
    useMatomo().trackEvent(EventCategory.History, getHistoryAction(historyType))
  }

  function formatName(ben?: BeneficiaryNames) {
    return ben
      ? formatBeneficiaryDisplayName({
          firstName: ben.firstName,
          usualName: ben.usualName,
          birthName: ben.birthName
        })
      : undefined
  }

  const getFileInstruction = async () => {
    if (historyType === TypeSuivi.AllHelpRequest) {
      const res = await trpcClient.helpRequest.getOne.useQuery({
        id: helpRequestId
      })
      const support = res.data.value?.helpRequest satisfies
        | HelpRequestOutput
        | undefined
      return {
        status: res.status.value,
        error: res.error.value,
        support,
        type: res.data.value?.helpRequest.fileInstruction.type satisfies
          | FileInstructionType
          | undefined as 'Other' | 'Financial' | undefined,
        beneficiaryId: support?.fileInstruction.socialSupport.beneficiaryId,
        familyFileId: support?.fileInstruction.socialSupport.familyFileId,
        socialSupportId: support?.fileInstruction.socialSupport.id,
        beneficiaryName: formatName(
          support?.fileInstruction.socialSupport.beneficiary
        )
      }
    }

    if (historyType === TypeSuivi.HousingHelpRequest) {
      const res = await trpcClient.housingHelpRequest.getOne.useQuery({
        id: helpRequestId
      })
      const support = res.data.value?.housingHelpRequest satisfies
        | HousingHelpRequestOutput
        | undefined
      return {
        status: res.status.value,
        error: res.error.value,
        support,
        type: res.data.value?.housingHelpRequest.fileInstruction.type satisfies
          | FileInstructionType
          | undefined as 'Housing' | undefined,
        beneficiaryId: support?.fileInstruction.socialSupport.beneficiaryId,
        familyFileId: support?.fileInstruction.socialSupport.familyFileId,
        socialSupportId: support?.fileInstruction.socialSupport.id,
        beneficiaryName: formatName(
          support?.fileInstruction.socialSupport.beneficiary
        )
      }
    }

    const res = await trpcClient.followup.getOne.useQuery({
      id: helpRequestId
    })
    const support = res.data.value?.followup satisfies
      | FollowupOutput
      | undefined
    return {
      status: res.status.value,
      error: res.error.value,
      support,
      type: 'Followup' as const,
      beneficiaryId: support?.beneficiaryId,
      familyFileId: support?.familyFileId,
      socialSupportId: support?.socialSupportId,
      beneficiaryName: formatName(support?.beneficiary)
    }
  }

  const instruction = await getFileInstruction()
  if (instruction?.type) {
    trackWithMatomo(instruction?.type)
  }

  useHead({
    title: instruction?.beneficiaryName || routes.file.AppHistoryPrint.title
  })

  /** Print immediately if there is no social support synthesis
   * Otherwise, wait for the Tiptap Text Editor to be rendered
   * The private synthesis is never printed
   */
  const hasSynthesis =
    instruction.type === 'Followup'
      ? !!instruction.support?.synthesis
      : !!instruction.support?.fileInstruction.socialSupport.synthesis

  onMounted(() => {
    window.addEventListener('afterprint', onAfterPrint)
    if (!hasSynthesis) {
      window.print()
    }
  })

  const onSynthesisRendered = () => {
    window.addEventListener('afterprint', onAfterPrint)
    window.print()
  }

  onUnmounted(() => {
    window.removeEventListener('afterprint', onAfterPrint)
  })

  async function onAfterPrint() {
    const { familyFileId, beneficiaryId, socialSupportId } = instruction
    if (!familyFileId || !beneficiaryId || !socialSupportId) {
      return
    }
    navigateTo(
      routes.file.AppFile.path(familyFileId, {
        beneficiaryId,
        item: socialSupportId,
        tab: BeneficiaryTab.History
      })
    )
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
