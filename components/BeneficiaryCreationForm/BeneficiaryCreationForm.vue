<template>
  <form
    class="fr-p-3v"
    @submit="onSubmit"
  >
    <BeneficiaryFormFileInformation :agents="agents" />

    <div
      class="fr-grid-row fr-grid-row--center fr-grid-row--gutters feature-section fr-mb-7v"
    >
      <div class="fr-col-6">
        <div class="formgroup__title fr-pb-2w">Identité du bénéficiaire</div>
        <VeeInput
          name="usualName"
          :label="beneficiaryFieldLabels.usualName"
        />
        <VeeInput
          name="birthName"
          :label="beneficiaryFieldLabels.birthName"
        />
        <VeeInput
          name="firstName"
          :label="beneficiaryFieldLabels.firstName"
        />
        <VeeInput
          name="birthDate"
          :label="beneficiaryFieldLabels.birthDate"
          type="date"
        />
      </div>
      <div class="fr-col-6">
        <div class="formgroup__title fr-pb-2w">Coordonnées</div>
        <VeeInput
          name="phone1"
          :label="beneficiaryFieldLabels.phone1"
          type="tel"
          no-hint
        />
        <VeeInput
          name="email"
          :label="beneficiaryFieldLabels.email"
          type="email"
        />
        <VeeInput
          v-if="isMinistryAgent"
          name="numeroPegase"
          :label="beneficiaryFieldLabels.numeroPegase"
        />
      </div>
    </div>

    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-mb-5w">
      <AtomAlert
        message="Souhaitez-vous ajouter plus d'informations sur ce bénéficiaire ?"
        :alert-type="AlertType.Info"
      >
        <template #detailedMessage
          ><p>
            Renseignez des informations complémentaires concernant le
            bénéficiaire dès maintenant.<br />Vous pourrez également les
            compléter plus tard via sa fiche bénéficiaire.
          </p></template
        >
        <template #action>
          <ul class="fr-btns-group fr-btns-group--icon-left">
            <li>
              <button
                :class="`fr-btn fr-btn--secondary fr-icon-edit-line`"
                type="submit"
                @click="complete = true"
              >
                Compléter
              </button>
            </li>
          </ul>
        </template>
      </AtomAlert>
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
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { BeneficiaryReferent } from '~/types/beneficiary'
  import {
    CreateBeneficiaryInput,
    createBeneficiarySchema
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { beneficiaryFieldLabels } from '~/client/labels'

  const isMinistryAgent = useMinistryAgent()

  defineProps<{
    isSubmitting: boolean
    agents: BeneficiaryReferent[]
  }>()

  const emit = defineEmits<{
    saveBeneficiary: [beneficiary: CreateBeneficiaryInput, complete: boolean]
  }>()

  const complete = ref<boolean>(false)

  const { handleSubmit } = useForm<CreateBeneficiaryInput>({
    validationSchema: toTypedSchema(createBeneficiarySchema),
    initialValues: {
      status: BeneficiaryStatus.Active
    }
  })

  const onSubmit = handleSubmit(values => {
    emit('saveBeneficiary', values, complete.value)
  })
</script>

<style scoped>
  .formgroup__title {
    font-weight: bold;
  }

  .fr-btns-group {
    align-items: center;
  }
</style>
