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
      :message="confirmationMessage"
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
    @next="onConfirm"
  />
</template>

<script setup lang="ts">
  import { MAX_BENEFICIARIES_REFERENT_TRANSFER } from '~/utils/constants'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'

  const { selectedBeneficiaries, referentId, editionChoice } =
    useMassReferentTransferState()

  const props = defineProps<{
    agentOptions?: Options
  }>()

  const emit = defineEmits<{
    previous: []
  }>()

  const agentName = computed(() => {
    const agent = props.agentOptions?.find(a => a.value === referentId.value)
    return agent?.label
  })

  const confirmationMessage = computed(() => {
    const name = agentName.value ?? '(nom introuvable)'
    const count = selectedBeneficiaries.value.length
    if (editionChoice.value === 'add') {
      return `Êtes-vous sûr de vouloir ajouter ${name} sur ${count} dossiers bénéficiaires ?`
    }
    return `Êtes-vous sûr de vouloir retirer ${name} de ${count} dossiers bénéficiaires ?`
  })

  const addReferentMutation = useTrpcClient().file.addReferent.useMutation()
  const deleteReferentMutation =
    useTrpcClient().file.deleteReferent.useMutation()

  const mutationStatus = computed(() =>
    editionChoice.value === 'add'
      ? addReferentMutation.status.value
      : deleteReferentMutation.status.value
  )

  async function onConfirm() {
    if (referentId.value == null || selectedBeneficiaries.value.length === 0) {
      useSnackbar().error('La mise à jour des référents à échouée.')
      return
    }
    const values = {
      beneficiaries: selectedBeneficiaries.value,
      referentId: referentId.value
    }
    const { mutate, error } =
      editionChoice.value === 'add'
        ? addReferentMutation
        : deleteReferentMutation
    const res = await mutate(values)
    if (error.value || !res) {
      return
    }
    selectedBeneficiaries.value = []
    referentId.value = null
  }
</script>
