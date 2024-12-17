<template>
  <p>
    Sans nouvelle activité sur le dossier,
    <span class="fr-text--bold"
      >un prochain rappel pour vous inviter à le supprimer sera envoyé dans 1
      an.</span
    >
    Si vous réalisez une action sur le dossier, alors il sera réactivé pour 2
    ans.
  </p>
  <AtomAlertMSS :alert-type="AlertType.Info">
    <template #detailedMessage>
      <p>
        Pour rappel, les données ne doivent pas être conservées au-delà de 2 ans
        à compter du dernier contact. La CNIL émet des préconisations à cet
        égard, consultez le
        <NuxtLink
          to="https://www.cnil.fr/sites/cnil/files/atoms/files/referentiel_relatif_aux_traitements_de_donnees_personnelles_pour_le_suivi_social_et_medico-social_des_personnes_agees_en_situation_de_handicap_ou_en_difficulte.pdf"
          external
          target="_blank"
          >référentiel en vigueur.
        </NuxtLink>
      </p>
    </template>
  </AtomAlertMSS>
  <div class="btn-container--right fr-mt-2w">
    <button
      class="fr-btn fr-btn--secondary"
      type="button"
      @click="cancel()"
    >
      Annuler
    </button>
    <button
      class="fr-btn"
      type="button"
      @click="validate()"
    >
      Confirmer
    </button>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  const modal = useModal()

  defineProps<{
    validate: () => void
  }>()

  const cancel = () => {
    modal.close()
  }
</script>
