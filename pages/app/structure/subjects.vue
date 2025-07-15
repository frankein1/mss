<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="content">
      <div class="fr-container fr-pb-5w">
        <AtomBreadcrumb :links="breadcrumbs.structure.AppStructureSubjects()" />

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

        <div
          v-else-if="data"
          class="fr-accordions-group"
        >
          <section class="feature-section fr-accordion fr-mb-1w">
            <h2 class="fr-accordion__title">
              <button
                class="fr-accordion__btn fr-h4"
                type="button"
                aria-expanded="false"
                aria-controls="accordion-selection"
              >
                Sélectionner parmi une suggestion d’objets
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
                aria-expanded="false"
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
      </div>
    </div>

    <AtomActionsBar class="sticky">
      <ul
        class="fr-btns-group fr-btns-group--lg fr-btns-group--inline-sm fr-btns-group--right"
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
            :submitting="status === 'pending'"
            :disabled="status === 'pending'"
          >
            Valider
          </button>
        </li>
      </ul>
    </AtomActionsBar>
  </form>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import {
    updateSocialSupportSubjectsSchema,
    UpdateSocialSupportSubjectsInput
  } from '~/server/schema'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.structure.AppStructureSubjects.title

  useHead({ title })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const { data, pending, error } =
    await trpcClient.structure.getSocialSupportSubjects.useQuery()

  const form = ref<HTMLFormElement | null>(null)

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

  const fmt = (s: string) => s.trim().toLocaleLowerCase()

  /** Match existing names to index in `values` form array and produce
   * error attached to each field
   */
  function buildVeeValidateFormErrors(
    values: { name: string }[],
    existingNames: { id: string; name: string }[]
  ) {
    // build object from array to avoid looping to find match
    const formEntriesMap = values.reduce<Record<string, string>>(
      (acc, cur, index) => ({
        ...acc,
        [`${fmt(cur.name)}`]: `customs[${index}].name`
      }),
      {}
    )

    const errors: Record<string, string[]> = {}

    for (const existingName of existingNames) {
      const key = formEntriesMap[fmt(existingName.name)]
      if (key) {
        errors[key] = ["Cet objet d'accompagnement existe déjà"]
      }
    }

    return errors
  }

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const {
    mutate,
    status,
    error: errorMutation
  } = trpcClient.structure.updateSocialSupportSubjects.useMutation()

  const onSubmit = handleSubmit(async values => {
    isNavigatingWithFormActions.value = true

    const existingNames =
      await trpcClient.structure.searchSocialSupportSubjects.query(
        values.customs.map(input => ({
          name: fmt(input.name)
        }))
      )
    if (existingNames.length > 0) {
      setErrors(buildVeeValidateFormErrors(values.customs, existingNames))
      return
    }

    const updated = await mutate(values)
    if (errorMutation.value || !updated) {
      snackbar.error('La mise a jour a échoué.', snackbar.focus())
      return
    }

    snackbar.success('Objet(s) d’accompagnement(s) ajouté(s) avec succès')
    navigateTo(routes.structure.AppStructure.path())
  })

  const onCancel = () => {
    navigateTo(routes.structure.AppStructure.path())
  }
</script>

<style scoped lang="scss">
  @use '~/assets/style/variables' as *;

  form > .content {
    height: calc(100vh - #{$actions-bar-height} - #{$top-bar-height});
  }

  .sticky {
    position: sticky;
    bottom: 0;
  }

  .note {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .fr-accordion__btn {
    padding: 2rem 2.5rem;
  }
</style>
