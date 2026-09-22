<template>
  <section class="spn">
    <SupportProgramNamesEmpty
      v-if="supportProgramNames && supportProgramNames.length === 0"
    />
    <ul
      v-else
      class="spn__items"
    >
      <SupportProgramNamesItem
        v-for="item in supportProgramNames"
        :id="item.id"
        :key="item.id"
        :label="item.name"
        :has-lifecycle="item.hasLifecycle"
        @edit="openEditModal(item)"
        @remove="openDeleteModal(item)"
      />
    </ul>

    <div
      v-if="application.edit.structure"
      class="fr-grid-row fr-grid-row--right"
    >
      <button
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-line"
        type="button"
        data-fr-opened="false"
        aria-controls="global-modal"
        @click="openAddModal"
      >
        Ajouter un dispositif ou axe d'intervention
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
  import SupportProgramNameFormModal from './SupportProgramNameFormModal.vue'
  import SupportProgramNameDeletionModal from './SupportProgramNameDeletionModal.vue'
  import type { UpsertSupportProgramNameInput } from '~~/server/schema'

  type SupportProgramNameItem = {
    id: string
    name: string
    hasLifecycle: boolean
  }

  const { application } = usePermissions()
  const modal = useModal()
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()

  const { data: supportProgramNames, refresh } =
    await trpcClient.supportProgram.getNameList.useQuery()

  const isSubmitting = ref(false)

  function nameIsUnique(name: string, id?: string): boolean {
    const normalised = name.trim().toLocaleLowerCase()
    return !supportProgramNames.value?.some(
      item =>
        item.name.trim().toLocaleLowerCase() === normalised && item.id !== id
    )
  }

  function openAddModal() {
    modal.open(SupportProgramNameFormModal, {
      title: "Ajouter un dispositif ou axe d'intervention",
      size: 'lg',
      isSubmitting: isSubmitting.value,
      validate: (name: string) => nameIsUnique(name),
      submit: onSubmitForm
    })
  }

  function openEditModal(item: SupportProgramNameItem) {
    modal.open(SupportProgramNameFormModal, {
      title: "Modifier le dispositif ou axe d'intervention",
      size: 'lg',
      id: item.id,
      name: item.name,
      hasLifecycle: item.hasLifecycle,
      isSubmitting: isSubmitting.value,
      validate: (name: string, id?: string) => nameIsUnique(name, id),
      submit: onSubmitForm
    })
  }

  function onSubmitForm(values: UpsertSupportProgramNameInput) {
    const isCreation = !values.id
    modal.patch<typeof SupportProgramNameFormModal>({ isSubmitting: true })
    useTrpcMutation({
      mutation: () => trpcClient.supportProgram.upsertName.mutate(values),
      isSubmitting,
      onSuccess: () => {
        modal.close()
        refresh()
        snackbar.success(
          isCreation
            ? "Le dispositif ou axe d'intervention a été ajouté."
            : "Le dispositif ou axe d'intervention a été modifié."
        )
      },
      onFailure: () => {
        modal.patch<typeof SupportProgramNameFormModal>({
          isSubmitting: false
        })
        snackbar.error(
          isCreation
            ? "L'ajout du dispositif ou axe d'intervention a échoué."
            : "La modification du dispositif ou axe d'intervention a échoué."
        )
      }
    })
  }

  function openDeleteModal(item: SupportProgramNameItem) {
    modal.open(SupportProgramNameDeletionModal, {
      title: "Suppression du dispositif ou axe d'intervention",
      size: 'lg',
      id: item.id,
      isSubmitting: false,
      delete: () => onDelete(item)
    })
  }

  async function onDelete(item: SupportProgramNameItem) {
    modal.patch<typeof SupportProgramNameDeletionModal>({ isSubmitting: true })
    try {
      await trpcClient.supportProgram.deleteName.mutate({ id: item.id })
      snackbar.success("Le dispositif ou axe d'intervention a été supprimé.")
      modal.close()
      refresh()
    } catch {
      modal.patch<typeof SupportProgramNameDeletionModal>({
        isSubmitting: false
      })
      snackbar.error(
        "La suppression du dispositif ou axe d'intervention a échoué."
      )
    }
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .spn > *:not(:last-of-type) {
    margin-bottom: 1.5rem;
  }

  .spn__items {
    padding: 1rem 0;

    @include dsfr-media-query.respond-from('lg') {
      columns: 2;
      column-gap: 3rem;
    }
  }
</style>
