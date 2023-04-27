<template>
  <div class="fr-container fr-p-5w">
    <TheHeader title="Mon compte" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main
          ref="main"
          class="main-container fr-p-5w"
        >
          <ul>
            <li>
              <NuxtLink
                class="fr-link"
                :to="inclusionConnectAccountUrl"
                target="_blank"
                title="Nouvel onglet - Modifier mon mot de passe InclusionConnect"
              >
                Modifier mon mot de passe
              </NuxtLink>
            </li>
          </ul>
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Routes } from '~/utils/routing/routes'

  const {
    public: {
      inclusionConnect: { issuer, clientId },
      appUrl
    }
  } = useRuntimeConfig()

  const inclusionConnectAccountUrlBase = `${issuer}/account`

  const params = new URLSearchParams({
    referrer: clientId,
    referrer_uri: `${appUrl}${Routes.Account}`
  })

  const inclusionConnectAccountUrl = `${inclusionConnectAccountUrlBase}?${params}`
</script>
