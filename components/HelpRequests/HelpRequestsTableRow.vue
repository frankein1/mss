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
        <HelpRequestsTableRowStatusForm
          v-if="canQuickEditHelpRequest"
          :help-request="helpRequest"
          @click.stop
          @updated="emit('updated', $event)"
        />
        <span
          v-else
          class="fr-badge"
          :class="[helpRequestStatusClasses[helpRequest.status]]"
        >
          {{ helpRequestStatusOptions.get(helpRequest.status) }}
        </span>
      </td>
      <td>{{ helpRequest.type.name }}</td>
      <td v-if="canViewHelpRequestDetails">
        <template v-if="helpRequest.dueDate">
          {{ formatDate(helpRequest.dueDate) }}
        </template>
      </td>
      <td>
        {{ getBeneficiaryDisplayName(helpRequest.beneficiary) }}
      </td>
      <template v-if="canViewHelpRequestDetails">
        <td>{{ instructorOrganization }}</td>
        <td>
          <template v-if="helpRequest.examinationDate">
            {{ formatDate(helpRequest.examinationDate) }}
          </template>
        </td>
        <td>
          <template v-if="helpRequest.askedAmount">
            {{ euros(helpRequest.askedAmount) }}
          </template>
        </td>
        <td v-if="canViewHelpRequestDetails">
          <HelpRequestsTableRowAllocatedAmountForm
            v-if="canEditAllocatedAmount"
            :help-request="helpRequest"
            @click.stop
            @updated="emit('updated', $event)"
          />
          <template v-else-if="helpRequest.allocatedAmount">
            {{ euros(helpRequest.allocatedAmount) }}
          </template>
        </td>
        <td v-if="canViewHelpRequestDetails">
          <HelpRequestsTableRowPaymentMethodForm
            v-if="canEditPaymentMethod"
            :help-request="helpRequest"
            @click.stop
            @updated="emit('updated', $event)"
          />
          <template v-else-if="helpRequest.paymentMethod">
            {{ paymentMethodOptions.get(helpRequest.paymentMethod) }}
          </template>
        </td>
        <td v-if="canViewHelpRequestDetails">
          <HelpRequestsTableRowPaymentDateForm
            v-if="canEditPaymentDate"
            :help-request="helpRequest"
            @click.stop
            @updated="emit('updated', $event)"
          />
          <template v-else-if="helpRequest.paymentDate">
            {{ formatDate(helpRequest.paymentDate) }}
          </template>
        </td>
        <td v-if="canViewHelpRequestDetails">
          <template v-if="helpRequest.handlingDate">{{
            formatDate(helpRequest.handlingDate)
          }}</template>
        </td>
      </template>
      <td>
        <template v-if="helpRequest.createdBy">
          {{ getUserDisplayName(helpRequest.createdBy) }}
        </template>
      </td>
      <td>{{ readableFileNumber(helpRequest.beneficiary.id) }}</td>
    </tr>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import { HelpRequestStatus } from '@prisma/client'
  import { HelpRequestItem } from './types'
  import { HistoryTab } from '~/utils/constants/history'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary-tabs'
  import {
    helpRequestStatusOptions,
    paymentMethodOptions
  } from '~/client/options/helpRequest'
  import { helpRequestStatusClasses } from '~/client/classes/helpRequest'
  import { euros } from '~/utils/euros'
  import { readableFileNumber } from '~/utils/readableFileNumber'
  import { getUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import {
    canViewHelpRequestDetails as canViewHelpRequestDetailsRule,
    canEditHelpRequest
  } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { getBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { Route, RoutePath } from '~/utils/routing'

  const authStore = useAuthStore()

  const props = defineProps<{
    helpRequest: HelpRequestItem
  }>()

  const emit = defineEmits<{
    (e: 'updated', helpRequest: HelpRequestItem): void
  }>()

  const user = computed(() => authStore.getAuthUser)

  const helpRequestPath = computed(() =>
    RoutePath.AppBeneficiary(props.helpRequest.beneficiary.id, {
      tab: BeneficiaryTab.History,
      item: props.helpRequest.id,
      originPage: Route.AppHistory,
      originTab: HistoryTab.HelpRequests
    })
  )

  const instructorOrganization = computed(() =>
    props.helpRequest.externalStructure
      ? props.helpRequest.instructorOrganization?.name || ''
      : 'Interne'
  )

  const canViewHelpRequestDetails = computed(() =>
    canViewHelpRequestDetailsRule(user.value, props.helpRequest.beneficiary)
  )

  const canQuickEditHelpRequest = computed(() =>
    canEditHelpRequest(user.value, props.helpRequest)
  )

  const isAcceptedHelpRequest = computed(
    () => props.helpRequest.status === HelpRequestStatus.Accepted
  )

  const isFinancialSupport = computed(() => props.helpRequest.financialSupport)

  const isExternalSupport = computed(() => props.helpRequest.externalStructure)

  const canEditAllocatedAmount = computed(
    () =>
      canQuickEditHelpRequest.value &&
      isAcceptedHelpRequest.value &&
      isFinancialSupport.value
  )

  const canEditPaymentMethod = computed(
    () =>
      canQuickEditHelpRequest.value &&
      isAcceptedHelpRequest.value &&
      !isExternalSupport.value
  )

  const canEditPaymentDate = computed(
    () =>
      canQuickEditHelpRequest.value &&
      isAcceptedHelpRequest.value &&
      !isExternalSupport.value
  )
</script>
