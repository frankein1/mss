<template>
  <form
    ref="archiveForm"
    novalidate
  >
    <div class="feature-section fr-mt-1w">
      <h2 class="fr-h4">Précisez les raisons de l’archivage</h2>
      <VeeSelect
        name="reason"
        label="Motif de l'archivage"
        :options="withEmptyValue(reasons)"
      />
      <VeeInput
        v-if="displayDatePicker"
        type="date"
        name="date"
        label="Date"
      />
      <VeeInput
        name="clarification"
        label="Précisions"
      />
    </div>

    <AtomAlertMSS
      class="fr-mt-4w"
      :alert-type="AlertType.Warning"
      message="Attention, le dossier sera définitivement supprimé de Mon Suivi Social"
    >
      <template #detailedMessage>
        <p>
          L’ensemble des données relatives au dossier seront supprimées de Mon
          Suivi Social. Le dossier et ses accompagnements ne seront plus
          comptabilisés dans les statistiques. Seuls le nom et le prénom seront
          conservés si vous avez sélectionné l’option.
        </p>
      </template>
    </AtomAlertMSS>
    <div class="fr-mt-4w flex-right">
      <button
        class="fr-btn fr-mb-0"
        type="button"
        @click="onArchive()"
      >
        Télécharger
      </button>
      <button
        class="fr-btn fr-btn--icon-left fr-icon-delete-line fr-mb-0 edit-btn"
        :class="{ 'btn-delete-action': !disabledDeleteButton }"
        type="button"
        :disabled="disabledDeleteButton"
        @click="onDelete()"
      >
        Supprimer dénitivement
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
  import { archiveReasonKeys, ArchiveReasons } from '~/client/options/archive'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    downloadReceived: boolean
  }>()

  const emit = defineEmits<{
    deleteFile: []
    archiveFile: [value: any]
  }>()

  const disabledDeleteButton = computed(() => !props.downloadReceived)
  const { values: formValues } = useForm({
    initialValues: {}
  })
  const reasons = archiveReasonKeys.options
  const { value: reasonValue } = useField<ArchiveReasons>('reason')
  const displayDatePicker: ComputedRef<boolean> = computed(() => {
    const withDate = [
      ArchiveReasons.Death,
      ArchiveReasons.Displacement,
      ArchiveReasons.Transfer,
      ArchiveReasons.EndOfFollowup
    ]
    return withDate.includes(reasonValue.value)
  })

  const onArchive = () => {
    emit('archiveFile', formValues)
  }
  const onDelete = () => {
    emit('deleteFile')
  }
</script>

<style lang="scss" scoped>
  .flex-right {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
  }
</style>
