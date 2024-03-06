<template>
  <NuxtLink
    v-slot="{ navigate }"
    custom
    :to="helpRequestPath"
  >
    <tr
      class="clickable-row"
      @click="navigate"
    >
      <td>
        <span
          class="fr-badge fr-badge--sm"
          :class="[socialSupportStatusClasses[socialSupport.status]]"
        >
          {{ socialSupportStatusLabels[socialSupport.status] }}
        </span>
      </td>
      <td>{{ formatDate(socialSupport.date) }}</td>
      <td>
        {{ formatBeneficiaryDisplayName(socialSupport.beneficiary, true) }}
      </td>
      <td>{{ fileInstructionObject }}</td>
      <td>
        <template v-if="socialSupport.createdBy">
          {{ formatUserDisplayName(socialSupport.createdBy) }}
        </template>
      </td>
      <td>
        <template v-if="socialSupport.dueDate">{{
          formatDate(socialSupport.dueDate)
        }}</template>
      </td>
    </tr>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import { FileInstructionType } from '@prisma/client'
  import { FileInstructionPageItem } from '~/server/trpc/routers'
  import { HistoryTab } from '~/utils/constants/history'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { socialSupportStatusClasses } from '~/client/classes/socialSupport'
  import { formatUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { Route, RoutePath } from '~/utils/routing'

  const props = defineProps<{
    item: FileInstructionPageItem
  }>()

  const { socialSupportStatusLabels } = useSocialSupportStatus()

  const fileInstruction = computed(() => props.item.fileInstruction)
  const socialSupport = computed(() => fileInstruction.value.socialSupport)
  const fileInstructionObject = computed(() => {
    if (fileInstruction.value.type === FileInstructionType.Housing) {
      return 'Demande de logement'
    }
    const subjects = fileInstruction.value.socialSupport.subjects
    return subjects.length > 0 ? subjects[0].name : ''
  })

  const helpRequestPath = computed(() =>
    RoutePath.AppBeneficiary(socialSupport.value.beneficiary.id, {
      tab: BeneficiaryTab.History,
      item: socialSupport.value.id,
      originPage: Route.AppHistory,
      originTab: HistoryTab.FileInstructions
    })
  )
</script>
