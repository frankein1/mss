<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    class="fr-p-3v"
    @submit.prevent="onSubmit"
  >
    <BeneficiaryFormFileInformation
      :agents="agents"
      :permissions="permissions"
      no-aidant-connect-authorized
    />

    <div class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-7v">
      <h3 class="fr-col-12 fr-text--md formgroup__title fr-mb-0">
        Identité du bénéficiaire
      </h3>
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
      <BeneficiaryCreationFormSimilarAlert
        v-if="similarBeneficiaries.length"
        :similar-beneficiaries="similarBeneficiaries"
      />
      <h3 class="fr-col-12 fr-text--md formgroup__title fr-mb-0 fr-mt-1w">
        Coordonnées
      </h3>
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
        <VeeAddressInput
          name="street"
          :label="beneficiaryFieldLabels.street"
          :zip-code="zipcode"
          hint="Numéro et voie"
          @address-selected="onAddressSelected"
        />
      </div>
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
    </div>

    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-mb-5w">
      <AtomCallout
        class="complete-callout"
        title="Souhaitez-vous ajouter plus d'informations sur ce bénéficiaire ?"
        :button="{
          label: 'Compléter',
          className: 'fr-btn--secondary',
          icon: 'fr-icon-edit-line',
          onClick: () => {
            complete = true
          }
        }"
      >
        <p>
          Renseignez des informations complémentaires concernant le bénéficiaire
          dès maintenant.
        </p>
        <p>
          Vous pourrez également les compléter plus tard via sa fiche
          bénéficiaire.
        </p>
      </AtomCallout>
    </div>

    <button
      class="fr-btn fr-btn--lg submit-btn"
      type="submit"
      :submitting="isSubmitting"
      :disabled="isSubmitting"
      @click="complete = false"
    >
      Enregistrer
    </button>
  </form>
</template>

<script setup lang="ts">
  import { BeneficiaryStatus } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import BeneficiaryCreationFormSimilarModal from './BeneficiaryCreationFormSimilarModal.vue'
  import { BeneficiaryReferent } from '~/types/beneficiary'
  import {
    CreateBeneficiaryInput,
    createBeneficiarySchema,
    getSimilarBeneficiariesSchema,
    GetSimilarBeneficiariesInput
  } from '~/server/schema'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import { BeneficiaryPermissions } from '~/server/security'
  import { SimilarBeneficiaries } from '~/server/trpc/routers'

  defineProps<{
    isSubmitting: boolean
    permissions: BeneficiaryPermissions
    agents: BeneficiaryReferent[]
  }>()

  const emit = defineEmits<{
    saveBeneficiary: [beneficiary: CreateBeneficiaryInput, complete: boolean]
  }>()

  const complete = ref<boolean>(false)
  const form = ref<HTMLFormElement | null>(null)
  const similarBeneficiaries = ref<SimilarBeneficiaries>([])

  const { application } = usePermissions()

  const { handleSubmit, setFieldValue, controlledValues } =
    useForm<CreateBeneficiaryInput>({
      validationSchema: toTypedSchema(createBeneficiarySchema),
      initialValues: {
        status: BeneficiaryStatus.Active
      }
    })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      if (similarBeneficiaries.value.length) {
        useModal().open({
          title:
            'Attention, un·e bénéficiaire est déjà enregistré·e sous cette identité.',
          contentComponent: BeneficiaryCreationFormSimilarModal,
          contentComponentProps: {
            similarBeneficiaries: similarBeneficiaries.value
          },
          contentComponentEvents: {
            create: () => emit('saveBeneficiary', values, complete.value)
          },
          triggerOpen: true
        })
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

  function isSimilarInputValid(input: {
    usualName: string | null | undefined
    firstName?: string | null | undefined
    birthDate?: Date | null | undefined
  }): input is GetSimilarBeneficiariesInput {
    return getSimilarBeneficiariesSchema.safeParse({
      usualName: input.usualName,
      firstName: input.firstName,
      birthDate: input.birthDate
    }).success
  }

  watch(
    [
      () => controlledValues.value.usualName,
      () => controlledValues.value.firstName,
      () => controlledValues.value.birthDate
    ],
    async ([usualName, firstName, birthDate]) => {
      const input = { usualName, firstName, birthDate }
      if (!isSimilarInputValid(input)) {
        similarBeneficiaries.value = []
        return
      }

      similarBeneficiaries.value =
        await useTrpcClient().beneficiary.getSimilar.query(input)
    }
  )

  const { onCitySelected, onAddressSelected } = useAddressFields({
    setCityValue: (value: string) => setFieldValue('city', value),
    setZipcodeValue: (value: string) => setFieldValue('zipcode', value)
  })
</script>

<style scoped>
  .formgroup__title {
    font-weight: bold;
  }

  .fr-btns-group {
    align-items: center;
  }

  .complete-callout {
    width: 100%;
  }
</style>
