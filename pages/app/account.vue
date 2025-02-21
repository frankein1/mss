<template>
  <PageContainer>
    <AtomBreadcrumb :links="breadcrumbs.user.AppAccount()" />
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main
          ref="main"
          class="main-container fr-p-5w"
        ></main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.user.AppAccount.title

  useHead({ title })
</script>
