<template>
  <section class="spn">
    <AtomCallout>
      <p>
        Les dispositifs renseignés ci-dessous sont proposés lors de l’ajout d’un
        dispositif sur la fiche d’un bénéficiaire.
      </p>
    </AtomCallout>

    <p
      v-if="
        supportProgramNames && supportProgramNames.length === 0 && !isAdding
      "
      class="fr-text--sm fr-mb-0"
    >
      Aucun dispositif configuré. Ajoutez un dispositif pour pouvoir l'associer
      aux accompagnements.
    </p>

    <ul class="spn__items">
      <SupportProgramNamesItem
        v-for="item in supportProgramNames"
        :id="item.id"
        :key="item.id || 'new'"
        :name="item.name"
        :can-edit="application.edit.structure"
        :is-submitting="upsertStatus === 'pending'"
        :success-message="successMessageByItemId[item.id]"
        @update="onUpdate(item, $event)"
        @remove="onClickRemove(item)"
        @clear-success="clearSuccess(item)"
      />
    </ul>

    <div
      v-if="application.edit.structure"
      class="fr-grid-row fr-grid-row--right"
    >
      <button
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-line"
        type="button"
        :disabled="isAdding"
        @click="onAdd"
      >
        Ajouter un dispositif
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
  import SupportProgramNamesItem from './SupportProgramNamesItem.vue'
  import SupportProgramNameDeletionModal from './SupportProgramNameDeletionModal.vue'

  type SupportProgramNameItem = { id: string; name: string }

  const { application } = usePermissions()
  const modal = useModal()
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()

  const { data: supportProgramNames, refresh } =
    await trpcClient.supportProgram.getNameList.useQuery()

  const {
    mutate: upsertName,
    error: upsertError,
    status: upsertStatus
  } = trpcClient.supportProgram.upsertName.useMutation()

  /** The success message after mutation is shown under the corresponding field */
  const successMessageByItemId = ref<Record<string, string>>({})

  const { mutate: deleteName, error: deleteError } =
    trpcClient.supportProgram.deleteName.useMutation()

  async function onUpdate(item: SupportProgramNameItem, name: string) {
    const focusBack = snackbar.focus('form', 'button[type="submit"]')
    await upsertName({ id: item.id || undefined, name })

    if (upsertError.value) {
      snackbar.error('La modification du dispositif a échoué.', focusBack)
      return
    }

    const isCreation = !item.id
    await refresh()
    const refreshedItem = supportProgramNames.value?.find(i => i.name === name)
    if (refreshedItem) {
      successMessageByItemId.value[refreshedItem.id] =
        `Le dispositif a été ${isCreation ? 'ajouté' : 'modifié'}.`
    }
  }

  function clearSuccess(item: SupportProgramNameItem) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete successMessageByItemId.value[item.id]
  }

  const isAdding = computed(() =>
    supportProgramNames.value?.some(item => !item.id)
  )

  function onAdd() {
    if (isAdding.value) {
      return
    }
    supportProgramNames.value?.push({ id: '', name: '' })
  }

  function onClickRemove(item: SupportProgramNameItem) {
    modal.open(SupportProgramNameDeletionModal, {
      title: 'Suppression du dispositif',
      id: item.id,
      isSubmitting: false,
      delete: () => onRemove(item)
    })
  }

  async function onRemove(item: SupportProgramNameItem) {
    modal.patch<typeof SupportProgramNameDeletionModal>({ isSubmitting: true })
    await deleteName({ id: item.id })
    if (deleteError.value) {
      modal.patch<typeof SupportProgramNameDeletionModal>({
        isSubmitting: false
      })
      snackbar.error(
        'La suppression du dispositif a échoué.',
        snackbar.focus('form', 'button[type="submit"]')
      )
      return
    }
    snackbar.success('Le dispositif a été supprimé.')
    modal.close()
    refresh()
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .spn > *:not(:last-of-type) {
    margin-bottom: 1.5rem;
  }

  .spn__title {
    color: var(--primary);
  }

  .spn__items {
    list-style: none;

    @include dsfr-media-query.respond-from('lg') {
      columns: 2;
      column-gap: 3rem;
    }
  }
</style>
