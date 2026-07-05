<template>
  <section class="spn">
    <AtomCallout>
      <p>
        Les dispositifs renseignés ci-dessous sont proposés lors de l'ajout d'un
        dispositif sur la fiche d'un bénéficiaire.
      </p>
    </AtomCallout>

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
        Ajouter un dispositif
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
  import SupportProgramNameFormModal from './SupportProgramNameFormModal.vue'
  import SupportProgramNameDeletionModal from './SupportProgramNameDeletionModal.vue'
  import type { UpsertSupportProgramNameInput } from '~/server/schema'

  type SupportProgramNameItem = { id: string; name: string }

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
      title: 'Ajouter un dispositif',
      isSubmitting: isSubmitting.value,
      validate: (name: string) => nameIsUnique(name),
      submit: onSubmitForm
    })
  }

  function openEditModal(item: SupportProgramNameItem) {
    modal.open(SupportProgramNameFormModal, {
      title: 'Modifier le dispositif',
      id: item.id,
      name: item.name,
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
            ? 'Le dispositif a été ajouté.'
            : 'Le dispositif a été modifié.'
        )
      },
      onFailure: () => {
        modal.patch<typeof SupportProgramNameFormModal>({
          isSubmitting: false
        })
        snackbar.error(
          isCreation
            ? "L'ajout du dispositif a échoué."
            : 'La modification du dispositif a échoué.'
        )
      }
    })
  }

  function openDeleteModal(item: SupportProgramNameItem) {
    modal.open(SupportProgramNameDeletionModal, {
      title: 'Suppression du dispositif',
      id: item.id,
      isSubmitting: false,
      delete: () => onDelete(item)
    })
  }

  async function onDelete(item: SupportProgramNameItem) {
    modal.patch<typeof SupportProgramNameDeletionModal>({ isSubmitting: true })
    try {
      await trpcClient.supportProgram.deleteName.mutate({ id: item.id })
      snackbar.success('Le dispositif a été supprimé.')
      modal.close()
      refresh()
    } catch {
      modal.patch<typeof SupportProgramNameDeletionModal>({
        isSubmitting: false
      })
      snackbar.error(
        'La suppression du dispositif a échoué.',
        snackbar.focus('form', 'button[type="submit"]')
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
