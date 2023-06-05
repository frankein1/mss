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

    <hr />
    <BeneficiaryDetailsActions
      :beneficiary-id="beneficiaryId"
      class="fr-pb-3w"
    />
    <hr />

    <AtomTabs>
      <Tab
        :id="BeneficiaryTab.Details"
        name="Infos"
      >
        <BeneficiaryDetails
          :beneficiary="beneficiary"
          :entourages="entourages"
          :tax-households="taxHouseholds"
        />
      </Tab>
      <Tab
        :id="BeneficiaryTab.Documents"
        name="Documents"
      >
        <BeneficiaryDocumentList
          :beneficiary-id="beneficiaryId"
        ></BeneficiaryDocumentList>
      </Tab>
      <Tab
        :id="BeneficiaryTab.History"
        name="Historique"
        >Historique</Tab
      >
    </AtomTabs>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { Tab } from 'vue3-tabs-component'
  import { canDeleteBeneficiary } from '~/server/query/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary-tabs'

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
