<template>
  <div class="fr-container fr-py-5w page-container">
    <BeneficiaryCreationForm
      v-if="agents?.length"
      :agents="agents"
      :is-submitting="isSubmitting"
      @save-beneficiary="onCreateBeneficiary"
    />
  </div>
</template>

<script setup lang="ts">
  import { CreateBeneficiaryInput } from '~/server/schema'
  import { Routes } from '~/utils/routing/routes'

  const trpcClient = useTrpcClient()

  const { data: agents } = await trpcClient.config.getAgents.useQuery()

  const isSubmitting = ref(false)

  async function onCreateBeneficiary(beneficiary: CreateBeneficiaryInput) {
    isSubmitting.value = true
    // TODO: handle error
    const { id } = await trpcClient.beneficiary.create.mutate(beneficiary)
    isSubmitting.value = false

    navigateTo(`${Routes.Beneficiary(id)}`)
  }
</script>

<style>
  .page-container {
    padding-left: 10em;
    padding-right: 10em;
  }
</style>
