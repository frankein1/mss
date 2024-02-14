<template>
  <div class="notification-list-header__container">
    <AtomPictogram
      path="/pictograms/notification.svg"
      class="fr-mr-2w"
    />
    <div>
      <div class="notification-list-header__title-container">
        <h2 class="fr-h4 notification-list-header__title">
          Notifications & échéances
        </h2>
        <button
          class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-right fr-icon-question-line fr-btn--tooltip"
          aria-describedby="notification-more-info-tooltip"
        >
          En savoir plus
        </button>
        <div
          id="notification-more-info-tooltip"
          class="fr-tooltip fr-placement"
          role="tooltip"
          aria-hidden="true"
        >
          <ul>
            <li>
              Définissez des dates d'échéances à la création d'un accompagnement
              (entretien ou instruction d'un dossier) dans le dossier d'un
              bénéficiaire. Un rappel est envoyé un mois avant et le jour de
              l'échéance.
            </li>
            <li>
              Les commentaires déposés par un·e collègue sur l'un de vos
              accompagnements vous sont notifiés dans la catégorie
              "commentaires".
            </li>
            <li>
              Le filtre "ajouts d'un tiers" vous permet de retrouver tous les
              documents et accompagnements réalisés par un·e collègue sur les
              dossiers des bénéficiaires dont vous êtes référent·e.
            </li>
          </ul>
        </div>
      </div>
      <p class="fr-mb-0">
        Suivi des modifications sur vos dossiers bénéficiaires et rappels des
        échéances.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use '~/assets/style/variables' as *;

  .notification-list-header__container {
    padding: 1.5rem 1rem;
    display: flex;
    align-items: center;

    > :last-child {
      width: 100%;
    }
  }

  .notification-list-header__title-container {
    width: 100%;
    margin-bottom: 0.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .notification-list-header__title {
    color: $primary;
    margin-bottom: 0;
  }
</style>
