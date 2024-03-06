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
        <FileInstructionsStatusForm
          v-if="permissions.edit"
          :item="item"
          @click.stop
          @updated="emit('updated', $event)"
        />
        <span
          v-else
          class="fr-badge"
          :class="[socialSupportStatusClasses[socialSupport.status]]"
        >
          {{ socialSupportStatusLabels[socialSupport.status] }}
        </span>
      </td>
      <td>{{ fileInstructionObject || '' }}</td>
      <td v-if="application.module.helpRequest">
        <template v-if="socialSupport.dueDate">
          {{ formatDate(socialSupport.dueDate) }}
        </template>
      </td>
      <td>
        {{ formatBeneficiaryDisplayName(socialSupport.beneficiary) }}
      </td>
      <td v-if="application.module.helpRequest">
        {{ instructorOrganization }}
      </td>
      <td v-if="application.module.helpRequest">
        <template v-if="fileInstruction.examinationDate">
          {{ formatDate(fileInstruction.examinationDate) }}
        </template>
      </td>
      <td v-if="application.module.helpRequest">
        <template v-if="helpRequest?.askedAmount">
          {{ euros(helpRequest?.askedAmount) }}
        </template>
      </td>
      <td v-if="application.module.helpRequest">
        <HelpRequestsAllocatedAmountForm
          v-if="helpRequest && canEditAllocatedAmount"
          :item="item"
          :help-request="helpRequest"
          @click.stop
          @updated="emit('updated', $event)"
        />
        <template v-else-if="helpRequest?.allocatedAmount">
          {{ euros(helpRequest?.allocatedAmount) }}
        </template>
      </td>
      <td v-if="application.module.helpRequest">
        <HelpRequestsPaymentMethodForm
          v-if="helpRequest && canEditPaymentMethod"
          :item="item"
          :help-request="helpRequest"
          @click.stop
          @updated="emit('updated', $event)"
        />
        <template v-else-if="helpRequest?.paymentMethod">
          {{ paymentMethodOptions.get(helpRequest?.paymentMethod) }}
        </template>
      </td>
      <td v-if="application.module.helpRequest">
        <HelpRequestsPaymentDateForm
          v-if="helpRequest && canEditPaymentDate"
          :item="item"
          :help-request="helpRequest"
          @click.stop
          @updated="emit('updated', $event)"
        />
        <template v-else-if="helpRequest?.paymentDate">
          {{ formatDate(helpRequest?.paymentDate) }}
        </template>
      </td>
      <td v-if="application.module.helpRequest">
        <template v-if="helpRequest?.handlingDate">{{
          formatDate(helpRequest?.handlingDate)
        }}</template>
      </td>
      <td>
        <template v-if="socialSupport.createdBy">
          {{ formatUserDisplayName(socialSupport.createdBy) }}
        </template>
      </td>
      <td>{{ readableFileNumber(socialSupport.beneficiary.id) }}</td>
    </tr>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import { FileInstructionType, SocialSupportStatus } from '@prisma/client'
  import { FileInstructionPageItem } from '~/server/trpc/routers'
  import { HistoryTab } from '~/utils/constants/history'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { paymentMethodOptions } from '~/client/options'
  import { socialSupportStatusClasses } from '~/client/classes/socialSupport'
  import { euros } from '~/utils/euros'
  import { readableFileNumber } from '~/utils/readableFileNumber'
  import { formatUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { Route, RoutePath } from '~/utils/routing'

  const props = defineProps<{
    item: FileInstructionPageItem
  }>()

  const { socialSupportStatusLabels } = useSocialSupportStatus()

  const emit = defineEmits<{
    updated: [item: FileInstructionPageItem]
  }>()

  const fileInstruction = computed(() => props.item.fileInstruction)
  const helpRequest = computed(() => fileInstruction.value.helpRequest)
  const socialSupport = computed(() => fileInstruction.value.socialSupport)
  const fileInstructionObject = computed(() => {
    if (fileInstruction.value.type === FileInstructionType.Housing) {
      return 'Demande de logement'
    }
    const subjects = fileInstruction.value.socialSupport.subjects
    return subjects.length > 0 ? subjects[0].name : null
  })

  const permissions = computed(() => props.item.permissions)
  const { application } = usePermissions()

  const helpRequestPath = computed(() =>
    RoutePath.AppBeneficiary(socialSupport.value.beneficiary.id, {
      tab: BeneficiaryTab.History,
      item: socialSupport.value.id,
      originPage: Route.AppHistory,
      originTab: HistoryTab.FileInstructions
    })
  )

  const instructorOrganization = computed(() =>
    fileInstruction.value.externalStructure
      ? fileInstruction.value.instructorOrganization?.name || ''
      : 'Interne'
  )

  const isFinancialSupport = computed(() => helpRequest.value?.financialSupport)

  const isExternalSupport = computed(
    () => fileInstruction.value.externalStructure
  )

  const canEditAllocatedAmount = computed(
    () =>
      props.item.permissions.edit &&
      isFinancialSupport.value &&
      socialSupport.value.status === SocialSupportStatus.Accepted
  )

  const canEditPaymentMethod = computed(
    () =>
      props.item.permissions.edit &&
      isFinancialSupport.value &&
      socialSupport.value.status === SocialSupportStatus.Accepted &&
      !isExternalSupport.value
  )

  const canEditPaymentDate = computed(
    () =>
      props.item.permissions.edit &&
      isFinancialSupport.value &&
      socialSupport.value.status === SocialSupportStatus.Accepted &&
      !isExternalSupport.value
  )
</script>
