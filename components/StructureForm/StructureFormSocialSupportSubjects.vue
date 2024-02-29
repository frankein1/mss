<template>
  <fieldset
    class="fr-fieldset"
    aria-labelledby="organisation-social-support-subject-legend"
  >
    <legend
      id="organisation-social-support-subject-legend"
      class="fr-fieldset__legend fr-h4"
    >
      Objets d'accompagnement proposés par
      {{ adminView ? 'la' : 'ma' }} structure
    </legend>
    <div class="fr-fieldset__element">
      <VeeMultiSelect
        name="legallyRequiredSocialSupportSubjects"
        :label="structureFieldLabels.legallyRequiredSocialSupportSubjects"
        :options="defaultLegallyRequiredSocialSupportSubjectOptions"
        label-class="fr-h6"
        :disabled-options="disableRequiredSubjectOptions"
        hint="Vous ne pouvez pas désélectionner un objet d'accompagnement qui a déjà été associé à une synthèse d'entretien ou une instruction de dossier."
      />
    </div>
    <div class="fr-fieldset__element">
      <VeeMultiSelect
        class="fr-mb-1w"
        name="legallyNotRequiredSocialSupportSubjects"
        :label="structureFieldLabels.legallyNotRequiredSocialSupportSubjects"
        :options="optionalSubjectOptions"
        label-class="fr-h6"
        :disabled-options="disableOptionalSubjectOptions"
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
      <StructureFormAddSocialSupportSubjectForm
        :structure-id="structureId"
        :admin-view="adminView || false"
        @create-social-support-subject="onCreateSocialSupportSubject"
      />
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
  import { SocialSupportSubject } from '@prisma/client'
  import { toOptions } from '~/utils/options'
  import { structureFieldLabels } from '~/client/labels'
  import { sortSocialSupportSubjectsByName } from '~/utils/socialSupportSubject'
  import {
    defaultLegallyRequiredSocialSupportSubjectOptions,
    defaultLegallyNotRequiredSocialSupportSubjectOptions
  } from '~/client/options'

  const props = withDefaults(
    defineProps<{
      structureId: string
      requiredSubjects: SocialSupportSubject[]
      optionalSubjects: SocialSupportSubject[]
      adminView?: boolean
    }>(),
    {
      adminView: false
    }
  )

  const isAdding = ref(false)
  const createdSocialSupportSubjects = ref<string[]>([])

  watch(
    () => props.optionalSubjects,
    () => {
      createdSocialSupportSubjects.value = []
    }
  )

  const optionalSubjectOptions = computed(() => {
    const defaultOptionalObjects = Array.from(
      defaultLegallyNotRequiredSocialSupportSubjectOptions
    ).map(([id, name]) => ({ id, name }))
    const customObjects = props.optionalSubjects
      .filter(oo => !oo.default)
      .map(oo => ({ id: oo.id, name: oo.name }))
    const subjects = [
      ...defaultOptionalObjects,
      ...customObjects,
      ...createdSocialSupportSubjects.value.map(name => ({ id: name, name }))
    ]
    return toOptions(
      subjects.sort(sortSocialSupportSubjectsByName),
      'id',
      'name'
    )
  })

  const disableOptionalSubjectOptions = computed(() => {
    return props.optionalSubjects
      .filter(({ used }) => used)
      .map(({ default: key, id }) => key || id)
  })

  const disableRequiredSubjectOptions = computed(() => {
    return props.requiredSubjects
      .filter(({ used }) => used)
      .map(({ default: key, id }) => key || id)
  })

  function onCreateSocialSupportSubject(name: string) {
    createdSocialSupportSubjects.value.push(name)
    isAdding.value = false
  }
</script>
