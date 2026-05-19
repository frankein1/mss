<template>
  <template v-if="mutationStatus === 'idle'">
    <p class="fr-text--bold">{{ summarySelected }}</p>

    <AtomAlert
      :alert-type="AlertType.Warning"
      size="sm"
      :message="confirmationMessage"
      title-tag="p"
      class="fr-mb-6v"
    />
  </template>
  <template v-else-if="mutationStatus === 'pending'">
    <AtomAlert
      :alert-type="AlertType.Warning"
      size="sm"
      message="Ne pas fermer cette fenêtre"
      title-tag="p"
      class="fr-mb-6v"
    >
      <template #detailedMessage>
        La mise à jour {{ pluralAgentLabel }} est en cours. Cela peut prendre
        quelques minutes.
      </template></AtomAlert
    >
  </template>
  <template v-else-if="mutationStatus === 'error'">
    <AtomAlert
      :alert-type="AlertType.Error"
      size="sm"
      :message="`La mise à jour ${pluralAgentLabel} a échoué.`"
      title-tag="p"
      class="fr-mb-6v"
    >
      <template #detailedMessage>
        <p>Réessayez l'action ou contactez le support.</p>
      </template>
    </AtomAlert>
  </template>
  <template v-else-if="mutationStatus === 'success'">
    <AtomAlert
      :alert-type="AlertType.Success"
      size="sm"
      :message="`La mise à jour ${pluralAgentLabel} a réussi.`"
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
  import { BeneficiaryAction, EventCategory } from '~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'

  const { selectedBeneficiaries, referentId, editionChoice, summarySelected } =
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

  const count = computed(() => selectedBeneficiaries.value.length)
  const pluralAgentLabel = computed(() =>
    count.value > 1 ? 'des agents référents' : "de l'agent référent"
  )
  const pluralBeneficiaryLabel = computed(() =>
    count.value > 1 ? 'dossiers bénéficiaires' : 'dossier bénéficiaire'
  )

  const confirmationMessage = computed(() => {
    const name = agentName.value ?? '(nom introuvable)'
    if (editionChoice.value === 'add') {
      return `Êtes-vous sûr de vouloir ajouter ${name} sur ${count.value} ${pluralBeneficiaryLabel.value} ?`
    }
    return `Êtes-vous sûr de vouloir retirer ${name} de ${count.value} ${pluralBeneficiaryLabel.value} ?`
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
      useSnackbar().error(
        "Référent ou bénéficiaires manquants. Le transfert n'a pas pu être effectué."
      )
      return
    }
    const values = {
      familyFileIds: selectedBeneficiaries.value.map(b => b.familyFileId),
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
    useMatomo().trackEvent(
      EventCategory.Beneficiary,
      editionChoice.value === 'add'
        ? BeneficiaryAction.MassReferentTransferAddition
        : BeneficiaryAction.MassReferentTransferRemoval
    )
    selectedBeneficiaries.value = []
    referentId.value = null
  }
</script>
