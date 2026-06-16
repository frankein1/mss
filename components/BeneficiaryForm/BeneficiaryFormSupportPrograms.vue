<template>
  <BeneficiaryFormSection>
    <div class="fr-col-12">
      <p class="fr-text--bold fr-text--uppercase fr-mb-1w">
        Prestations / Dispositifs d'accompagnement
      </p>
      <p class="fr-hint-text fr-mb-0">
        Exemple : portage de repas, dispositif de retour à l'emploi...
      </p>
    </div>

    <BeneficiaryFormSupportProgram
      v-for="(field, idx) in fields"
      :key="field.key"
      :index="idx"
      :is-duplicate="duplicateFlags[idx] ?? false"
      :support-program-name-options="supportProgramNameOptions"
      :partner-organisation-options="partnerOrganisationOptions"
      @remove-support-program="handleRemoveSupportProgram(idx)"
    />

    <div class="fr-col-12">
      <button
        class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-add-circle-line"
        type="button"
        @click="addSupportProgram"
      >
        Ajouter un dispositif
      </button>
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import BeneficiaryFormSupportProgramDeleteModal from './BeneficiaryFormSupportProgramDeleteModal.vue'

  const trpcClient = useTrpcClient()
  const modal = useModal()

  const { data: supportProgramNames } =
    await trpcClient.supportProgram.getNameList.useQuery()

  const supportProgramNameOptions: Ref<Options> = computed(
    () =>
      supportProgramNames.value?.map(({ name }) => ({
        label: name,
        value: name
      })) ?? []
  )

  const { data: partnerOrganisations } =
    await trpcClient.partner.getAll.useQuery()

  const partnerOrganisationOptions: Ref<Options> = computed(
    () =>
      partnerOrganisations.value?.map(({ id, name }) => ({
        label: name,
        value: id
      })) ?? []
  )

  const { remove, fields, push } = useFieldArray('supportPrograms')

  const duplicateFlags = computed(() => {
    const names = fields.value.map(
      f => (f.value as { name?: string }).name ?? ''
    )
    return names.map(
      (name, idx) =>
        Boolean(name) && names.some((n, i) => i !== idx && n === name)
    )
  })

  function addSupportProgram() {
    push({ id: crypto.randomUUID(), name: '' })
  }

  async function handleRemoveSupportProgram(idx: number) {
    const supportProgramId = (
      fields.value[idx]?.value as { id?: string } | undefined
    )?.id

    if (!supportProgramId) {
      remove(idx)
      return
    }

    const isLinked = await trpcClient.supportProgram.checkHasFollowup.query({
      supportProgramId
    })

    if (!isLinked) {
      remove(idx)
      return
    }

    modal.open(BeneficiaryFormSupportProgramDeleteModal, {
      title: 'Attention : ce dispositif est déjà lié à un accompagnement',
      triggerOpen: true,
      onConfirm: () => {
        remove(idx)
        modal.close()
      }
    })
  }
</script>
