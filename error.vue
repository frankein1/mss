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
        <template v-if="typeof line === 'object'">
          <NuxtLink
            v-if="line.type === 'url'"
            :to="line.content"
            external
            target="_blank"
            >{{ line.content }}</NuxtLink
          >
        </template>
        <template v-else>{{ line }}</template>
        <br v-if="index < solutions.length - 1" />
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
      <li v-if="hasSignoutLink">
        <NuxtLink
          class="fr-btn"
          :to="apiRoutes.proConnect.ApiLogoutProconnectOnly.path()"
          external
          >Réessayer une connexion</NuxtLink
        >
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
  import { apiRoutes } from '~/utils/routes'

  const {
    public: {
      email: { from: supportEmail },
      mssEnvironment
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
      case 401:
        return 'Accès interdit'
      case 403:
        return props.error.message.match(/unknown user/i)
          ? 'Utilisateur inconnu'
          : 'Accès interdit'
      default:
        return 'Erreur inattendue'
    }
  })

  useHead({
    title: pageTitle.value,
    bodyAttrs: {
      class: computed(() => {
        if (mssEnvironment === 'demo') {
          return 'ribbon ribbon-demo'
        }
        if (mssEnvironment === 'development') {
          return 'ribbon ribbon-development'
        }
        if (mssEnvironment === 'local') {
          return 'ribbon ribbon-local'
        }
        return ''
      })
    }
  })

  const intro = computed(() => {
    switch (props.error.statusCode) {
      case 404:
        return 'La page que vous cherchez est introuvable. Excusez-nous pour la gène occasionnée.'
      case 401:
        return "Les informations d'authentification sont incorrectes."
      case 403: {
        if (props.error.message.match(/mfa necessary/i)) {
          return "L'authentification double facteur est nécessaire pour accéder à l'application."
        }
        if (props.error.message.match(/unknown user/i)) {
          return "Aucun compte Mon Suivi Social n'est rattaché à votre compte ProConnect."
        }
        return "Vous n'avez pas les droits suffisants pour accéder à cette page."
      }
      default:
        return 'Désolé, le service rencontre un problème, nous travaillons pour le résoudre le plus rapidement possible.'
    }
  })

  const solutions = computed(() => {
    switch (props.error.statusCode) {
      case 404:
        return [
          "Si vous avez tapé l'adresse web dans le navigateur, vérifiez qu'elle est correcte. La page n'est peut-être plus disponible.",
          "Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d'accueil.",
          "Sinon, contactez-nous pour que l'on puisse vous rediriger vers la bonne information."
        ]
      case 503:
        return [
          "Merci de réessayer plus tard, vous serez en mesure de réutiliser le service très rapidement. Si vous avez besoin d'une aide immédiate, merci de nous contacter directement."
        ]
      case 401:
        return [
          'Merci de réessayer.',
          "Si vous avez besoin d'une aide immédiate, merci de nous contacter directement."
        ]
      case 403: {
        if (props.error.message.match(/mfa necessary/i)) {
          const devInstructions = [
            "En démo et développement, l'instance de Proconnect Identité est :",
            {
              type: 'url',
              content: 'https://identite-sandbox.proconnect.gouv.fr/'
            }
          ]
          return [
            "Configurez votre second facteur à l'aide des instructions suivantes :",
            {
              type: 'url',
              content:
                'https://proconnect.crisp.help/fr/article/quest-ce-que-la-double-authentification-1m5mpmj/.'
            },
            ...(mssEnvironment !== 'production' ? devInstructions : [])
          ]
        }
        if (props.error.message.match(/unknown user/i)) {
          return [
            'Vous avez accédé à Mon Suivi Social avec ProConnect mais votre compte ProConnect est inconnu de nos services.',
            "Si votre structure a un espace Mon Suivi Social, veuillez vous rapprocher de votre responsable de structure pour qu'un compte Mon Suivi Social rattaché à votre compte ProConnect vous soit créé.",
            'Si votre structure n\'a pas d\'espace Mon Suivi Social, vous trouverez toutes les informations nécessaires pour créer un espace sur notre service sur la page "Créer un espace".',
            "Sinon, contactez-nous pour que nous puissions solutionner vos problèmes d'accès."
          ]
        }
        return [
          'Vérifiez que vous avez bien le rôle nécessaire pour accéder à la page souhaitée et que votre compte Proconnect est bien configuré.',
          "Si vous avez besoin d'une aide immédiate, merci de nous contacter directement."
        ]
      }
      default:
        return [
          "Essayez de rafraichir la page, sinon merci de réessayer plus tard. Si vous avez besoin d'une aide immédiate, merci de nous contacter directement."
        ]
    }
  })

  const hasHomeLink = computed(() => props.error.statusCode === 404)
  const hasSignoutLink = computed(
    () => props.error.statusCode === 403 || props.error.statusCode === 401
  )
</script>
