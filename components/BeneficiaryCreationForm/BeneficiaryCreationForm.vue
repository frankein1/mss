<template>
  <form @submit="onSubmit">
    <div
      class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-p-2w fr-mt-2w fr-mb-2w bg-color-white"
    >
      <div class="fr-col-6">
        <VeeSelect
          name="status"
          :label="beneficiaryFieldLabels.status"
          :options="beneficiaryStatusOptions"
          required
        />
        <VeeCheckbox
          :label="beneficiaryFieldLabels.aidantConnectAuthorized"
          name="aidantConnectAuthorized"
        />
      </div>
      <div class="fr-col-6">
        <VeeMultiSelect
          name="referents"
          label="Agent(s) référent(s)"
          :options="referentOptions"
          required
          dropdown
          :disabled-options="disabledReferentOptions"
        />
      </div>
    </div>

    <div
      class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-p-2w fr-mt-2w fr-mb-2w bg-color-white"
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

    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-mb-2w">
      <AtomAlert
        class="fr-mt-2w fr-mb-2w"
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
  import { BeneficiaryStatus, UserStatus } from '@prisma/client'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { BeneficiaryReferent } from '~/types/beneficiary'
  import {
    CreateBeneficiaryInput,
    createBeneficiarySchema
  } from '~/server/schema/beneficiary.schema'
  import { AlertType } from '~/utils/constants/alert'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import { beneficiaryStatusOptions } from '~/client/options/beneficiary'
  import { toOptions } from '~/utils/options'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'

  const isMinistryAgent = useMinistryAgent()
  const { matomo } = useMatomo()

  const props = defineProps<{
    isSubmitting: boolean
    agents: BeneficiaryReferent[]
  }>()

  const emit = defineEmits<{
    (
      e: 'saveBeneficiary',
      beneficiary: CreateBeneficiaryInput,
      complete: boolean
    ): void
  }>()

  const complete = ref<boolean>(false)

  const { handleSubmit } = useForm<CreateBeneficiaryInput>({
    validationSchema: toTypedSchema(createBeneficiarySchema),
    initialValues: {
      status: BeneficiaryStatus.Active
    }
  })

  const onSubmit = handleSubmit(values => {
    if (complete.value) {
      matomo.trackEvent(
        EventCategory.CreateBeneficiary,
        CreateBeneficiaryEventAction.Complete
      )
    }
    emit('saveBeneficiary', values, complete.value)
  })

  const referentOptions = computed(() => toOptions(props.agents, 'id', 'name'))

  const disabledReferentOptions = computed(() =>
    props.agents
      .filter(
        (agent: BeneficiaryReferent) => agent.status !== UserStatus.Active
      )
      .map((agent: BeneficiaryReferent) => agent.id)
  )
</script>

<style scoped>
  .formgroup__title {
    font-weight: bold;
  }

  .fr-btns-group {
    align-items: center;
  }
</style>
