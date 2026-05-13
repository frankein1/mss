<template>
  <BeneficiaryFormSection>
    <div class="fr-col-12">
      <button
        class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-add-circle-line"
        type="button"
        @click="addRelative()"
      >
        {{ addButtonLabel }}
      </button>
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  const props = defineProps<{
    name: string
    addButtonLabel: string
  }>()

  const { push } = useFieldArray(props.name)

  function addRelative() {
    push({ id: crypto.randomUUID(), caregiver: false })
  }
</script>
