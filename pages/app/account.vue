<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppAccount()" />
    <PageTitle :title="title" />
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
                :to="data"
                target="_blank"
                title="Modifier mon mot de passe InclusionConnect - nouvelle fenêtre"
                rel="noopener external"
                >Modifier mon mot de passe</NuxtLink
              >
            </li>
          </ul>
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { Breadcrumb, RouteTitle } from '~/utils/routing'

  const title = RouteTitle.AppAccount()

  useHead({ title })

  const data =
    await useTrpcClient().config.getInclusionConnectEditPasswordUrl.query()
</script>
