<template>
  <AtomAlert
    v-if="isAntillesGuyane && open"
    closeable
    :alert-type="AlertType.Info"
    message="correction à venir sur les champs dates"
    class="fr-mb-2v"
    @close="open = false"
  >
    <template #detailedMessage>
      <p>
        Votre structure est située dans un DROM. Tous les champs "dates" (date
        d'échéance, date de naissance, etc...) ont un décalage d'un jour.
      </p>
      <p>
        Une correction sera apportée <strong>le 19 mai</strong> et vos dates
        mises à jour.
        <strong
          >Continuez de saisir les dates sous le format choisi jusqu'ici et ne
          modifiez pas vos dossiers.</strong
        >
      </p>
      <p>
        Si vous avez utilisé dans ces champs un format J+1 merci de prendre
        contact avec nous à l'adresse
        <NuxtLink :to="`mailto:${supportEmail}`">{{ supportEmail }}</NuxtLink
        >.
      </p>
    </template>
  </AtomAlert>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'

  const { isAntillesGuyane } = useStructureState()
  const {
    public: {
      email: { from: supportEmail }
    }
  } = useRuntimeConfig()

  const open = ref(true)
</script>
