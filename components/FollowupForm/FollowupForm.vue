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
      <div class="fr-col-12">
        <VeeCheckbox
          :label="followupFieldLabels.firstFollowup"
          name="firstFollowup"
        />
      </div>

      <div>
        <VeeInput
          name="date"
          :label="followupFieldLabels.date"
          type="date"
          required
        />
      </div>

      <div v-if="permissions.fields.numeroPegase">
        <VeeInput
          name="numeroPegase"
          :label="followupFieldLabels.numeroPegase"
          hint="Format attendu : A-00-000000"
        />
      </div>

      <div>
        <VeeSelect
          name="medium"
          :label="followupFieldLabels.medium"
          :options="withEmptyValue(followupMediumOptions)"
          required
        />
      </div>

      <div v-if="permissions.fields.ministre">
        <VeeSelect
          name="ministre"
          :label="followupFieldLabels.ministre"
          :options="withEmptyValue(ministerOptions)"
        />
      </div>

      <div
        v-if="medium === FollowupMedium.ExternalAppointment"
        class="fr-col-12 fr-col-lg-8"
      >
        <VeeInput
          name="place"
          :label="followupFieldLabels.place"
        />
      </div>

      <div v-if="medium === FollowupMedium.ThirdParty">
        <VeeInput
          name="thirdPersonName"
          :label="followupFieldLabels.thirdPersonName"
        />
      </div>

      <div>
        <VeeSearchableSelect
          :label="followupFieldLabels.types"
          name="types"
          :options="followupTypeOptions"
          required
          hint
          multiple
        >
          <template #hint>
            <span class="fr-icon-information-line fr-fi--sm">
              <NuxtLink
                v-if="permissions.actions.editStructure"
                :to="RoutePath.AppStructureEdit()"
                target="_self"
              >
                Personnaliser les objets des entretiens de ma structure.
              </NuxtLink>
              <template v-else>
                Les responsables de votre structure peuvent personnaliser ces
                objets des entretiens.
              </template>
            </span>
          </template>
        </VeeSearchableSelect>
      </div>

      <div>
        <VeeSearchableSelect
          :label="followupFieldLabels.prescribingOrganizationId"
          name="prescribingOrganizationId"
          :options="withEmptyValue(prescribingOrganizationOptions)"
          :can-create-new-option="
            permissions.actions.createPrescribingOrganization
          "
        />
      </div>

      <div>
        <VeeSelect
          name="status"
          :label="followupFieldLabels.status"
          :options="followupStatusOptions"
          required
        />
      </div>

      <div>
        <VeeInput
          name="dueDate"
          :label="followupFieldLabels.dueDate"
          type="date"
        />
      </div>

      <div class="fr-col-12">
        <VeeTextarea
          class="large-textarea"
          name="synthesis"
          :label="followupFieldLabels.synthesis"
        />
      </div>

      <div
        v-if="permissions.fields.privateSynthesis"
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

          <template v-if="permissions.fields.classified">
            <div class="fr-fieldset__element fr-fieldset__element--inline">
              <VeeCheckbox
                name="classified"
                :label="followupFieldLabels.classified"
              />
            </div>

            <div
              v-if="permissions.fields.forwardedToJustice"
              class="fr-fieldset__element fr-fieldset__element--inline"
            >
              <VeeCheckbox
                name="forwardedToJustice"
                :label="followupFieldLabels.forwardedToJustice"
              />
            </div>

            <div
              v-if="permissions.fields.interventions"
              class="fr-fieldset__element fr-mb-0"
            >
              <fieldset
                class="fr-fieldset fr-mb-0"
                aria-labelledby="followup-interventions-legend"
              >
                <legend
                  id="followup-interventions-legend"
                  class="fr-fieldset__legend"
                >
                  {{ followupFieldLabels.interventions }}
                </legend>
                <div
                  v-for="[value, label] in followupInterventionOptions"
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

            <div
              v-if="permissions.fields.signalements"
              class="fr-fieldset__element fr-mb-0"
            >
              <fieldset
                class="fr-fieldset fr-mb-0"
                aria-labelledby="followup-signalements-legend"
              >
                <legend
                  id="followup-signalements-legend"
                  class="fr-fieldset__legend"
                >
                  {{ followupFieldLabels.signalements }}
                </legend>
                <div
                  v-for="[value, label] in followupSignalementOptions"
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
        </fieldset>
      </div>
    </div>

    <BeneficiaryDocumentsSelect
      class="fr-mb-4w"
      :beneficiary-id="beneficiaryId"
      name="documents"
      :label="followupFieldLabels.documents"
      snackbar-success-message="Le document a été ajouté à la fiche bénéficiaire. Enregistrez la synthèse d'entretien pour conserver le lien entre les deux."
    />

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
  import {
    FollowupType,
    PrescribingOrganization,
    FollowupMedium
  } from '@prisma/client'
  import type { FormErrors } from 'vee-validate'
  import { ministerOptions } from '~/client/options/ministry'
  import {
    followupStatusOptions,
    followupMediumOptions,
    followupInterventionOptions,
    followupSignalementOptions
  } from '~/client/options/followup'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { SENSITIVE_DATA_HINT } from '~/utils/constants'
  import { RoutePath } from '~/utils/routing'
  import { followupFieldLabels } from '~/client/labels'
  import { AddFollowupInput, EditFollowupInput } from '~/server/schema'
  import { FollowupFormPermission } from '~/server/route'

  const props = defineProps<{
    isSubmitting: boolean
    followupTypes: Array<FollowupType>
    prescribingOrganizations: Array<PrescribingOrganization>
    beneficiaryId: string
    medium: FollowupMedium
    isRedirected: boolean
    caughtErrors: FormErrors<AddFollowupInput | EditFollowupInput>
    permissions: FollowupFormPermission
  }>()

  const emit = defineEmits<{
    submit: [payload: Event]
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const { errors } = useDisplayFormErrors(
    form,
    toRef(() => props.caughtErrors),
    followupFieldLabels
  )

  const followupTypeOptions = computed(() =>
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
</script>
