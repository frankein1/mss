<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppSocialSupportSubjectAdd()" />

    <PageTitle :title="title" />

    <AtomCallout>
      <div class="note">
        <p class="fr-callout__text">
          Choisissez des objets qui correspondent au mieux au fonctionnement de
          votre structure. Vous trouverez des suggestions d'objets ci-dessous.
          Vous pouvez également créer des intitulés sur-mesure. Les objets
          seront utilisés dans les formulaires de suivi, alimenteront vos
          statistiques et vous permettront de facilement retrouver vos dossiers.
        </p>

        <img
          src="~/assets/icons/inclusion.svg"
          class="img"
          alt=""
        />
      </div>
    </AtomCallout>

    <main>
      <AtomLoader
        v-if="pending"
        class="fr-mx-auto"
      />

      <AtomAlert
        v-else-if="error"
        :alert-type="AlertType.Error"
        message="Les informations de votre structure n'ont pas pu être chargées."
      />

      <div v-else-if="data">
        <SocialSupportSubjectsAdd :subjects="data.socialSupportSubjects" />

        <SocialSupportSubjectsCustom />
      </div>
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { RouteTitle, Breadcrumb } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'

  const title = RouteTitle.AppSocialSupportSubjectAdd()

  useHead({ title })

  const trpcClient = useTrpcClient()

  // TODO replace by getting only all sss whatever their status is
  const { data, pending, error, refresh } =
    await trpcClient.structure.getCurrentUserStructure.useQuery()
</script>

<style scoped lang="scss">
  .note {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
</style>
