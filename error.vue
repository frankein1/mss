<template>
  <NuxtLayout name="error">
    <h1>{{ pageTitle }}</h1>
    <p class="fr-text--sm fr-mb-3w">Erreur {{ error.statusCode }}</p>
    <p class="fr-text--lead fr-mb-3w">
      {{ intro }}
    </p>
    <p class="fr-text--sm fr-mb-5w">
      <template
        v-for="(line, index) in solutions"
        :key="line"
      >
        {{ line }}<br v-if="index < solutions.length - 1" />
      </template>
    </p>
    <ul class="fr-btns-group fr-btns-group--inline-md">
      <li v-if="hasHomeLink">
        <NuxtLink
          class="fr-btn"
          to="/"
        >
          Page d'accueil
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          class="fr-btn fr-btn--secondary"
          :to="`mailto:${supportEmail}`"
        >
          Contactez-nous
        </NuxtLink>
      </li>
    </ul>
  </NuxtLayout>
</template>

<script setup lang="ts">
  const {
    public: {
      email: { from: supportEmail }
    }
  } = useRuntimeConfig()

  const props = defineProps<{
    error: {
      url: string
      statusCode: number
      statusMessage: string
      message: string
      description: string
      data: any
    }
  }>()

  const pageTitle = computed(() => {
    switch (props.error.statusCode) {
      case 404:
        return 'Page non trouvée'
      case 503:
        return 'Service indisponible'
      default:
        return 'Erreur inattendue'
    }
  })

  useHead({
    title: pageTitle.value
  })

  const intro = computed(() => {
    switch (props.error.statusCode) {
      case 404:
        return 'La page que vous cherchez est introuvable. Excusez-nous pour la gène occasionnée.'
      default:
        return 'Désolé, le service rencontre un problème, nous travaillons pour le résoudre le plus rapidement possible.'
    }
  })

  const solutions = computed(() => {
    switch (props.error.statusCode) {
      case 404:
        return [
          "Si vous avez tapé l'adresse web dans le navigateur, vérifiez qu'elle est correcte. La page n’est peut-être plus disponible.",
          'Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d’accueil.',
          'Sinon, contactez-nous pour que l’on puisse vous rediriger vers la bonne information.'
        ]
      case 503:
        return [
          'Merci de réessayer plus tard, vous serez en mesure de réutiliser le service très rapidement. Si vous avez besoin d’une aide immédiate, merci de nous contacter directement.'
        ]
      default:
        return [
          'Essayez de rafraichir la page, sinon merci de réessayer plus tard. Si vous avez besoin d’une aide immédiate, merci de nous contacter directement.'
        ]
    }
  })

  const hasHomeLink = computed(() => props.error.statusCode === 404)
</script>
