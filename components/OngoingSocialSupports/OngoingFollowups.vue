<template>
  <OngoingSocialSupports
    :is-file-instructions="false"
    title="Entretiens"
    :ongoing-social-supports="data"
    empty-message="Vous n'avez pas d'entretien à traiter ou en cours."
    :pending="pending"
    :error-message="errorMessage"
  />
</template>

<script setup lang="ts">
  const { data, pending, error } =
    await useTrpcClient().followup.getOngoing.useQuery()

  const errorMessage = computed(() =>
    error.value
      ? "Les entretiens à traiter ou en cours n'ont pas pu être chargés."
      : ''
  )
</script>
