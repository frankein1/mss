<template>
  <section
    class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-2w fr-mt-2w"
  >
    <div class="fr-col-12">
      <h2 class="fr-text--sm fr-text--bold uppercase">
        Informations pratiques
      </h2>
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        type="date"
        :label="workshopLabels.date"
        name="date"
        :disabled="pending"
        required
      />
    </div>
    <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
      <VeeSelect
        :label="workshopLabels.startTime"
        name="startTime"
        :disabled="pending"
        :options="withEmptyValue(hourOptions)"
      />
    </div>
    <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
      <VeeSelect
        :label="workshopLabels.endTime"
        name="endTime"
        :disabled="pending"
        :options="withEmptyValue(hourOptions)"
      />
    </div>

    <div class="fr-col-12">
      <VeeInput
        type="text"
        :label="workshopLabels.location"
        name="location"
        :disabled="pending"
      />
    </div>
    <div class="fr-col-12">
      <VeeCombobox
        class="fr-mb-1w"
        :label="workshopLabels.partner"
        name="partner"
        :options="partnerOptions"
        :disabled="pending"
      />
      <NuxtLink
        :to="routes.structure.AppPartners.path()"
        class="fr-link fr-icon-info-fill fr-link--icon-left"
      >
        Données issues de l'annuaire de partenaires
      </NuxtLink>
    </div>
    <div class="fr-col-12">
      <VeeInput
        type="text"
        :label="workshopLabels.contractor"
        name="contractor"
        :disabled="pending"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { workshopLabels } from '~/client/labels'
  import { routes } from '~/utils/routes'

  defineProps<{
    isSubmitting: boolean
    pending: boolean
    partnerOptions: Options
    hourOptions: Options
  }>()
</script>
