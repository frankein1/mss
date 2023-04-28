<template>
  <div
    v-if="beneficiary"
    class="fr-container fr-p-5w"
  >
    <TheHeader
      :title="title"
      :back-link="backLink"
    >
      <BeneficiaryDetailsHeader
        :beneficiary-id="beneficiaryId"
        :can-delete="canDelete"
        @on-delete="onDelete"
      />
      <BeneficiaryDetailsTitle :beneficiary="beneficiary" />
    </TheHeader>
  </div>
</template>

<script lang="ts" setup>
  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const { data: beneficiary } =
    await useTrpcClient().beneficiary.getBeneficiaryWithReferents.useQuery({
      id: beneficiaryId
    })

  const title = computed(() => {
    return beneficiary.value ? beneficiaryName(beneficiary.value) : ''
  })

  const canDelete = true

  const onDelete = () => {}

  const backLink = ''
</script>
