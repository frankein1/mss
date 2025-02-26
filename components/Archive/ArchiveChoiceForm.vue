<template>
  <div class="feature-section fr-mt-1w">
    <h2 class="fr-h4">
      Que souhaitez-vous faire du dossier&nbsp;?&nbsp;<span class="color-red"
        >*</span
      >
    </h2>
    <p>
      Attention, les données ne doivent pas être conservées plus de deux ans à
      compter du dernier contact, sauf si cela est justifié. La CNIL émet des
      préconisations à cet égard, consultez le
      <NuxtLink
        to="https://www.cnil.fr/sites/cnil/files/atoms/files/referentiel_relatif_aux_traitements_de_donnees_personnelles_pour_le_suivi_social_et_medico-social_des_personnes_agees_en_situation_de_handicap_ou_en_difficulte.pdf"
        external
        target="_blank"
        >référentiel en vigueur </NuxtLink
      >. S'il s'agit d'un dossier foyer, les autres membres ne seront pas
      impactés par ces choix.
    </p>
    <AtomAlert
      v-if="!archivePermission || !deletePermission"
      class="fr-mb-2w"
      :alert-type="AlertType.Warning"
      :message="getWarningMessage()"
    />
    <form
      ref="archiveChoiceForm"
      novalidate
    >
      <VeeRadioButtons
        name="archive"
        label="archiver"
        :no-label="true"
        :options="radioButtonOptions"
        :pictos="archivePictos"
        :inline="false"
        :rich="true"
        @change-value="changeValue($event)"
      />
    </form>
    <AtomCallout v-if="archiveDueDateHistory > 0">
      <p>Ce dossier a déjà été conservé {{ archiveDueDateHistory }} fois.</p>
    </AtomCallout>
    <p>
      <button
        class="fr-link"
        type="button"
        :disabled="!archivePermission || !delayPermission"
        @click="changeValue('delay')"
      >
        Je souhaite conserver le dossier 1 an supplémentaire.
      </button>
    </p>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'

  const archiveChoiceForm = ref<HTMLFormElement | null>(null)

  const props = defineProps<{
    archiveDueDateHistory: number
    pending: boolean
    archivePermission: boolean | undefined
    deletePermission: boolean
    delayPermission: boolean
  }>()

  const emit = defineEmits<{
    changeValue: [value: string]
    delayArchive: []
  }>()

  // keys have to be the value of radioButtonOptions
  const archivePictos = {
    delete: '/pictograms/supprimer.svg',
    archive: '/pictograms/archive.svg'
  }

  const radioButtonOptions = computed(() => [
    {
      value: 'delete',
      label: 'Supprimer définitivement le dossier',
      disabled: props.pending || !props.deletePermission
    },
    {
      value: 'archive',
      label: 'Réaliser une archive et supprimer le dossier',
      disabled: props.pending || !props.archivePermission
    }
  ])

  const getWarningMessage = () => {
    if (!props.deletePermission && !props.archivePermission) {
      return "vous n'avez pas l'autorisation de gérer le dossier. Rapprochez-vous de votre responsable."
    }
    if (!props.deletePermission) {
      return "vous n'avez pas l'autorisation de supprimer le dossier. Rapprochez-vous de votre responsable."
    }
    if (!props.archivePermission) {
      return "vous n'avez pas l'autorisation d'archiver le dossier. Rapprochez-vous de votre responsable."
    }
    return ''
  }

  const { resetForm } = useForm({
    initialValues: {}
  })
  const changeValue = (value: string) => {
    emit('changeValue', value)

    if (value === 'delay') {
      resetForm({ values: {} }, { force: true })
      emit('delayArchive')
    }
  }
</script>

<style lang="scss" scoped>
  .fr-link {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.25rem;

    &:hover {
      background-color: transparent;
      text-decoration-thickness: 2px;
    }
  }

  .fr-link[disabled] {
    text-decoration-color: var(--text-disabled-grey);

    &:hover {
      text-decoration-thickness: 1px;
      background-color: transparent;
    }
  }
</style>
