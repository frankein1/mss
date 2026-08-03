<template>
  <h3 class="fr-h4">Contexte du dossier d'instruction</h3>
  <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--top">
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
        <MinisterCombobox
          :error="ministerIdError"
          :initial-minister-id="initialMinisterId"
          @on-set-minister-id="onSetMinisterId"
        />
      </div>
    </template>

    <template v-if="isHousingSupport">
      <div class="fr-col-12">
        <VeeRadioButtons
          name="isFirst"
          :label="helpRequestFieldLabels.isFirst"
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
            class="fr-fieldset__legend fr-fieldset__legend--regular"
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

      <!-- ROW -->
      <div class="fr-col-12 fr-col-md-6">
        <VeeCombobox
          :label="helpRequestFieldLabels.prescribingOrganizationId"
          name="prescribingOrganizationId"
          :options="withEmptyValue(partnerOrganizationOptions)"
          :disabled="prescribingOrganizationContactIsDisabled"
          @change-value="onPrescribingOrganization"
        />
      </div>

      <div class="fr-col-12 fr-col-md-6">
        <VeeSelect
          name="prescribingOrganizationContactId"
          :disabled="prescribingOrganizationContactIsDisabled"
          :label="helpRequestFieldLabels.prescribingOrganizationContactId"
          :options="withEmptyValue(prescribingOrganizationContactOptions)"
        />
      </div>
    </template>

    <template v-else>
      <div class="fr-col-12">
        <VeeCombobox
          :label="helpRequestFieldLabels.subjectId"
          name="subjectId"
          :options="socialSupportSubjectOptions"
          required
        />
      </div>
      <div class="fr-col-12 fr-mt-0 fr-pt-0">
        <NuxtLink
          v-if="application.edit.structure"
          :to="routes.structure.AppStructureCustomObjects.path()"
          class="fr-link fr-icon-info-fill fr-fi--sm fr-link--icon-left"
          >Je personnalise les objets d'accompagnement de ma structure
        </NuxtLink>
        <p v-else>
          Les responsables de votre structure peuvent personnaliser les objets
          d'accompagnement
        </p>
      </div>

      <!-- ROW -->
      <div class="fr-col-12 fr-col-md-6">
        <VeeCombobox
          :label="helpRequestFieldLabels.prescribingOrganizationId"
          name="prescribingOrganizationId"
          :options="withEmptyValue(partnerOrganizationOptions)"
          @change-value="onPrescribingOrganization"
        />
      </div>

      <div class="fr-col-12 fr-col-md-6">
        <VeeSelect
          name="prescribingOrganizationContactId"
          :disabled="prescribingOrganizationContactIsDisabled"
          :label="helpRequestFieldLabels.prescribingOrganizationContactId"
          :options="withEmptyValue(prescribingOrganizationContactOptions)"
        />
      </div>

      <!-- ROW -->
      <div class="fr-col-12 fr-mt-0 fr-pt-0">
        <NuxtLink
          :to="routes.structure.AppPartners.path()"
          class="fr-link fr-icon-info-fill fr-fi--sm fr-link--icon-left"
        >
          Données issues de l'annuaire de partenaires
        </NuxtLink>
      </div>
    </template>

    <!-- ROW -->
    <div class="fr-col-12">
      <VeeSelect
        label="Le dossier est instruit..."
        name="externalStructure"
        :options="withEmptyValue(externalOrganisationKeys.options)"
        required
      />
    </div>

    <!-- ROW -->

    <template v-if="isExternalSupport">
      <div class="fr-col-12 fr-col-md-6">
        <VeeCombobox
          :label="helpRequestFieldLabels.instructorOrganizationId"
          name="instructorOrganizationId"
          :options="partnerOrganizationOptions"
          @change-value="onInstructorOrganization"
        />
      </div>
      <div class="fr-col-12 fr-col-md-6">
        <VeeSelect
          name="instructorOrganizationContactId"
          :label="helpRequestFieldLabels.instructorOrganizationContactId"
          :options="withEmptyValue(instructorOrganizationContactOptions)"
          :disabled="instructorOrganizationContactIsDisabled"
        />
      </div>

      <!-- ROW -->
      <div class="fr-col-12 fr-mt-0 fr-pt-0">
        <NuxtLink
          :to="routes.structure.AppPartners.path()"
          class="fr-link fr-icon-info-fill fr-fi--sm fr-link--icon-left"
        >
          Données issues de l'annuaire de partenaires
        </NuxtLink>
      </div>
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
  </div>
</template>

<script setup lang="ts">
  import type { SocialSupportSubject } from '@prisma/client'
  import {
    helpRequestFieldLabels,
    housingHelpRequestFieldLabels
  } from '~/client/labels'
  import {
    isFirstKeys,
    externalOrganisationKeys,
    askedHousingKeys
  } from '~/client/options'
  import type { CreateHousingHelpRequestInput } from '~/server/schema'
  import type { PartnerOrganizationIdName } from '~/types/partner'
  import { routes } from '~/utils/routes'

  const { application } = usePermissions()

  const props = defineProps<{
    socialSupportSubjects: SocialSupportSubject[]
    partnerOrganizations: PartnerOrganizationIdName[]
    isExternalSupport: boolean
    hasSetExternalStructure: boolean
    isHousingSupport: boolean
    ministerIdError?: {
      name: string
      message: string
    }
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

  // update minister form value
  const { setValue: setMinisterId, value: initialMinisterId } = useField<
    string | undefined
  >('ministerId')
  const onSetMinisterId = (id: string) => {
    setMinisterId(id, true)
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

  const selectedPrescribingOrganization = computed(() => {
    const partnerId = prescribingOrganizationId.value
    if (!partnerId) {
      return null
    }

    return (props.partnerOrganizations || []).find(
      partner => partner.id === partnerId
    )
  })

  const selectedInstructorOrganization = computed(() => {
    const partnerId = instructorOrganizationId.value
    if (!partnerId) {
      return null
    }

    return (props.partnerOrganizations || []).find(
      partner => partner.id === partnerId
    )
  })

  const getContacts = (id: string | null) => {
    if (!id) {
      return []
    }
    const partnerOrganization = (props.partnerOrganizations || []).find(
      partner => partner.id === id
    )
    return toOptions(partnerOrganization?.contacts || [], 'id', 'name')
  }

  const prescribingOrganizationContactOptions = computed(() =>
    getContacts(prescribingOrganizationId.value)
  )

  const instructorOrganizationContactOptions = computed(() =>
    getContacts(instructorOrganizationId.value)
  )

  const prescribingOrganizationContactIsDisabled = computed(() => {
    if (!selectedPrescribingOrganization.value) {
      return true
    }
    if ((selectedPrescribingOrganization.value.contacts || []).length === 0) {
      return true
    }
    return false
  })

  const instructorOrganizationContactIsDisabled = computed(() => {
    if (!selectedInstructorOrganization.value) {
      return true
    }
    if ((selectedInstructorOrganization.value.contacts || []).length === 0) {
      return true
    }
    return false
  })
</script>
