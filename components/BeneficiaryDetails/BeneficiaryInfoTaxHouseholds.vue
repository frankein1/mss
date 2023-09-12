<template>
  <BeneficiaryInfoSection
    v-if="hasTaxHouseholdsInfo"
    title="Foyer fiscal"
    :beneficiary-id="beneficiary.id"
  >
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12 fr-pb-1w">
          <div class="text-bold">Situation familiale</div>
        </div>
        <div class="fr-col-12 fr-pb-1w">
          <div class="field-label">
            {{
              BeneficiaryFamilySituationKeys.value(beneficiary.familySituation)
            }}
          </div>
        </div>
        <div class="fr-col-6">
          <BeneficiaryInfoLabel
            label="Nombre d'enfant(s) mineur(s)"
            :value="beneficiary.minorChildren || '0'"
          />
        </div>
        <div class="fr-col-6">
          <BeneficiaryInfoLabel
            label="Nombre d'enfant(s) majeur(s)"
            :value="beneficiary.majorChildren || '0'"
          />
        </div>
        <div
          v-for="taxHousehold in taxHouseholds"
          :key="taxHousehold.id"
          class="fr-col-12"
        >
          <hr class="fr-col-12 fr-mt-5v" />
          <BeneficiaryInfoRelative :relative="taxHousehold" />
        </div>
      </div>
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import { BeneficiaryFamilySituationKeys } from '~/client/options/beneficiary'
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'
  import type { GetBeneficiaryOutput } from '~/server/routers'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
    taxHouseholds: BeneficiaryRelativeWithLinkedBeneficiary[]
  }>()

  const hasTaxHouseholdsInfo = computed(
    () =>
      props.taxHouseholds?.length > 0 ||
      props.beneficiary.familySituation ||
      props.beneficiary.minorChildren ||
      props.beneficiary.majorChildren
  )
</script>
