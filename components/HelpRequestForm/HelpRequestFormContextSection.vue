<template>
  <h3 class="fr-col-12 fr-h5 fr-mb-0">Contexte du dossier d'instruction</h3>

  <div class="fr-col-12">
    <VeeInput
      name="date"
      :label="helpRequestFieldLabels.date"
      type="date"
      required
    />
  </div>

  <template v-if="application.module.ministere">
    <div class="fr-col-12">
      <VeeInput
        name="numeroPegase"
        :label="helpRequestFieldLabels.numeroPegase"
        hint="Format attendu : A-00-000000"
      />
    </div>

    <div class="fr-col-12">
      <VeeSelect
        name="ministre"
        :label="helpRequestFieldLabels.ministre"
        :options="withEmptyValue(ministerKeys.options)"
        required
      />
    </div>
  </template>

  <template v-if="isHousingSupport">
    <div class="fr-col-12">
      <VeeRadioButtons
        name="isFirst"
        label="Il s'agit"
        :options="isFirstKeys.options"
      />
    </div>

    <div
      v-if="isFirst === 'false'"
      class="fr-col-12"
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
          v-for="{ value, label } in askedHousingKeys.options"
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
        :label="helpRequestFieldLabels.subjectId"
        name="subjectId"
        :options="socialSupportSubjectOptions"
        required
        hint
      >
        <template #hint>
          <NuxtLink
            v-if="application.edit.structure"
            :to="RoutePath.AppStructure()"
            class="fr-link fr-icon-info-fill fr-fi--sm fr-link--icon-left"
            >Je personnalise les objets d'accompagnement de ma structure
          </NuxtLink>
          <template v-else>
            Les responsables de votre structure peuvent personnaliser les objets
            d'accompagnement
          </template>
        </template>
      </VeeSearchableSelect>
    </div>

    <!-- ROW -->
    <div class="fr-col-6">
      <VeeSearchableSelect
        :label="helpRequestFieldLabels.prescribingOrganizationId"
        name="prescribingOrganizationId"
        :options="withEmptyValue(partnerOrganizationOptions)"
        @change-value="onPrescribingOrganization"
      />
    </div>

    <div class="fr-col-6">
      <VeeSelect
        name="prescribingOrganizationContactId"
        :label="helpRequestFieldLabels.prescribingOrganizationContactId"
        :options="withEmptyValue(prescribingOrganizationContactOptions)"
      />
    </div>

    <!-- ROW -->
    <div class="fr-col-6 fr-mt-0 fr-pt-0">
      <NuxtLink
        :to="RoutePath.AppPartners()"
        class="fr-link fr-icon-info-fill fr-fi--sm fr-link--icon-left"
      >
        Données issues de l'annuaire de partenaires
      </NuxtLink>
    </div>
    <div class="fr-col-6 fr-mt-0 fr-pt-0"></div>
  </template>

  <!-- ROW -->
  <div class="fr-col-6">
    <VeeSelect
      label="Le dossier est instruit..."
      name="externalStructure"
      :options="withEmptyValue(externalOrganisationKeys.options)"
      required
    />
  </div>
  <div class="fr-col-6"></div>

  <!-- ROW -->

  <template v-if="isExternalSupport">
    <div class="fr-col-6">
      <VeeSearchableSelect
        :label="helpRequestFieldLabels.instructorOrganizationId"
        name="instructorOrganizationId"
        :options="partnerOrganizationOptions"
        @change-value="onInstructorOrganization"
      />
    </div>
    <div class="fr-col-6">
      <VeeSelect
        name="instructorOrganizationContactId"
        :label="helpRequestFieldLabels.instructorOrganizationContactId"
        :options="withEmptyValue(instructorOrganizationContactOptions)"
      />
    </div>

    <!-- ROW -->
    <div class="fr-col-6 fr-mt-0 fr-pt-0">
      <NuxtLink
        :to="RoutePath.AppPartners()"
        class="fr-link fr-icon-info-fill fr-fi--sm fr-link--icon-left"
      >
        Données issues de l'annuaire de partenaires
      </NuxtLink>
    </div>
    <div class="fr-col-6 fr-mt-0 fr-pt-0"></div>
  </template>

  <div
    v-if="hasSetExternalStructure"
    class="fr-col-12"
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
  import { SocialSupportSubject } from '@prisma/client'
  import {
    helpRequestFieldLabels,
    housingHelpRequestFieldLabels
  } from '~/client/labels'
  import {
    ministerKeys,
    isFirstKeys,
    externalOrganisationKeys,
    askedHousingKeys
  } from '~/client/options'
  import { RoutePath } from '~/utils/routing'
  import { CreateHousingHelpRequestInput } from '~/server/schema'
  import { PartnerOrganizationIdName } from '~/types/partner'

  const { application } = usePermissions()

  const props = defineProps<{
    socialSupportSubjects: SocialSupportSubject[]
    partnerOrganizations: PartnerOrganizationIdName[]
    isExternalSupport: boolean
    hasSetExternalStructure: boolean
    isHousingSupport: boolean
  }>()

  const { value: isFirst } =
    useField<CreateHousingHelpRequestInput['isFirst']>('isFirst')

  const { value: prescribingOrganizationId } = useField<string | null>(
    'prescribingOrganizationId'
  )
  const { value: instructorOrganizationId } = useField<string | null>(
    'instructorOrganizationId'
  )

  const { setValue: setPrescribingOrganizationContactId } = useField<
    string | null
  >('prescribingOrganizationContactId')
  const { setValue: setInstructorOrganizationContactId } = useField<
    string | null
  >('instructorOrganizationContactId')

  const onPrescribingOrganization = (id: string[] | string) => {
    if (!id) {
      setPrescribingOrganizationContactId(null)
    }
  }

  const onInstructorOrganization = (id: string[] | string) => {
    if (!id) {
      setInstructorOrganizationContactId(null)
    }
  }

  const socialSupportSubjectOptions = computed(() =>
    toOptions(props.socialSupportSubjects, 'id', 'name')
  )

  const partnerOrganizationOptions = computed(() => {
    const partnerOrganizationsWithStringId = props.partnerOrganizations.map(
      ({ id, ...rest }) => ({
        id: String(id),
        ...rest
      })
    )
    return toOptions(partnerOrganizationsWithStringId, 'id', 'name')
  })

  const prescribingOrganizationContactOptions = computed(() => {
    const partnerId = prescribingOrganizationId.value
    if (!partnerId) {
      return []
    }
    const partnerOrganization = (props.partnerOrganizations || []).find(
      partner => partner.id === partnerId
    )
    return toOptions(partnerOrganization?.contacts || [], 'id', 'name')
  })

  const instructorOrganizationContactOptions = computed(() => {
    const partnerId = instructorOrganizationId.value
    if (!partnerId) {
      return []
    }
    const partnerOrganization = (props.partnerOrganizations || []).find(
      partner => partner.id === partnerId
    )
    return toOptions(partnerOrganization?.contacts || [], 'id', 'name')
  })
</script>
