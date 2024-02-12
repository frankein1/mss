<template>
  <fieldset
    class="fr-fieldset"
    aria-labelledby="organisation-follow-up-types-legend"
  >
    <legend
      id="organisation-follow-up-types-legend"
      class="fr-fieldset__legend fr-h4"
    >
      Objets d'accompagnement proposés par
      {{ adminView ? 'la' : 'ma' }} structure
    </legend>
    <div class="fr-fieldset__element">
      <VeeMultiSelect
        name="legallyRequiredFollowupTypes"
        :label="structureFieldLabels.legallyRequiredFollowupTypes"
        :options="defaultLegallyRequiredFollowupTypeOptions"
        label-class="fr-h6"
        :disabled-options="disableRequiredTypeOptions"
        hint="Vous ne pouvez pas désélectionner un objet d'accompagnement qui a déjà été associé à une synthèse d'entretien ou une instruction de dossier."
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
        hint="Vous ne pouvez pas désélectionner un objet d'accompagnement qui a déjà été associé à une synthèse d'entretien ou une instruction de dossier."
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
        :structure-id="structureId"
        :admin-view="adminView || false"
        @create-followup-type="onCreateFollowupType"
      />
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
  import { FollowupType } from '@prisma/client'
  import { toOptions } from '~/utils/options'
  import { structureFieldLabels } from '~/client/labels'
  import { sortFollowupTypesByName } from '~/utils/followupType'
  import {
    defaultLegallyRequiredFollowupTypeOptions,
    defaultLegallyNotRequiredFollowupTypeOptions
  } from '~/client/options'

  const props = withDefaults(
    defineProps<{
      structureId: string
      requiredTypes: FollowupType[]
      optionalTypes: FollowupType[]
      adminView?: boolean
    }>(),
    {
      adminView: false
    }
  )

  const isAdding = ref(false)
  const createdFollowupTypes = ref<string[]>([])

  watch(
    () => props.optionalTypes,
    () => {
      createdFollowupTypes.value = []
    }
  )

  const optionalTypeOptions = computed(() => {
    const defaultOptionalTypes = Array.from(
      defaultLegallyNotRequiredFollowupTypeOptions
    ).map(([id, name]) => ({ id, name }))
    const customTypes = props.optionalTypes
      .filter(type => !type.default)
      .map(type => ({ id: type.id, name: type.name }))
    const types = [
      ...defaultOptionalTypes,
      ...customTypes,
      ...createdFollowupTypes.value.map(name => ({ id: name, name }))
    ]
    return toOptions(types.sort(sortFollowupTypesByName), 'id', 'name')
  })

  const disableOptionalTypeOptions = computed(() => {
    return props.optionalTypes
      .filter(({ used }) => used)
      .map(({ default: key, id }) => key || id)
  })

  const disableRequiredTypeOptions = computed(() => {
    return props.requiredTypes
      .filter(({ used }) => used)
      .map(({ default: key, id }) => key || id)
  })

  function onCreateFollowupType(name: string) {
    createdFollowupTypes.value.push(name)
    isAdding.value = false
  }
</script>
