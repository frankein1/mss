<template>
  <form
    ref="archiveForm"
    novalidate
  >
    <section class="feature-section fr-mt-4w">
      <h2 class="fr-h4">Précisez les raisons de l’archivage</h2>
      <VeeSelect
        name="reason"
        label="Motif de l'archivage"
        :disabled="pending"
        :options="withEmptyValue(reasons)"
      />
      <VeeInput
        v-if="displayDatePicker"
        type="date"
        name="date"
        label="Date"
        :disabled="pending"
      />
      <VeeInput
        name="clarification"
        label="Précisions"
        :disabled="pending"
      />
    </section>

    <AtomAlertMSS
      class="fr-mt-4w"
      :alert-type="AlertType.Warning"
      message="Le dossier sera définitivement supprimé de Mon Suivi Social après son téléchargement"
    >
      <template #detailedMessage>
        <p>
          L’ensemble des données relatives au dossier seront supprimées de Mon
          Suivi Social. Le dossier et ses accompagnements ne seront plus
          comptabilisés dans les statistiques.
        </p>
      </template>
    </AtomAlertMSS>
    <div class="fr-mt-4w flex-right">
      <button
        class="fr-btn fr-mb-0"
        type="button"
        :disabled="pending"
        @click="onDownloadArchive()"
      >
        {{ pending ? 'Téléchargement en cours' : 'Télécharger' }}
      </button>
      <button
        class="fr-btn fr-btn--icon-left fr-icon-delete-line fr-mb-0 edit-btn"
        :class="{ 'btn-delete-action': !disabledDeleteButton }"
        type="button"
        :disabled="disabledDeleteButton || pending"
        @click="onDelete()"
      >
        Supprimer définitivement
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
  import { ArchiveReason } from '@prisma/client'
  import { archiveReasonKeys } from '~/client/options/archive'
  import type { ExportBeneficiaryInput } from '~/server/schema/beneficiary/exportbeneficiary.schema'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    downloadReceived: boolean
    beneficiaryId: string
    pending: boolean
  }>()

  const emit = defineEmits<{
    downloadArchive: [value: ExportBeneficiaryInput]
    deleteFile: [value: ExportBeneficiaryInput]
  }>()

  const disabledDeleteButton = computed(
    () => !props.downloadReceived || props.pending
  )
  const { values: formValues } = useForm({
    initialValues: {
      beneficiaryId: props.beneficiaryId,
      keepName: false
    }
  })
  const reasons = archiveReasonKeys.options
  const { value: reasonValue } = useField<ArchiveReason>('reason')
  const displayDatePicker: ComputedRef<boolean> = computed(() => {
    const withDate: ArchiveReason[] = [
      ArchiveReason.Death,
      ArchiveReason.Displacement,
      ArchiveReason.Transfer,
      ArchiveReason.EndOfFollowup
    ]
    return withDate.includes(reasonValue.value)
  })

  const onDownloadArchive = () => {
    emit('downloadArchive', {
      ...formValues,
      keepName: false
    })
  }
  const onDelete = () => {
    emit('deleteFile', {
      ...formValues,
      keepName: false
    })
  }
</script>

<style lang="scss" scoped>
  .flex-right {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
  }
</style>
