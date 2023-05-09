<template>
  <fieldset
    class="fr-fieldset"
    aria-labelledby="organisation-follow-up-types-legend"
  >
    <legend
      id="organisation-follow-up-types-legend"
      class="fr-fieldset__legend fr-h4"
    >
      Types d'accompagnement proposés par ma structure
    </legend>
    <div class="fr-fieldset__element">
      <AtomMultiSelect
        name="legallyRequiredFollowupTypes"
        label="Aides légales"
        :options="defaultLegallyRequiredFollowupTypeOptions"
        :model-value="initialLegallyRequiredSelectedIds"
        label-class="fr-h6"
        :disabled-options="initialSelectedIdsAlreadyUsed"
        hint="Vous ne pouvez pas désélectionner un type d'accompagnement qui a déjà été associé à une synthèse d'entretien ou une instruction de demande d'aide."
      />
    </div>
    <div class="fr-fieldset__element">
      <AtomMultiSelect
        class="fr-mb-1w"
        name="legallyNotRequiredFollowupTypes"
        label="Aides facultatives"
        :options="legallyNotRequiredFollowupTypeOptions"
        :model-value="initialLegallyNotRequiredSelectedIds"
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

  const props = defineProps<{
    structureFollowupTypes: FollowupTypeWithSupportsCount[]
  }>()

  const isAdding = ref(false)
  const createdFollowupTypes = ref<string[]>([])

  const legallyNotRequiredFollowupTypeOptions = computed(
    () =>
      new Map<string, string>([
        ...defaultLegallyNotRequiredFollowupTypeOptions,
        ...toOptions(customFollowupTypes.value, 'id', 'name'),
        ...arrayToOptions(createdFollowupTypes.value)
      ])
  )

  const defaultLegallyRequiredSelectedFollowupTypes = computed(() =>
    props.structureFollowupTypes.filter(isDefaultLegallyRequired)
  )

  const defaultLegallyNotRequiredSelectedFollowupTypes = computed(() =>
    props.structureFollowupTypes.filter(isDefaultLegallyNotRequired)
  )

  const customFollowupTypes = computed(() =>
    props.structureFollowupTypes.filter(isCustom)
  )

  const legallyNotRequiredSelectedFollowupTypes = computed(() => [
    ...defaultLegallyNotRequiredSelectedFollowupTypes.value,
    ...customFollowupTypes.value
  ])

  const initialLegallyRequiredSelectedIds = computed(() =>
    defaultLegallyRequiredSelectedFollowupTypes.value.map(
      ({ defaultLegallyRequiredKey }) => defaultLegallyRequiredKey
    )
  )

  const initialLegallyNotRequiredSelectedIds = computed(() => [
    ...defaultLegallyNotRequiredSelectedFollowupTypes.value.map(
      ({ defaultLegallyNotRequiredKey }) => defaultLegallyNotRequiredKey
    ),
    ...customFollowupTypes.value.map(({ id }) => id)
  ])

  const initialLegallyRequiredSelectedAlreadyUsed = computed(() =>
    defaultLegallyRequiredSelectedFollowupTypes.value
      .filter(isAlreadyUsed)
      .map(({ defaultLegallyRequiredKey }) => defaultLegallyRequiredKey)
  )

  const initialLegallyNotRequiredSelectedAlreadyUsed = computed(() =>
    legallyNotRequiredSelectedFollowupTypes.value
      .filter(isAlreadyUsed)
      .map(
        ({ id, defaultLegallyNotRequiredKey }) =>
          defaultLegallyNotRequiredKey || id
      )
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

  function isDefaultLegallyRequired(
    f: FollowupTypeWithSupportsCount
  ): f is DefaultLegallyRequiredFollowupTypeWithSupportsCount {
    return !!(f.default && f.legallyRequired)
  }

  function isDefaultLegallyNotRequired(
    f: FollowupTypeWithSupportsCount
  ): f is DefaultLegallyNotRequiredFollowupTypeWithSupportsCount {
    return !!(f.default && !f.legallyRequired)
  }

  function isCustom(
    f: FollowupTypeWithSupportsCount
  ): f is CustomFollowupTypeWithSupportsCount {
    return !f.default
  }

  function isAlreadyUsed(f: FollowupTypeWithSupportsCount) {
    return !!(f._count.followups || f._count.helpRequests)
  }
</script>
