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
          <p class="fr-h5 fr-mb-2v">
            Vous ne pouvez pas supprimer cet utilisateur car il a déjà des
            éléments saisis.
          </p>
          <p class="fr-text--bold">
            Rapprochez vous de l'équipe de Mon Suivi Social si besoin.
          </p>
          <ul v-if="blockingCounts.length > 0">
            <li
              v-for="{ relation, label, count } in blockingCounts"
              :key="relation"
            >
              {{ toFirstLetterUpperCase(label) }}&nbsp;: {{ count }}
            </li>
          </ul>
        </template>
        <p
          v-else
          class="fr-h4 text--primary"
        >
          La suppression est définitive et a des impacts sur les suivis déjà
          réalisés
        </p>

        <div class="image-text-container">
          <img
            src="/assets/img/innovation.svg"
            alt=""
          />
          <p class="fr-mb-0 fr-text--bold">
            Si vous souhaitez que cette personne n’ait plus accès à Mon Suivi
            Social, tout en conservant ses dossiers et suivis, utilisez plutôt
            la fonction «&nbsp;désactiver l’utilisateur&nbsp;». La désactivation
            est disponible depuis la page de modification du compte.
          </p>
        </div>
        <template v-if="!userHasFiles">
          <div class="fr-checkbox-group fr-mt-6v">
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
              Je confirme que je souhaite supprimer l’utilisateur et que
              l’action est définitive.
            </label>
            <div
              id="checkbox-delete-zone"
              class="fr-messages-group"
              aria-live="polite"
            ></div>
          </div>

          <button
            type="button"
            :disabled="!deleteValue || isDeleting"
            class="fr-btn fr-btn--icon-left fr-btn-primary btn-delete-action fr-mt-6v"
            :class="{
              'fr-icon-delete-bin-6-line': !isDeleting,
              'btn-loading': isDeleting
            }"
            @click="deleteUser(userId)"
          >
            Supprimer l'utilisateur
          </button>
        </template>
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
  import {
    userBlockingRelationLabels,
    type UserBlockingRelation
  } from '~~/client/labels'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { AlertType } from '~/utils/constants/alert'
  import { EventCategory, UserAction } from '~~/types/matomo'

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
    id: userId,
    withCounts: true
  })

  /** Relations that still link data to the account, zero counts left out */
  const blockingCounts = computed(() => {
    const counts = user.value?._count
    if (!counts) {
      return []
    }
    return Object.entries(userBlockingRelationLabels)
      .map(([relation, label]) => ({
        relation,
        label,
        count: counts[relation as UserBlockingRelation] ?? 0
      }))
      .filter(({ count }) => count > 0)
  })

  const userHasFiles = computed(() => blockingCounts.value.length > 0)

  const userName = computed(
    () => `${user.value?.firstName} ${user.value?.lastName}`
  )

  const title = computed(() =>
    routes.structure.AppStructureUserDelete.title(userName.value)
  )
  useHead({ title })

  const breadcrumbLinks = computed(() =>
    breadcrumbs.structure.AppStructureUserDelete(userName.value)
  )

  /* server/route/user/deleteUser.mutation.ts */
  const {
    mutate,
    status: deleteStatus,
    error: deleteError
  } = trpcClient.user.delete.useMutation()
  const isDeleting = computed(() => deleteStatus.value === 'pending')

  const deleteUser = async (id: string) => {
    // The disabled attribute only applies on the next DOM update
    if (isDeleting.value) {
      return
    }
    const userDeleted = await mutate({ id })
    if (deleteError.value || !userDeleted) {
      snackbar.error(
        deleteError.value?.message ||
          "La suppression de l'utilisateur a échoué.",
        snackbar.focus('.feature-section', '.btn-delete-action')
      )
      return
    }
    matomo.trackEvent(EventCategory.User, UserAction.DeleteUser)
    snackbar.success("L'utilisateur a été supprimé avec succès.")
    await navigateTo(routes.structure.AppStructureUsers.path())
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
