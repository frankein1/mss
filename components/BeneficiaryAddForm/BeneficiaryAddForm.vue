<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    v-if="!success"
    ref="form"
    novalidate
    class="fr-container fr-p-3v"
    @submit.prevent="onSubmit"
  >
    <fieldset
      class="fr-fieldset form-grid fr-grid-row fr-grid-row--gutters fr-grid-row--bottom fr-mb-4w"
      aria-labelledby="add-benefeciary-legend"
    >
      <div class="fr-col-12">
        <p class="fr-text--xs fr-mb-1w"><RequiredFields /></p>
        <p>
          Les champs suivants sont nécessaires pour ajouter un membre au dossier
          et créer sa fiche. Vous pourrez remplir des informations
          supplémentaires si vous le souhaitez par la suite.
        </p>
      </div>

      <!-- ROW -->
      <div class="fr-col-12 fr-mt-2w">
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
            Confirmer la création
          </button>
        </li>
      </ul>
    </div>
  </form>

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
  import { routes } from '~/utils/routes'

  const modal = useModal()
  const success = useState('success', () => false)
  const newBeneficiaryId = useState(
    'newBeneficiaryId',
    (): string | undefined => undefined
  )
  const form = ref<HTMLFormElement | null>(null)

  const props = defineProps<{
    isSubmitting: boolean // TODO
    familyFileId: string
    add: (values: CreateFamilyFileMemberInput) => Promise<string | undefined>
  }>()

  const { handleSubmit } = useForm<CreateFamilyFileMemberInput>({
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
        modal.setTitle()
        success.value = true
        newBeneficiaryId.value = response
      }
    }
  )
  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    beneficiaryFieldLabels
  )

  const onClose = () => {
    modal.close()
    success.value = false
  }

  const goToFilePage = () => {
    // navigateTo(routes.file.AppFile.path(props.familyFileId))
    refreshNuxtData()
    onClose()
  }
  const goToBeneficiaryForm = () => {
    if (newBeneficiaryId.value) {
      navigateTo(
        routes.beneficiary.AppBeneficiaryEditInfo.path(newBeneficiaryId.value)
      )
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
