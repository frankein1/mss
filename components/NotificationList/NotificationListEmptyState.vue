<template>
  <div class="notification-list__empty-state-container">
    <img
      src="~/assets/img/empty-notification.svg"
      class="fr-responsive-img"
      alt=""
    />
    <p class="fr-mb-0">{{ message }}</p>
    <p
      v-if="hintMessage"
      class="fr-hint-text"
    >
      {{ hintMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import { NotificationTypeFilterValue } from '~/client/options'
  const { isReceptionAgent } = useAuthState()

  const props = defineProps<{
    notificationType?: NotificationTypeFilterValue | '' | null
  }>()

  const message = computed(() => {
    switch (props.notificationType) {
      case NotificationTypeFilterValue.DueDate:
        return "Vous n'avez pas de nouveau rappel d'échéance"
      case NotificationTypeFilterValue.NewComment:
        return "Vous n'avez pas de nouveaux commentaires"
      case NotificationTypeFilterValue.NewItem:
        return "Aucune nouvelle action n'a été réalisée sur vos dossiers"
      default:
        return "Vous n'avez pas de nouvelle notification"
    }
  })

  const hintMessage = computed(() => {
    switch (props.notificationType) {
      case NotificationTypeFilterValue.DueDate:
        return "Définissez des dates d'échéances à la création d'un accompagnement (entretien ou instruction d'un dossier) dans le dossier d'un bénéficiaire. Un rappel est envoyé un mois avant et le jour de l'échéance."
      case NotificationTypeFilterValue.NewComment:
        return 'Les commentaires déposés par votre collègue sur l\'un de vos accompagnements vous sont notifiés dans la catégorie "Commentaires".'
      case NotificationTypeFilterValue.NewItem:
        return 'Le filtre "Ajouts d\'un tiers" vous permet de retrouver tous les documents ajoutés et accompagnements réalisés par votre collègue sur les dossiers des bénéficiaires dont vous êtes référent.'
      case NotificationTypeFilterValue.Archivage:
        return isReceptionAgent()
          ? 'Votre rôle utilisateur ne vous autorise pas à archiver les dossiers des bénéficiaires. Rapprochez-vous de votre responsable de structure pour toute modification concernant votre rôle.'
          : ''
      default:
        return ''
    }
  })
</script>

<style scoped lang="scss">
  .notification-list__empty-state-container {
    padding: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    > .fr-responsive-img {
      margin-bottom: 1rem;
      max-width: 15rem;
    }

    .fr-hint-text {
      margin-bottom: 0;
      text-align: center;
    }
  }
</style>
