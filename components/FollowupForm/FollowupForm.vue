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
    <section
      v-if="!editionMode && familyFileIdentification.length > 1"
      class="feature-section fr-p-6v fr-p-md-8v fr-mb-4v"
    >
      <VeeRadioButtons
        class="fr-col-12 fr-mb-0"
        name="beneficiaryId"
        label="Bénéficiaire concerné par le suivi :"
        :options="beneficiaryOptions"
        :inline="true"
        required
      />
    </section>

    <section class="feature-section fr-p-6v fr-p-md-8v fr-mb-4v">
      <h2 class="fr-h4">Contexte de la synthèse d'entretien</h2>
      <div
        class="fr-grid-row fr-grid-row--gutters form-grid fr-grid-row--bottom"
      >
        <div class="fr-col-12">
          <div class="btn-container">
            <VeeCheckbox
              :label="followupFieldLabels.firstFollowup"
              name="firstFollowup"
            />
            <VeeCheckbox
              name="endOfSocialSupport"
              :label="followupFieldLabels.endOfSocialSupport"
            />
            <VeeCheckbox
              name="isDuringWalkInSession"
              :label="followupFieldLabels.isDuringWalkInSession"
            />
          </div>
        </div>

        <!-- ROW -->
        <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
          <VeeInput
            name="date"
            :label="followupFieldLabels.date"
            type="date"
            required
          />
        </div>

        <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
          <VeeSelect
            name="duration"
            :label="followupFieldLabels.duration"
            :options="withEmptyValue(followupDurationKeys.options)"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
          <VeeSelect
            name="medium"
            :label="followupFieldLabels.medium"
            :options="withEmptyValue(followupMediumKeys.options)"
            required
          />
        </div>

        <template v-if="application.module.ministere">
          <div class="fr-col-12">
            <VeeInput
              name="numeroPegase"
              :label="followupFieldLabels.numeroPegase"
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

        <div
          v-if="medium === FollowupMedium.ExternalAppointment"
          class="fr-col-12 fr-col-md-6"
        >
          <VeeInput
            name="place"
            :label="followupFieldLabels.place"
          />
        </div>
        <div
          v-else-if="medium === FollowupMedium.ThirdParty"
          class="fr-col-12 fr-col-md-6"
        >
          <VeeInput
            name="thirdPersonName"
            :label="followupFieldLabels.thirdPersonName"
          />
        </div>
        <div
          v-else
          class="fr-col-12 fr-col-md-6"
        ></div>

        <div class="fr-col-12">
          <MultiSelect
            name="subjects"
            :label="followupFieldLabels.subjects"
            :options="socialSupportSubjectOptions"
            required
          />
        </div>

        <div class="fr-col-12 fr-mt-0 fr-pt-0">
          <NuxtLink
            v-if="application.edit.structure"
            :to="routes.structure.AppStructureCustomObjects.path()"
            class="fr-link fr-icon-info-fill fr-fi--sm fr-link--icon-left"
            @click="
              matomo.trackEvent(
                EventCategory.FollowupForm,
                FollowupFormAction.SocialSupportSubjectLink
              )
            "
          >
            Je personnalise les objets d'accompagnement de ma structure
          </NuxtLink>
          <template v-else>
            Les responsables de votre structure peuvent personnaliser les objets
            d'accompagnement.
          </template>
        </div>

        <div class="fr-col-12 fr-col-md-6">
          <VeeSelect
            name="status"
            :label="followupFieldLabels.status"
            :options="followupStatusKeys.options"
            required
          />
        </div>

        <div class="fr-col-12 fr-col-md-6">
          <VeeInput
            name="dueDate"
            :label="followupFieldLabels.dueDate"
            hint="Notification le jour de l'échéance et à J-30."
            type="date"
          />
        </div>

        <div class="fr-col-12 fr-col-md-6">
          <VeeCombobox
            :label="followupFieldLabels.prescribingOrganizationId"
            placeholder="Saisir le nom de l'organisme"
            name="prescribingOrganizationId"
            :options="withEmptyValue(partnerOrganizationOptions)"
            @change-value="onPrescribingOrganization"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <VeeSelect
            name="prescribingOrganizationContactId"
            :disabled="organizationContactIsDisabled"
            :label="followupFieldLabels.prescribingOrganizationContactId"
            :options="withEmptyValue(prescribingOrganizationContactOptions)"
          />
        </div>

        <div class="fr-col-12 fr-col-md-6 fr-mt-0 fr-pt-0">
          <NuxtLink
            :to="routes.structure.AppPartners.path()"
            class="fr-link fr-icon-info-fill fr-link--icon-left"
            @click="
              matomo.trackEvent(
                EventCategory.FollowupForm,
                FollowupFormAction.PartnersLink
              )
            "
          >
            Données issues de l'annuaire de partenaires
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="feature-section fr-p-6v fr-p-md-8v fr-mb-4v">
      <h2 class="fr-h4">Notes</h2>
      <div
        class="fr-grid-row fr-grid-row--gutters form-grid fr-grid-row--bottom"
      >
        <div class="fr-col-12">
          <AtomTextEditor
            name="synthesis"
            :initial-value="synthesisRichTextValue || null"
            :initial-raw-value="synthesis"
            :label="followupFieldLabels.synthesis"
            @update="onUpdateSynthesis"
          >
            <template #hint>
              Il est fortement recommandé de ne stocker que les informations
              utiles au suivi du bénéficiaire et d'éviter le recueil
              d'informations sensibles (données de santé, mots de passe, etc).
            </template>
          </AtomTextEditor>
        </div>

        <!-- ROW -->
        <div
          v-if="canSetPrivateSynthesis"
          class="fr-col-12"
        >
          <AtomTextEditor
            name="privateSynthesis"
            :initial-value="privateSynthesisRichTextValue || null"
            :initial-raw-value="privateSynthesis"
            :label="followupFieldLabels.privateSynthesis"
            label-icon="fr-icon-lock-line"
            :min-height="120"
            @update="onUpdatePrivateSynthesis"
          >
            <template #hint>
              Le compte rendu privé est uniquement visible et modifiable par
              l'agent qui crée la synthèse d'entretien.<br />{{
                SENSITIVE_DATA_HINT
              }}
            </template>
          </AtomTextEditor>
        </div>
      </div>
    </section>

    <section class="feature-section fr-p-6v fr-p-md-8v fr-mb-4v">
      <h2 class="fr-h4">Documents</h2>

      <BeneficiaryDocumentsSelect
        :family-file-id="familyFileId || ''"
        :beneficiary-id="beneficiaryId || ''"
        name="documents"
        snackbar-success-message="Le document a été ajouté à la fiche bénéficiaire. Enregistrez la synthèse d'entretien pour conserver le lien entre les deux."
      />
    </section>

    <section class="feature-section fr-p-6v fr-p-md-8v fr-mb-4v">
      <h2 class="fr-h4">Réorientations</h2>
      <div
        class="fr-grid-row fr-grid-row--gutters form-grid fr-grid-row--bottom"
      >
        <div class="fr-col-12">
          <RedirectionForm
            :partner-organization-options
            :partner-organizations
          />
        </div>
        <div class="fr-col-12">
          <fieldset
            id="followup-actions"
            class="fr-fieldset"
            aria-labelledby="followup-actions-legend"
          >
            <legend
              id="followup-actions-legend"
              class="fr-fieldset__legend--regular fr-fieldset__legend"
            >
              Actions entreprises
            </legend>
            <div class="fr-fieldset__element fr-fieldset__element--inline">
              <div class="fr-checkbox-group">
                <VeeCheckbox
                  name="helpRequested"
                  :label="followupFieldLabels.helpRequested"
                />
              </div>
            </div>
            <div
              v-if="application.module.ministere"
              class="fr-fieldset__element fr-fieldset__element--inline"
            >
              <div class="fr-checkbox-group">
                <VeeCheckbox
                  name="classified"
                  :label="followupFieldLabels.classified"
                />
              </div>
            </div>
            <div
              v-if="application.module.ministere"
              class="fr-fieldset__element fr-fieldset__element--inline"
            >
              <div class="fr-checkbox-group">
                <VeeCheckbox
                  name="forwardedToJustice"
                  :label="followupFieldLabels.forwardedToJustice"
                />
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </section>

    <section class="fr-mt-4v fr-mb-4v">
      <ul
        class="fr-btns-group fr-btns-group--inline fr-btns-group--lg fr-btns-group--right"
      >
        <li>
          <NuxtLink
            class="fr-btn fr-btn--secondary"
            :to="
              familyFileId && beneficiaryId
                ? routes.file.AppFile.path(familyFileId, {
                    beneficiaryId,
                    tab: BeneficiaryTab.History
                  })
                : '/'
            "
          >
            Annuler
          </NuxtLink>
        </li>
        <li>
          <button
            class="fr-btn submit-btn"
            type="submit"
            :data-submitting="isSubmitting"
            :disabled="isSubmitting"
          >
            Enregistrer
          </button>
        </li>
      </ul>
    </section>
  </form>
</template>

<script lang="ts" setup>
  import type { SocialSupportSubject } from '@prisma/client'
  import { FollowupMedium } from '@prisma/client'
  import type { FormErrors } from 'vee-validate'
  import type { JSONContent } from '@tiptap/vue-3'
  import {
    followupStatusKeys,
    followupMediumKeys,
    followupDurationKeys
  } from '~/client/options'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { SENSITIVE_DATA_HINT } from '~/utils/constants'
  import { routes } from '~/utils/routes'
  import { followupFieldLabels } from '~/client/labels'
  import type { AddFollowupInput, EditFollowupInput } from '~/server/schema'
  import type { PartnerOrganizationIdName } from '~/types/partner'
  import type { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'
  import { cleanEmptyParagraph } from '~/utils/text/cleanEmptyParagraph'
  import { EventCategory, FollowupFormAction } from '~/types/matomo'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'

  const props = withDefaults(
    defineProps<{
      isSubmitting: boolean
      socialSupportSubjects: Array<SocialSupportSubject>
      partnerOrganizations: Array<PartnerOrganizationIdName>
      familyFileIdentification: BeneficiaryFileIdentification[]
      medium: FollowupMedium
      canSetPrivateSynthesis?: boolean
      caughtErrors: FormErrors<AddFollowupInput | EditFollowupInput>
      editionMode?: boolean
    }>(),
    { canSetPrivateSynthesis: true, editionMode: false }
  )

  const { application } = usePermissions()
  const matomo = useMatomo()

  const emit = defineEmits<{
    submit: [payload: Event]
  }>()

  const form = useTemplateRef('form')

  const { value: beneficiaryId } = useField<string | null>('beneficiaryId')
  const { value: familyFileId } = useField<string | null>('familyFileId')
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
  const { setValue: setSynthesis, value: synthesis } = useField<
    string | undefined
  >('synthesis')
  const { setValue: setSynthesisRichText, value: synthesisRichTextValue } =
    useField<string | undefined>('synthesisRichText')
  const onUpdateSynthesis = (
    html: string | undefined,
    json: JSONContent | undefined,
    rawText: string | undefined
  ) => {
    setSynthesis(cleanEmptyParagraph(rawText))
    setSynthesisRichText(JSON.stringify(json))
  }
  const { setValue: setPrivateSynthesis, value: privateSynthesis } = useField<
    string | undefined
  >('privateSynthesis')
  const {
    setValue: setPrivateSynthesisRichText,
    value: privateSynthesisRichTextValue
  } = useField<string | undefined>('privateSynthesisRichText')

  const onUpdatePrivateSynthesis = (
    html: string | undefined,
    json: JSONContent | undefined,
    rawText: string | undefined
  ) => {
    setPrivateSynthesis(cleanEmptyParagraph(rawText))
    setPrivateSynthesisRichText(JSON.stringify(json))
  }

  const { errors } = useDisplayFormErrors(
    form,
    toRef(() => props.caughtErrors),
    followupFieldLabels
  )
  const ministerIdError = computed(() => {
    const res = errors.value?.find(e => e.name === 'ministerId')
    if (!res) {
      return undefined
    }
    return res
  })

  const beneficiaryOptions = computed(() =>
    props.familyFileIdentification.map(m => ({
      label: formatBeneficiaryShortenedName(m),
      value: m.id
    }))
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

  // Minister combobox
  const { setValue: setMinisterId, value: initialMinisterId } = useField<
    string | undefined
  >('ministerId')

  const onSetMinisterId = (id: string) => {
    setMinisterId(id, true)
  }
</script>

<style lang="scss" scoped>
  h2 {
    color: var(--primary);
  }

  .feature-section {
    *:last-child {
      margin-bottom: 0;
    }
  }
</style>
