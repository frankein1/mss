<template>
  <tr class="clickable-row">
    <td>
      <span
        class="fr-badge fr-badge--sm"
        :class="[socialSupportStatusClasses[followup.status]]"
      >
        {{ followupStatusKeys.value(followup.status) }}
      </span>
    </td>
    <td>
      {{ formatDate(followup.date) }}
    </td>
    <td>
      {{ formatBeneficiaryDisplayName(followup.beneficiary, true) }}
    </td>
    <td class="social-support-subjects-data">
      <NuxtLink
        :aria-label="
          formatBeneficiaryDisplayName(followup.beneficiary, true) +
          ' ' +
          socialSupportSubjects
        "
        :to="followupPath"
        class="table-row-link"
      >
        <span>
          {{ socialSupportSubjects }}
        </span>
      </NuxtLink>
    </td>
    <td>
      {{ followup.dueDate ? formatDate(followup.dueDate) : undefined }}
    </td>
    <td>
      <template v-if="followup.createdBy">
        {{ formatUserDisplayName(followup.createdBy) }}
      </template>
    </td>
  </tr>
</template>

<script lang="ts" setup>
  import type { FollowupPageItem } from '~/server/trpc/routers'
  import { followupStatusKeys } from '~/client/options'
  import { socialSupportStatusClasses } from '~/client/classes/socialSupport'
  import { formatUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { routes } from '~/utils/routes'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'

  const props = defineProps<{
    data: FollowupPageItem
  }>()

  const followup = computed(() => props.data.followup)

  const followupPath = computed(() =>
    routes.file.AppFile.path(followup.value.familyFile.id, {
      item: followup.value.socialSupportId,
      beneficiaryId: followup.value.beneficiary.id,
      tab: BeneficiaryTab.History
    })
  )
  const socialSupportSubjects = computed(() =>
    followup.value.subjects.map(({ name }) => name).join(', ')
  )
</script>
