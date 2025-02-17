<template>
  <AtomAlertMSS
    :alert-type="AlertType.Warning"
    :closable="false"
  >
    <template #detailedMessage>
      <p>Son dossier n'a pas été mis à jour depuis 2 ans.</p>
      <p>
        Conformément au
        <NuxtLink
          to="https://www.cnil.fr/sites/cnil/files/atoms/files/referentiel_relatif_aux_traitements_de_donnees_personnelles_pour_le_suivi_social_et_medico-social_des_personnes_agees_en_situation_de_handicap_ou_en_difficulte.pdf"
          external
          target="_blank"
          >référentiel en vigueur
        </NuxtLink>
        vous devez réaliser une action et décider du traitement à apporter au
        dossier.
      </p>
    </template>
  </AtomAlertMSS>
  <div class="btn-container--right fr-mt-2w">
    <button
      class="fr-btn"
      type="button"
      @click="validate()"
    >
      Gérer le dossier
    </button>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'

  defineProps<{
    validate: () => void
  }>()
</script>
