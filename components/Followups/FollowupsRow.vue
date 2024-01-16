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
          v-if="permissions.edit"
          :data="data"
          @click.stop
        />
        <span
          v-else
          class="fr-badge"
          :class="[socialSupportStatusClasses[followup.status]]"
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
        {{ followup.dueDate ? formatDate(followup.dueDate) : undefined }}
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
  import { FollowupPageItem } from './types'
  import { HistoryTab } from '~/utils/constants/history'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { followupStatusOptions } from '~/client/options/followup'
  import { socialSupportStatusClasses } from '~/client/classes/socialSupport'
  import { readableFileNumber } from '~/utils/readableFileNumber'
  import { formatUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { Route, RoutePath } from '~/utils/routing'

  const props = defineProps<{
    data: FollowupPageItem
  }>()

  const followup = computed(() => props.data.followup)
  const permissions = computed(() => props.data.permissions)

  const followupPath = computed(() =>
    RoutePath.AppBeneficiary(followup.value.beneficiary.id, {
      tab: BeneficiaryTab.History,
      item: followup.value.id,
      originPage: Route.AppHistory,
      originTab: HistoryTab.Followups
    })
  )

  const followUpTypes = computed(() =>
    followup.value.types.map(({ name }) => name).join(', ')
  )
</script>
