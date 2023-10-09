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
        <FollowupsStatusForm
          v-if="canQuickEditFollowup"
          :followup="followup"
          @click.stop
        />
        <span
          v-else
          class="fr-badge"
          :class="[followupStatusClasses[followup.status]]"
        >
          {{ followupStatusOptions.get(followup.status) }}
        </span>
      </td>
      <td>{{ formatDate(followup.date) }}</td>
      <td>
        {{ formatBeneficiaryDisplayName(followup.beneficiary) }}
      </td>
      <td class="followup-types-data">{{ followUpTypes }}</td>
      <td>
        {{
          canViewFollowupDetails && followup.dueDate
            ? formatDate(followup.dueDate)
            : undefined
        }}
      </td>
      <td>
        <template v-if="followup.createdBy">
          {{ formatUserDisplayName(followup.createdBy) }}
        </template>
      </td>
      <td>{{ readableFileNumber(followup.beneficiary.id) }}</td>
    </tr>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import { FollowupItem } from '~/server/trpc/routers'
  import { HistoryTab } from '~/utils/constants/history'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { followupStatusOptions } from '~/client/options/followup'
  import { followupStatusClasses } from '~/client/classes/followup'
  import { readableFileNumber } from '~/utils/readableFileNumber'
  import { formatUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import {
    canViewFollowupDetails as canViewFollowupDetailsRule,
    canEditFollowup
  } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { Route, RoutePath } from '~/utils/routing'

  const authStore = useAuthStore()

  const props = defineProps<{
    followup: FollowupItem
  }>()

  const user = computed(() => authStore.getAuthUser)

  const followupPath = computed(() =>
    RoutePath.AppBeneficiary(props.followup.beneficiary.id, {
      tab: BeneficiaryTab.History,
      item: props.followup.id,
      originPage: Route.AppHistory,
      originTab: HistoryTab.Followups
    })
  )

  const followUpTypes = computed(() =>
    props.followup.types.map(({ name }) => name).join(', ')
  )

  const canViewFollowupDetails = computed(() =>
    canViewFollowupDetailsRule(user.value, props.followup)
  )

  const canQuickEditFollowup = computed(() =>
    canEditFollowup(user.value, props.followup)
  )
</script>
