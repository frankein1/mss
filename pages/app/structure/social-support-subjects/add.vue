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
          <SocialSupportSubjectsSelection :subjects="data" />

          <SocialSupportSubjectsCustomCreation />

          <ul
            class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right"
          >
            <li>
              <button
                class="fr-btn fr-btn--secondary"
                type="button"
                @click="onCancel"
              >
                Annuler
              </button>
            </li>
            <li>
              <button
                class="fr-btn submit-btn"
                type="submit"
                :submitting="isSubmitting"
                :disabled="isSubmitting"
              >
                Valider
              </button>
            </li>
          </ul>
        </form>
      </div>
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { RouteTitle, Breadcrumb, RoutePath } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'
  import {
    updateSocialSupportSubjectsSchema,
    UpdateSocialSupportSubjectsInput
  } from '~/server/schema'

  const title = RouteTitle.AppStructureSocialSupportSubjectAdd()

  useHead({ title })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const { data, pending, error } =
    await trpcClient.structure.getCreateSocialSupportSubjects.useQuery()

  const form = ref<HTMLFormElement | null>(null)
  const isSubmitting = ref(false)

  const { handleSubmit, meta } = useForm<UpdateSocialSupportSubjectsInput>({
    validationSchema: toTypedSchema(updateSocialSupportSubjectsSchema),
    initialValues: {
      selected: (data.value || []).map(({ id, inactive, name }) => ({
        id,
        active: !inactive,
        name
      })),
      custom: []
    }
  })

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const onSubmit = handleSubmit(values => {
    isNavigatingWithFormActions.value = true
    useTrpcMutation({
      mutation: () =>
        trpcClient.structure.updateSocialSupportSubjects.mutate(values),
      onSuccess: () => {
        navigateTo(RoutePath.AppStructure())
      },
      onFailure: () => {
        snackbar.error('La mise a jour a échoué.')
      }
    })
  })

  const onCancel = () => {}
</script>

<style scoped lang="scss">
  .note {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
</style>
