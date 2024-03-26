<template>
  <form
    novalidate
    @submit.prevent="onSubmit"
  >
    <main class="fr-container content">
      <PageTitle :title="title" />

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
          >
            Valider
          </button>
        </li>
      </ul>
    </div>
  </form>
</template>

<script lang="ts" setup>
  import { RouteTitle, RoutePath } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'
  import {
    updateSocialSupportSubjectsSchema,
    UpdateSocialSupportSubjectsInput
  } from '~/server/schema'

  const title = RouteTitle.AppStructureSubjects()

  useHead({ title })
  const route = useRoute()
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const structureId = route.params.id as string

  const { data, pending, error } =
    await trpcClient.admin.getSocialSupportSubjects.useQuery({
      id: structureId
    })

  const { handleSubmit } = useForm<UpdateSocialSupportSubjectsInput>({
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

  const onSubmit = handleSubmit(values => {
    useTrpcMutation({
      mutation: () =>
        trpcClient.admin.updateSocialSupportSubjects.mutate({
          structureId,
          ...values
        }),
      onSuccess: () => {
        navigateTo(RoutePath.AdminStructure(structureId))
        snackbar.success('Objet(s) d’accompagnement(s) ajouté(s) avec succès')
      },
      onFailure: () => {
        snackbar.error('La mise a jour a échoué.')
      }
    })
  })

  const onCancel = () => {
    navigateTo(RoutePath.AdminStructure(structureId))
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
    padding: 1rem;
  }
</style>
