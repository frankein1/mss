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
      class="feature-section fr-p-5w fr-mb-2w"
    >
      <div class="fr-grid-row">
        <VeeRadioButtons
          class="fr-col-12 fr-mb-0"
          name="beneficiaryId"
          label="Bénéficiaire concerné par le suivi :"
          :options="beneficiaryOptions"
          :inline="true"
          required
        />
      </div>
    </section>

    <div class="feature-section fr-p-5w">
      <div
        class="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom fr-grid-row--center"
      >
        <HelpRequestFormContextSection
          :social-support-subjects="socialSupportSubjects"
          :partner-organizations="partnerOrganizations"
          :is-external-support="isExternalSupport"
          :has-set-external-structure="hasSetExternalStructure"
          :is-housing-support="isHousingSupport"
        />

        <hr class="helprequestform__divider" />

        <HelpRequestFormInfoSection
          :status="status"
          :has-set-external-structure="hasSetExternalStructure"
          :is-external-support="isExternalSupport"
          :subject="subject"
        />

        <HelpRequestFormHousingSection
          v-if="isHousingSupport"
          :beneficiary-id="beneficiaryId || ''"
        />

        <hr
          v-else
          class="helprequestform__divider"
        />

        <HelpRequestFormSynthesisSection
          :can-edit-private-synthesis="canEditPrivateSynthesis"
        />

        <hr class="helprequestform__divider" />

        <HelpRequestFormDocumentSection
          :family-file-id="familyFileId || ''"
          :beneficiary-id="beneficiaryId || ''"
        />

        <div class="fr-col-12">
          <VeeCheckbox
            name="fullFile"
            :label="helpRequestFieldLabels.fullFile"
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
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
  import {
    SocialSupportSubject,
    SocialSupportStatus,
    FileInstructionType
  } from '@prisma/client'
  import type { FormErrors } from 'vee-validate'
  import {
    helpRequestFieldLabels,
    housingHelpRequestFieldLabels
  } from '~/client/labels'
  import { CreateHelpRequestInput, EditHelpRequestInput } from '~/server/schema'
  import { useDisplayFormErrors } from '~/composables/useDisplayFormErrors'
  import { PartnerOrganizationIdName } from '~/types/partner'
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'

  const props = withDefaults(
    defineProps<{
      isSubmitting: boolean
      socialSupportSubjects?: SocialSupportSubject[]
      partnerOrganizations: PartnerOrganizationIdName[]
      familyFileIdentification: BeneficiaryFileIdentification[]
      canEditPrivateSynthesis?: boolean
      caughtErrors: FormErrors<CreateHelpRequestInput | EditHelpRequestInput>
      subject: FileInstructionType
      editionMode?: boolean
    }>(),
    {
      canEditPrivateSynthesis: true,
      socialSupportSubjects: () => [],
      prescribingOrganizations: () => [],
      editionMode: false
    }
  )

  const form = ref<HTMLFormElement | null>(null)

  const { errors } = useDisplayFormErrors(
    form,
    toRef(() => props.caughtErrors),
    { ...helpRequestFieldLabels, ...housingHelpRequestFieldLabels }
  )

  const emit = defineEmits<{
    submit: [payload: Event]
  }>()

  const { value: beneficiaryId } = useField<string | null>('beneficiaryId')
  const { value: familyFileId } = useField<string | null>('familyFileId')
  const { value: status } = useField<SocialSupportStatus>('status')
  const { value: externalStructure } = useField<'true' | 'false' | undefined>(
    'externalStructure'
  )

  const hasSetExternalStructure = computed(
    () => externalStructure.value !== undefined
  )

  const isExternalSupport = computed(() => externalStructure.value === 'true')
  const isHousingSupport = computed(() => props.subject === 'Housing')

  const beneficiaryOptions = computed(() =>
    props.familyFileIdentification.map(m => ({
      label: formatBeneficiaryShortenedName(m),
      value: m.id
    }))
  )
</script>

<style scoped lang="scss">
  .helprequestform__divider {
    width: calc(100% - 1.5rem);
    margin: 0.75rem 0 -0.75rem;
  }

  :deep(.fr-col-12 .fr-fieldset) {
    margin-bottom: -1rem;
  }
</style>
