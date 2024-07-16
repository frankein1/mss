<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    class="fr-container--fluid"
    @submit.prevent="emit('submit', $event)"
  >
    <div class="fr-grid-row fr-grid-row--gutters form-grid fr-grid-row--bottom">
      <!-- ROW -->
      <div class="fr-col-12">
        <VeeCheckbox
          :label="followupFieldLabels.firstFollowup"
          name="firstFollowup"
        />
      </div>

      <!-- ROW -->
      <div class="fr-col-6">
        <VeeInput
          name="date"
          :label="followupFieldLabels.date"
          type="date"
          required
        />
      </div>

      <div class="fr-col-6">
        <VeeSelect
          name="duration"
          :label="followupFieldLabels.duration"
          :options="withEmptyValue(followupDurationKeys.options)"
        />
      </div>

      <!-- ROW -->
      <template v-if="application.module.ministere">
        <div class="fr-col-6">
          <VeeInput
            name="numeroPegase"
            :label="followupFieldLabels.numeroPegase"
            hint="Format attendu : A-00-000000"
          />
        </div>

        <div class="fr-col-6">
          <VeeSelect
            name="ministre"
            :label="followupFieldLabels.ministre"
            :options="withEmptyValue(ministerKeys.options)"
            required
          />
        </div>
      </template>

      <!-- ROW -->
      <div class="fr-col-6">
        <VeeSelect
          name="medium"
          :label="followupFieldLabels.medium"
          :options="withEmptyValue(followupMediumKeys.options)"
          required
        />
      </div>

      <div
        v-if="medium === FollowupMedium.ExternalAppointment"
        class="fr-col-6"
      >
        <VeeInput
          name="place"
          :label="followupFieldLabels.place"
        />
      </div>
      <div
        v-else-if="medium === FollowupMedium.ThirdParty"
        class="fr-col-6"
      >
        <VeeInput
          name="thirdPersonName"
          :label="followupFieldLabels.thirdPersonName"
        />
      </div>
      <div
        v-else
        class="fr-col-6"
      ></div>

      <!-- ROW -->
      <div class="fr-col-12">
        <VeeSearchableSelect
          :label="followupFieldLabels.subjects"
          name="subjects"
          :options="socialSupportSubjectOptions"
          required
          multiple
        >
          <template #hint> </template>
        </VeeSearchableSelect>
      </div>

      <!-- ROW -->
      <!-- ROW -->
      <div class="fr-col-12 fr-mt-0 fr-pt-0">
        <NuxtLink
          v-if="application.edit.structure"
          :to="routes.structure.AppStructure.path()"
          class="fr-link fr-icon-info-fill fr-fi--sm fr-link--icon-left"
        >
          Je personnalise les objets d'accompagnement de ma structure
        </NuxtLink>
        <template v-else>
          Les responsables de votre structure peuvent personnaliser les objets
          d'accompagnement.
        </template>
      </div>

      <!-- ROW -->
      <div class="fr-col-6">
        <VeeSelect
          name="status"
          :label="followupFieldLabels.status"
          :options="followupStatusKeys.options"
          required
        />
      </div>

      <div class="fr-col-6">
        <VeeInput
          name="dueDate"
          :label="followupFieldLabels.dueDate"
          type="date"
        />
      </div>

      <!-- ROW -->
      <div class="fr-col-6">
        <VeeSearchableSelect
          :label="followupFieldLabels.prescribingOrganizationId"
          name="prescribingOrganizationId"
          :options="withEmptyValue(partnerOrganizationOptions)"
          @change-value="onPrescribingOrganization"
        >
        </VeeSearchableSelect>
      </div>
      <div class="fr-col-6">
        <VeeSelect
          name="prescribingOrganizationContactId"
          :disabled="organizationContactIsDisabled"
          :label="followupFieldLabels.prescribingOrganizationContactId"
          :options="withEmptyValue(prescribingOrganizationContactOptions)"
        />
      </div>

      <!-- ROW -->
      <div class="fr-col-6 fr-mt-0 fr-pt-0">
        <NuxtLink
          :to="RoutePath.AppPartners()"
          class="fr-link fr-icon-info-fill fr-link--icon-left"
        >
          Données issues de l'annuaire de partenaires
        </NuxtLink>
      </div>
      <div class="fr-col-6 fr-mt-0 fr-pt-0"></div>

      <!-- ROW -->
      <div class="fr-col-12">
        <VeeTextarea
          class="large-textarea"
          name="synthesis"
          :label="followupFieldLabels.synthesis"
        />
      </div>

      <!-- ROW -->
      <div
        v-if="canSetPrivateSynthesis"
        class="fr-col-12"
      >
        <VeeTextarea
          name="privateSynthesis"
          :label="followupFieldLabels.privateSynthesis"
          label-icon="fr-icon-lock-line"
        >
          <template #hint>
            Le compte rendu privé est uniquement visible et modifiable par
            l'agent qui crée la synthèse d'entretien.<br />{{
              SENSITIVE_DATA_HINT
            }}
          </template>
        </VeeTextarea>
      </div>

      <!-- ROW -->
      <div class="fr-col-12">
        <fieldset
          class="fr-fieldset fr-col-12"
          aria-labelledby="followup-actions-entreprises-legend"
        >
          <legend
            id="followup-actions-entreprises-legend"
            class="fr-fieldset__legend fr-h6"
          >
            Actions entreprises
          </legend>

          <div class="fr-fieldset__element fr-mb-0">
            <fieldset
              class="fr-fieldset fr-mb-0"
              aria-labelledby="followup-reoriente-apres-entretien-legend"
            >
              <legend
                id="followup-reoriente-apres-entretien-legend"
                hidden
              >
                {{ followupFieldLabels.redirected }}
              </legend>

              <div class="fr-fieldset__element fr-fieldset__element--inline">
                <VeeCheckbox
                  name="redirected"
                  :label="followupFieldLabels.redirected"
                />
              </div>
              <div class="fr-fieldset__element fr-fieldset__element--inline">
                <VeeInput
                  v-if="isRedirected"
                  name="structureName"
                  :label="followupFieldLabels.structureName"
                />
              </div>
            </fieldset>
          </div>

          <div class="fr-fieldset__element fr-fieldset__element--inline">
            <VeeCheckbox
              name="helpRequested"
              :label="followupFieldLabels.helpRequested"
            />
          </div>

          <template v-if="application.module.ministere">
            <div class="fr-fieldset__element fr-fieldset__element--inline">
              <VeeCheckbox
                name="classified"
                :label="followupFieldLabels.classified"
              />
            </div>

            <div class="fr-fieldset__element fr-fieldset__element--inline">
              <VeeCheckbox
                name="forwardedToJustice"
                :label="followupFieldLabels.forwardedToJustice"
              />
            </div>
          </template>
        </fieldset>
      </div>
    </div>

    <div class="fr-mb-4w">
      <BeneficiaryDocumentsSelect
        :family-file-id="familyFileId"
        name="documents"
        snackbar-success-message="Le document a été ajouté à la fiche bénéficiaire. Enregistrez la synthèse d'entretien pour conserver le lien entre les deux."
      />
    </div>

    <ul
      class="fr-btns-group fr-btns-group--inline fr-btns-group--lg fr-btns-group--right"
    >
      <li>
        <button
          class="fr-btn submit-btn"
          type="submit"
          :submitting="isSubmitting"
          :disabled="isSubmitting"
        >
          Enregistrer
        </button>
      </li>
    </ul>
  </form>
</template>

<script lang="ts" setup>
  import { SocialSupportSubject, FollowupMedium } from '@prisma/client'
  import type { FormErrors } from 'vee-validate'
  import {
    ministerKeys,
    followupStatusKeys,
    followupMediumKeys,
    followupDurationKeys
  } from '~/client/options'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { SENSITIVE_DATA_HINT } from '~/utils/constants'
  import { RoutePath } from '~/utils/routing'
  import { followupFieldLabels } from '~/client/labels'
  import { AddFollowupInput, EditFollowupInput } from '~/server/schema'
  import { PartnerOrganizationIdName } from '~/types/partner'
  import { routes } from '~/routes'

  const props = withDefaults(
    defineProps<{
      isSubmitting: boolean
      socialSupportSubjects: Array<SocialSupportSubject>
      partnerOrganizations: Array<PartnerOrganizationIdName>
      familyFileId: string
      medium: FollowupMedium
      isRedirected: boolean
      canSetPrivateSynthesis?: boolean
      caughtErrors: FormErrors<AddFollowupInput | EditFollowupInput>
    }>(),
    { canSetPrivateSynthesis: true }
  )

  const { application } = usePermissions()

  const emit = defineEmits<{
    submit: [payload: Event]
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const { value: prescribingOrganizationId } = useField<string | null>(
    'prescribingOrganizationId'
  )

  const { setValue: setPrescribingOrganizationContactId } = useField<
    string | null
  >('prescribingOrganizationContactId')

  const onPrescribingOrganization = (id: string[] | string) => {
    if (!id) {
      setPrescribingOrganizationContactId(null)
    }
  }

  const { errors } = useDisplayFormErrors(
    form,
    toRef(() => props.caughtErrors),
    followupFieldLabels
  )

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

  const selectedPartnerOrganization = computed(() => {
    const partnerId = prescribingOrganizationId.value
    if (!partnerId) {
      return null
    }

    return (props.partnerOrganizations || []).find(
      partner => partner.id === partnerId
    )
  })

  const organizationContactIsDisabled = computed(() => {
    if (!selectedPartnerOrganization.value) {
      return true
    }
    if ((selectedPartnerOrganization.value.contacts || []).length === 0) {
      return true
    }
    return false
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
</script>
