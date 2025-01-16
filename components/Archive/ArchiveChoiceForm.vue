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
    <p>
      Je souhaite
      <button
        class="fr-link"
        type="button"
        @click="changeValue('delay')"
      >
        conserver le dossier 1 an supplémentaire.
      </button>
    </p>
  </div>
</template>

<script lang="ts" setup>
  import { FamilyFilePermissions } from '~/server/security'

  const archiveChoiceForm = ref<HTMLFormElement | null>(null)

  const props = defineProps<{
    permissions?: FamilyFilePermissions | undefined
    pending: boolean
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
      disabled: !props.permissions?.delete || props.pending
    },
    {
      value: 'archive',
      label: 'Réaliser une archive et supprimer le dossier',
      // TODO: archive must be a permission. Ex: props.permissions.archive
      disabled: props.pending
    }
  ])

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
    color: inherit;
  }
</style>
