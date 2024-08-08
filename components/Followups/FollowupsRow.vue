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
      <NuxtLink
        :to="followupPath"
        class="table-row-link"
      >
        {{ formatDate(followup.date) }}
      </NuxtLink>
    </td>
    <td>
      {{ formatBeneficiaryDisplayName(followup.beneficiary, true) }}
    </td>
    <td class="social-support-subjects-data">
      <span :title="socialSupportSubjects">
        {{ socialSupportSubjects }}
      </span>
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
  import { FollowupPageItem } from '~/server/trpc/routers'
  import { HistoryTab } from '~/utils/constants/history'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { followupStatusKeys } from '~/client/options'
  import { socialSupportStatusClasses } from '~/client/classes/socialSupport'
  import { formatUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    data: FollowupPageItem
  }>()

  const followup = computed(() => props.data.followup)

  const followupPath = computed(() =>
    routes.beneficiary.AppBeneficiary.path(followup.value.beneficiary.id, {
      tab: BeneficiaryTab.History,
      item: followup.value.socialSupportId,
      originPage: routes.file.AppHistory.name,
      originTab: HistoryTab.Followups
    })
  )

  const socialSupportSubjects = computed(() =>
    followup.value.subjects.map(({ name }) => name).join(', ')
  )
</script>
