<template>
  <div class="sss-list-empty___container">
    <img
      src="~/assets/img/empty-social-subject-list.svg"
      class="fr-responsive-img"
      alt=""
    />
    <div class="text">Vous n’avez aucun objet d’accompagnement configuré.</div>
  </div>
</template>

<style scoped lang="scss">
  .sss-list-empty__container {
    padding: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    > .fr-responsive-img {
      margin-bottom: 1rem;
      max-width: 15rem;
    }

    > .text {
      margin-bottom: 0;
      text-align: center;
    }
  }
</style>
