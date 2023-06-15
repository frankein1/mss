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
          v-if="canEditHistory"
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
      <td v-if="canAccessRestrictedFieldsInHelpRequest">
        <template v-if="canDisplayDetailedHistory && helpRequest.dueDate">
          {{ formatDate(helpRequest.dueDate) }}
        </template>
      </td>
      <td>
        {{ getBeneficiaryDisplayName(helpRequest.beneficiary) }}
      </td>
      <template v-if="canAccessRestrictedFieldsInHelpRequest">
        <td>
          <template v-if="canDisplayDetailedHistory">
            {{ instructorOrganization }}
          </template>
        </td>
        <td>
          <template
            v-if="canDisplayDetailedHistory && helpRequest.examinationDate"
          >
            {{ formatDate(helpRequest.examinationDate) }}
          </template>
        </td>
        <td>
          <template
            v-if="canDisplayDetailedHistory && helpRequest.askedAmount"
            >{{ euros(helpRequest.askedAmount) }}</template
          >
        </td>
        <td>
          <template v-if="canDisplayDetailedHistory">
            <HelpRequestsTableRowAllocatedAmountForm
              v-if="canEditAllocatedAmount"
              :help-request="helpRequest"
              @click.stop
              @updated="emit('updated', $event)"
            />
            <template v-else-if="helpRequest.allocatedAmount">
              {{ euros(helpRequest.allocatedAmount) }}
            </template>
          </template>
        </td>
        <td>
          <template v-if="canDisplayDetailedHistory">
            <HelpRequestsTableRowPaymentMethodForm
              v-if="canEditPaymentMethod"
              :help-request="helpRequest"
              @click.stop
              @updated="emit('updated', $event)"
            />
            <template v-else-if="helpRequest.paymentMethod">
              {{ paymentMethodOptions.get(helpRequest.paymentMethod) }}
            </template>
          </template>
        </td>
        <td>
          <template v-if="canDisplayDetailedHistory">
            <HelpRequestsTableRowPaymentDateForm
              v-if="canEditPaymentDate"
              :help-request="helpRequest"
              @click.stop
              @updated="emit('updated', $event)"
            />
            <template v-else-if="helpRequest.paymentDate">
              {{ formatDate(helpRequest.paymentDate) }}
            </template>
          </template>
        </td>
        <td>
          <template
            v-if="canDisplayDetailedHistory && helpRequest.handlingDate"
            >{{ formatDate(helpRequest.handlingDate) }}</template
          >
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
    canAccessProtectedDataInHelpRequest,
    canEditBeneficiaryHelpRequest
  } from '~/server/query/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { getBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { Route, RoutePath } from '~/utils/routing'

  const authStore = useAuthStore()
  const user = authStore.getAuthUser

  const props = defineProps<{
    helpRequest: HelpRequestItem
  }>()

  const emit = defineEmits<{
    (e: 'updated', helpRequest: HelpRequestItem): void
  }>()

  const helpRequestPath = computed(() =>
    RoutePath.Beneficiary(props.helpRequest.beneficiary.id, {
      tab: BeneficiaryTab.History,
      item: props.helpRequest.id,
      originPage: Route.History,
      originTab: HistoryTab.HelpRequests
    })
  )

  const instructorOrganization = computed(() =>
    props.helpRequest.externalStructure
      ? props.helpRequest.instructorOrganization?.name || ''
      : 'Interne'
  )

  const canAccessRestrictedFieldsInHelpRequest = computed(() =>
    canAccessProtectedDataInHelpRequest(user)
  )

  const canDisplayDetailedHistory = computed(
    () => true
    // TODO
    // permissionsStore.canDisplayDetailedHistory({
    //   ...props.history,
    //   isInterview: props.isInterview
    // })
  )

  const canEditHistory = computed(() =>
    canEditBeneficiaryHelpRequest(
      user,
      props.helpRequest.beneficiary,
      props.helpRequest
    )
  )

  const isAcceptedHelpRequest = computed(
    () => props.helpRequest.status === HelpRequestStatus.Accepted
  )

  const isFinancialSupport = computed(() => props.helpRequest.financialSupport)

  const isExternalSupport = computed(() => props.helpRequest.externalStructure)

  const canEditAllocatedAmount = computed(
    () =>
      canEditHistory.value &&
      isAcceptedHelpRequest.value &&
      isFinancialSupport.value
  )

  const canEditPaymentMethod = computed(
    () =>
      canEditHistory.value &&
      isAcceptedHelpRequest.value &&
      !isExternalSupport.value
  )

  const canEditPaymentDate = computed(
    () =>
      canEditHistory.value &&
      isAcceptedHelpRequest.value &&
      !isExternalSupport.value
  )
</script>
