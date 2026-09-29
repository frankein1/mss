<template>
  <AtomLazyComponent
    :error="Boolean(sharingsError)"
    message="Les structures associées n'ont pas pu être chargées."
    :pending="sharingsStatus === 'pending'"
  >
    <section class="feature-section fr-p-5v fr-p-md-10v fr-mb-5w">
      <h3 class="fr-h5">Structures actives</h3>

      <p v-if="activeSharings.length === 0">
        Aucune structure ne partage ses statistiques avec vous pour le moment.
        Une structure doit vous inviter depuis son espace de configuration.
      </p>

      <div
        v-else
        class="fr-table fr-table--no-caption fr-mb-0"
      >
        <table>
          <caption>
            Structures partageant leurs statistiques avec vous
          </caption>
          <thead>
            <tr>
              <th scope="col">Structure</th>
              <th scope="col">Type</th>
              <th scope="col">Commune</th>
              <th scope="col">Accès accordé le</th>
              <th scope="col">Accès</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="sharing in activeSharings"
              :key="sharing.id"
            >
              <td>{{ sharing.structure.name }}</td>
              <td>{{ structureTypeKeys.value(sharing.structure.type) }}</td>
              <td>
                {{ sharing.structure.zipcode }} {{ sharing.structure.city }}
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
                  Révoquer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section
      v-if="revokedSharings.length"
      class="feature-section fr-p-5v fr-p-md-10v"
    >
      <h3 class="fr-h5">Structures révoquées</h3>
      <p class="fr-text--sm text--muted">
        Accès auxquels vous avez renoncé, ou qui vous ont été retirés. Seule la
        structure concernée peut vous autoriser à nouveau.
      </p>

      <div class="fr-table fr-table--no-caption fr-mb-0">
        <table>
          <caption>
            Structures dont l'accès a été révoqué
          </caption>
          <thead>
            <tr>
              <th scope="col">Structure</th>
              <th scope="col">Type</th>
              <th scope="col">Commune</th>
              <th scope="col">Accès révoqué le</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="sharing in revokedSharings"
              :key="sharing.id"
            >
              <td>{{ sharing.structure.name }}</td>
              <td>{{ structureTypeKeys.value(sharing.structure.type) }}</td>
              <td>
                {{ sharing.structure.zipcode }} {{ sharing.structure.city }}
              </td>
              <td>{{ formatDate(sharing.revokedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </AtomLazyComponent>
</template>

<script lang="ts" setup>
  import DecisionMakerSharingRevokeModal from '~/components/DecisionMaker/DecisionMakerSharingRevokeModal.vue'
  import { structureTypeKeys } from '~~/client/options'

  const modal = useModal()
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()

  const {
    data: sharings,
    error: sharingsError,
    status: sharingsStatus,
    refresh
  } = await trpcClient.decisionMakerAccount.getMySharings.useQuery()

  type Sharing = NonNullable<typeof sharings.value>['active'][number]

  const activeSharings = computed(() => sharings.value?.active ?? [])
  const revokedSharings = computed(() => sharings.value?.revoked ?? [])

  function formatDate(date: Date | null) {
    return date ? new Date(date).toLocaleDateString('fr-FR') : '—'
  }

  function openRevokeModal(sharing: Sharing) {
    modal.open(DecisionMakerSharingRevokeModal, {
      title: "Révoquer l'accès",
      name: sharing.structure.name,
      isSubmitting: false,
      revoke: () => onRevoke(sharing.id)
    })
  }

  async function onRevoke(id: string) {
    modal.patch<typeof DecisionMakerSharingRevokeModal>({ isSubmitting: true })
    try {
      await trpcClient.decisionMakerAccount.revokeSharing.mutate({
        sharingId: id
      })
      modal.close()
      await refresh()
      snackbar.success("L'accès a été révoqué.")
    } catch {
      modal.patch<typeof DecisionMakerSharingRevokeModal>({
        isSubmitting: false
      })
      snackbar.error("L'accès n'a pas pu être révoqué.")
    }
  }
</script>
