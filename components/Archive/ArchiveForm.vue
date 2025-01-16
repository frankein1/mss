<template>
  <form
    ref="archiveForm"
    novalidate
  >
    <div class="feature-section fr-mt-4w">
      <h2 class="fr-h4">
        Conserver son prénom et son nom dans Mon Suivi Social durant
        2&nbsp;ans&nbsp;?&nbsp;<span class="color-red">*</span>
      </h2>
      <p class="muted">
        Son dossier passera au statut archivé. Le reste des informations ne sera
        plus visible.
      </p>
      <VeeRadioButtons
        name="keepName"
        label="Conserver prénom et nom dans Mon suivi Social"
        :no-label="true"
        :options="keepNameOptions"
        :inline="false"
        @change-value="onChangeKeepName($event)"
      />
    </div>

    <section ref="reasonSection">
      <template v-if="keepName != null">
        <div class="feature-section fr-mt-4w">
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
        </div>

        <AtomAlertMSS
          class="fr-mt-4w"
          :alert-type="AlertType.Warning"
          message="Le dossier sera définitivement supprimé de Mon Suivi Social après son téléchargement"
        >
          <template #detailedMessage>
            <p>
              L’ensemble des données relatives au dossier seront supprimées de
              Mon Suivi Social. Le dossier et ses accompagnements ne seront plus
              comptabilisés dans les statistiques. Seuls le nom et le prénom
              seront conservés si vous avez sélectionné l’option.
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
            Supprimer dénitivement
          </button>
        </div>
      </template>
    </section>
  </form>
</template>

<script lang="ts" setup>
  import { archiveReasonKeys, ArchiveReasons } from '~/client/options/archive'
  import { ExportBeneficiaryInput } from '~/server/schema/beneficiary/exportbeneficiary.schema'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    downloadReceived: boolean
    beneficiaryId: string
    pending: boolean
  }>()

  const emit = defineEmits<{
    downloadArchive: [value: ExportBeneficiaryInput]
    deleteFile: []
  }>()

  const keepName = ref<boolean | null>(null)
  const reasonSection = ref<HTMLElement | null>(null)

  const keepNameOptions = computed(() => [
    { label: 'Non, tout supprimer', value: 'false', disabled: props.pending },
    { label: 'Oui, conserver ', value: 'true', disabled: props.pending }
  ])

  const onChangeKeepName = (value: string) => {
    keepName.value = value === 'true'
    setTimeout(() => {
      reasonSection?.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 100)
  }

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

  const onDownloadArchive = () => {
    emit('downloadArchive', {
      ...formValues,
      keepName: keepName.value as boolean
    })
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
