<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
      <VeeInput
        :name="`contacts[${index}].name`"
        :label="partnerOrganizationContactFieldLabels.name"
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
</script>
