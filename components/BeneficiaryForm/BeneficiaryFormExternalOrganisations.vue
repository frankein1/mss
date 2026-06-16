<template>
  <section class="fr-p-3v">
    <h2 class="title-blue fr-mb-6v">
      {{ routes.beneficiary.AppBeneficiaryEditExternalOrganisations.title }}
    </h2>

    <BeneficiaryFormSection>
      <div class="fr-col-12">
        <VeeSelect
          name="protectionMeasure"
          :label="beneficiaryFieldLabels.protectionMeasure"
          :options="withEmptyValue(beneficiaryProtectionMeasureKeys.options)"
        />
      </div>
      <div class="fr-col-12">
        <VeeInput
          name="representative"
          :label="beneficiaryFieldLabels.representative"
        />
      </div>
      <div class="fr-col-12">
        <VeeAutocomplete
          name="prescribingStructure"
          :label="beneficiaryFieldLabels.prescribingStructure"
          :search-fn="searchPrescribingStructure"
        />
      </div>
      <div class="fr-col-12">
        <VeeSelect
          name="orientationType"
          :label="beneficiaryFieldLabels.orientationType"
          :options="withEmptyValue(beneficiaryOrientationTypeKeys.options)"
        />
      </div>
      <div class="fr-col-12">
        <VeeInput
          name="orientationStructure"
          :label="beneficiaryFieldLabels.orientationStructure"
        />
      </div>
    </BeneficiaryFormSection>

    <BeneficiaryFormSupportPrograms />
  </section>
</template>

<script setup lang="ts">
  import {
    beneficiaryOrientationTypeKeys,
    beneficiaryProtectionMeasureKeys
  } from '~/client/options'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'
  import { routes } from '~/utils/routes'
  import { SEARCH_NUMBER_CHARACTERS } from '~/utils/constants'
  import type { OptionsWithDisabled } from '~/utils/options'

  const trpcClient = useTrpcClient()

  async function searchPrescribingStructure(
    search: string
  ): Promise<OptionsWithDisabled> {
    if (search.length < SEARCH_NUMBER_CHARACTERS) {
      return []
    }

    const { results } = await trpcClient.dataInclusion.searchStructures.query({
      query: search.toLocaleLowerCase()
    })

    return results.map(({ name, city }) => ({
      value: name,
      label: `${name}${city ? ' - ' + city : ''}`
    }))
  }
</script>
