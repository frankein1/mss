<template>
  <OngoingSocialSupports
    is-file-instructions
    title="Instructions"
    :ongoing-social-supports="data"
    empty-message="Vous n'avez pas de dossier en attente de justificatifs ou en cours d'instruction."
    :pending="pending"
    :error-message="errorMessage"
  />
</template>

<script setup lang="ts">
  const { data, pending, error } =
    await useTrpcClient().fileInstruction.getOngoing.useQuery()

  const errorMessage = computed(() =>
    error.value
      ? "Les instructions de dossier en attente de justificatifs ou en cours d'instruction n'ont pas pu être chargés."
      : ''
  )
</script>
