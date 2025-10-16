<template>
  <section
    class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-2w fr-mt-2w"
  >
    <div class="fr-col-12">
      <h2 class="fr-text--sm fr-text--bold text--uppercase fr-mb-1w">
        Conditions de participation
      </h2>
    </div>
    <div class="workshop-form-toggle fr-col-12 fr-mt-2v">
      <VeeToggle
        :label="workshopLabels.chargeable"
        name="chargeable"
        :checked-label="false"
        hint="Vous pourrez indiquer pour chaque personne son règlement."
      />
      <AtomAlert
        v-if="chargeable.meta.initialValue && chargeable.value.value === false"
        class="fr-mt-4v"
        :alert-type="AlertType.Warning"
        message="Les montants précédemment renseignés seront définitivement supprimés."
      />
    </div>

    <div class="workshop-form-toggle fr-col-12 fr-mt-2v">
      <!-- Do not use DsfrToggleSwitch here. Bug: duplicate id on label and hint paragraph -->
      <div class="fr-toggle">
        <input
          id="attendee-limit-toggle"
          v-model="hasAttendeeLimit"
          type="checkbox"
          class="fr-toggle__input"
          aria-describedby="attendee-limit-toggle-hint attendee-limit-toggle-messages"
        />
        <label
          class="fr-toggle__label"
          for="attendee-limit-toggle"
          >Limiter le nombre de personnes participantes</label
        >
        <p
          id="attendee-limit-toggle-hint"
          class="fr-hint-text"
        >
          Les personnes supplémentaires seront inscrites sur liste d’attente.
        </p>
        <div
          id="attendee-limit-toggle-messages"
          class="fr-messages-group"
          aria-live="polite"
        ></div>
      </div>
    </div>
    <div class="fr-col-12 fr-col-sm-6">
      <VeeInput
        type="number"
        hint="Saisisez un nombre entier"
        :label="workshopLabels.attendeeLimit"
        name="attendeeLimit"
        :disabled="!hasAttendeeLimit"
      />
    </div>
    <div class="fr-col-12 fr-col-sm-8 flex-end">
      <VeeSelect
        :label="workshopLabels.ageLimitCondition"
        name="ageLimitCondition"
        :options="withEmptyValue(ageConditionOptions)"
      />
    </div>
    <div class="fr-col-12 fr-col-sm-4 flex-end">
      <VeeInput
        type="number"
        hint="Saisissez un nombre entier"
        :label="workshopLabels.ageLimit"
        name="ageLimit"
        :disabled="!ageLimitCondition"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { workshopLabels } from '~/client/labels'
  import { AlertType } from '~/utils/constants/alert'

  defineProps<{
    ageConditionOptions: Options
  }>()

  const { value: ageLimitCondition } = useField('ageLimitCondition')
  const { value: attendeeLimit } = useField('attendeeLimit')
  const { value: ageLimit } = useField('ageLimit')
  const chargeable = useField<boolean>('chargeable')

  const hasAttendeeLimit = ref(Boolean(attendeeLimit.value))

  watch(hasAttendeeLimit, () => {
    if (!hasAttendeeLimit.value) {
      attendeeLimit.value = null
    }
  })
  watch(ageLimitCondition, () => {
    if (ageLimitCondition.value === '') {
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

  .flex-end {
    align-self: flex-end;
  }
</style>
