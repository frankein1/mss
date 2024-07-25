<template>
  <!-- add form errors-->
  <form
    v-if="!success"
    ref="form"
    novalidate
    class="fr-container fr-p-3v"
    @submit.prevent="onSubmit"
  >
    <div
      class="form-grid fr-grid-row fr-grid-row--gutters fr-grid-row--bottom fr-mb-4w"
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
      <div class="fr-col-12">
        <VeeMultiSelect
          name="referents"
          :label="beneficiaryFieldLabels.referents"
          :options="referentOptions"
          dropdown
        />
      </div>
      <!-- ROW -->
      <div class="fr-col-12 fr-mt-2w">
        <VeeSelect
          name="relationship"
          :label="beneficiaryFieldLabels.relationship"
          :options="withEmptyValue(commonRelationshipKeys.options)"
          required
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
      <div class="fr-col-12 fr-col-lg-4">
        <VeeInput
          name="birthDate"
          :label="beneficiaryFieldLabels.birthDate"
          type="date"
        />
      </div>
    </div>

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
          >
            Confirmer la création
          </button>
        </li>
      </ul>
    </div>
  </form>

  <BeneficiaryAddSuccess
    v-else
    @go-to-beneficiary="goToBeneficiary"
    @go-to-beneficiary-form="goToBeneficiaryForm"
  />
</template>

<script setup lang="ts">
  import { AddFamilyFileMemberInput } from '~/server/schema'
  import { beneficiaryFieldLabels } from '~/client/labels'
  import {
    commonRelationshipKeys,
    beneficiaryTitleKeys
  } from '~/client/options'
  import { BeneficiaryReferent } from '~/types/beneficiary'

  // TODO: add formError component
  // TODO: add formvalidation befor sending to parent (handleSubmit)

  const modal = useModal()
  const success = useState('success', () => false)
  const form = ref<HTMLFormElement | null>(null)

  const props = defineProps<{
    agents: BeneficiaryReferent[]
    beneficiaryReferentIds: string[]
    isSubmitting: boolean // TODO
    add: (values: AddFamilyFileMemberInput) => Promise<string | undefined>
  }>()

  const referentOptions = computed(() => toOptions(props.agents, 'id', 'name'))

  const { handleSubmit } = useForm<AddFamilyFileMemberInput>()

  const { onSubmit } = useCatchFormErrors(handleSubmit, async values => {
    const response = await props.add(values)
    if (response) {
      modal.setTitle()
      success.value = true
    }
  })

  const onClose = () => {
    modal.close()
    success.value = false
  }

  const goToBeneficiary = () => {
    console.log('redirection vers page du nouveau bénéficiaire')
  }
  const goToBeneficiaryForm = () => {
    console.log('redirection vers formulaire du nouveau bénéficiaire')
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
