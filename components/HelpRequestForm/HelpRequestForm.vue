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
      <HelpRequestFormContextSection
        :social-support-subjects="socialSupportSubjects"
        :partner-organizations="partnerOrganizations"
        :is-external-support="isExternalSupport"
        :has-set-external-structure="hasSetExternalStructure"
        :is-housing-support="isHousingSupport"
        :minister-id-error="ministerIdError"
      />

      <hr class="fr-col-12 helprequestform__divider" />

      <HelpRequestFormInfoSection
        :status="status"
        :has-set-external-structure="hasSetExternalStructure"
        :is-external-support="isExternalSupport"
        :subject="subject"
      />

      <HelpRequestFormHousingSection v-if="isHousingSupport" />

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

      <hr class="helprequestform__divider" />
      <div
        class="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom fr-grid-row--center"
      >
        <div class="fr-col-12">
          <VeeCheckbox
            name="fullFile"
            :label="helpRequestFieldLabels.fullFile"
          />
        </div>
      </div>
      <div
        class="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom fr-grid-row--center"
      >
        <ul
          class="fr-btns-group fr-btns-group--inline fr-btns-group--lg fr-btns-group--right"
        >
          <li>
            <button
              class="fr-btn submit-btn"
              type="submit"
              :disabled="isSubmitting"
              :data-submitting="isSubmitting"
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
  import type {
    SocialSupportSubject,
    SocialSupportStatus,
    FileInstructionType
  } from '@prisma/client'
  import type { FormErrors } from 'vee-validate'
  import {
    helpRequestFieldLabels,
    housingHelpRequestFieldLabels
  } from '~/client/labels'
  import type {
    CreateHelpRequestInput,
    EditHelpRequestInput
  } from '~/server/schema'
  import { useDisplayFormErrors } from '~/composables/useDisplayFormErrors'
  import type { PartnerOrganizationIdName } from '~/types/partner'
  import type { BeneficiaryFileIdentification } from '~/types/beneficiary'
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

  const ministerIdError = computed(() => {
    const res = errors.value?.find(e => e.name === 'ministerId')
    if (!res) {
      return undefined
    }
    return res
  })

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
    width: 100%;
    margin: 2rem 0 1rem;
  }

  :deep(.fr-col-12 .fr-fieldset) {
    margin-bottom: -1rem;
  }
</style>
