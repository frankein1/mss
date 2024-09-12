<template>
  <DsfrStepper
    :steps
    :current-step
  />

  <template v-if="currentStep === 1">
    <form @submit.prevent="split">
      <p>
        <strong
          >Voulez-vous retirer {{ beneficiaryName }} du dossier foyer ?</strong
        >
        <br />
        Ses informations, ses documents, ses suivis ainsi que ses revenus seront
        retirés du dossier actuel et formeront un nouveau dossier indépendant.
      </p>

      <p class="color-red fr-text--bold">
        <span
          class="fr-icon-warning-line"
          aria-hidden="true"
        ></span>
        Attention cette opération ne pourra pas être annulée.
      </p>

      <DsfrButtonGroup
        equisized
        inline-layout-when="always"
        align="right"
      >
        <li>
          <DsfrButton
            label="Annuler"
            type="button"
            secondary
            @click="modal.close"
          ></DsfrButton>
        </li>

        <li>
          <DsfrButton
            label="Confirmer la dissociation"
            type="submit"
            :submitting="isSubmittingSplit"
            :readonly="isSubmittingSplit"
          ></DsfrButton>
        </li>
      </DsfrButtonGroup>
    </form>
  </template>

  <template v-else-if="currentStep === 2">
    <form @submit.prevent="updateFamilySituation">
      <p>
        Souhaitez-vous mettre à jour la situation familiale de
        {{ beneficiaryName }} ?
      </p>

      <FamilyFileSplitSituationUpdate class="fr-mb-4w" />

      <DsfrButtonGroup
        equisized
        inline-layout-when="always"
        align="right"
      >
        <li>
          <DsfrButton
            label="Pas maintenant"
            type="button"
            secondary
            @click="modal.close"
          ></DsfrButton>
        </li>

        <li>
          <DsfrButton
            label="Enregistrer"
            type="submit"
            :submitting="isSubmittingSituation"
            :readonly="isSubmittingSituation"
          ></DsfrButton>
        </li>
      </DsfrButtonGroup>
    </form>
  </template>
</template>

<script setup lang="ts">
  import type { Beneficiary } from '@prisma/client'
  import {
    UpdateBeneficiaryTaxHouseholdInput,
    updateBeneficiaryTaxHouseholdSchema
  } from '~/server/schema'
  import { GetBeneficiaryTaxHousehold } from '~/types/beneficiary'
  import { routes } from '~/utils/routes'
  import { BeneficiaryAction, EventCategory } from '~/types/matomo'
  const props = defineProps<{
    id: string
    beneficiaryName: string
    household: GetBeneficiaryTaxHousehold
    mutationSplit: () => Promise<unknown>
    mutationFamilySituation: (
      values: UpdateBeneficiaryTaxHouseholdInput
    ) => Promise<Beneficiary>
  }>()

  const modal = useModal()
  const snackbar = useSnackbar()
  const matomo = useMatomo()

  const steps = [
    `Dissocier ${props.beneficiaryName} du dossier`,
    'Mettre à jour sa situation familiale'
  ]

  const currentStep = ref(1)

  /** Step 1 : Split beneficiary from family file */
  const isSubmittingSplit = ref(false)
  async function split() {
    matomo.trackEvent(EventCategory.Beneficiary, BeneficiaryAction.Split)

    await useTrpcMutation({
      mutation: props.mutationSplit,
      isSubmitting: isSubmittingSplit,
      onSuccess: () => {
        currentStep.value = 2
      },
      onFailure: () => {
        snackbar.error(
          'La dissociation du membre du foyer a échoué',
          snackbar.focus()
        )
      }
    })
  }

  /** Step 2 : Update Family Situation of the beneficiary */
  const { handleSubmit } = useForm<UpdateBeneficiaryTaxHouseholdInput>({
    validationSchema: toTypedSchema(updateBeneficiaryTaxHouseholdSchema),
    initialValues: {
      id: props.id,
      familySituation: props.household.familySituation,
      divorceDate: props.household.divorceDate,
      caregiver: props.household.caregiver
    }
  })

  const isSubmittingSituation = ref(false)
  const updateFamilySituation = handleSubmit(values => {
    useTrpcMutation({
      mutation: () => props.mutationFamilySituation(values),
      isSubmitting: isSubmittingSituation,
      onSuccess: ({ familyFileId, id }) => {
        snackbar.success(
          `${props.beneficiaryName} a bien été retiré du dossier. Pensez à mettre à jour le statut du dossier, les agents référents et le budget si nécessaire.`
        )
        navigateTo(
          routes.file.AppFile.path(familyFileId, { beneficiaryId: id })
        )
        modal.close()
      },
      onFailure: () => {
        snackbar.error(
          'La mise à jour de la situation familiale du bénéficiaire a échoué',
          snackbar.focus('form', 'select')
        )
      }
    })
  })
</script>

<style>
  @import '@gouvfr/dsfr/dist/component/stepper/stepper.min.css';

  :deep(.fr-stepper__steps) {
    background-image: repeating-linear-gradient(
        to right,
        var(--primary) 0,
        var(--primary) var(--active-inner),
        transparent var(--active-inner),
        transparent var(--active-outer)
      ),
      repeating-linear-gradient(
        to right,
        var(--background-contrast-grey) 0,
        var(--background-contrast-grey) var(--default-inner),
        transparent var(--default-inner),
        transparent var(--default-outer)
      );
  }
</style>
