<template>
  <div
    v-if="beneficiary"
    class="fr-container fr-p-5w"
  >
    <TheHeader
      :title="title"
      :back-link="backLink"
    >
      <template #title-extension>
        <BeneficiaryDetailsHeader
          :beneficiary-id="beneficiaryId"
          :can-delete="canDelete"
          @on-delete="onDelete"
        />
      </template>
      <template #subtitle>
        <BeneficiaryDetailsTitle :beneficiary="beneficiary" />
      </template>
    </TheHeader>

    <BeneficiaryDetails
      :beneficiary="beneficiary"
      :entourages="entourages"
      :tax-households="taxHouseholds"
    />
  </div>
</template>

<script lang="ts" setup>
  import { canDeleteBeneficiary } from '~/server/query/security/rules'
  import { useAuthStore } from '~/store/auth'

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const { data } =
    await useTrpcClient().beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const beneficiary = computed(() => data.value?.beneficiary)
  const taxHouseholds = computed(() => data.value?.taxHouseholds || [])
  const entourages = computed(() => data.value?.taxHouseholds || [])

  const title = computed(() => {
    return beneficiary.value ? getBeneficiaryDisplayName(beneficiary.value) : ''
  })

  const authUser = useAuthStore().getAuthUser
  const canDelete = computed(() => {
    return beneficiary.value
      ? canDeleteBeneficiary(authUser, beneficiary.value)
      : false
  })

  const onDelete = () => {}

  const backLink = ''
</script>

<style lang="scss">
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  @include dsfr-media-query.respond-from('lg') {
    .beneficiary-details-col:nth-of-type(2) {
      border-left: 1px solid rgb(151 151 151 / 30%);
    }
  }

  .beneficiary-details-section {
    --title-spacing: 0 0 0.75rem;

    &:not(:last-child) {
      margin-bottom: 2rem;
    }
  }
</style>
