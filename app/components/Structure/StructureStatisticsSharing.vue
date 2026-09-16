<template>
  <section class="feature-section sharing fr-p-5v fr-p-md-10v">
    <h3 class="fr-h4 sharing__title">Partage des statistiques</h3>

    <AtomCallout>
      <p class="fr-mb-0">
        Vous pouvez autoriser un élu ou un décideur — préfecture, département,
        tête de réseau — à consulter les
        <strong>statistiques agrégées</strong> de votre structure. Aucune donnée
        nominative n'est partagée, et vous pouvez retirer une autorisation à
        tout moment.
      </p>
    </AtomCallout>

    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="Les partages de statistiques n'ont pas pu être chargés."
      :closeable="false"
    />

    <p v-else-if="activeSharings.length === 0 && revokedSharings.length === 0">
      Vous n'avez autorisé personne pour le moment.
    </p>

    <template v-if="activeSharings.length">
      <h3 class="fr-h6 fr-mb-1w">Autorisations en cours</h3>
      <div class="fr-table fr-table--no-caption fr-mb-0">
        <table>
          <caption>
            Personnes autorisées à consulter vos statistiques
          </caption>
          <thead>
            <tr>
              <th scope="col">Personne</th>
              <th scope="col">Organisation</th>
              <th scope="col">Statut</th>
              <th scope="col">Autorisé le</th>
              <th scope="col">
                <span class="fr-sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="sharing in activeSharings"
              :key="sharing.id"
            >
              <td>
                {{ sharing.decisionMaker.firstName }}
                {{ sharing.decisionMaker.lastName }}
                <br />
                <span class="fr-text--xs text--muted">
                  {{ sharing.decisionMaker.email }}
                </span>
              </td>
              <td>{{ sharing.decisionMaker.structure?.name ?? '—' }}</td>
              <td>
                <span
                  class="fr-badge fr-badge--sm fr-badge--no-icon"
                  :class="
                    sharing.decisionMaker.firstAccess
                      ? 'fr-badge--success'
                      : 'fr-badge--info'
                  "
                >
                  {{
                    sharing.decisionMaker.firstAccess
                      ? 'Compte actif'
                      : 'En attente de connexion'
                  }}
                </span>
              </td>
              <td>{{ formatDate(sharing.createdAt) }}</td>
              <td>
                <button
                  class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm btn-delete-action"
                  type="button"
                  data-fr-opened="false"
                  aria-controls="global-modal"
                  @click="openRevokeModal(sharing)"
                >
                  Retirer l'accès
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-if="revokedSharings.length">
      <h3 class="fr-h6 fr-mb-1w fr-mt-3w">Accès retirés</h3>
      <ul class="revoked">
        <li
          v-for="sharing in revokedSharings"
          :key="sharing.id"
          class="fr-text--sm text--muted"
        >
          {{ sharing.decisionMaker.firstName }}
          {{ sharing.decisionMaker.lastName }} — accès retiré le
          {{ formatDate(sharing.revokedAt) }}
        </li>
      </ul>
    </template>

    <div class="fr-grid-row fr-grid-row--right">
      <button
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-line"
        type="button"
        data-fr-opened="false"
        aria-controls="global-modal"
        @click="openInviteModal"
      >
        Autoriser un élu ou un décideur
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
  import StructureStatisticsSharingInviteModal from './StructureStatisticsSharingInviteModal.vue'
  import StructureStatisticsSharingRevokeModal from './StructureStatisticsSharingRevokeModal.vue'
  import type { InviteDecisionMakerInput } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'

  type Sharing = {
    id: string
    createdAt: Date
    revokedAt: Date | null
    decisionMaker: {
      firstName: string | null
      lastName: string | null
      email: string | null
      firstAccess: Date | null
      structure: { name: string } | null
    }
  }

  const modal = useModal()
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const {
    data: sharings,
    error,
    refresh
  } = await trpcClient.statisticsSharing.getForStructure.useQuery()

  const activeSharings = computed(
    () => sharings.value?.filter(sharing => !sharing.revokedAt) ?? []
  )
  const revokedSharings = computed(
    () => sharings.value?.filter(sharing => sharing.revokedAt) ?? []
  )

  function formatDate(date: Date | null) {
    return date ? new Date(date).toLocaleDateString('fr-FR') : '—'
  }

  function openInviteModal() {
    modal.open(StructureStatisticsSharingInviteModal, {
      title: 'Autoriser un élu ou un décideur',
      isSubmitting: isSubmitting.value,
      submit: onInvite
    })
  }

  async function onInvite(values: InviteDecisionMakerInput) {
    modal.patch<typeof StructureStatisticsSharingInviteModal>({
      isSubmitting: true,
      errorMessage: undefined
    })
    try {
      await trpcClient.statisticsSharing.invite.mutate(values)
      modal.close()
      refresh()
      snackbar.success("L'autorisation a été accordée.")
    } catch (error) {
      // Le serveur refuse un email déjà rattaché à un compte non décideur,
      // et une personne déjà autorisée par cette structure.
      modal.patch<typeof StructureStatisticsSharingInviteModal>({
        isSubmitting: false,
        errorMessage: isConflict(error)
          ? 'Cette adresse est déjà utilisée dans Mon Suivi Social, ou cette personne est déjà autorisée.'
          : "L'autorisation n'a pas pu être accordée."
      })
    }
  }

  function isConflict(error: unknown) {
    return (
      typeof error === 'object' &&
      error !== null &&
      'data' in error &&
      (error.data as { httpStatus?: number } | null)?.httpStatus === 409
    )
  }

  function openRevokeModal(sharing: Sharing) {
    modal.open(StructureStatisticsSharingRevokeModal, {
      title: "Retirer l'accès",
      name: `${sharing.decisionMaker.firstName} ${sharing.decisionMaker.lastName}`,
      isSubmitting: false,
      revoke: () => onRevoke(sharing.id)
    })
  }

  async function onRevoke(id: string) {
    modal.patch<typeof StructureStatisticsSharingRevokeModal>({
      isSubmitting: true
    })
    try {
      await trpcClient.statisticsSharing.revoke.mutate({ id })
      modal.close()
      refresh()
      snackbar.success("L'accès a été retiré.")
    } catch {
      modal.patch<typeof StructureStatisticsSharingRevokeModal>({
        isSubmitting: false
      })
      snackbar.error("L'accès n'a pas pu être retiré.")
    }
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .sharing > *:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  // Aligné sur le titre du bloc « Informations sur votre structure »
  .sharing__title {
    color: var(--primary);
    font-size: 1.5rem;

    @include dsfr-media-query.respond-from('md') {
      font-size: 2.5rem;
    }
  }

  .revoked {
    --ul-type: none;
    --ul-start: 0;
  }
</style>
