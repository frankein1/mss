<template>
  <template v-if="beneficiary">
    <div class="fr-grid-row fr-mt-1w">
      <div class="fr-col-12 fr-col-xl-4 fr-my-2w">
        <h3 class="title fr-h4 fr-mb-0">
          {{ beneficiaryTitle }}
        </h3>
      </div>
      <div class="fr-col-12 fr-col-xl-8 detail-actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <div class="feature-section fr-mt-1w">
      <h4 class="fr-sr-only">Résumé</h4>
      <BeneficiaryInfoHeader :beneficiary="beneficiary" />
      <hr />
      <BeneficiaryInfoSocialSupportSubjects
        :social-support-subjects="beneficiary.history.subjects"
      />
    </div>

    <BeneficiaryInfoGeneral
      :beneficiary-id="beneficiaryId"
      :general="beneficiary.general"
    />

    <!-- Situation familiale -->
    <BeneficiaryInfoTaxHouseholds
      v-if="hasTaxHouseholds && beneficiary.taxHouseholds"
      :beneficiary-id="beneficiary.id"
      :tax-households="beneficiary.taxHouseholds"
    />

    <BeneficiaryInfoEntourages
      v-if="beneficiary.entourages"
      :beneficiary-id="beneficiary.id"
      :entourages="beneficiary.entourages"
    />

    <BeneficiaryInfoHealth
      v-if="beneficiary.health"
      :beneficiary-id="beneficiary.id"
      :health="beneficiary.health"
    />

    <BeneficiaryInfoOccupationIncome
      v-if="beneficiary.occupationIncome"
      :beneficiary-id="beneficiary.id"
      :occupation-income="beneficiary.occupationIncome"
    />

    <BeneficiaryInfoExternalOrganisations
      v-if="beneficiary?.externalOrganisations"
      :beneficiary-id="beneficiary.id"
      :external-organisations="beneficiary.externalOrganisations"
    />
  </template>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    beneficiaryId: string
  }>()

  const { beneficiary } = await useBeneficiaryDetails(
    toRef(props, 'beneficiaryId')
  )

  const beneficiaryTitle = computed(() => {
    let title = 'Informations'
    if (beneficiary.value?.general?.firstName) {
      title = title + ' ' + beneficiary.value.general.firstName
    }
    if (beneficiary.value?.general?.usualName) {
      title = title + ' ' + beneficiary.value.general.usualName
    }
    return title
  })

  const hasTaxHouseholds = computed(() => {
    const taxHouseholds = beneficiary.value?.taxHouseholds
    return !(
      !taxHouseholds?.caregiver &&
      !taxHouseholds?.divorceDate &&
      !taxHouseholds?.familySituation &&
      !taxHouseholds?.majorChildren &&
      !taxHouseholds?.minorChildren &&
      !taxHouseholds?.weddingDate
    )
  })
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .title {
    color: var(--primary);
    align-self: center;
  }

  .fr-grid-row {
    align-items: center;
  }

  .detail-actions {
    margin-top: 1rem;

    @include dsfr-media-query.respond-from('xl') {
      margin-top: 0;
    }

    > :deep(ul) {
      @include dsfr-media-query.respond-from('xl') {
        justify-content: right;
      }
    }
  }
</style>
