<template>
  <div>
    <template v-if="beneficiaryNames.length > 1">
      <ul>
        <li
          v-for="name in beneficiaryNames"
          :key="name"
        >
          {{ name }}
        </li>
      </ul>
    </template>
    <AtomAlertMSS
      :alert-type="AlertType.Warning"
      :closable="false"
    >
      <template #detailedMessage>
        <p v-if="beneficiaryNames.length > 1">
          Leurs dossiers n'ont pas été mis à jour depuis plus de 2 ans.
        </p>
        <p v-else>Son dossier n'a pas été mis à jour depuis 2 ans.</p>
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
        <span v-if="beneficiaryNames.length > 1">Gérer les dossiers</span>
        <span v-else>Gérer le dossier</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'

  defineProps<{
    beneficiaryNames: string[]
    validate: () => void
  }>()
</script>
