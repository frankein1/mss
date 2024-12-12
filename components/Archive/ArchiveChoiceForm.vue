<template>
  <div class="feature-section fr-mt-1w">
    <h2 class="fr-h4">
      Que souhaitez-vous faire du dossier de
      {{ formatBeneficiaryName(beneficiaryIdentification as Beneficiary) }}
      ?
    </h2>
    <p>
      Son dossier n’a pas été modifié depuis plus de 2 ans. Rappel RGPD
      blablabla. Les autres personnes du dossier foyer ne seront pas impactées
      par ces choix.
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
  import { Beneficiary } from '@prisma/client'
  import { BeneficiaryIdentification } from '~/types/beneficiary'
  import { FamilyFilePermissions } from '~/server/security'

  const archiveChoiceForm = ref<HTMLFormElement | null>(null)

  const props = defineProps<{
    beneficiaryIdentification: BeneficiaryIdentification
    permissions?: FamilyFilePermissions | undefined
  }>()

  const emit = defineEmits<{
    changeValue: [value: string]
  }>()

  // keys have to be the value of radioButtonOptions
  const archivePictos = {
    delete: '/pictograms/supprimer.svg',
    archive: '/pictograms/archive.svg'
  }

  const radioButtonOptions = [
    {
      value: 'delete',
      label: 'Supprimer définitivement le dossier',
      disabled: !props.permissions?.delete || false
    },
    {
      value: 'archive',
      label: 'Réaliser une archive et supprimer le dossier',
      // TODO: archive must be a permission. Ex: props.permissions.archive
      disabled: false
    }
  ]

  const { resetForm } = useForm({
    initialValues: {}
  })
  const changeValue = (value: string) => {
    emit('changeValue', value)

    if (value === 'delay') {
      resetForm({ values: {} }, { force: true })
    }
  }
</script>

<style lang="scss" scoped>
  .fr-link {
    color: inherit;
    text-decoration: underline;
  }
</style>
