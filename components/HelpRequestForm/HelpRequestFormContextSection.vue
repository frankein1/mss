<template>
  <h3 class="fr-col-12 fr-h5 fr-mb-0">Contexte du dossier d'instruction</h3>

  <div class="fr-col-12 fr-col-lg-6 fr-col-offset-lg-6--right">
    <VeeInput
      name="date"
      :label="helpRequestFieldLabels.date"
      type="date"
      required
    />
  </div>

  <template v-if="application.module.ministere">
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        name="numeroPegase"
        :label="helpRequestFieldLabels.numeroPegase"
        hint="Format attendu : A-00-000000"
      />
    </div>

    <div class="fr-col-12 fr-col-lg-6">
      <VeeSelect
        name="ministre"
        :label="helpRequestFieldLabels.ministre"
        :options="withEmptyValue(currentMinisterOptions)"
        required
      />
    </div>
  </template>

  <template v-if="isHousingSupport">
    <div class="fr-col-12">
      <VeeRadioButtons
        name="isFirst"
        label="Il s'agit"
        :options="isFirstOptions"
      />
    </div>

    <div
      v-if="isFirst === 'false'"
      class="fr-col-12 fr-col-lg-6 fr-col-offset-lg-6--right"
    >
      <VeeInput
        name="firstOpeningDate"
        :label="housingHelpRequestFieldLabels.firstOpeningDate"
        type="date"
      />
    </div>

    <div class="fr-col-12">
      <fieldset
        class="fr-fieldset"
        aria-labelledby="housing-help-request-asked-housing-legend"
      >
        <legend
          id="housing-help-request-asked-housing-legend"
          class="fr-fieldset__legend"
        >
          {{ housingHelpRequestFieldLabels.askedHousing }}
        </legend>
        <div
          v-for="[value, label] in askedHousingOptions"
          :key="value"
          class="fr-fieldset__element fr-fieldset__element--inline"
        >
          <VeeCheckbox
            :name="value"
            :label="label"
          />
        </div>
      </fieldset>
    </div>
  </template>
  <template v-else>
    <div class="fr-col-12">
      <VeeSearchableSelect
        :label="helpRequestFieldLabels.typeId"
        name="typeId"
        :options="followUpTypeOptions"
        required
        hint
      >
        <template #hint>
          <NuxtLink
            v-if="application.edit.structure"
            :to="RoutePath.AppStructureEdit()"
            class="fr-link fr-icon-info-fill fr-fi--sm fr-link--icon-left"
            >Je personnalise les objets d’accompagnement de ma structure
          </NuxtLink>
          <template v-else>
            Les responsables de votre structure peuvent personnaliser les objets
            d'accompagnement
          </template>
        </template>
      </VeeSearchableSelect>
    </div>

    <div class="fr-col-12">
      <VeeSearchableSelect
        :label="helpRequestFieldLabels.prescribingOrganizationId"
        name="prescribingOrganizationId"
        :options="withEmptyValue(prescribingOrganizationOptions)"
        :can-create-new-option="application.create.prescribingOrganization"
      />
    </div>
  </template>

  <div
    class="fr-col-12 fr-col-lg-6"
    :class="{
      'fr-col-offset-lg-6--right': !isExternalSupport
    }"
  >
    <VeeSelect
      label="Le dossier est instruit..."
      name="externalStructure"
      :options="withEmptyValue(externalOrganisationOptions)"
      required
    />
  </div>

  <div
    v-if="isExternalSupport"
    class="fr-col-12 fr-col-lg-6"
  >
    <VeeSearchableSelect
      :label="helpRequestFieldLabels.instructorOrganizationId"
      name="instructorOrganizationId"
      :options="instructorOrganizationOptions"
      :can-create-new-option="application.create.instructorOrganization"
    />
  </div>

  <div
    v-if="hasSetExternalStructure"
    class="fr-col-12 fr-col-lg-6 fr-col-offset-lg-6--right"
  >
    <VeeInput
      v-if="isExternalSupport"
      name="dispatchDate"
      :label="helpRequestFieldLabels.dispatchDate"
      type="date"
    />
    <VeeInput
      v-else
      name="examinationDate"
      :label="helpRequestFieldLabels.examinationDate"
      type="date"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    FollowupType,
    InstructorOrganization,
    PrescribingOrganization
  } from '@prisma/client'
  import {
    helpRequestFieldLabels,
    housingHelpRequestFieldLabels
  } from '~/client/labels'
  import {
    currentMinisterOptions,
    isFirstOptions,
    externalOrganisationOptions,
    askedHousingOptions
  } from '~/client/options'
  import { RoutePath } from '~/utils/routing'
  import { CreateHousingHelpRequestInput } from '~/server/schema'

  const { application } = usePermissions()

  const props = defineProps<{
    followupTypes: FollowupType[]
    prescribingOrganizations: PrescribingOrganization[]
    instructorOrganizations: InstructorOrganization[]
    isExternalSupport: boolean
    hasSetExternalStructure: boolean
    isHousingSupport: boolean
  }>()

  const { value: isFirst } =
    useField<CreateHousingHelpRequestInput['isFirst']>('isFirst')

  const followUpTypeOptions = computed(() =>
    toOptions(props.followupTypes, 'id', 'name')
  )

  const prescribingOrganizationOptions = computed(() => {
    const prescribingOrganizationsWithStringId =
      props.prescribingOrganizations.map(({ id, ...rest }) => ({
        id: String(id),
        ...rest
      }))
    return toOptions(prescribingOrganizationsWithStringId, 'id', 'name')
  })

  const instructorOrganizationOptions = computed(() => {
    const instructorOrganizationsWithStringId =
      props.instructorOrganizations.map(({ id, ...rest }) => ({
        id: String(id),
        ...rest
      }))
    return toOptions(instructorOrganizationsWithStringId, 'id', 'name')
  })
</script>
