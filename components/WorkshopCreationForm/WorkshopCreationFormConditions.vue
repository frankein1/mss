<template>
  <section
    class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-2w fr-mt-2w"
  >
    <div class="fr-col-12">
      <h2 class="fr-text--sm fr-text--bold uppercase">
        Conditions de participation
      </h2>
    </div>
    <div class="workshop-form-toggle fr-col-12 fr-col-sm-8">
      <VeeToggle
        :label="workshopLabels.rateLimit"
        name="rateLimit"
        :checked-label="false"
        hint="Les personnes supplémentaires seront inscrites sur liste d’attente."
      />
    </div>
    <div class="fr-col-12 fr-col-sm-4">
      <VeeInput
        type="number"
        :min="1"
        :label="workshopLabels.attendeeNumber"
        :no-label="true"
        name="attendeeNumber"
        :disabled="pending || formValues.rateLimit == false"
      />
    </div>
    <div class="fr-col-12 fr-col-sm-8">
      <VeeSelect
        :label="workshopLabels.ageCondition"
        name="ageCondition"
        :options="withEmptyValue(ageConditionOptions)"
        :disabled="pending"
      />
    </div>
    <div class="fr-col-12 fr-col-sm-4">
      <VeeInput
        type="number"
        :label="workshopLabels.age"
        name="age"
        :disabled="
          pending ||
          formValues.ageCondition == null ||
          formValues.ageCondition === ''
        "
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { workshopLabels } from '~/client/labels'

  defineProps<{
    isSubmitting: boolean
    pending: boolean
    ageConditionOptions: Options
  }>()

  const { values: formValues } = useForm({
    initialValues: {
      ageCondition: undefined,
      rateLimit: false
    }
  })
</script>
