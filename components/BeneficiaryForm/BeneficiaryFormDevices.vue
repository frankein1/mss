<template>
  <div>
    <BeneficiaryFormSection>
      <div class="fr-col-12">
        <p class="fr-text--bold fr-text--uppercase fr-mb-1w">
          Prestations / Dispositifs d'accompagnement
        </p>
        <p class="fr-hint-text fr-mb-0">
          Exemple : portage de repas, dispositif de retour à l'emploi...
        </p>
      </div>
    </BeneficiaryFormSection>

    <BeneficiaryFormDevice
      v-for="(field, idx) in fields"
      :key="field.key"
      :index="idx"
      :device-name-options="deviceNameOptions"
      :partner-organisation-options="partnerOrganisationOptions"
      @remove-device="handleRemoveDevice(idx)"
    />

    <BeneficiaryFormSection>
      <div class="fr-col-12">
        <button
          class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-add-circle-line"
          type="button"
          @click="addDevice"
        >
          Ajouter un dispositif
        </button>
      </div>
    </BeneficiaryFormSection>
  </div>
</template>

<script setup lang="ts">
  import { v4 } from 'uuid'
  import BeneficiaryFormDeviceDeleteModal from './BeneficiaryFormDeviceDeleteModal.vue'

  const trpcClient = useTrpcClient()
  const modal = useModal()

  const { data: deviceNames } =
    await trpcClient.beneficiary.getDeviceNameList.useQuery()

  const deviceNameOptions: Ref<Options> = computed(
    () =>
      deviceNames.value?.map(({ name }) => ({ label: name, value: name })) ?? []
  )

  const { data: partnerOrganisations } =
    await trpcClient.partner.getAll.useQuery()

  const partnerOrganisationOptions: Ref<Options> = computed(
    () =>
      partnerOrganisations.value?.map(({ name }) => ({
        label: name,
        value: name
      })) ?? []
  )

  const { remove, fields, push } = useFieldArray('devices')

  function addDevice() {
    push({ id: v4(), name: '' })
  }

  async function handleRemoveDevice(idx: number) {
    const deviceId = (fields.value[idx].value as { id?: string }).id

    if (!deviceId) {
      remove(idx)
      return
    }

    const isLinked = await trpcClient.beneficiary.checkDeviceHasFollowup.query({
      deviceId
    })

    if (!isLinked) {
      remove(idx)
      return
    }

    modal.open(BeneficiaryFormDeviceDeleteModal, {
      title: 'Attention : ce dispositif est déjà lié à un accompagnement',
      triggerOpen: true,
      onConfirm: () => {
        remove(idx)
        modal.close()
      }
    })
  }
</script>
