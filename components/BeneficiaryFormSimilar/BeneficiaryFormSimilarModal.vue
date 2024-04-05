<template>
  <div>
    <p class="fr-mb-0">
      Êtes-vous sûr·e de vouloir créer ce nouveau bénéficiaire ?
    </p>
    <p>
      Dossier déjà existant :
      {{ formatBeneficiaryNameAndBirthDate(similarBeneficiary) }}
    </p>
    <div
      class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg"
    >
      <button
        class="fr-btn"
        @click="modal.close()"
      >
        Revenir au formulaire
      </button>
      <button
        class="fr-btn fr-btn--secondary"
        @click="confirmCreation"
      >
        Confirmer la création
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SimilarBeneficiary } from '~/server/trpc/routers'
  import { formatBeneficiaryNameAndBirthDate } from '~/utils/beneficiary'

  const modal = useModal()

  const props = defineProps<{
    similarBeneficiary: Exclude<SimilarBeneficiary, undefined>
    create: () => void
  }>()

  function confirmCreation() {
    props.create()
    modal.close()
  }
</script>
