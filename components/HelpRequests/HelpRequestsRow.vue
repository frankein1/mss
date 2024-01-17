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
        <HelpRequestsStatusForm
          v-if="permissions"
          :item="item"
          @click.stop
          @updated="emit('updated', $event)"
        />
        <span
          v-else
          class="fr-badge"
          :class="[socialSupportStatusClasses[helpRequest.status]]"
        >
          {{ helpRequestStatusOptions.get(helpRequest.status) }}
        </span>
      </td>
      <td>{{ helpRequest.type?.name || '' }}</td>
      <td v-if="application.module.helpRequest">
        <template v-if="helpRequest.dueDate">
          {{ formatDate(helpRequest.dueDate) }}
        </template>
      </td>
      <td>
        {{ formatBeneficiaryDisplayName(helpRequest.beneficiary) }}
      </td>
      <td v-if="application.module.helpRequest">
        {{ instructorOrganization }}
      </td>
      <td v-if="application.module.helpRequest">
        <template v-if="helpRequest.examinationDate">
          {{ formatDate(helpRequest.examinationDate) }}
        </template>
      </td>
      <td v-if="application.module.helpRequest">
        <template v-if="helpRequest.askedAmount">
          {{ euros(helpRequest.askedAmount) }}
        </template>
      </td>
      <td v-if="application.module.helpRequest">
        <HelpRequestsAllocatedAmountForm
          v-if="canEditAllocatedAmount"
          :item="item"
          @click.stop
          @updated="emit('updated', $event)"
        />
        <template v-else-if="helpRequest.allocatedAmount">
          {{ euros(helpRequest.allocatedAmount) }}
        </template>
      </td>
      <td v-if="application.module.helpRequest">
        <HelpRequestsPaymentMethodForm
          v-if="canEditPaymentMethod"
          :item="item"
          @click.stop
          @updated="emit('updated', $event)"
        />
        <template v-else-if="helpRequest.paymentMethod">
          {{ paymentMethodOptions.get(helpRequest.paymentMethod) }}
        </template>
      </td>
      <td v-if="application.module.helpRequest">
        <HelpRequestsPaymentDateForm
          v-if="canEditPaymentDate"
          :item="item"
          @click.stop
          @updated="emit('updated', $event)"
        />
        <template v-else-if="helpRequest.paymentDate">
          {{ formatDate(helpRequest.paymentDate) }}
        </template>
      </td>
      <td v-if="application.module.helpRequest">
        <template v-if="helpRequest.handlingDate">{{
          formatDate(helpRequest.handlingDate)
        }}</template>
      </td>
      <td>
        <template v-if="helpRequest.createdBy">
          {{ formatUserDisplayName(helpRequest.createdBy) }}
        </template>
      </td>
      <td>{{ readableFileNumber(helpRequest.beneficiary.id) }}</td>
    </tr>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import { HelpRequestSubject, SocialSupportStatus } from '@prisma/client'
  import { HelpRequestPageItem } from './types'
  import { HistoryTab } from '~/utils/constants/history'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { paymentMethodOptions } from '~/client/options/helpRequest'
  import { socialSupportStatusClasses } from '~/client/classes/socialSupport'
  import { euros } from '~/utils/euros'
  import { readableFileNumber } from '~/utils/readableFileNumber'
  import { formatUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { Route, RoutePath } from '~/utils/routing'

  const props = defineProps<{
    item: HelpRequestPageItem
  }>()

  const { helpRequestStatusOptions } = useHelpRequestStatus()

  const emit = defineEmits<{
    updated: [item: HelpRequestPageItem]
  }>()

  const helpRequest = computed(() => props.item.helpRequest)
  const permissions = computed(() => props.item.permissions)
  const { application } = usePermissions()

  const helpRequestPath = computed(() =>
    RoutePath.AppBeneficiary(helpRequest.value.beneficiary.id, {
      tab: BeneficiaryTab.History,
      item: helpRequest.value.socialSupportId,
      originPage: Route.AppHistory,
      originTab: HistoryTab.HelpRequests
    })
  )

  const instructorOrganization = computed(() =>
    helpRequest.value.externalStructure
      ? helpRequest.value.instructorOrganization?.name || ''
      : 'Interne'
  )

  const isFinancialSupport = computed(
    () => helpRequest.value.subject === HelpRequestSubject.Financial
  )

  const isExternalSupport = computed(() => helpRequest.value.externalStructure)

  const canEditAllocatedAmount = computed(
    () =>
      props.item.permissions.edit &&
      isFinancialSupport.value &&
      helpRequest.value.status === SocialSupportStatus.Accepted
  )

  const canEditPaymentMethod = computed(
    () =>
      props.item.permissions.edit &&
      isFinancialSupport.value &&
      helpRequest.value.status === SocialSupportStatus.Accepted &&
      !isExternalSupport.value
  )

  const canEditPaymentDate = computed(
    () =>
      props.item.permissions.edit &&
      isFinancialSupport.value &&
      helpRequest.value.status === SocialSupportStatus.Accepted &&
      !isExternalSupport.value
  )
</script>
