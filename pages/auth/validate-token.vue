<template>
  <main class="landing-main-container fr-container fr-my-8w">
    <client-only>
      <ValidateToken />
      <template #fallback>
        <div class="fr-grid-row fr-my-5w">
          <div class="fr-col fr-col-lg-8 fr-col-offset-lg-2 text-center">
            <h1 class="fr-text--regular">
              <span>{{ routes.auth.AuthValidateToken.title }}...</span>
            </h1>
          </div>
        </div>
      </template>
    </client-only>
  </main>
</template>
<script setup lang="ts">
  import { routes } from '~/routes'

  useHead({
    title: routes.auth.AuthValidateToken.title
  })

  definePageMeta({
    layout: 'landing'
  })
</script>
