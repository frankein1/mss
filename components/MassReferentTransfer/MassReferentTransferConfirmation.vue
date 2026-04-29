<template>
  <template v-if="mutationStatus === 'idle'">
    <p>
      {{ selectedBeneficiaries.length }}/{{
        MAX_BENEFICIARIES_REFERENT_TRANSFER
      }}
      bénéficiaires sélectionné(s).
    </p>
    <AtomAlert
      :alert-type="AlertType.Warning"
      size="sm"
      :message="`Êtes-vous sur de vouloir ajouter ${agentName ? agentName : '(nom introuvable)'} sur ${selectedBeneficiaries.length} dossiers bénéficiaires ?`"
      :closeable="false"
      title-tag="p"
      class="fr-mb-6v"
    />
  </template>
  <template v-else-if="mutationStatus === 'pending'">
    <AtomAlert
      :alert-type="AlertType.Warning"
      size="sm"
      :message="`Ne pas fermer cette fenêtre`"
      :closeable="false"
      title-tag="p"
      class="fr-mb-6v"
      >La mise à jour des agents référents est en cours. Cela peut prendre
      quelques minutes.</AtomAlert
    >
  </template>
  <template v-else-if="mutationStatus === 'error'">
    <AtomAlert
      :alert-type="AlertType.Error"
      size="sm"
      :message="`echec`"
      :closeable="false"
      title-tag="p"
      class="fr-mb-6v"
    >
      <template #detailedMessage>
        <p>La mise à jour des agents référents a échoué.</p>
      </template>
    </AtomAlert>
  </template>
  <template v-else-if="mutationStatus === 'success'">
    <AtomAlert
      :alert-type="AlertType.Success"
      size="sm"
      :message="`La mise à jour des agents référents à réussi.`"
      :closeable="false"
      title-tag="p"
      class="fr-mb-6v"
    >
      <template #detailedMessage>
        <p>
          <NuxtLink
            class="fr-link"
            :to="routes.beneficiary.AppBeneficiaries.path()"
          >
            Retour à la liste des bénéficiaires.
          </NuxtLink>
        </p>
      </template>
    </AtomAlert>
  </template>

  <MassReferentTransferStepButtons
    v-if="mutationStatus === 'idle' || mutationStatus === 'pending'"
    next-label="Valider"
    :disable-previous="mutationStatus === 'pending'"
    @previous="emit('previous')"
    @next="onAddReferent"
  />
</template>

<script setup lang="ts">
  import type { AddReferentToFamilyFileInput } from '~/server/schema'
  import { MAX_BENEFICIARIES_REFERENT_TRANSFER } from '~/utils/constants'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'

  const { selectedBeneficiaries, referentId } = useMassReferentTransferState()

  const props = defineProps<{
    agentOptions?: Options
  }>()

  const emit = defineEmits<{
    previous: []
  }>()

  // Get agent name
  const agentName = computed(() => {
    const agent = props.agentOptions?.find(a => a.value === referentId.value)
    return agent?.label
  })

  // Action
  const {
    mutate,
    status: mutationStatus,
    error: mutationError
  } = useTrpcClient().file.addReferent.useMutation()

  async function onAddReferent() {
    const values: AddReferentToFamilyFileInput = {
      beneficiaries: selectedBeneficiaries.value,
      referentId: referentId.value || '' // TODO
    }
    const res = await mutate(values)
    if (mutationError.value || !res) {
      return
    }
  }
</script>
