<template>
  <div class="admin-transfer-user-form">
    <AtomStepper
      :steps="stepLabels"
      :current-step="currentStep"
    />

    <AdminTransferStepSelection
      v-if="currentStep === 1"
      :user
      @cancelled="onCancelled"
      @next="currentStep = 2"
    />
    <AdminTransferStepCode
      v-else-if="currentStep === 2"
      :user
      @previous="currentStep = 1"
      @transferred="afterTransfer"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    user: {
      id: string
      displayName: string
      email: string
      currentStructureId: string
      currentStructureName: string
    }
    onTransferred: () => void
  }>()

  useProvideTransferUserState()
  const modal = useModal()
  const snackbar = useSnackbar()
  const currentStep = ref(1)

  const stepLabels = [
    'Choisir la structure de destination et le nouveau rôle',
    "Valider le code d'autorisation"
  ]

  function afterTransfer() {
    modal.close()
    snackbar.success(
      "L'utilisateur a été transféré vers la nouvelle structure."
    )
    props.onTransferred()
  }

  function onCancelled() {
    modal.close()
  }
</script>
