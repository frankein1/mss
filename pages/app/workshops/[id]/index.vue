<template>
  <AtomAlert
    v-if="error"
    :alert-type="AlertType.Error"
    message="Les informations de l'atelier n'ont pas pu être chargées."
  />
  <AtomLoader
    v-else-if="pending"
    class="fr-mx-auto"
  />
  <div v-else-if="workshop">
    <div class="fr-container--fluid container-top">
      <PageContainer class="fr-pb-1w fr-pt-1w">
        <AtomBreadcrumb :links="breadcrumbs.workshop.AppWorkshop(workshop)" />
        <NuxtLink
          :to="routes.workshop.AppWorkshops.path()"
          class="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-line fr-btn--icon-left"
        >
          Retour
        </NuxtLink>
        <WorkshopHeader :workshop="workshop" />
      </PageContainer>
    </div>
    <div class="fr-container--fluid container-middle">
      <PageContainer>
        <WorkshopCreateAttendee class="add-participant" />
      </PageContainer>
    </div>
    <div class="fr-container--fluid">
      <PageContainer class="fr-pb-1w fr-pt-1w">
        <WorkshopAttendeeList :workshop="workshop" />
      </PageContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { routes } from '~/utils/routes'
  import { AlertType } from '~/utils/constants/alert'

  const trpcClient = useTrpcClient()
  const route = useRoute()
  const workshopId = route.params.id as string

  const {
    data: workshop,
    pending,
    error
  } = await trpcClient.workshop.getOne.useQuery({
    id: workshopId
  })

  useHead({
    title: routes.workshop.AppWorkshop.title(workshop.value || null)
  })
</script>

<style lang="scss" scoped>
  .container-top {
    background-color: var(--color-workshop-light);
  }

  .container-middle {
    background: var(--color-workshop-light);
    background: linear-gradient(
      180deg,
      var(--color-workshop-light) 0%,
      var(--color-workshop-light) 50%,
      var(--background-alt-grey) 50%,
      var(--background-alt-grey) 100%
    );

    .fr-container {
      padding-bottom: 0 !important;
    }
  }

  .add-participant {
    margin: 0 auto;
  }
</style>
