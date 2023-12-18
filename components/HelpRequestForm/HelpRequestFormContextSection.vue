<template>
  <h3 class="fr-col-12 fr-h5 fr-mb-0">Contexte du dossier d'instruction</h3>

  <div class="fr-col-12 fr-col-lg-6 fr-col-offset-lg-6--right">
    <VeeInput
      name="openingDate"
      :label="helpRequestFieldLabels.openingDate"
      type="date"
      required
    />
  </div>

  <template v-if="isMinistryAgent">
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
        :options="withEmptyValue(ministerOptions)"
        required
      />
    </div>
  </template>

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
          v-if="allowEditStructure"
          :to="RoutePath.AppStructureEdit()"
          target="_self"
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
      :can-create-new-option="canCreatePrescribingOrganization"
    />
  </div>

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
      :disabled="isEditing"
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
      :readonly="isEditingAndIsLocked"
      :can-create-new-option="canCreateInstructorOrganization"
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
      :readonly="isEditingAndIsLocked"
    />
    <VeeInput
      v-else
      name="examinationDate"
      :label="helpRequestFieldLabels.examinationDate"
      type="date"
      :readonly="isEditingAndIsLocked"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    FollowupType,
    InstructorOrganization,
    PrescribingOrganization
  } from '@prisma/client'
  import { helpRequestFieldLabels } from '~/client/labels/helpRequest.labels'
  import { ministerOptions } from '~/client/options/ministry'
  import {
    canCreatePrescribingOrganization as canCreatePrescribingOrganizationRule,
    canEditStructure as canEditStructureRule,
    canCreateInstructorOrganization as canCreateInstructorOrganizationRule
  } from '~/server/security'
  import { RoutePath } from '~/utils/routing'
  import { externalOrganisationOptions } from '~/client/options/helpRequest'

  const isMinistryAgent = useMinistryAgent()
  const { user } = useAuth()

  const props = defineProps<{
    followupTypes: FollowupType[]
    prescribingOrganizations: PrescribingOrganization[]
    instructorOrganizations: InstructorOrganization[]
    isExternalSupport: boolean
    isEditing: boolean
    isEditingAndIsLocked: boolean
    hasSetExternalStructure: boolean
  }>()

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

  const allowEditStructure = computed(() => canEditStructureRule(user.value))

  const canCreatePrescribingOrganization = computed(() =>
    canCreatePrescribingOrganizationRule(user.value)
  )

  const canCreateInstructorOrganization = computed(() =>
    canCreateInstructorOrganizationRule(user.value)
  )
</script>
