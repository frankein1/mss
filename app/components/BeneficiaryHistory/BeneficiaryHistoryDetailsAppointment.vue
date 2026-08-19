<template>
  <hr class="fr-mb-1v" />
  <AtomLazyComponent
    :pending="queryStatus === 'pending'"
    :error="!!error"
    message="Le contenu de cet accompagnement n'a pas pu être chargé"
  >
    <template v-if="appointment">
      <ul class="information-list">
        <li v-if="appointment.durationInMin">
          <span class="information-label">Durée :</span>
          {{ appointment.durationInMin }} min
        </li>
        <li v-if="appointment.type">
          <span class="information-label">Type :</span>
          {{
            appointment.type === 'public_office'
              ? 'RDV en physique'
              : 'RDV téléphonique'
          }}
        </li>
        <li v-if="appointment.place">
          <span class="information-label">Lieu :</span> {{ appointment.place }}
        </li>
        <li v-if="appointment.createdBy">
          <span class="information-label">Créé par :</span>
          {{ formatUserDisplayName(appointment.createdBy) }}
        </li>
      </ul>
      <template v-if="appointment.collectif">
        <p class="fr-text--sm fr-mb-1w">
          Le statut de ce rendez-vous collectif ne peut être modifié que depuis
          RDV Service Public.
        </p>
        <ul
          class="fr-btns-group fr-btns-group--sm fr-btns-group--icon-left fr-btns-group--inline fr-btns-group--right"
        >
          <li>
            <NuxtLink
              :to="appointment.url"
              class="fr-btn fr-btn--secondary fr-icon-edit-line"
              external
              target="_blank"
              @click="
                matomo.trackEvent(
                  EventCategory.Beneficiary,
                  BeneficiaryHistoryAction.UpdateAppointment
                )
              "
            >
              Modifier dans RDV Service Public
            </NuxtLink>
          </li>
        </ul>
      </template>
      <template v-else>
        <div class="fr-select-group">
          <label
            class="fr-label"
            for="select-statut"
          >
            Changer le statut
          </label>
          <select
            id="select-statut"
            class="fr-select"
            aria-describedby="select-statut-messages"
            name="select-statut"
            @change="updateStatus"
          >
            <template
              v-for="option in options"
              :key="option.value"
            >
              <option
                :value="option.value"
                :selected="option.selected"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </option>
            </template>
          </select>
          <div
            id="select-statut-messages"
            class="fr-messages-group"
            aria-live="polite"
          ></div>
        </div>
        <ul
          class="fr-btns-group fr-btns-group--sm fr-btns-group--icon-left fr-btns-group--inline fr-btns-group--right"
        >
          <li>
            <NuxtLink
              :to="appointment.url"
              class="fr-btn fr-btn--secondary fr-icon-edit-line"
              external
              @click="
                matomo.trackEvent(
                  EventCategory.Beneficiary,
                  BeneficiaryHistoryAction.UpdateAppointment
                )
              "
            >
              Modifier dans RDV Service Public
            </NuxtLink>
          </li>
        </ul>
      </template>
    </template>
  </AtomLazyComponent>
</template>
<script setup lang="ts">
  import type { RdvMetadata } from './types'
  import { BeneficiaryHistoryAction, EventCategory } from '~~/types/matomo'
  import { RdvspStatus } from '~~/types/rdvsp'
  import { formatUserDisplayName } from '~/utils/user'
  import dayjs from 'dayjs'

  const props = defineProps<{
    id: number
    rdvMetadata?: RdvMetadata
  }>()

  const trpcClient = useTrpcClient()
  const matomo = useMatomo()
  const {
    data: appointment,
    status: queryStatus,
    error
  } = trpcClient.rdvsp.getAppointment.useQuery({
    id: props.id,
    // rdvMetadata is a discriminated union keyed on `collectif`; beneficiaryId only
    // exists on the collective variant, where the server resolves it to the RDVSP
    // participation to reconcile that specific participant's status.
    beneficiaryId: props.rdvMetadata?.collectif
      ? props.rdvMetadata.beneficiaryId
      : undefined
  })

  const status = computed(() => {
    switch (appointment.value?.status) {
      case 'RdvUnknown': {
        return dateIsSameOrAfter(
          dayjs(appointment.value?.date),
          dayjs(new Date())
        )
          ? 'RdvUpcoming'
          : 'RdvObsolete'
      }
      default:
        return appointment.value?.status
    }
  })

  const options = computed(() => {
    const isFuture = dayjs(appointment.value?.date).isSameOrAfter(
      dayjs(new Date()),
      'day'
    )

    return [
      {
        label: 'Séléctionnez un statut',
        value: '',
        selected:
          status.value === 'RdvUpcoming' || status.value === 'RdvObsolete',
        disabled: true
      },
      {
        label: 'RDV honoré',
        value: RdvspStatus.Seen,
        selected: status.value === 'RdvSeen',
        disabled: isFuture
      },
      {
        label: 'Absence non excusée',
        value: RdvspStatus.NoShow,
        selected: status.value === 'RdvNoShow',
        disabled: isFuture
      },
      {
        label: 'Annulé par l’usager',
        value: RdvspStatus.Excused,
        selected: status.value === 'RdvExcused',
        disabled: false
      },
      {
        label: 'Annulé par la structure',
        value: RdvspStatus.Revoked,
        selected: status.value === 'RdvRevoked',
        disabled: false
      }
    ]
  })

  // Update status
  const { mutate } = trpcClient.rdvsp.updateAppointmentStatus.useMutation()
  const updateStatus = async (event: Event) => {
    const rdvspStatus = (event.target as HTMLSelectElement).value as RdvspStatus

    await mutate({
      id: Number(appointment.value?.id),
      status: rdvspStatus
    })
    matomo.trackEvent(
      EventCategory.History,
      BeneficiaryHistoryAction.UpdateAppointmentStatus
    )
    await refreshNuxtData(['getFamilyFile.history'])
  }
</script>
