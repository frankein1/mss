<template>
  <AccordionFieldset :label="sectionTitle">
    <template v-if="household">
      <fieldset class="fr-fieldset fr-container--fluid relatives-fieldset">
        <legend class="fr-fieldset__legend--regular fr-fieldset__legend">
          <h3 class="fr-h5">Situation du foyer fiscal</h3>
        </legend>
        <div class="fr-grid-row fr-grid-row--gutters form-grid">
          <div class="fr-fieldset__element">
            <AtomSelect
              name="family_situation"
              label="Situation familiale"
              :options="withEmptyValue(beneficiaryFamilySituationOptions)"
              :model-value="beneficiary?.familySituation || ''"
              @change-value="$emit('changeFamilySituation', $event)"
            />
          </div>
          <div class="fr-fieldset__element">
            <AtomInput
              name="minor_children"
              label="Nombre d'enfant(s) mineur(s)"
              type="number"
              :value="beneficiary?.minorChildren || ''"
              :min="0"
            />
          </div>
          <div class="fr-fieldset__element">
            <AtomInput
              name="major_children"
              label="Nombre d'enfant(s) majeur(s)"
              type="number"
              :value="beneficiary?.majorChildren || ''"
              :min="0"
              @change-value="$emit('changeMajorChildrenNb', parseInt($event))"
            />
          </div>
        </div>
      </fieldset>
      <hr class="fr-mt-5w fr-mb-2w" />
    </template>

    <template
      v-for="(relative, index) in relatives"
      :key="relative.id"
    >
      <BeneficiaryFormRelative
        :relative="relative"
        :index="index"
        :household="household"
        :current-beneficiary-id="beneficiary?.id || ''"
        @remove-relative="$emit('removeRelative', relative.id)"
      />
      <hr class="fr-mt-5w fr-mb-2w" />
    </template>

    <button
      class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-circle-line"
      type="button"
      @click="$emit('addRelative')"
    >
      {{ addButtonLabel }}
    </button>
  </AccordionFieldset>
</template>

<script setup lang="ts">
  import { Beneficiary } from '@prisma/client'
  import { beneficiaryFamilySituationOptions } from '~/client/options/beneficiary'
  import { BeneficiaryRelativeWithBeneficiary } from '~/utils/beneficiary'

  const props = defineProps<{
    beneficiary: Beneficiary
    relatives: BeneficiaryRelativeWithBeneficiary[]
    household: boolean
  }>()

  defineEmits([
    'removeRelative',
    'addRelative',
    'changeFamilySituation',
    'changeMajorChildrenNb'
  ])

  const sectionTitle = computed(() =>
    props.household ? 'Foyer fiscal' : 'Entourage'
  )

  const addButtonLabel = computed(() =>
    props.household ? 'Ajouter un membre du foyer' : 'Ajouter un proche'
  )
</script>

<style scoped>
  .relatives-fieldset {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
