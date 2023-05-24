<template>
  <PageContainer v-if="beneficiary">
    <div class="beneficiarytitle__container">
      <PageTitle :title="title" />
      <BeneficiaryDetailsHeader
        :beneficiary-id="beneficiaryId"
        :can-delete="canDelete"
        @on-delete="onDelete"
      />
    </div>

    <BeneficiaryDetailsTitle :beneficiary="beneficiary" />

    <Tabs
      class="main-container fr-tabs fr-transition-none fr-tabs__shadow fr-tabs__shadow--right"
      nav-class="fr-tabs__list"
      nav-item-link-class="fr-tabs__tab"
      panels-wrapper-class="fr-tabs__panel"
    >
      <Tab name="Infos">
        <BeneficiaryDetails
          :beneficiary="beneficiary"
          :entourages="entourages"
          :tax-households="taxHouseholds"
        />
      </Tab>
      <Tab name="Documents">Documents</Tab>
      <Tab name="Historiques">Historiques</Tab>
    </Tabs>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { Tabs, Tab } from 'vue3-tabs-component'
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
  const entourages = computed(() => data.value?.entourages || [])

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
</script>

<style lang="scss">
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  @include dsfr-media-query.respond-from('lg') {
    .beneficiary-details-col:nth-of-type(2) {
      border-left: 1px solid rgb(151 151 151 / 30%);
    }
  }

  .beneficiarytitle__container {
    display: flex;
    justify-items: center;
  }

  .beneficiary-details-section {
    --title-spacing: 0 0 0.75rem;

    &:not(:last-child) {
      margin-bottom: 2rem;
    }
  }
</style>
