<template>
  <!--TODO: condition sur cette information -->
  <!--uniquement pour les dossiers qui avaient de la donnée renseignée dans l'ancienne section "foyer fiscal" -->
  <AtomNotice
    class="fr-mx-n3v fr-mb-4w"
    :close-button="true"
  >
    <template #default
      >Si des membres du foyer étaient précédemment renseignés dans la section
      "foyer fiscal", ils se trouvent désormais dans la section
      "Entourage".</template
    >
  </AtomNotice>

  <BeneficiaryFormSection>
    <div class="fr-col-12">
      <VeeSelect
        name="familySituation"
        :label="beneficiaryFieldLabels.familySituation"
        :options="withEmptyValue(beneficiaryFamilySituationKeys.options)"
      />
    </div>
    <div
      v-if="showDivorceDate"
      class="fr-col-12"
    >
      <VeeInput
        name="divorceDate"
        :label="beneficiaryFieldLabels.divorceDate"
        type="date"
      />
    </div>
    <div
      v-if="showWeddingDate"
      class="fr-col-12"
    >
      <VeeInput
        name="weddingDate"
        :label="beneficiaryFieldLabels.weddingDate"
        type="date"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        name="minorChildren"
        :label="beneficiaryFieldLabels.minorChildren"
        type="number"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        name="majorChildren"
        :label="beneficiaryFieldLabels.majorChildren"
        type="number"
      />
    </div>
    <div class="fr-col-12">
      <VeeCheckbox
        label="Ce bénéficiaire est aidant familial"
        name="caregiver"
      />
    </div>
  </BeneficiaryFormSection>
  <BeneficiaryFormCallOut class="fr-mx-n3v fr-mb-4w" />
</template>

<script setup lang="ts">
  import { BeneficiaryFamilySituation } from '@prisma/client'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import { beneficiaryFamilySituationKeys } from '~/client/options'

  const { value } = useField<BeneficiaryFamilySituation>('familySituation')

  const showDivorceDate = computed(() => isSeparate(value.value))
  const showWeddingDate = computed(() => isMarried(value.value))
</script>
