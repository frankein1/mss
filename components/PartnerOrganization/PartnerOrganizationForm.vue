<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    class="fr-container--fluid"
    @submit.prevent="emit('submit', $event)"
  >
    <div class="partner-form-subtitle fr-mb-2w">
      <div>Renseignez uniquement les champs qui vous sont utiles.</div>
      <div>Les champ avec * sont obligatoires.</div>
    </div>
    <h3 class="fr-text--md formgroup__title fr-mb-2w">
      Informations principales
    </h3>
    <VeeInput
      name="name"
      :label="partnerOrganizationFieldLabels.name"
      required
    />
    <VeeInput
      name="siret"
      :label="partnerOrganizationFieldLabels.siret"
      hint="Format attendu : 01234567890123"
      required
      @change-value="onSiretChange"
    />
    <template v-if="partnerWithSameSiret">
      <div class="fr-alert fr-alert--error fr-mb-2w">
        <h3 class="fr-alert__title">
          Un organisme existe déjà avec ce numéro de SIRET
        </h3>
        <p>
          <a
            href="#"
            target="_self"
            @click="goToPartnerWithSameSiret"
          >
            {{ `${partnerWithSameSiret.name} ${partnerWithSameSiret.siret}` }}
          </a>
        </p>
      </div>
    </template>

    <h3 class="fr-text--md formgroup__title fr-mb-2w">Coordonnées</h3>
    <VeeInput
      name="address"
      :label="partnerOrganizationFieldLabels.address"
      hint="Numéro et voie"
    />
    <div class="partner-form-row">
      <VeeInput
        class="partner-form-row--zipcode"
        name="zipcode"
        :label="partnerOrganizationFieldLabels.zipcode"
      />
      <VeeInput
        class="partner-form-row--city"
        name="city"
        :label="partnerOrganizationFieldLabels.city"
      />
    </div>

    <div class="partner-form-row">
      <VeeInput
        class="partner-form-row--phone1"
        name="phone1"
        :label="partnerOrganizationFieldLabels.phone1"
        hint="Format attendu: 00 00 00 00 00"
      />
      <VeeInput
        v-if="showPhone2"
        class="partner-form-row--phone2"
        name="phone2"
        :label="partnerOrganizationFieldLabels.phone2"
        hint="Format attendu: 00 00 00 00 00"
      />
      <div
        v-if="!showPhone2"
        class="partner-form--open-phone fr-mb-2w"
      >
        <button
          class="fr-link fr-icon-file-add-line fr-text--xs fr-ml-2w fr-mb-2w"
          @click="dislpayPhone2"
        >
          + Ajouter un téléphone
        </button>
      </div>
    </div>

    <VeeInput
      name="email"
      :label="partnerOrganizationFieldLabels.email"
      hint="Format attendu : nom@domaine.fr"
    />
    <VeeTextarea
      name="workingHours"
      :label="partnerOrganizationFieldLabels.workingHours"
    />
    <div class="button-bar">
      <button
        class="fr-btn fr-btn--secondary fr-mt-3w"
        title="Annuler"
        @click="onCancel"
      >
        Annuler
      </button>
      <button
        class="fr-btn fr-mt-3w"
        title="Valider"
        type="submit"
        :submitting="isSubmitting"
      >
        Valider
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
  import type { FormErrors } from 'vee-validate'
  import { PartnerOrganizationData } from './types'
  import { partnerOrganizationFieldLabels } from '~/client/labels'
  import {
    AddPartnerOrganizationInput,
    EditPartnerOrganizationInput
  } from '~/server/schema'

  const props = defineProps<{
    partnerId?: string
    showPhone2: boolean
    isSubmitting: boolean
    caughtErrors: FormErrors<
      AddPartnerOrganizationInput | EditPartnerOrganizationInput
    >
  }>()

  const trpcClient = useTrpcClient()

  const emit = defineEmits<{
    submit: [payload: Event]
    cancel: [filter?: string]
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const showPhone2 = ref(props.showPhone2)

  const partnerWithSameSiret = ref<PartnerOrganizationData>()

  function dislpayPhone2() {
    showPhone2.value = true
  }

  async function onSiretChange(siret: string) {
    const findBySiret = await trpcClient.partner.findBySiret.query({ siret })
    if (!findBySiret) {
      partnerWithSameSiret.value = undefined
    } else if (props.partnerId && findBySiret.id === props.partnerId) {
      partnerWithSameSiret.value = undefined
    } else {
      partnerWithSameSiret.value = findBySiret
    }
  }

  const { errors } = useDisplayFormErrors(
    form,
    toRef(() => props.caughtErrors),
    partnerOrganizationFieldLabels
  )

  function goToPartnerWithSameSiret() {
    const sameSiret = partnerWithSameSiret.value
    const siretValue = sameSiret?.siret
    emit('cancel', siretValue || undefined)
  }

  function onCancel() {
    emit('cancel')
  }
</script>

<style scoped>
  .partner-form-subtitle {
    color: var(--text-title-grey);
  }

  .partner-form-row {
    display: flex;
    gap: 4px;
  }

  .partner-form-row--zipcode {
    flex: 0 0 calc(33.333% - 12px);
  }

  .partner-form-row--city {
    flex: 1 0 0;
  }

  .partner-form-row--phone1 {
    flex: 0 0 calc(50% - 12px);
  }

  .partner-form-row--phone2 {
    flex: 1 0 0;
  }

  .partner-form--open-phone {
    display: flex;
    flex-direction: column-reverse;
  }

  .button-bar {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
</style>
