<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <main class="fr-container content">
      <DsfrBreadcrumb
        :links="Breadcrumb.AppStructureSocialSupportSubjectAdd()"
      />

      <PageTitle :title="title" />

      <AtomCallout>
        <div class="note">
          <p class="fr-callout__text">
            Choisissez des objets qui correspondent au mieux au fonctionnement
            de votre structure. Vous trouverez des suggestions d'objets
            ci-dessous. Vous pouvez également créer des intitulés sur-mesure.
            Les objets seront utilisés dans les formulaires de suivi,
            alimenteront vos statistiques et vous permettront de facilement
            retrouver vos dossiers.
          </p>

          <img
            src="~/assets/icons/inclusion.svg"
            class="img"
            alt=""
          />
        </div>
      </AtomCallout>

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
        <div class="fr-accordions-group">
          <section class="feature-section fr-accordion">
            <h3 class="fr-accordion__title">
              <button
                class="fr-accordion__btn fr-h4"
                type="button"
                aria-expanded="false"
                aria-controls="accordion-selection"
              >
                Sélectionner parmi une suggestion d’objets
              </button>
            </h3>
            <div
              id="accordion-selection"
              type="button"
              class="fr-collapse"
            >
              <SocialSupportSubjectsSelection :subjects="data" />
            </div>
          </section>
          <section class="feature-section fr-accordion">
            <h3 class="fr-accordion__title">
              <button
                class="fr-accordion__btn fr-h4"
                type="button"
                aria-expanded="false"
                aria-controls="accordion-customization"
              >
                Créer un objet personnalisé
              </button>
            </h3>

            <div
              id="accordion-customization"
              class="fr-collapse"
            >
              <SocialSupportSubjectsCustomCreation />
            </div>
          </section>
        </div>
      </div>
    </main>
    <div class="actions-bar">
      <ul class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right">
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
    </div>
  </form>
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
      customs: []
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
        snackbar.success('Objet(s) d’accompagnement(s) ajouté(s) avec succès')
      },
      onFailure: () => {
        snackbar.error('La mise a jour a échoué.')
      }
    })
  })

  const onCancel = () => {
    navigateTo(RoutePath.AppStructure())
  }
</script>

<style scoped lang="scss">
  .note {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  $actions-bar-height: 9rem;

  .content {
    height: calc(100vh - #{$actions-bar-height});
    overflow: scroll;
  }

  .actions-bar {
    background-color: white;
    padding: 1rem 1rem;
  }
</style>
