<template>
  <NuxtLink
    v-slot="{ navigate }"
    custom
    :to="historyPath"
  >
    <tr
      class="clickable-row"
      @click="navigate"
    >
      <td>
        <form
          v-if="canEditHistory"
          @click.stop
          @change="onUpdateRow('status', $event)"
        >
          <AtomSelect
            name="status"
            label="Statut"
            :options="statusOptions"
            :model-value="history.status"
            required
            no-label
            labelled-by="status-col"
            :disabled-options="pastStatuses"
          />
        </form>
        <span
          v-else
          class="fr-badge"
          :class="[statusClass]"
        >
          {{ statusOptions.get(history.status) }}
        </span>
      </td>
      <td v-if="isInterview">
        {{ followupMediumOptions.get((history as Followup).medium) }}
      </td>
      <td>{{ followUpTypes }}</td>
      <td v-if="isInterview || canAccessRestrictedFieldsInHelpRequest">
        <template v-if="canDisplayDetailedHistory">
          {{ history.dueDate ? formatDate(history.dueDate) : undefined }}
        </template>
      </td>
      <td>
        {{ getBeneficiaryDisplayName(history.beneficiary) }}
      </td>
      <!-- <template v-if="!isInterview && canAccessRestrictedFieldsInHelpRequest">
        <td>
          <template v-if="canDisplayDetailedHistory">
            {{ examiningOrganisation }}
          </template>
        </td>
        <td>
          <template v-if="canDisplayDetailedHistory">
            {{ formatDate(history.examination_date) }}
          </template>
        </td>
        <td>
          <template v-if="canDisplayDetailedHistory && history.asked_amount">{{
            euros(history.asked_amount)
          }}</template>
        </td>
        <td>
          <template v-if="canDisplayDetailedHistory">
            <form
              v-if="canEditAllocatedAmount"
              @click.stop
              @change="onUpdateRow('allocated_amount', $event)"
            >
              <AtomCurrencyInput
                name="allocated_amount"
                label="Montant attribué"
                :value="history.allocated_amount"
                no-label
                labelled-by="allocated-amount-col"
              />
            </form>
            <template v-else-if="history.allocated_amount">
              {{ euros(history.allocated_amount) }}
            </template>
          </template>
        </td>
        <td>
          <template v-if="canDisplayDetailedHistory">
            <form
              v-if="canEditPaymentMethod"
              @click.stop
              @change="onUpdateRow('payment_method', $event)"
            >
              <AtomSelect
                name="payment_method"
                label="Mode de paiement"
                no-label
                labelled-by="payment-method-col"
                :options="withEmptyValue(paymentMethodOptions)"
                :model-value="history.payment_method"
              />
            </form>
            <template v-else>
              {{ paymentMethodOptions.get(history.payment_method) }}
            </template>
          </template>
        </td>
        <td>
          <template v-if="canDisplayDetailedHistory">
            <form
              v-if="canEditPaymentDate"
              @click.stop
              @change="onUpdateRow('payment_date', $event)"
            >
              <AtomInput
                name="payment_date"
                label="Date du paiement"
                type="date"
                no-label
                labelled-by="payment-date-col"
                :value="history.payment_date"
              />
            </form>
            <template v-else>
              {{ formatDate(history.payment_date) }}
            </template>
          </template>
        </td>
        <td>
          <template v-if="canDisplayDetailedHistory">{{
            formatDate(history.handling_date)
          }}</template>
        </td>
      </template> -->
      <td>{{ getUserDisplayName(history.createdBy) }}</td>
      <td>{{ readableFileNumber(history.beneficiary.id) }}</td>
    </tr>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import {
    HelpRequestStatus,
    Followup,
    FollowupType,
    Beneficiary,
    User,
    HelpRequest,
    FollowupStatus
  } from '@prisma/client'
  import {
    ORIGIN_PAGE_PARAMETER,
    ORIGIN_TAB_PARAMETER
  } from '~/utils/constants'
  import {
    INTERVIEWS_TAB_ID,
    HELP_REQUESTS_TAB_ID
  } from '~/utils/constants/history'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary-tabs'
  import {
    followupStatusOptions,
    followupMediumOptions
  } from '~/client/options/followup'
  import {
    helpRequestStatusOptions
    // paymentMethodOptions
  } from '~/client/options/helpRequest'
  import { followupStatusClasses } from '~/client/classes/followup'
  import { helpRequestStatusBadgeClasses } from '~/client/classes/helpRequest'
  import { pastStatusesFromStatus } from '~/utils/pastStatusesFromStatus'
  // import { euros } from '~/utils/euros'
  import { readableFileNumber } from '~/utils/readableFileNumber'
  import { getUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  // import { withEmptyValue } from '~/utils/options'
  import { canAccessProtectedDataInHelpRequest } from '~/server/query/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { getBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { Routes } from '~/utils/routing/routes'

  // const snackbar = useSnackbar()
  const authStore = useAuthStore()
  const user = authStore.getAuthUser
  // const trpcClient = useTrpcClient()
  const route = useRoute()

  const props = withDefaults(
    defineProps<{
      history:
        | (Followup & {
            types: Array<FollowupType>
            beneficiary: Beneficiary
            createdBy: User
          })
        | (HelpRequest & {
            type: FollowupType
            beneficiary: Beneficiary
            createdBy: User
          })
      isInterview?: boolean
    }>(),
    {
      isInterview: false
    }
  )

  // const emit = defineEmits(['updated'])

  const historyPath = computed(() => {
    return {
      path: Routes.Beneficiary(props.history.beneficiary.id),
      query: {
        tab: BeneficiaryTab.History,
        item: props.history.id,
        [ORIGIN_PAGE_PARAMETER]: route.path,
        [ORIGIN_TAB_PARAMETER]: props.isInterview
          ? INTERVIEWS_TAB_ID
          : HELP_REQUESTS_TAB_ID
      }
    }
  })

  // const examiningOrganisation = computed(() => {
  //   if (props.isInterview) return ''
  //   return props.history.externalStructure
  //     ? props.history.organisme_instructeur?.name || ''
  //     : 'Interne'
  // })

  const statusOptions = computed(() =>
    props.isInterview ? followupStatusOptions : helpRequestStatusOptions
  )

  const pastStatuses = computed(() => {
    if (props.isInterview) return []
    return pastStatusesFromStatus(props.history.status as HelpRequestStatus)
  })

  const statusClass = computed(() => {
    if (props.isInterview) {
      return followupStatusClasses[props.history.status as FollowupStatus] || ''
    }
    return (
      helpRequestStatusBadgeClasses[
        props.history.status as HelpRequestStatus
      ] || ''
    )
  })

  const followUpTypes = computed(() => {
    if (props.isInterview) {
      return props.history.types.map((t: FollowupType) => t.name).join(', ')
    }
    return (props.history.type as FollowupType).name
  })

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

  const canEditHistory = computed(
    () => true
    // TODO
    // permissionsStore.canEditHistoryItem(props.history)
  )

  // const isAcceptedHelpRequest = computed(
  //   () =>
  //     !props.isInterview && props.history.status === HelpRequestStatus.Accepted
  // )

  // const isFinancialSupport = computed(
  //   () => !props.isInterview && (props.history as HelpRequest).financialSupport
  // )

  // const isExternalSupport = computed(
  //   () => !props.isInterview && (props.history as HelpRequest).externalStructure
  // )

  // const canEditAllocatedAmount = computed(
  //   () =>
  //     canEditHistory.value &&
  //     isAcceptedHelpRequest.value &&
  //     isFinancialSupport.value
  // )

  // const canEditPaymentMethod = computed(
  //   () =>
  //     canEditHistory.value &&
  //     isAcceptedHelpRequest.value &&
  //     !isExternalSupport.value
  // )

  // const canEditPaymentDate = computed(
  //   () =>
  //     canEditHistory.value &&
  //     isAcceptedHelpRequest.value &&
  //     !isExternalSupport.value
  // )

  function onUpdateRow(field, target) {
    // TODO
    console.log(field)
    console.log(target)
    // fieldName: string,
    // { target }: { target: Object }
    // const { value, type } = target
    // // A hack to prevent submitting dates while typing
    // if (type === 'date' && value.startsWith('0')) return
    // try {
    //   const fields = props.isInterview
    //     ? INTERVIEWS_TABLE_FIELDS
    //     : permissionsStore.accessibleHelpRequestFields
    //   const res = await $apiRequest(
    //     `/items/${historyCollection.value}/${props.history.id}`,
    //     {
    //       method: 'patch',
    //       data: {
    //         [fieldName]: value.length ? value : null
    //       }
    //     },
    //     fields ? { fields } : undefined
    //   )
    //   if (res.status === 200) {
    //     emit('updated', res.data.data)
    //     snackbar.success(
    //       props.isInterview
    //         ? "L'entretien a été modifié"
    //         : "La demande d'aide a été modifiée"
    //     )
    //   } else throw new Error(errorResponseMessage(res))
    // } catch {
    //   snackbar.error('La modification a échoué.')
    // }
  }
</script>
