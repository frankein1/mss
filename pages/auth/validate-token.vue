<template>
  <main class="landing-main-container fr-container fr-my-8w">
    <client-only>
      <validate-token />
      <template #fallback>
        <div class="fr-grid-row fr-my-5w">
          <div class="fr-col fr-col-lg-8 fr-col-offset-lg-2 text-center">
            <h1 class="fr-text--regular">
              <span>{{ RouteTitle.AuthValidateToken() }}...</span>
            </h1>
          </div>
        </div>
      </template>
    </client-only>
  </main>
</template>
<script setup lang="ts">
  import { RouteTitle } from '~/utils/routing'

  useHead({
    title: RouteTitle.AuthValidateToken()
  })

  definePageMeta({
    layout: 'landing'
  })
</script>
