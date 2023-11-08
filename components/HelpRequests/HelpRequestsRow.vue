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
          v-if="permissions.edit"
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
      <td v-if="permissions.viewDetails">
        <template v-if="helpRequest.dueDate">
          {{ formatDate(helpRequest.dueDate) }}
        </template>
      </td>
      <td>
        {{ formatBeneficiaryDisplayName(helpRequest.beneficiary) }}
      </td>
      <template v-if="permissions.viewDetails">
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
        <td v-if="permissions.viewDetails">
          <HelpRequestsAllocatedAmountForm
            v-if="canEditAllocatedAmount"
            :help-request="helpRequest"
            @click.stop
            @updated="emit('updated', $event)"
          />
          <template v-else-if="helpRequest.allocatedAmount">
            {{ euros(helpRequest.allocatedAmount) }}
          </template>
        </td>
        <td v-if="permissions.viewDetails">
          <HelpRequestsPaymentMethodForm
            v-if="canEditPaymentMethod"
            :help-request="helpRequest"
            @click.stop
            @updated="emit('updated', $event)"
          />
          <template v-else-if="helpRequest.paymentMethod">
            {{ paymentMethodOptions.get(helpRequest.paymentMethod) }}
          </template>
        </td>
        <td v-if="permissions.viewDetails">
          <HelpRequestsPaymentDateForm
            v-if="canEditPaymentDate"
            :help-request="helpRequest"
            @click.stop
            @updated="emit('updated', $event)"
          />
          <template v-else-if="helpRequest.paymentDate">
            {{ formatDate(helpRequest.paymentDate) }}
          </template>
        </td>
        <td v-if="permissions.viewDetails">
          <template v-if="helpRequest.handlingDate">{{
            formatDate(helpRequest.handlingDate)
          }}</template>
        </td>
      </template>
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
  import { HelpRequestStatus } from '@prisma/client'
  import { HelpRequestItem } from './types'
  import { HistoryTab } from '~/utils/constants/history'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { paymentMethodOptions } from '~/client/options/helpRequest'
  import { helpRequestStatusClasses } from '~/client/classes/helpRequest'
  import { euros } from '~/utils/euros'
  import { readableFileNumber } from '~/utils/readableFileNumber'
  import { formatUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { Route, RoutePath } from '~/utils/routing'
  import { HelpRequestItemPermissions } from '~/server/route'

  const { helpRequestStatusOptions } = useHelpRequestStatus()

  const props = defineProps<{
    helpRequest: HelpRequestItem
    permissions: HelpRequestItemPermissions
  }>()

  const emit = defineEmits<{
    updated: [helpRequest: HelpRequestItem]
  }>()

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

  const isAcceptedHelpRequest = computed(
    () => props.helpRequest.status === HelpRequestStatus.Accepted
  )

  const isFinancialSupport = computed(() => props.helpRequest.financialSupport)

  const isExternalSupport = computed(() => props.helpRequest.externalStructure)

  const canEditAllocatedAmount = computed(
    () =>
      props.permissions.edit &&
      isAcceptedHelpRequest.value &&
      isFinancialSupport.value
  )

  const canEditPaymentMethod = computed(
    () =>
      props.permissions.edit &&
      isAcceptedHelpRequest.value &&
      !isExternalSupport.value
  )

  const canEditPaymentDate = computed(
    () =>
      props.permissions &&
      isAcceptedHelpRequest.value &&
      !isExternalSupport.value
  )
</script>
