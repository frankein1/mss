<template>
  <section class="feature-section bg-color-white spn">
    <h3 class="fr-h4 spn__title">Dispositifs proposés par votre structure</h3>

    <AtomCallout>
      <p>
        Les dispositifs renseignés ci-dessous sont proposés lors de l’ajout d’un
        dispositif sur la fiche d’un bénéficiaire.
      </p>
    </AtomCallout>

    <ul class="spn__items">
      <SupportProgramNamesItem
        v-for="item in supportProgramNames"
        :key="item.id"
        :name="item.name"
        :can-edit="application.edit.structure"
        @update="onUpdate(item, $event)"
        @remove="onClickRemove(item)"
      />
    </ul>

    <div
      v-if="application.edit.structure"
      class="fr-grid-row fr-grid-row--right"
    >
      <button
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-line"
        type="button"
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

  const props = defineProps<{
    supportProgramNames: SupportProgramNameItem[]
  }>()

  const emit = defineEmits<{
    update: [item: SupportProgramNameItem]
    remove: [item: SupportProgramNameItem]
    add: [item: SupportProgramNameItem]
  }>()

  const { application } = usePermissions()
  const modal = useModal()
  const isSubmittingDeletion = ref(false)

  const supportProgramNames = ref<SupportProgramNameItem[]>(
    props.supportProgramNames.map(item => ({ ...item }))
  )

  watch(
    () => props.supportProgramNames,
    names => {
      supportProgramNames.value = names.map(item => ({ ...item }))
    }
  )

  function onClickRemove(item: SupportProgramNameItem) {
    modal.open(SupportProgramNameDeletionModal, {
      title: 'Suppression du dispositif',
      name: item.name,
      isSubmitting: isSubmittingDeletion.value,
      delete: () => onRemove(item)
    })
  }

  // TODO: en attente du enpoint

  function onUpdate(item: SupportProgramNameItem, name: string) {
    item.name = name
    emit('update', { id: item.id, name })
  }

  function onRemove(item: SupportProgramNameItem) {
    supportProgramNames.value = supportProgramNames.value.filter(
      i => i.id !== item.id
    )
    emit('remove', item)
    modal.close()
  }

  function onAdd() {
    const item = { id: crypto.randomUUID(), name: '' }
    supportProgramNames.value.push(item)
    emit('add', item)
  }
</script>

<style scoped lang="scss">
  .spn > *:not(:last-of-type) {
    margin-bottom: 1.5rem;
  }

  .spn__title {
    color: var(--primary);
  }

  .spn__items {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
