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
        <FollowupsTableRowStatusForm
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
      <td>
        {{ followupMediumOptions.get(followup.medium) }}
      </td>
      <td>{{ followUpTypes }}</td>
      <td>
        {{
          canViewFollowupDetails && followup.dueDate
            ? formatDate(followup.dueDate)
            : undefined
        }}
      </td>
      <td>
        {{ getBeneficiaryDisplayName(followup.beneficiary) }}
      </td>
      <td>
        <template v-if="followup.createdBy">
          {{ getUserDisplayName(followup.createdBy) }}
        </template>
      </td>
      <td>{{ readableFileNumber(followup.beneficiary.id) }}</td>
    </tr>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import { FollowupItem } from './types'
  import { HistoryTab } from '~/utils/constants/history'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary-tabs'
  import {
    followupStatusOptions,
    followupMediumOptions
  } from '~/client/options/followup'
  import { followupStatusClasses } from '~/client/classes/followup'
  import { readableFileNumber } from '~/utils/readableFileNumber'
  import { getUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import {
    canViewFollowupDetails as canViewFollowupDetailsRule,
    canEditFollowup
  } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { getBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { Route, RoutePath } from '~/utils/routing'

  const authStore = useAuthStore()
  const user = authStore.getAuthUser

  const props = defineProps<{
    followup: FollowupItem
  }>()

  const followupPath = computed(() =>
    RoutePath.Beneficiary(props.followup.beneficiary.id, {
      tab: BeneficiaryTab.History,
      item: props.followup.id,
      originPage: Route.History,
      originTab: HistoryTab.Followups
    })
  )

  const followUpTypes = computed(() =>
    props.followup.types.map(({ name }) => name).join(', ')
  )

  const canViewFollowupDetails = computed(() =>
    canViewFollowupDetailsRule(user, props.followup)
  )

  const canQuickEditFollowup = computed(() =>
    canEditFollowup(user, props.followup)
  )
</script>
