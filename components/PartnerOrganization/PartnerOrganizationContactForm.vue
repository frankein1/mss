<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
      <div class="contact-title">
        <div class="fr-text--lg fr-text--bold fr-mb-0">
          Personne {{ index + 1 }}
        </div>
        <div>
          <button
            class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-delete-line"
            type="button"
            @click="emit('remove', index)"
          >
            Supprimer
          </button>
        </div>
      </div>
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
  .contact-title {
    display: flex;
    justify-content: space-between;
    padding: 0 0 0 0;
  }
</style>
