<template>
  <section class="fr-p-3v">
    <h2 class="title-blue fr-mb-6v">
      {{ routes.beneficiary.AppBeneficiaryEditExternalOrganisations.title }}
    </h2>

    <BeneficiaryInfoExternalOrganisationsLegacyAlert
      v-if="externalOrganisations"
      :external-organisations="externalOrganisations"
    />

    <BeneficiaryFormSection>
      <div class="fr-col-12 fr-col-xl-6">
        <VeeCombobox
          :label="beneficiaryFieldLabels.prescribingOrganizationId"
          hint="Issu de l'annuaire des partenaires de la structure"
          name="prescribingOrganizationId"
          :options="withEmptyValue(partnerOrganizationOptions)"
          @change-value="onPrescribingOrganizationChange"
        />
      </div>
      <div class="fr-col-12 fr-col-xl-6">
        <VeeSelect
          :label="beneficiaryFieldLabels.prescribingOrganizationContactId"
          name="prescribingOrganizationContactId"
          hint="Issu de l'annuaire des partenaires de la structure"
          :disabled="prescribingContactDisabled"
          :options="withEmptyValue(prescribingContactOptions)"
        />
      </div>
      <div class="fr-col-12 fr-mt-0 fr-pt-0">
        <NuxtLink
          :to="routes.structure.AppPartners.path()"
          class="fr-link fr-icon-info-fill fr-link--icon-left"
        >
          Données issues de l'annuaire de partenaires
        </NuxtLink>
      </div>

      <div class="fr-col-12">
        <VeeSelect
          name="protectionMeasure"
          :label="beneficiaryFieldLabels.protectionMeasure"
          :options="withEmptyValue(beneficiaryProtectionMeasureKeys.options)"
        />
      </div>
      <div class="fr-col-12">
        <VeeInput
          name="representative"
          :label="beneficiaryFieldLabels.representative"
        />
      </div>
      <div class="fr-col-12">
        <VeeSelect
          name="orientationType"
          :label="beneficiaryFieldLabels.orientationType"
          :options="withEmptyValue(beneficiaryOrientationTypeKeys.options)"
        />
      </div>
      <div class="fr-col-12">
        <VeeInput
          name="orientationStructure"
          :label="beneficiaryFieldLabels.orientationStructure"
        />
      </div>
    </BeneficiaryFormSection>

    <BeneficiaryFormSection>
      <div class="fr-col-12 fr-p-2w">
        <AtomAlertMSS :alert-type="AlertType.Info">
          <template #detailedMessage>
            <p class="fr-my-2w">
              Renseignez les partenaires qui interviennent auprès du
              bénéficiaire.
            </p>
          </template>
        </AtomAlertMSS>
      </div>

      <BeneficiaryFormContributingPartner
        v-for="(field, idx) in fields"
        :key="field.key"
        :index="idx"
        :is-duplicate="isDuplicate(idx)"
        :partner-organizations="partnerOrganizations"
        :partner-organization-options="partnerOrganizationOptions"
        @remove-partner="remove(idx)"
      />

      <div class="fr-col-12">
        <button
          class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-line"
          type="button"
          @click="addPartner"
        >
          Ajouter un partenaire
        </button>
      </div>
    </BeneficiaryFormSection>
  </section>
</template>

<script setup lang="ts">
  import {
    beneficiaryProtectionMeasureKeys,
    beneficiaryOrientationTypeKeys
  } from '~~/client/options'
  import { beneficiaryFieldLabels } from '~~/client/labels/beneficiary.labels'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { withEmptyValue } from '~/utils/options'
  import type { PartnerOrganizationIdName } from '~~/types/partner'
  import type { GetBeneficiaryExternalOrganisations } from '~~/types/beneficiary'
  import type { ContributingPartnerInput } from '~~/server/schema'

  const props = defineProps<{
    partnerOrganizations: PartnerOrganizationIdName[]
    externalOrganisations: GetBeneficiaryExternalOrganisations | undefined
  }>()

  const { fields, push, remove } = useFieldArray<ContributingPartnerInput>(
    'contributingPartners'
  )

  const { value: prescribingOrganizationId } = useField<string | null>(
    'prescribingOrganizationId'
  )
  const { setValue: setPrescribingContactId } = useField<string | null>(
    'prescribingOrganizationContactId'
  )

  // Partner org options
  const partnerOrganizationOptions = computed(() => {
    return toOptions(
      props.partnerOrganizations.map(({ id, ...rest }) => ({
        id: String(id),
        ...rest
      })),
      'id',
      'name'
    )
  })

  /**
   * Prescribing organization and contact
   */
  const selectedPrescribingOrg = computed(() =>
    props.partnerOrganizations.find(
      p => p.id === prescribingOrganizationId.value
    )
  )

  const prescribingContactDisabled = computed(() => {
    if (!selectedPrescribingOrg.value) {
      return true
    }
    return (selectedPrescribingOrg.value.contacts || []).length === 0
  })

  const prescribingContactOptions = computed(() => {
    if (!selectedPrescribingOrg.value) {
      return []
    }
    return toOptions(selectedPrescribingOrg.value.contacts || [], 'id', 'name')
  })

  const onPrescribingOrganizationChange = () => {
    setPrescribingContactId(null)
  }

  /**
   * Contributing partner helpers
   */

  const isDuplicate = (index: number) => {
    const row = fields.value[index]?.value
    if (!row || !row.partnerOrganizationId) {
      return false
    }
    return fields.value.some((field, i) => {
      if (i === index) {
        return false
      }
      return field.value.partnerOrganizationId === row.partnerOrganizationId
    })
  }

  const addPartner = async () => {
    push({ id: crypto.randomUUID() } as any)
    await nextTick()
  }
</script>
