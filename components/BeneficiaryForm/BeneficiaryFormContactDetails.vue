<template>
  <BeneficiaryFormSection section-title="Coordonnées">
    <div
      v-if="!noPhone"
      class="fr-col-12 fr-col-lg-6"
    >
      <VeeInput
        name="phone1"
        :label="beneficiaryFieldLabels.phone1"
        type="tel"
      />
    </div>
    <div
      class="fr-col-12"
      :class="{ 'fr-col-lg-6': !noPhone }"
    >
      <VeeCheckbox
        name="noPhone"
        :label="beneficiaryFieldLabels.noPhone"
      />
    </div>
    <div
      v-if="!noPhone"
      class="fr-col-12"
      :class="{ 'fr-col-lg-6 fr-col-offset-lg-6--right': showPhone2 }"
    >
      <button
        v-if="!showPhone2"
        class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-add-line"
        type="button"
        @click="showPhone2 = true"
      >
        Ajouter un numéro de téléphone
      </button>
      <VeeInput
        v-else
        v-autofocus="'input'"
        name="phone2"
        :label="beneficiaryFieldLabels.phone2"
        type="tel"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="email"
        :label="beneficiaryFieldLabels.email"
        type="email"
      />
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import { beneficiaryFieldLabels } from '~/client/labels'

  const { value: noPhone } = useField<boolean>('noPhone')
  const { value: phone2 } = useField<boolean>('phone2')

  const showPhone2 = ref<boolean>(!!phone2.value)
</script>
