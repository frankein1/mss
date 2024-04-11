<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12">
          <VeeInput
            name="lastName"
            :label="relativeFieldLabels.lastName"
            required
          />
        </div>

        <div class="fr-col-12">
          <VeeInput
            name="firstName"
            :label="relativeFieldLabels.firstName"
            required
          />
        </div>

        <div class="fr-col-12">
          <VeeSelect
            name="relationship"
            :label="relativeFieldLabels.relationship"
            :options="withEmptyValue(taxHouseHoldRelationshipKeys.options)"
            required
          />
        </div>
      </div>
    </div>

    <BudgetActions
      class="fr-mt-6w"
      :is-submitting="isSubmitting"
      confirm-label="Valider"
      @cancel="modal.close"
    />
  </form>
</template>

<script setup lang="ts">
  import { taxHouseHoldRelationshipKeys } from '~/client/options'
  import { relativeFieldLabels } from '~/client/labels'

  import {
    CreateHouseholdMemberInput,
    createHouseholdMemberSchema
  } from '~/server/schema'

  const props = defineProps<{
    beneficiaryId: string
    budgetId: string
    isSubmitting: boolean
    add: (values: CreateHouseholdMemberInput) => void
  }>()

  const modal = useModal()

  const { handleSubmit } = useForm<CreateHouseholdMemberInput>({
    validationSchema: toTypedSchema(createHouseholdMemberSchema),
    initialValues: {
      beneficiaryId: props.beneficiaryId,
      budgetId: props.budgetId
    }
  })

  const onSubmit = handleSubmit(values => {
    props.add(values)
  })
</script>
