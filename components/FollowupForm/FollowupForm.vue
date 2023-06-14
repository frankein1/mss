<template>
  <form
    class="fr-container--fluid"
    @submit="emit('submit', $event)"
  >
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <VeeCheckbox
        class="fr-col-12"
        :label="followupFieldLabels.firstFollowup"
        name="firstFollowup"
      />

      <VeeInput
        name="date"
        :label="followupFieldLabels.date"
        type="date"
        required
      />

      <VeeInput
        v-if="isMinistryAgent"
        name="numeroPegase"
        :label="followupFieldLabels.numeroPegase"
      />

      <VeeSelect
        name="medium"
        :label="followupFieldLabels.medium"
        :options="withEmptyValue(followupMediumOptions)"
        required
      />

      <VeeSelect
        v-if="isMinistryAgent"
        name="ministre"
        :label="followupFieldLabels.ministre"
        :options="withEmptyValue(ministerOptions)"
      />

      <VeeInput
        v-if="medium === FollowupMedium.ExternalAppointment"
        class="fr-col-12 fr-col-lg-8"
        name="place"
        :label="followupFieldLabels.place"
      />

      <VeeInput
        v-if="medium === FollowupMedium.ThirdParty"
        name="thirdPersonName"
        :label="followupFieldLabels.thirdPersonName"
      />

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
              v-if="canEditStructure"
              :to="RoutePath.StructureEdit()"
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

      <VeeSearchableSelect
        :label="followupFieldLabels.prescribingOrganizationId"
        name="prescribingOrganizationId"
        :options="withEmptyValue(prescribingOrganizationOptions)"
        :can-create-new-option="canCreateOrganisme"
      />

      <VeeSelect
        name="status"
        :label="followupFieldLabels.status"
        :options="followupStatusOptions"
        required
      />

      <VeeInput
        name="dueDate"
        :label="followupFieldLabels.dueDate"
        type="date"
      />

      <VeeTextarea
        class="fr-col-12 large-textarea"
        name="synthesis"
        :label="followupFieldLabels.synthesis"
      />

      <VeeTextarea
        v-if="canSetPrivateSynthesis"
        class="fr-col-12"
        name="privateSynthesis"
        :label="followupFieldLabels.privateSynthesis"
        label-icon="fr-icon-lock-line"
        hint
      >
        <template #hint>
          Le compte rendu privé est uniquement visible et modifiable par l'agent
          qui crée la synthèse d'entretien.<br />{{ SENSITIVE_DATA_HINT }}
        </template>
      </VeeTextarea>

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

        <template v-if="isMinistryAgent">
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

          <div class="fr-fieldset__element fr-mb-0">
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

          <div class="fr-fieldset__element fr-mb-0">
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

    <BeneficiaryDocumentsSelect
      class="fr-mb-4w"
      :beneficiary-id="beneficiaryId"
      name="documents"
      :label="followupFieldLabels.documents"
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
  import { ministerOptions } from '~/client/options/ministry'
  import {
    followupStatusOptions,
    followupMediumOptions,
    followupInterventionOptions,
    followupSignalementOptions
  } from '~/client/options/followup'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { SENSITIVE_DATA_HINT } from '~/utils/constants'
  import { canCreatePrescribingOrganization } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { RoutePath } from '~/utils/routing'
  import { followupFieldLabels } from '~/client/labels'

  const authStore = useAuthStore()

  const props = withDefaults(
    defineProps<{
      isSubmitting: boolean
      followupTypes: Array<FollowupType>
      prescribingOrganizations: Array<PrescribingOrganization>
      beneficiaryId: string
      medium: FollowupMedium
      isRedirected: boolean
      canSetPrivateSynthesis?: boolean
    }>(),
    { canSetPrivateSynthesis: true }
  )

  const emit = defineEmits<{
    (e: 'submit', payload: Event): void
  }>()

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

  const isMinistryAgent = computed(() => authStore.isMinistryAgent)

  const user = computed(() => authStore.getAuthUser)

  const canEditStructure = computed(() => authStore.isResponsableDeStructure)

  const canCreateOrganisme = computed(() =>
    canCreatePrescribingOrganization(user.value)
  )
</script>
