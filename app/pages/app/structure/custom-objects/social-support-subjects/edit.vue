<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-container content fr-pb-5w">
      <AtomBreadcrumb
        :links="breadcrumbs.structure.AppStructureSocialSupportSubjectsEdit()"
      />

      <PageTitle :title="title" />

      <AtomCallout class="fr-mb-5w">
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
            src="/pictograms/inclusion.svg"
            class="fr-hidden fr-unhidden-sm img"
            alt=""
          />
        </div>
      </AtomCallout>

      <AtomLazyComponent
        :pending
        :error="error != null || !data"
        message="Les informations de votre structure n'ont pas pu être chargées."
      >
        <div
          v-if="data"
          data-fr-group="false"
          class="fr-accordions-group"
        >
          <section class="feature-section fr-accordion fr-mb-1w">
            <h2 class="fr-accordion__title">
              <button
                class="fr-accordion__btn fr-h4"
                type="button"
                aria-expanded="true"
                aria-controls="accordion-selection"
              >
                Sélectionner parmi une suggestion d'objets
              </button>
            </h2>
            <div
              id="accordion-selection"
              type="button"
              class="fr-collapse"
            >
              <SocialSupportSubjectsSelection :subjects="data" />
            </div>
          </section>
          <section class="feature-section fr-accordion">
            <h2 class="fr-accordion__title">
              <button
                class="fr-accordion__btn fr-h4"
                type="button"
                aria-expanded="true"
                aria-controls="accordion-customization"
              >
                Créer un objet personnalisé
              </button>
            </h2>

            <div
              id="accordion-customization"
              class="fr-collapse"
            >
              <SocialSupportSubjectsCustomCreation />
            </div>
          </section>
        </div>
      </AtomLazyComponent>
    </div>
    <AtomActionsBar>
      <ul
        class="fr-btns-group fr-btns-group--lg fr-btns-group--inline-md fr-btns-group--right"
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
            :disabled="isSubmitting"
            :data-submitting="isSubmitting"
          >
            Valider
          </button>
        </li>
      </ul>
    </AtomActionsBar>
  </form>
</template>

<script lang="ts" setup>
  import type { UpdateSocialSupportSubjectsInput } from '~~/server/schema'
  import { updateSocialSupportSubjectsSchema } from '~~/server/schema'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.structure.AppStructureSocialSupportSubjectsEdit.title

  useHead({ title })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const { data, pending, error } =
    await trpcClient.structure.getSocialSupportSubjects.useQuery()

  const form = useTemplateRef('form')
  const isSubmitting = ref(false)

  const { handleSubmit, meta, setErrors } =
    useForm<UpdateSocialSupportSubjectsInput>({
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

  const nameCanBeUpdated = async (name: string) => {
    const subjectWithSameNameExists =
      await trpcClient.structure.findSocialSupportSubject.query({
        name: name.trim().toLocaleLowerCase()
      })
    return !subjectWithSameNameExists
  }

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const onSubmit = handleSubmit(async values => {
    isNavigatingWithFormActions.value = true
    let error = false
    for (const [index, custom] of values.customs.entries()) {
      const isValid = await nameCanBeUpdated(custom.name)
      if (!isValid) {
        error = true
        setErrors({
          [`customs[${index}].name`]: ["Cet objet d'accompagnement existe déjà"]
        })
      }
    }
    if (error) {
      return
    }
    useTrpcMutation({
      mutation: () =>
        trpcClient.structure.updateSocialSupportSubjects.mutate(values),
      onSuccess: () => {
        navigateTo(routes.structure.AppStructureCustomObjects.path())
        snackbar.success('Objet(s) d’accompagnement(s) ajouté(s) avec succès')
      },
      onFailure: () => {
        snackbar.error('La mise a jour a échoué.')
      }
    })
  })

  const onCancel = () => {
    navigateTo(routes.structure.AppStructureCustomObjects.path())
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .note {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .fr-accordion__btn {
    padding: 2rem 2.5rem;

    &[aria-expanded='true'] {
      background: none;
      border-bottom: 1px solid var(--border-default-grey);
    }
  }

  form > .fr-container {
    min-height: calc(100vh - 6rem - 145px);

    @include dsfr-media-query.respond-from('md') {
      min-height: calc(100vh - 3rem - 97px);
    }
  }
</style>
