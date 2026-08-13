<template>
  <div class="success">
    <div class="success-hero">
      <AtomPictogram path="/pictograms/success.svg" />
      <p class="fr-h5">
        Bénéficiaire ajouté avec succès.<br />
        Tous les bénéficiaires sont rassemblés dans un dossier “foyer”.
      </p>
    </div>

    <div class="success-content">
      <div class="content-icon fr-mr-2w">
        <span
          class="fr-icon-group-line"
          aria-hidden="true"
        ></span>
      </div>
      <div class="content-text">
        <p>
          Chaque bénéficiaire conserve ses informations personnelles, ses
          documents et ses suivis individuels mais ces éléments sont rassemblés
          au sein d'un seul et même dossier.
        </p>
      </div>
    </div>

    <div class="success-content fr-mb-6w">
      <div class="content-icon fr-mr-2w">
        <span
          class="fr-icon-money-euro-circle-line"
          aria-hidden="true"
        ></span>
      </div>
      <div class="content-text">
        <p>
          Le budget est commun à tous les membres du dossier. Pensez à le mettre
          à jour.
        </p>
      </div>
    </div>

    <ul class="fr-btns-group fr-btns-group--inline-md btns-groups">
      <li>
        <button
          type="button"
          class="fr-btn fr-btn--secondary fr-mb-0"
          @click="$emit('goToBeneficiary')"
        >
          Voir le dossier
        </button>
      </li>
      <li>
        <button
          type="button"
          class="fr-btn fr-btn fr-mb-0"
          @click="$emit('goToBeneficiaryForm')"
        >
          Remplir la fiche détaillée
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  defineEmits<{
    goToBeneficiary: []
    goToBeneficiaryForm: []
  }>()
</script>

<style scoped lang="scss">
  .btns-groups {
    justify-content: flex-end;
  }

  .success {
    .success-hero {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      p {
        text-align: center;
      }
    }

    .success-content {
      display: flex;
      flex-direction: row;
      align-items: flex-start;

      .content-icon {
        color: var(--primary);
      }
    }
  }
</style>
