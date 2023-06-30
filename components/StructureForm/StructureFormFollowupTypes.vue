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
        :options="defaultLegallyRequiredFollowupTypeOptions"
        label-class="fr-h6"
        :disabled-options="initialSelectedIdsAlreadyUsed"
        hint="Vous ne pouvez pas désélectionner un type d'accompagnement qui a déjà été associé à une synthèse d'entretien ou une instruction de demande d'aide."
      />
    </div>
    <div class="fr-fieldset__element">
      <VeeMultiSelect
        class="fr-mb-1w"
        name="legallyNotRequiredFollowupTypes"
        :label="structureFieldLabels.legallyNotRequiredFollowupTypes"
        :options="legallyNotRequiredFollowupTypeOptions"
        label-class="fr-h6"
        :disabled-options="initialSelectedIdsAlreadyUsed"
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
  import type {
    DefaultLegallyRequiredFollowupTypeWithSupportsCount,
    DefaultLegallyNotRequiredFollowupTypeWithSupportsCount,
    CustomFollowupTypeWithSupportsCount
  } from './types'
  import type { FollowupTypeWithSupportsCount } from '~/types/followupType'
  import {
    defaultLegallyRequiredFollowupTypeOptions,
    defaultLegallyNotRequiredFollowupTypeOptions
  } from '~/client/options/followupType'
  import { toOptions } from '~/utils/options'
  import { structureFieldLabels } from '~/client/labels'

  const props = withDefaults(
    defineProps<{
      structureFollowupTypes: FollowupTypeWithSupportsCount[]
      defaultLegallyRequiredSelectedFollowupTypes: DefaultLegallyRequiredFollowupTypeWithSupportsCount[]
      defaultLegallyNotRequiredSelectedFollowupTypes: DefaultLegallyNotRequiredFollowupTypeWithSupportsCount[]
      customFollowupTypes: CustomFollowupTypeWithSupportsCount[]
      adminView?: boolean
    }>(),
    {
      adminView: false
    }
  )

  const isAdding = ref(false)
  const createdFollowupTypes = ref<string[]>([])

  const legallyNotRequiredFollowupTypeOptions = computed(
    () =>
      new Map<string, string>([
        ...defaultLegallyNotRequiredFollowupTypeOptions,
        ...toOptions(props.customFollowupTypes, 'id', 'name'),
        ...arrayToOptions(createdFollowupTypes.value)
      ])
  )

  const legallyNotRequiredSelectedFollowupTypes = computed(() => [
    ...props.defaultLegallyNotRequiredSelectedFollowupTypes,
    ...props.customFollowupTypes
  ])

  const initialLegallyRequiredSelectedAlreadyUsed = computed(() =>
    props.defaultLegallyRequiredSelectedFollowupTypes
      .filter(isAlreadyUsed)
      .map(({ default: defaultKey }) => defaultKey)
  )

  const initialLegallyNotRequiredSelectedAlreadyUsed = computed(() =>
    legallyNotRequiredSelectedFollowupTypes.value
      .filter(isAlreadyUsed)
      .map(({ id, default: defaultKey }) => defaultKey || id)
  )

  const initialSelectedIdsAlreadyUsed = computed(() => [
    ...initialLegallyRequiredSelectedAlreadyUsed.value,
    ...initialLegallyNotRequiredSelectedAlreadyUsed.value
  ])

  watch(
    () => props.structureFollowupTypes,
    () => {
      createdFollowupTypes.value = []
    },
    { deep: true }
  )

  function onCreateFollowupType(name: string) {
    createdFollowupTypes.value.push(name)
    isAdding.value = false
  }

  function isAlreadyUsed(f: FollowupTypeWithSupportsCount) {
    return !!(f._count.followups || f._count.helpRequests)
  }
</script>
