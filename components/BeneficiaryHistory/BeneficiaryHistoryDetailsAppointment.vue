<template>
  <hr class="fr-mb-1v" />
  <AtomLazyComponent
    :pending="status === 'pending'"
    :error="!!error"
    message="Le contenu de cet accompagnement n'a pas pu être chargé"
  >
    <template v-if="appointment">
      <ul class="information-list">
        <li v-if="appointment.durationInMin">
          <span class="information-label">Durée :</span>
          {{ appointment.durationInMin }} min
        </li>
        <li v-if="appointment.place">
          <span class="information-label">Lieu :</span> {{ appointment.place }}
        </li>
        <li v-if="appointment.createdBy">
          <span class="information-label">Créé par :</span>
          {{ formatUserDisplayName(appointment.createdBy) }}
        </li>
      </ul>
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
  </AtomLazyComponent>
</template>
<script setup lang="ts">
  import { BeneficiaryHistoryAction, EventCategory } from '~/types/matomo'
  import { formatUserDisplayName } from '~/utils/user'

  const props = defineProps<{
    id: number
  }>()

  const trpcClient = useTrpcClient()
  const matomo = useMatomo()
  const {
    data: appointment,
    status,
    error
  } = trpcClient.rdvsp.getAppointment.useQuery({
    id: props.id
  })
</script>
