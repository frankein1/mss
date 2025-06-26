<template>
  <section
    class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-2w fr-mt-2w"
  >
    <div class="fr-col-12">
      <h2 class="fr-text--sm fr-text--bold text--uppercase">
        Conditions de participation
      </h2>
    </div>
    <div class="workshop-form-toggle fr-col-12 fr-col-sm-8">
      <DsfrToggleSwitch
        v-model="hasAttendeeLimit"
        label="Limiter le nombre de personnes participantes"
        hint="Les personnes supplémentaires seront inscrites sur liste d’attente."
        no-text
      />
    </div>
    <div class="fr-col-12 fr-col-sm-4">
      <VeeInput
        type="number"
        :label="workshopLabels.attendeeLimit"
        :no-label="true"
        name="attendeeLimit"
        :disabled="isSubmitting || hasAttendeeLimit === false"
      />
    </div>
    <div class="fr-col-12 fr-col-sm-8">
      <VeeSelect
        :label="workshopLabels.ageLimitCondition"
        name="ageLimitCondition"
        :options="withEmptyValue(ageConditionOptions)"
        :disabled="isSubmitting"
      />
    </div>
    <div class="fr-col-12 fr-col-sm-4">
      <VeeInput
        type="number"
        :label="workshopLabels.ageLimit"
        name="ageLimit"
        :disabled="isSubmitting || !ageLimitCondition"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { workshopLabels } from '~/client/labels'

  const hasAttendeeLimit = ref(false)

  defineProps<{
    isSubmitting: boolean
    ageConditionOptions: Options
  }>()

  const { value: ageLimitCondition } = useField('ageLimitCondition')
  const { value: attendeeLimit } = useField('attendeeLimit')
  const { value: ageLimit } = useField('ageLimit')

  watch(hasAttendeeLimit, () => {
    if (!hasAttendeeLimit.value) {
      attendeeLimit.value = null
    }
  })
  watch(ageLimitCondition, () => {
    if (ageLimitCondition.value == '') {
      ageLimit.value = null
    }
  })
</script>

<style scoped lang="scss">
  .workshop-form-toggle {
    :deep(.fr-toggle) {
      .fr-hint-text {
        margin-top: 4px;
      }

      label::before {
        margin-right: 1rem;
      }
    }
  }
</style>
