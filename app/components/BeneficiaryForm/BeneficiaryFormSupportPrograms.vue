<template>
  <BeneficiaryFormSection ref="supportProgramsRef">
    <div class="fr-col-12">
      <AtomAlertMSS :alert-type="AlertType.Info">
        <template #detailedMessage>
          <p class="fr-mb-2v">
            Renseignez les dispositifs ou axes d'intervention dans lesquels le
            bénéficiaire est engagé.
          </p>
          <p>
            Les dates d'entrée et de sortie ne sont proposées que pour les
            dispositifs et axes d'intervention configurés avec des dates. À la
            saisie d'une date de sortie, précisez le motif et l'atteinte des
            objectifs.
          </p>
        </template>
      </AtomAlertMSS>
    </div>

    <BeneficiaryFormSupportProgram
      v-for="(field, idx) in fields"
      :key="field.key"
      :index="idx"
      :is-duplicate="duplicatedProgramIds.has(field.value.id)"
      :has-lifecycle="programNameHasLifecycle(field)"
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
        Ajouter un dispositif ou axe d'intervention
      </button>
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import type { SupportProgramInput } from '~~/server/schema'
  import BeneficiaryFormSupportProgramDeletionModal from './BeneficiaryFormSupportProgramDeletionModal.vue'
  import { AlertType } from '~/utils/constants/alert'

  const trpcClient = useTrpcClient()
  const modal = useModal()

  const supportProgramsRef = useTemplateRef('supportProgramsRef')
  const { focusElementAdded } = useDynamicFieldFocus(supportProgramsRef)

  const { data: supportProgramNames } =
    await trpcClient.supportProgram.getNameList.useQuery()

  const lifecycleByNameId = computed(() => {
    const map = new Map<string, boolean>()
    for (const name of supportProgramNames.value ?? []) {
      map.set(name.id, name.hasLifecycle)
    }
    return map
  })

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
    const spidCounts = new Map<string, string[]>()

    fields.value.forEach(f => {
      const spid = f.value.supportProgramNameId
      spidCounts.set(spid, [...(spidCounts.get(spid) || []), f.value.id])
    })

    const lastDuplicatedIds = spidCounts
      .entries()
      .filter(e => e[1].length > 1)
      .map(e => e[1].at(e[1].length - 1) as string)

    return new Set(lastDuplicatedIds)
  })

  function programNameHasLifecycle(
    field: (typeof fields)['value'][number]
  ): boolean {
    const nameId = field.value.supportProgramNameId
    if (!nameId) {
      return false
    }
    return lifecycleByNameId.value.get(nameId) ?? false
  }

  function onClickRemove(field: (typeof fields)['value'][number], idx: number) {
    const id = field.value.id

    // Confirm program deletion when social supports are associated to it
    modal.open(BeneficiaryFormSupportProgramDeletionModal, {
      title: "Suppression du dispositif ou axe d'intervention",
      supportProgramId: id!,
      remove: () => remove(idx)
    })
  }

  function addSupportProgram() {
    push({ id: crypto.randomUUID(), supportProgramNameId: '' })
    focusElementAdded()
  }
</script>
