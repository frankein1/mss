<template>
  <PageContainer>
    <PageBreadcrumb :links="Breadcrumb.Account()" />
    <PageTitle :title="RouteTitle.Account()" />
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
                title="Nouvel onglet - Modifier mon mot de passe InclusionConnect"
              >
                Modifier mon mot de passe
              </NuxtLink>
            </li>
          </ul>
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { Breadcrumb, RouteTitle } from '~/utils/routing'

  const data = await useTrpcClient().config.getInclusionConnectLogoutUrl.query()
</script>
