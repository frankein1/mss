<template>
  <BeneficiaryFormSection>
    <div class="fr-col-12">
      <AtomAlertMSS :alert-type="AlertType.Info">
        <template #detailedMessage>
          <p>
            Renseignez les dispositifs dans lesquels le bénéficiaire est engagé.
            À la saisie d'une date de sortie, précisez le motif et l'atteinte
            des objectifs.
          </p>
        </template>
      </AtomAlertMSS>
    </div>

    <BeneficiaryFormSupportProgram
      v-for="(field, idx) in fields"
      :key="field.key"
      :index="idx"
      :is-duplicate="duplicatedProgramIds[idx] ?? false"
      :support-program-name-options="supportProgramNameOptions"
      :partner-organisation-options="partnerOrganisationOptions"
      @remove-support-program="onClickRemove(field, idx)"
    />

    <div class="fr-col-12">
      <button
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-line"
        type="button"
        @click="addSupportProgram"
      >
        Ajouter un dispositif
      </button>
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import type { SupportProgramInput } from '~/server/schema'
  import BeneficiaryFormSupportProgramDeletionModal from './BeneficiaryFormSupportProgramDeletionModal.vue'
  import { AlertType } from '~/utils/constants/alert'

  const trpcClient = useTrpcClient()
  const modal = useModal()

  const { data: supportProgramNames } =
    await trpcClient.supportProgram.getNameList.useQuery()

  const supportProgramNameOptions: Ref<Options> = computed(
    () =>
      supportProgramNames.value?.map(({ id, name }) => ({
        label: name,
        value: id
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

  const { fields, push, remove } =
    useFieldArray<SupportProgramInput>('supportPrograms')

  const duplicatedProgramIds = computed(() => {
    const ids = fields.value.map(f => f.value.supportProgramNameId ?? '')
    const duplicated = new Set(
      ids.filter((id, i) => id && ids.indexOf(id) !== i)
    )
    return ids.map(id => duplicated.has(id))
  })

  function onClickRemove(field: (typeof fields)['value'][number], idx: number) {
    const id = field.value.id

    // Confirm program deletion when social supports are associated to it
    modal.open(BeneficiaryFormSupportProgramDeletionModal, {
      title: 'Suppression du dispositif',
      supportProgramId: id!,
      remove: () => remove(idx)
    })
  }

  function addSupportProgram() {
    push({ id: crypto.randomUUID(), supportProgramNameId: '' })
  }
</script>
