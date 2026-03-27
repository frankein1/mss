<template>
  <AtomLazyComponent
    :error="Boolean(initialUserError)"
    :pending="initialUserStatus === 'idle' || initialUserStatus === 'pending'"
    message="Les informations de l'utilisateur n'ont pas pu être chargées."
  >
    <PageContainer class="container">
      <AtomBreadcrumb :links="breadcrumbLinks" />
      <NuxtLink
        class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-arrow-left-line fr-mb-4v"
        :to="routes.structure.AppStructureUserEdit.path(userId)"
      >
        Retour
      </NuxtLink>
      <PageTitle :title="title" />

      <section
        v-if="authUserId !== userId"
        class="feature-section"
      >
        <template v-if="userHasFiles">
          <h2 class="fr-h4 text--primary fr-mb-2v">
            Vous ne pouvez pas supprimer cet utilisateur car il a déjà des
            éléments saisis.
          </h2>
          <p class="fr-text--bold">
            Rapprochez vous de l'équipe de Mon Suivi Social si besoin.
          </p>
        </template>
        <h2
          v-else
          class="fr-h4 text--primary"
        >
          La suppression est définitive et a des impacts sur les suivis déjà
          réalisés.
        </h2>

        <ul v-if="userHasFiles && user?._count">
          <li>
            Nombre de dossier dont la personne est référente&nbsp;:
            {{ user._count.referentFor }}
          </li>
          <li>
            Nombre d'accompagnements créés&nbsp;:
            {{ user._count.createdSocialSupports }}
          </li>
          <li>
            Nombre de documents créés&nbsp;: {{ user._count.createdDocuments }}
          </li>
          <li>
            Nombre de commentaires créés&nbsp;:
            {{ user._count.createdComments }}
          </li>
          <li>Nombre d'atelier créés&nbsp;: {{ user._count.workshops }}</li>
          <li>
            Nombre de nom d'atelier créés&nbsp;: {{ user._count.workshopNames }}
          </li>
        </ul>

        <div class="image-text-container">
          <img
            src="/assets/img/innovation.svg"
            alt=""
          />
          <p class="fr-mb-0">
            Si vous souhaitez que cette personne n’ait plus accès à Mon Suivi
            Social, tout en conservant ses dossiers et suivis, utilisez plutôt
            la fonction «&nbsp;désactiver l’utilisateur&nbsp;». La désactivation
            est disponible depuis la page de modification du compte.
          </p>
        </div>
        <div
          v-if="!userHasFiles"
          class="fr-checkbox-group fr-mt-6v"
        >
          <input
            id="checkbox-delete-confirmation"
            v-model="deleteValue"
            name="checkbox"
            type="checkbox"
            aria-describedby="checkbox-delete-zone"
          />
          <label
            class="fr-label"
            for="checkbox-delete-confirmation"
          >
            Je confirme que je souhaite supprimer l’utilisateur et que l’action
            est définitive.
          </label>
          <div
            id="checkbox-delete-zone"
            class="fr-messages-group"
            aria-live="polite"
          ></div>
        </div>

        <button
          type="button"
          :disabled="userHasFiles || !deleteValue"
          class="fr-btn fr-icon-delete-bin-6-line fr-btn--icon-left fr-btn-primary btn-delete-action fr-mt-6v"
          @click="deleteUser(userId)"
        >
          Supprimer l'utilisateur
        </button>
      </section>

      <section
        v-else
        class="feature-section"
      >
        <AtomAlert
          :alert-type="AlertType.Error"
          class="fr-mb-6v"
          message="Vous ne pouvez pas supprimer votre propre compte."
        />
      </section>
    </PageContainer>
  </AtomLazyComponent>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { AlertType } from '~/utils/constants/alert'
  import { EventCategory, UserAction } from '~/types/matomo'

  const route = useRoute()
  const userId = route.params.id as string
  const deleteValue = ref()
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const authState = useAuthState()
  const matomo = useMatomo()

  const authUserId = authState.getUserId

  const {
    data: user,
    status: initialUserStatus,
    error: initialUserError
  } = await trpcClient.user.get.useQuery({
    id: userId
  })

  const userHasFiles = computed(() => {
    return (
      user?.value &&
      ((user.value._count.referentFor && user.value._count.referentFor > 0) ||
        (user.value._count.createdDocuments &&
          user.value._count.createdDocuments > 0) ||
        (user.value._count.createdSocialSupports &&
          user.value._count.createdSocialSupports > 0) ||
        (user.value._count.createdComments &&
          user.value._count.createdComments > 0) ||
        (user.value._count.workshops && user.value._count.workshops > 0) ||
        (user.value._count.workshopNames &&
          user.value._count.workshopNames > 0))
    )
  })

  const title = routes.structure.AppStructureUserDelete.title(
    `${user?.value?.firstName} ${user?.value?.lastName}`
  )
  useHead({ title })

  const breadcrumbLinks = computed(() =>
    breadcrumbs.structure.AppStructureUserDelete(
      `${user?.value?.firstName} ${user?.value?.lastName}`
    )
  )

  const { mutate, error: deleteError } = trpcClient.user.delete.useMutation()
  const deleteUser = async (id: string) => {
    const userDeleted = await mutate({ id })
    if (deleteError.value || !userDeleted) {
      snackbar.error(
        deleteError.value?.message ||
          "La suppression de l'utilisateur a échoué.",
        () => snackbar.focus('form', 'select')
      )
      return
    }
    matomo.trackEvent(EventCategory.User, UserAction.DeleteUser)
    snackbar.success("L'utilisateur a été supprimé avec succès.")
    await navigateTo(routes.structure.AppStructure.path())
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .container {
    @include dsfr-media-query.respond-from('sm') {
      min-height: calc(100vh - 6.0625rem - 3.5rem);
    }
  }

  .image-text-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }
</style>
