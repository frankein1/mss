<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-8">
      <h3 class="fr-h4 fr-mb-0">Contact {{ index + 1 }}</h3>
    </div>
    <div class="fr-col-4">
      <button
        class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-icon-delete-line contact-title__delete"
        type="button"
        @click="emit('remove', index)"
      >
        Supprimer ce contact
      </button>
    </div>
    <div class="fr-col-12">
      <VeeInput
        :name="`contacts[${index}].name`"
        :label="partnerOrganizationContactFieldLabels.name"
        required
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        :name="`contacts[${index}].phone`"
        :label="partnerOrganizationContactFieldLabels.phone"
        type="tel"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        :name="`contacts[${index}].email`"
        :label="partnerOrganizationContactFieldLabels.email"
        hint="Format attendu : nom@domaine.fr"
      />
    </div>
  </div>

  <hr class="fr-mt-3w" />
</template>

<script lang="ts" setup>
  import { partnerOrganizationContactFieldLabels } from '~/client/labels/partnerOrganization.labels'

  defineProps<{
    index: number
  }>()

  const emit = defineEmits<{
    remove: [index: number]
  }>()
</script>

<style lang="scss" scoped>
  .contact-title__delete {
    color: red;
  }
</style>
