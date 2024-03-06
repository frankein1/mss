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
  import { FileInstruction } from '~/server/trpc/routers'
  import { HistoryTab } from '~/utils/constants/history'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { socialSupportStatusClasses } from '~/client/classes/socialSupport'
  import { formatUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { Route, RoutePath } from '~/utils/routing'

  const props = defineProps<{
    fileInstruction: FileInstruction
  }>()

  const { socialSupportStatusLabels } = useSocialSupportStatus()

  const socialSupport = computed(() => props.fileInstruction.socialSupport)
  const fileInstructionObject = computed(() => {
    if (props.fileInstruction.type === FileInstructionType.Housing) {
      return 'Demande de logement'
    }
    const subjects = props.fileInstruction.socialSupport.subjects
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
