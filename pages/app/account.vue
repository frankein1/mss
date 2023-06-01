<template>
  <PageContainer>
    <PageTitle title="Mon compte" />
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
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
  const data = await useTrpcClient().config.getInclusionConnectLogoutUrl.query()
</script>
