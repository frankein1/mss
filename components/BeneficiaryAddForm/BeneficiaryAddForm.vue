<template>
  <div v-if="!success">
    <div class="fr-col-12">
      <p class="fr-text--xs fr-mb-2w"><RequiredFields /></p>
      <p class="fr-mb-2w">
        Vous pourrez remplir ou modifier les informations du dossier par la
        suite.
      </p>
    </div>
    <div class="fr-col-12 fr-mb-2w">
      <DsfrRadioButtonSet
        v-model="addMemberMode"
        :disabled="false"
        inline
        :options="addMemberModeOptions"
        @update:model-value="onAddMemberModeUpdate"
      >
        <template #legend
          ><span class="fr-text--bold">Souhaitez-vous :</span></template
        >
      </DsfrRadioButtonSet>
    </div>
    <div class="fr-col-12 fr-pt-2w">
      <hr class="fr-pb-2w" />
    </div>
    <FormErrors
      v-if="errors.length > 1"
      :errors="errors"
    />
    <form
      v-if="addMemberMode === 'create'"
      ref="form"
      novalidate
      @submit.prevent="onSubmit"
    >
      <fieldset
        class="fr-fieldset form-grid fr-grid-row fr-grid-row--gutters fr-grid-row--bottom fr-mb-6w"
        aria-labelledby="add-benefeciary-legend"
      >
        <!-- ROW -->
        <div class="fr-col-12">
          <VeeSelect
            name="relationship"
            required
            :label="beneficiaryFieldLabels.relationship"
            :options="withEmptyValue(commonRelationshipKeys.options)"
          />
        </div>
        <!-- ROW -->
        <div class="fr-col-12">
          <VeeRadioButtons
            class="fr-mb-0"
            name="title"
            :label="beneficiaryFieldLabels.title"
            :options="beneficiaryTitleKeys.options"
          />
        </div>
        <!-- ROW -->
        <div class="fr-col-12">
          <VeeInput
            name="usualName"
            required
            :label="beneficiaryFieldLabels.usualName"
          />
        </div>
        <!-- ROW -->
        <div class="fr-col-12">
          <VeeInput
            name="firstName"
            :label="beneficiaryFieldLabels.firstName"
          />
        </div>
        <!-- ROW -->
        <div class="fr-col-12">
          <VeeInput
            name="birthDate"
            :label="beneficiaryFieldLabels.birthDate"
            type="date"
          />
        </div>
        <BeneficiaryFormSimilarAlert
          v-model:similar-beneficiary="similarBeneficiary"
          :usual-name="controlledValues.usualName"
          :first-name="controlledValues.firstName"
          :birth-date="controlledValues.birthDate"
        />
      </fieldset>

      <div class="fr-col-12">
        <ul class="fr-btns-group fr-btns-group--inline-md btns-groups">
          <li>
            <button
              class="fr-btn fr-btn--secondary fr-mb-0"
              @click.prevent="onClose"
            >
              Annuler
            </button>
          </li>
          <li>
            <button
              class="fr-btn fr-btn fr-mb-0"
              type="submit"
              :submitting="isSubmitting"
              :disabled="isSubmitting"
            >
              Confirmer
            </button>
          </li>
        </ul>
      </div>
    </form>
    <div v-else>
      <BeneficiaryLinkForm
        :family-file-id="props.familyFileId"
        @go-to-success-page="goToSuccessPage"
        @close="onClose"
      />
    </div>
  </div>
  <BeneficiaryAddSuccess
    v-else
    @go-to-beneficiary="goToFilePage"
    @go-to-beneficiary-form="goToBeneficiaryForm"
  />
</template>

<script setup lang="ts">
  import {
    CreateFamilyFileMemberInput,
    createFamilyFileMemberSchema
  } from '~/server/schema'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import {
    commonRelationshipKeys,
    beneficiaryTitleKeys
  } from '~/client/options'
  import { SimilarBeneficiary } from '~/server/route'
  import { EventCategory, FamilyFileAction } from '~/types/matomo'

  const matomo = useMatomo()
  const modal = useModal()
  const success = useState('success', () => false)
  const newBeneficiaryId = useState(
    'newBeneficiaryId',
    (): string | undefined => undefined
  )
  const form = ref<HTMLFormElement | null>(null)
  const similarBeneficiary = ref<SimilarBeneficiary>(undefined)

  const addMemberModeOptions = [
    {
      label: 'Créer un nouveau bénéficiaire',
      value: 'create',
      matomoEventAction: FamilyFileAction.CreateBeneficiary
    },
    {
      label: 'Lier un bénéficiaire existant',
      value: 'link',
      matomoEventAction: FamilyFileAction.LinkBeneficiary
    }
  ]
  const addMemberMode = ref(addMemberModeOptions[0].value)

  function onAddMemberModeUpdate(val: string | number | boolean) {
    const option = addMemberModeOptions.find(({ value }) => value === val)
    if (option) {
      matomo.trackEvent(EventCategory.FamilyFile, option.matomoEventAction)
    }
  }

  const props = defineProps<{
    isSubmitting: boolean
    familyFileId: string
    add: (values: CreateFamilyFileMemberInput) => Promise<string | undefined>
    editBeneficiary: (beneficiaryId: string) => Promise<void>
  }>()

  const { handleSubmit, controlledValues } =
    useForm<CreateFamilyFileMemberInput>({
      validationSchema: toTypedSchema(createFamilyFileMemberSchema),
      initialValues: {
        familyFileId: props.familyFileId
      }
    })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    async values => {
      const response = await props.add(values)
      if (response) {
        goToSuccessPage(response)
        newBeneficiaryId.value = response
      }
    }
  )
  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    beneficiaryFieldLabels
  )

  const goToSuccessPage = (beneficiaryId?: string) => {
    if (beneficiaryId) {
      newBeneficiaryId.value = beneficiaryId
    }
    modal.setTitle()
    success.value = true
  }

  const onClose = () => {
    modal.close()
    success.value = false
  }

  const goToFilePage = () => {
    onClose()
  }

  const goToBeneficiaryForm = () => {
    if (newBeneficiaryId.value) {
      props.editBeneficiary(newBeneficiaryId.value)
      onClose()
    }
  }

  const stopWatchingIsOpen = watch(modal.isOpen, value => {
    if (!value) {
      success.value = false
    }
  })
  onUnmounted(() => {
    stopWatchingIsOpen()
  })
</script>

<style scoped lang="scss">
  .btns-groups {
    justify-content: flex-end;
  }
</style>
