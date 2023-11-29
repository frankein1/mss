<template>
  <fieldset
    class="fr-fieldset"
    aria-labelledby="organisation-follow-up-types-legend"
  >
    <legend
      id="organisation-follow-up-types-legend"
      class="fr-fieldset__legend fr-h4"
    >
      Types d'accompagnement proposés par
      {{ adminView ? 'la' : 'ma' }} structure
    </legend>
    <div class="fr-fieldset__element">
      <VeeMultiSelect
        name="legallyRequiredFollowupTypes"
        :label="structureFieldLabels.legallyRequiredFollowupTypes"
        :options="requiredTypeOptions"
        label-class="fr-h6"
        :disabled-options="disableRequiredTypeOptions"
        hint="Vous ne pouvez pas désélectionner un type d'accompagnement qui a déjà été associé à une synthèse d'entretien ou une instruction de demande d'aide."
      />
    </div>
    <div class="fr-fieldset__element">
      <VeeMultiSelect
        class="fr-mb-1w"
        name="legallyNotRequiredFollowupTypes"
        :label="structureFieldLabels.legallyNotRequiredFollowupTypes"
        :options="optionalTypeOptions"
        label-class="fr-h6"
        :disabled-options="disableOptionalTypeOptions"
        hint="Vous ne pouvez pas désélectionner un type d'accompagnement qui a déjà été associé à une synthèse d'entretien ou une instruction de demande d'aide."
      />
    </div>

    <button
      v-show="!isAdding"
      class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-add-circle-line"
      type="button"
      @click="isAdding = true"
    >
      Ajouter une aide facultative
    </button>

    <div
      v-show="isAdding"
      class="fr-fieldset__element"
    >
      <StructureFormAddFollowupTypeForm
        @create-followup-type="onCreateFollowupType"
      />
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
  import { TypeWithState } from './types'
  import { toOptions } from '~/utils/options'
  import { structureFieldLabels } from '~/client/labels'
  import { sortFollowupTypesByName } from '~/utils/followupType/sortFollowupTypesByName'

  const props = withDefaults(
    defineProps<{
      requiredTypes: TypeWithState[]
      optionalTypes: TypeWithState[]
      adminView?: boolean
    }>(),
    {
      adminView: false
    }
  )

  const isAdding = ref(false)
  const createdFollowupTypes = ref<string[]>([])

  const optionalTypeOptions = computed(() => {
    const optionalTypes = props.optionalTypes.map(({ type: { id, name } }) => ({
      id,
      name
    }))
    const types = [
      ...optionalTypes,
      ...createdFollowupTypes.value.map(name => ({ id: name, name }))
    ]
    return toOptions(types.sort(sortFollowupTypesByName), 'id', 'name')
  })

  const disableOptionalTypeOptions = computed(() => {
    return props.optionalTypes
      .filter(({ used }) => used)
      .map(({ type }) => type.id)
  })

  const disableRequiredTypeOptions = computed(() => {
    return props.requiredTypes
      .filter(({ used }) => used)
      .map(({ type }) => type.id)
  })

  const requiredTypeOptions = computed(() => {
    const requiredTypes = props.requiredTypes.map(({ type: { id, name } }) => ({
      id,
      name
    }))
    return toOptions(requiredTypes.sort(sortFollowupTypesByName), 'id', 'name')
  })

  function onCreateFollowupType(name: string) {
    createdFollowupTypes.value.push(name)
    isAdding.value = false
  }
</script>
