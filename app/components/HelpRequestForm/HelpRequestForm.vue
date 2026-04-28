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
      <HelpRequestFormContextSection
        :social-support-subjects="socialSupportSubjects"
        :partner-organizations="partnerOrganizations"
        :is-external-support="isExternalSupport"
        :has-set-external-structure="hasSetExternalStructure"
        :is-housing-support="isHousingSupport"
        :minister-id-error="ministerIdError"
        :support-program-options="supportProgramOptions"
        :support-program-options-disabled="supportProgramOptionsDisabled"
        :has-support-program-names="hasSupportProgramNames"
      />
    </section>

    <section class="feature-section fr-p-6v fr-p-md-8v fr-mb-4v">
      <HelpRequestFormInfoSection
        :status="status"
        :has-set-external-structure="hasSetExternalStructure"
        :is-external-support="isExternalSupport"
        :subject="subject"
      />
    </section>

    <section
      v-if="isHousingSupport"
      class="feature-section fr-p-6v fr-p-md-8v fr-mb-4v"
    >
      <HelpRequestFormHousingSection />
    </section>

    <section class="feature-section fr-p-6v fr-p-md-8v fr-mb-4v">
      <HelpRequestFormSynthesisSection
        :can-edit-private-synthesis="canEditPrivateSynthesis"
      />
    </section>

    <section class="feature-section fr-p-6v fr-p-md-8v fr-mb-4v">
      <HelpRequestFormDocumentSection
        :family-file-id="familyFileId || ''"
        :beneficiary-id="beneficiaryId || ''"
      />
      <VeeCheckbox
        class="fr-mt-6v"
        name="fullFile"
        :label="helpRequestFieldLabels.fullFile"
      />
    </section>

    <section class="feature-section fr-p-6v fr-p-md-8v fr-mb-4v">
      <h3 class="fr-h4">Réorientations</h3>
      <RedirectionForm
        :partner-organization-options
        :partner-organizations="partnerOrganizations"
        :edition-mode
      />
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
            :disabled="isSubmitting"
            :data-submitting="isSubmitting"
          >
            Enregistrer
          </button>
        </li>
      </ul>
    </section>
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
  } from '~~/client/labels'
  import type {
    CreateHelpRequestInput,
    EditHelpRequestInput
  } from '~~/server/schema'
  import { useDisplayFormErrors } from '~/composables/useDisplayFormErrors'
  import type { PartnerOrganizationIdName } from '~~/types/partner'
  import type { BeneficiaryFileIdentification } from '~~/types/beneficiary'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'
  import { formatSupportProgramOption } from '~/utils/beneficiary/formatSupportProgramOption'
  import { routes } from '~/utils/routes'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'

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

  const form = useTemplateRef('form')

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
  const { setValue: setSupportProgramId } = useField<string | null>(
    'supportProgramId'
  )
  const { value: familyFileId } = useField<string | null>('familyFileId')

  const trpcClient = useTrpcClient()
  const { hasSupportProgramNames } = await useHasSupportProgramNames()

  const { data: supportProgramsData } =
    await trpcClient.supportProgram.getForBeneficiary.useQuery(
      toRef(() => ({ beneficiaryId: beneficiaryId.value ?? '' }))
    )
  const supportProgramOptions = computed(() =>
    (supportProgramsData.value ?? []).map(formatSupportProgramOption)
  )
  const supportProgramOptionsDisabled = computed(
    () => supportProgramOptions.value.length === 0
  )

  watch(beneficiaryId, () => {
    setSupportProgramId(null)
  })
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

  const partnerOrganizationOptions = computed(() => {
    const partnerOrganizationsWithStringId = props.partnerOrganizations.map(
      ({ id, ...rest }) => ({
        id: String(id),
        ...rest
      })
    )
    return toOptions(partnerOrganizationsWithStringId, 'id', 'name')
  })
</script>

<style scoped lang="scss">
  .helprequestform__divider {
    width: 100%;
    margin: 2rem 0 1rem;
  }

  :deep(.fr-col-12 .fr-fieldset) {
    margin-bottom: -1rem;
  }

  :deep(h3) {
    color: var(--primary);
  }
</style>
