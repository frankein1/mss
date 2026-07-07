<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-container beneficiary-short-form-container">
      <div class="fr-p-3v">
        <BeneficiaryFormFileInformation :agents />

        <section
          class="fr-grid-row fr-grid-row--gutters feature-section fr-p-7v fr-mb-7v"
        >
          <h2 class="fr-col-12 fr-text--md formgroup__title fr-mb-0">
            Identité du bénéficiaire
          </h2>
          <div class="fr-col-12 fr-col-lg-6">
            <VeeSelect
              name="gender"
              :label="beneficiaryFieldLabels.gender"
              :options="withEmptyValue(beneficiaryGenderKeys.options)"
            />
          </div>
          <div class="fr-col-12 fr-col-lg-6">
            <VeeRadioButtons
              class="fr-mb-0"
              name="title"
              :label="beneficiaryFieldLabels.title"
              :options="beneficiaryTitleKeys.options"
            />
          </div>
          <div class="fr-col-12 fr-col-lg-6">
            <VeeInput
              name="usualName"
              :label="beneficiaryFieldLabels.usualName"
            />
          </div>
          <div class="fr-col-12 fr-col-lg-6">
            <VeeInput
              name="birthName"
              :label="beneficiaryFieldLabels.birthName"
            />
          </div>
          <div class="fr-col-12 fr-col-lg-6">
            <VeeInput
              name="firstName"
              :label="beneficiaryFieldLabels.firstName"
            />
          </div>
          <div class="fr-col-12 fr-col-lg-6">
            <VeeInput
              name="birthDate"
              :label="beneficiaryFieldLabels.birthDate"
              type="date"
            />
          </div>
          <BeneficiaryFormSimilarAlert
            v-model:similar-beneficiary="similarBeneficiary"
            :usual-name="controlledValues.usualName"
            :birth-name="controlledValues.birthName"
            :first-name="controlledValues.firstName"
            :birth-date="controlledValues.birthDate"
          />
          <h2 class="fr-col-12 fr-text--md formgroup__title fr-mb-0 fr-mt-1w">
            Coordonnées
          </h2>
          <div class="fr-col-12 fr-col-lg-6">
            <VeeInput
              name="phone1"
              :label="beneficiaryFieldLabels.phone1"
              type="tel"
            />
          </div>
          <div class="fr-col-12 fr-col-lg-6">
            <VeeInput
              name="email"
              :label="beneficiaryFieldLabels.email"
              type="email"
            />
          </div>
          <div class="fr-col-12">
            <VeeAddressInput
              name="street"
              :label="beneficiaryFieldLabels.street"
              :zip-code="zipcode"
              hint="Numéro et voie"
              @address-selected="onSelected"
            />
          </div>
          <div
            v-if="qpv"
            class="fr-col-12"
          >
            <AtomAlert
              :alert-type="AlertType.Info"
              message="Quartier Prioritaire de la Ville"
            >
              <template #detailedMessage>
                <p>
                  Un QPV a été détecté à cette adresse :
                  <span class="fr-text--bold"
                    >&laquo;&nbsp;{{ qpv.nom }}&nbsp;&raquo;</span
                  >. Si nécessaire, vous pouvez reporter ces informations dans
                  les champs ci-dessous.
                </p>
              </template>
            </AtomAlert>
          </div>

          <div class="fr-col-12 fr-col-md-3">
            <VeeInput
              name="zipcode"
              :label="beneficiaryFieldLabels.zipcode"
              @change-value="setFieldValue('zipcode', $event)"
            />
          </div>
          <div class="fr-col-12 fr-col-md-9">
            <VeeCityInput
              name="city"
              :label="beneficiaryFieldLabels.city"
              :zip-code="zipcode"
              @city-selected="onCitySelected"
            />
          </div>

          <div class="fr-col-12">
            <VeeInput
              name="district"
              :label="beneficiaryFieldLabels.district"
            />
          </div>
          <div class="fr-col-12">
            <VeeCheckbox
              name="qpv"
              :label="beneficiaryFieldLabels.qpv"
            />
          </div>

          <!-- masqué -->
          <div class="fr-col-12 fr-hidden">
            <VeeDepartmentInput
              name="department"
              :label="beneficiaryFieldLabels.department"
            />
          </div>
          <div class="fr-col-12 fr-hidden">
            <VeeRegionInput
              name="region"
              :label="beneficiaryFieldLabels.region"
            />
          </div>
          <!-- masqué -->
          <div
            v-if="application.module.ministere"
            class="fr-col-12 fr-col-lg-6"
          >
            <VeeInput
              name="numeroPegase"
              :label="beneficiaryFieldLabels.numeroPegase"
              hint="Format attendu : A-00-000000"
            />
          </div>
        </section>
      </div>
    </div>

    <AtomActionsBar class="sticky">
      <ul
        class="fr-btns-group fr-btns-group--inline-sm fr-btns-group--lg fr-btns-group--right"
      >
        <li>
          <button
            class="fr-btn fr-btn--secondary"
            type="button"
            :disabled="isSubmitting"
            @click="emit('cancel')"
          >
            Annuler
          </button>
        </li>
        <li>
          <button
            class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-edit-line"
            type="submit"
            :disabled="isSubmitting"
            :data-submitting="isSubmitting"
            @click="complete = true"
          >
            Enregistrer et compléter
          </button>
        </li>
        <li>
          <button
            class="fr-btn"
            type="submit"
            :disabled="isSubmitting"
            :data-submitting="isSubmitting"
            @click="complete = false"
          >
            Enregistrer
          </button>
        </li>
      </ul>
    </AtomActionsBar>
  </form>
</template>

<script setup lang="ts">
  import { BeneficiaryStatus, BeneficiaryTitle, Gender } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import type { BeneficiaryReferent } from '~/types/beneficiary'
  import type { AddressSelected } from '~/components/VeeForm/types'
  import type { CreateBeneficiaryInput } from '~/server/schema'
  import { createBeneficiarySchema } from '~/server/schema'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import type { SimilarBeneficiary } from '~/server/trpc/routers'
  import { beneficiaryGenderKeys, beneficiaryTitleKeys } from '~/client/options'
  import {
    useQpvResolution,
    type QpvFeatureProperties
  } from '~/composables/useQpvResolution'
  import { AlertType } from '~/utils/constants/alert'

  defineProps<{
    isSubmitting: boolean
    agents: BeneficiaryReferent[]
  }>()

  const emit = defineEmits<{
    saveBeneficiary: [beneficiary: CreateBeneficiaryInput, complete: boolean]
    cancel: []
  }>()

  const complete = ref<boolean>(false)
  const form = useTemplateRef('form')
  const similarBeneficiary = ref<SimilarBeneficiary>(undefined)

  const { application } = usePermissions()

  const { handleSubmit, setFieldValue, controlledValues } =
    useForm<CreateBeneficiaryInput>({
      validationSchema: toTypedSchema(createBeneficiarySchema),
      initialValues: {
        status: BeneficiaryStatus.Active
      }
    })

  // It does not use useForm meta as the dirty state of the referents field is ignored
  const isFormDirty = computed(() =>
    Object.entries(controlledValues.value).reduce((isDirty, [key, value]) => {
      if (key === 'status' || key === 'referents') {
        return isDirty
      }
      return isDirty || value !== undefined
    }, false)
  )

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const modal = useModal()
  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      isNavigatingWithFormActions.value = true
      if (similarBeneficiary.value) {
        useBeneficiaryFormSimilarModal(modal, similarBeneficiary.value, () =>
          emit('saveBeneficiary', values, complete.value)
        )
        return
      }

      emit('saveBeneficiary', values, complete.value)
    }
  )

  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    beneficiaryFieldLabels
  )

  const zipcode = computed(() => controlledValues.value.zipcode)

  watch(
    () => controlledValues.value.gender,
    newGender => {
      if (controlledValues.value.title) {
        return
      }
      if (newGender === Gender.Female) {
        setFieldValue('title', BeneficiaryTitle.Miss)
      } else if (newGender === Gender.Male) {
        setFieldValue('title', BeneficiaryTitle.Mister)
      }
    }
  )

  const { onCitySelected, onAddressSelected } = useAddressFields({
    setCityValue: (value: string) => setFieldValue('city', value),
    setZipcodeValue: (value: string) => setFieldValue('zipcode', value),
    setRegionValue: (value: string) => setFieldValue('region', value),
    setDepartmentValue: (value: string) => setFieldValue('department', value)
  })

  const { resolveQpv } = useQpvResolution()

  const qpv = ref<QpvFeatureProperties | null>(null)
  const isSelectingAddress = ref(false)

  // Guards against out-of-order resolveQpv responses: if the user picks a
  // new address before a previous lookup resolves, only the response
  // matching the latest count is allowed to update qpv.
  let qpvRequestCount = 0

  async function onSelected(address: AddressSelected) {
    isSelectingAddress.value = true
    onAddressSelected(address)

    const requestCount = ++qpvRequestCount
    try {
      const result = await resolveQpv(address.coordinates)
      if (requestCount === qpvRequestCount) {
        qpv.value = result
      }
    } catch {
      if (requestCount === qpvRequestCount) {
        qpv.value = null
      }
    }
  }

  // This watcher clears a stale QPV resolution when the user edits the
  // address by hand instead of picking a suggestion from the autocomplete.
  watch(
    () => controlledValues.value.street,
    () => {
      if (isSelectingAddress.value) {
        isSelectingAddress.value = false
        return
      }
      qpv.value = null
    }
  )
</script>

<style scoped>
  .beneficiary-short-form-container {
    max-width: 58rem;
  }

  .sticky {
    position: sticky;
    bottom: 0;
  }

  .formgroup__title {
    font-weight: bold;
  }

  /* overide fr-btn-group rules on button with icon */
  .fr-btn--icon-left {
    max-width: 100% !important;
    padding: 0.5rem 1rem !important;

    &::before {
      --icon-size: 1.5rem !important;

      margin-left: 0.5rem !important;
      margin-right: 0.5rem !important;
    }
  }

  .complete-callout {
    width: 100%;
  }
</style>
