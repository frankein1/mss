<template>
  <div class="content">
    <div class="content-icon fr-mr-2w">
      <span
        class="fr-icon-group-line"
        aria-hidden="true"
      ></span>
    </div>
    <div class="content-text">
      <p>
        Tous les éléments relatifs à votre accompagnement (documents, budget,
        suivis) seront visibles dans un seul et même dossier. Chaque
        bénéficiaire conserve sa fiche d'informations personnelles et son
        statut.
      </p>
    </div>
  </div>
  <hr />
  <div>
    <p class="fr-text--bold">
      Un décès, une séparation, un enfant quitte le foyer&nbsp;?
    </p>

    <div class="content">
      <div class="content-icon fr-mr-2w">
        <span
          class="fr-icon-check-line"
          aria-hidden="true"
        ></span>
      </div>
      <div class="content-text">
        <p>
          Retirez un membre du dossier via le bouton “Dissocier du dossier” sur
          la fiche bénéficiaire en question. Les documents et les suivis communs
          seront dupliqués dans chaque fiche.
        </p>
      </div>
    </div>
    <div class="content">
      <div class="content-icon fr-mr-2w">
        <span
          class="fr-icon-check-line"
          aria-hidden="true"
        ></span>
      </div>
      <div class="content-text">
        <p>
          Si une des 2 personnes décède, vous conserverez la fiche de l’autre
          bénéficiaire et les informations communes (documents, budget, suivis
          communs...)
        </p>
      </div>
    </div>
  </div>
  <div class="actions">
    <button
      class="fr-btn fr-btn--primary fr-mb-0"
      @click="modal.close()"
    >
      Fermer
    </button>
  </div>
</template>

<script lang="ts" setup>
  const modal = useModal()
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    .content-icon {
      color: var(--primary);
    }
  }

  .actions {
    text-align: right;
  }
</style>
