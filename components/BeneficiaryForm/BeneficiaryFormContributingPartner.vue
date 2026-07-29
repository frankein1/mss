<template>
  <div class="fr-col-12">
    <h3 class="fr-h4 title-blue">
      {{ `Partenaire intervenant ${index + 1}` }}
    </h3>
  </div>

  <div class="fr-col-12 fr-col-lg-6">
    <VeeCombobox
      :label="contributingPartnerFieldLabels.partnerOrganizationId"
      :name="`contributingPartners[${index}].partnerOrganizationId`"
      hint="Issu de l'annuaire des partenaires de la structure"
      :options="withEmptyValue(partnerOrganizationOptions)"
      @change-value="onOrgChange"
    />
    <AtomAlert
      v-if="isDuplicate"
      :alert-type="AlertType.Info"
      message="Attention, cet organisme est déjà présent dans la liste."
      class="fr-mt-1v"
    />
  </div>
  <div class="fr-col-12 fr-col-lg-6">
    <VeeSelect
      :label="contributingPartnerFieldLabels.partnerOrganizationContactId"
      :name="`contributingPartners[${index}].partnerOrganizationContactId`"
      hint="Issu de l'annuaire des partenaires de la structure"
      :disabled="contactDisabled"
      :options="withEmptyValue(contactOptions)"
    />
  </div>
  <div class="fr-col-12">
    <VeeInput
      :label="contributingPartnerFieldLabels.precisions"
      :name="`contributingPartners[${index}].precisions`"
      hint="Personne intervenante, horaires…"
    />
  </div>

  <div class="fr-col-12">
    <button
      class="fr-btn fr-btn--secondary fr-btn--icon-left fr-btn--sm fr-icon-delete-line btn-delete-action"
      type="button"
      :aria-label="`Supprimer le partenaire intervenant ${index + 1}`"
      @click="$emit('removePartner')"
    >
      Supprimer ce partenaire
    </button>
    <hr class="fr-mt-3w" />
  </div>
</template>

<script setup lang="ts">
  import { beneficiaryContributingPartnerFieldLabels as contributingPartnerFieldLabels } from '~/client/labels/beneficiary.labels'
  import { AlertType } from '~/utils/constants/alert'
  import { withEmptyValue, type Options } from '~/utils/options'
  import type { PartnerOrganizationIdName } from '~/types/partner'
  import type { ContributingPartnerInput } from '~/server/schema'

  const props = defineProps<{
    index: number
    isDuplicate: boolean
    partnerOrganizations: PartnerOrganizationIdName[]
    partnerOrganizationOptions: Options
  }>()

  defineEmits<{
    removePartner: []
  }>()

  const { value: row } = useFieldValue<ContributingPartnerInput>(
    () => `contributingPartners[${props.index}]`
  )

  const { setValue: setContactId } = useField<string | null>(
    () => `contributingPartners[${props.index}].partnerOrganizationContactId`
  )

  const contactOptions = computed(() => {
    if (row.partnerOrganizationId) {
      const org = props.partnerOrganizations.find(
        p => p.id === row.partnerOrganizationId
      )
      if (org?.contacts) {
        return toOptions(org.contacts, 'id', 'name')
      }
    }
    return []
  })

  const contactDisabled = computed(() => !row.partnerOrganizationId)

  const onOrgChange = () => {
    setContactId(null)
  }
</script>
