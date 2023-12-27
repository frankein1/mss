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
          v-if="props.helpRequest.permissions"
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
      <td v-if="generalPermissions?.get.anyDueDate">
        <template v-if="helpRequest.dueDate">
          {{ formatDate(helpRequest.dueDate) }}
        </template>
      </td>
      <td>
        {{ formatBeneficiaryDisplayName(helpRequest.beneficiary) }}
      </td>
      <td v-if="generalPermissions?.get.anyInstructorOrganization">
        {{ instructorOrganization }}
      </td>
      <td v-if="generalPermissions?.get.anyExaminationDate">
        <template v-if="helpRequest.examinationDate">
          {{ formatDate(helpRequest.examinationDate) }}
        </template>
      </td>
      <td v-if="generalPermissions?.get.anyAskedAmount">
        <template v-if="helpRequest.askedAmount">
          {{ euros(helpRequest.askedAmount) }}
        </template>
      </td>
      <td v-if="generalPermissions?.get.anyAllocatedAmount">
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
      <td v-if="generalPermissions?.get.anyPaymentMethod">
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
      <td v-if="generalPermissions?.get.anyPaymentDate">
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
      <td v-if="generalPermissions?.get.anyHandlingDate">
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
  import { HelpRequestSubject, HelpRequestStatus } from '@prisma/client'
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
  import { HelpRequestPermissions } from '~/server/security'

  const props = defineProps<{
    helpRequest: HelpRequestItem
    generalPermissions: HelpRequestPermissions | null
  }>()

  const { helpRequestStatusOptions } = useHelpRequestStatus()

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

  const isFinancialSupport = computed(
    () => props.helpRequest.subject === HelpRequestSubject.Financial
  )

  const isExternalSupport = computed(() => props.helpRequest.externalStructure)

  const canEditAllocatedAmount = computed(
    () =>
      props.helpRequest.permissions.edit &&
      isFinancialSupport.value &&
      props.helpRequest.status === HelpRequestStatus.Accepted
  )

  const canEditPaymentMethod = computed(
    () =>
      props.helpRequest.permissions.edit &&
      isFinancialSupport.value &&
      props.helpRequest.status === HelpRequestStatus.Accepted &&
      !isExternalSupport.value
  )

  const canEditPaymentDate = computed(
    () =>
      props.helpRequest.permissions.edit &&
      isFinancialSupport.value &&
      props.helpRequest.status === HelpRequestStatus.Accepted &&
      !isExternalSupport.value
  )
</script>
