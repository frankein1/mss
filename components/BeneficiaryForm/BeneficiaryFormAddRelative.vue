<template>
  <BeneficiaryFormSection>
    <div class="fr-col-12">
      <button
        class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-add-circle-line"
        type="button"
        @click="push({ id: v4(), caregiver: false })"
      >
        {{ addButtonLabel }}
      </button>
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import { v4 } from 'uuid'

  const props = defineProps<{
    name: string
    addButtonLabel: string
  }>()

  const { push } = useFieldArray(props.name)
</script>
