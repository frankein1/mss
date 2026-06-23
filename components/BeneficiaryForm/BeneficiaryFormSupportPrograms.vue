<template>
  <BeneficiaryFormSection
    section-title="Prestations / Dispositifs d'accompagnement"
  >
    <div class="fr-col-12">
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
  const trpcClient = useTrpcClient()

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

  const { fields, push } = useFieldArray('supportPrograms')

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
</script>
