<template>
  <tr class="clickable-row">
    <td>
      <span
        class="fr-badge fr-badge--sm"
        :class="[socialSupportStatusClasses[socialSupport.status]]"
      >
        {{ socialSupportStatusKeys.value(socialSupport.status) }}
      </span>
    </td>
    <td>{{ formatDate(socialSupport.date) }}</td>
    <NuxtLink
      :aria-label="
        formatBeneficiaryDisplayName(socialSupport.beneficiary, true) +
        ' ' +
        fileInstructionObject
      "
      :to="helpRequestPath"
      class="table-row-link"
    >
      <td>
        {{ formatBeneficiaryDisplayName(socialSupport.beneficiary, true) }}
      </td>
    </NuxtLink>
    <td
      v-if="fileInstructionTypeFilter !== 'Housing'"
      class="social-support-subjects-data"
    >
      {{ fileInstructionObject }}
    </td>
    <td v-else>
      {{ roomCounts }}
    </td>
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
</template>

<script lang="ts" setup>
  import { FileInstructionType } from '@prisma/client'
  import { FileInstruction } from '~/server/trpc/routers'
  import { socialSupportStatusClasses } from '~/client/classes/socialSupport'
  import { formatUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { FileInstructionFilterInput } from '~/server/schema'
  import { roomCountKeys } from '~/client/options'
  import { routes } from '~/utils/routes'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'

  const props = defineProps<{
    fileInstruction: FileInstruction
    fileInstructionTypeFilter: FileInstructionFilterInput['fileInstructionType']
  }>()

  const { socialSupportStatusKeys } = useSocialSupportStatus()

  const socialSupport = computed(() => props.fileInstruction.socialSupport)
  const fileInstructionObject = computed(() => {
    if (props.fileInstruction.type === FileInstructionType.Housing) {
      return 'Demande de logement'
    }
    const subjects = props.fileInstruction.socialSupport.subjects
    return subjects[0]?.name || ''
  })

  const helpRequestPath = computed(() =>
    routes.file.AppFile.path(socialSupport.value.familyFile.id, {
      item: socialSupport.value.id,
      beneficiaryId: socialSupport.value.beneficiary.id,
      tab: BeneficiaryTab.History
    })
  )

  const roomCounts = computed(() => {
    if (!props.fileInstruction.housingHelpRequest?.roomCount) {
      return ''
    }

    return props.fileInstruction.housingHelpRequest.roomCount
      .map(roomCount => roomCountKeys.value(roomCount))
      .join(', ')
  })
</script>
