<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppStructureSocialSupportSubjectAdd()" />

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
        <form
          ref="form"
          novalidate
          @submit.prevent="onSubmit"
        >
          <SocialSupportSubjectsSelection
            :subjects="data.socialSupportSubjects"
          />

          <SocialSupportSubjectsCustomCreation />

          <SocialSupportSubjectsAddActions
            :is-submitting="isSubmitting"
            @cancel="navigateTo(RoutePath.AppStructure())"
          />
        </form>
      </div>
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { RouteTitle, RoutePath, Breadcrumb } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'
  import {
    updateListSocialSupportSubjectSchema,
    UpdateListSocialSupportSubjectInput
  } from '~/server/schema'

  const title = RouteTitle.AppStructureSocialSupportSubjectAdd()

  useHead({ title })

  const trpcClient = useTrpcClient()

  // TODO replace by getting only all sss whatever their status is
  const { data, pending, error } =
    await trpcClient.structure.getCurrentUserStructure.useQuery()

  const form = ref<HTMLFormElement | null>(null)
  const isSubmitting = ref(false)

  const { handleSubmit, meta } = useForm<UpdateListSocialSupportSubjectInput>({
    validationSchema: toTypedSchema(updateListSocialSupportSubjectSchema),
    initialValues: {
      selected: (data.value?.socialSupportSubjects || []).map(
        ({ id, inactive, name }) => ({
          id,
          active: !inactive,
          name
        })
      ),
      custom: []
    }
  })

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const onSubmit = handleSubmit(() => {
    isNavigatingWithFormActions.value = true
  })
</script>

<style scoped lang="scss">
  .note {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
</style>
