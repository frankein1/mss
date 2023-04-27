<template>
  <div class="fr-container fr-p-5w">
    <TheHeader
      :title="title"
      :back-link="backLink"
    >
      <BeneficiaryDetailsHeader
        :beneficiary-id="beneficiaryId"
        :can-delete="canDelete"
      />
      <BeneficiaryDetailsTitle :beneficiary="beneficiary" />
    </TheHeader>
  </div>
</template>

<script lang="ts" setup>
  import BeneficiaryDetailsHeader from '~/components/BeneficiaryDetails/BeneficiaryDetailsHeader.vue'
  import BeneficiaryDetailsTitle from '~/components/BeneficiaryDetails/BeneficiaryDetailsTitle.vue'
  import TheHeader from '~/components/the/TheHeader.vue'

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
</script>
