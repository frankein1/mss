<template>
  <div class="success">
    <div class="success-hero">
      <AtomPictogram path="/pictograms/success.svg" />
      <p class="fr-h5">
        Bénéficiaire ajouté avec succès.<br />
        Il s’agit désormais d’un dossier “foyer”.
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
          <span class="fr-text--bold"
            >Eléments partagés au sein du dossier&nbsp;:</span
          >
          les documents, le budget, les suivis communs.
        </p>
      </div>
    </div>

    <div class="success-content">
      <div class="content-icon fr-mr-2w">
        <span
          class="fr-icon-user-line"
          aria-hidden="true"
        ></span>
      </div>
      <div class="content-text">
        <p>
          <span class="fr-text--bold">Eléments individuels&nbsp;:</span>
          la fiche informations de chaque bénéficiaire, les suivis individuels.
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
