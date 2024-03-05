<template>
  <NuxtLink
    v-slot="{ navigate }"
    custom
    :to="followupPath"
  >
    <tr
      class="clickable-row"
      @click="navigate"
    >
      <td>
        <span
          class="fr-badge fr-badge--sm"
          :class="[socialSupportStatusClasses[followup.status]]"
        >
          {{ followupStatusOptions.get(followup.status) }}
        </span>
      </td>
      <td>{{ formatDate(followup.date) }}</td>
      <td>
        {{ formatBeneficiaryDisplayName(followup.beneficiary) }}
      </td>
      <td class="social-support-subjects-data">{{ socialSupportSubjects }}</td>
      <td>
        {{ followup.dueDate ? formatDate(followup.dueDate) : undefined }}
      </td>
      <td>
        <template v-if="followup.createdBy">
          {{ formatUserDisplayName(followup.createdBy) }}
        </template>
      </td>
    </tr>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import { FollowupPageItem } from '~/server/trpc/routers'
  import { HistoryTab } from '~/utils/constants/history'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { followupStatusOptions } from '~/client/options'
  import { socialSupportStatusClasses } from '~/client/classes/socialSupport'
  import { formatUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { Route, RoutePath } from '~/utils/routing'

  const props = defineProps<{
    data: FollowupPageItem
  }>()

  const followup = computed(() => props.data.followup)

  const followupPath = computed(() =>
    RoutePath.AppBeneficiary(followup.value.beneficiary.id, {
      tab: BeneficiaryTab.History,
      item: followup.value.socialSupportId,
      originPage: Route.AppHistory,
      originTab: HistoryTab.Followups
    })
  )

  const socialSupportSubjects = computed(() =>
    followup.value.subjects.map(({ name }) => name).join(', ')
  )
</script>
