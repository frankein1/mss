<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div
          v-if="props.familyFileIdentification.length > 0"
          class="fr-col-12"
        >
          <VeeRadioButtons
            name="beneficiaryId"
            label="Choisir un membre du foyer&nbsp;:"
            :options="beneficiaryOptions"
            :inline="true"
            required
            @change-value="watchBeneficiary($event)"
          />
        </div>

        <template
          v-if="
            selectedBeneficiary === 'other' ||
            props.familyFileIdentification.length === 0
          "
        >
          <div class="fr-col-12">
            <p class="fr-mb-2w">
              <RequiredFields />
            </p>
          </div>
          <div class="fr-col-12">
            <VeeInput
              name="member.lastName"
              :label="relativeFieldLabels.lastName"
              required
            />
          </div>

          <div class="fr-col-12">
            <VeeInput
              name="member.firstName"
              :label="relativeFieldLabels.firstName"
              required
            />
          </div>

          <div class="fr-col-12">
            <VeeSelect
              name="member.relationship"
              :label="relativeFieldLabels.relationship"
              :options="withEmptyValue(taxHouseHoldRelationshipKeys.options)"
              required
            />
          </div>
        </template>
      </div>
    </div>

    <BudgetActions
      class="fr-mt-6w"
      :is-submitting="isSubmitting || !selectedBeneficiary"
      confirm-label="Valider"
      @cancel="modal.close"
    />
  </form>
</template>

<script setup lang="ts">
  import { taxHouseHoldRelationshipKeys } from '~/client/options'
  import { relativeFieldLabels } from '~/client/labels'

  import {
    CreateBudgetIncomeInput,
    createBudgetIncomeSchema
  } from '~/server/schema'
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'

  const props = defineProps<{
    budgetId: string
    isSubmitting: boolean
    familyFileIdentification: BeneficiaryFileIdentification[]
    add: (values: CreateBudgetIncomeInput) => void
  }>()

  // Refs
  const selectedBeneficiary = ref<string | undefined | 'other'>(undefined)

  const modal = useModal()

  const beneficiaryOptions = computed(() => {
    const temp = props.familyFileIdentification.map(m => ({
      label: formatBeneficiaryShortenedName(m),
      value: m.id
    }))
    temp.push({
      label: 'Autre',
      value: 'other'
    })
    return temp
  })

  const { handleSubmit } = useForm<CreateBudgetIncomeInput>({
    validationSchema: toTypedSchema(createBudgetIncomeSchema),
    initialValues: {
      budgetId: props.budgetId
    }
  })

  const watchBeneficiary = (value: string) => {
    selectedBeneficiary.value = value
  }
  const onSubmit = handleSubmit(values => {
    props.add(values)
  })
</script>
