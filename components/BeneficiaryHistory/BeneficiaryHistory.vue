<template>
  <div>
    <section class="feature-section fr-mb-4w">
      <h3 class="fr-sr-only">Filtres</h3>
      <BeneficiaryHistoryFilters
        v-model:values="socialSupportsFilters"
        :results-label="resultsLabel"
        :family-file-identification="familyFileIdentification"
        :device-name-options="deviceNames ?? []"
      />
    </section>
    <AtomAlert
      v-if="
        (rdvspAuthStatus === 'no_account' ||
          rdvspAuthStatus === 'disconnected') &&
        !isRdvspAlertHidden
      "
      :alert-type="AlertType.Error"
      closeable
      message="Connexion à Rendez-vous Service Public impossible"
      @close="isRdvspAlertHidden = true"
      ><template #detailedMessage>
        <template v-if="rdvspAuthStatus === 'no_account'">
          <p>
            Vous ne pouvez pas voir les rendez-vous déjà pris avec le module de
            prise de rdv.
          </p>
          <ul>
            <li>
              Soit votre compte RDV Service Public n’est pas encore actif :
              connectez-vous ici
              <div class="fr-pt-2v">
                <NuxtLink
                  class="fr-btn fr-btn--secondary"
                  :to="
                    apiRoutes.rdvsp.ApiSignIn.path({
                      action: 'goToFamilyFileHistory',
                      id: familyFileId
                    })
                  "
                  external
                  @click="trackRdvspReconnection"
                  >Se connecter à RDV SP</NuxtLink
                >
              </div>
            </li>
            <li>
              Soit votre compte n’existe pas, votre responsable de structure
              doit vous le créer sur RDV Service Public
            </li>
          </ul>
        </template>
        <template v-else>
          <div>
            <p>
              Vous avez été déconnecté de RDVSP, reconnectez-vous pour afficher
              les rendez-vous.
            </p>
            <div class="fr-pt-2v">
              <NuxtLink
                class="fr-btn fr-btn--secondary"
                :to="
                  apiRoutes.rdvsp.ApiSignIn.path({
                    action: 'goToFamilyFileHistory',
                    id: familyFileId
                  })
                "
                external
                @click="trackRdvspReconnection"
                >Se connecter à RDV SP</NuxtLink
              >
            </div>
          </div>
        </template>
      </template></AtomAlert
    >
    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="L'historique du bénéficiaire n'a pas pu être chargé."
    />
    <template v-else-if="items">
      <template v-if="!items.length">
        <p v-if="!socialSupportsFilters">
          Créez une synthèse d'entretien pour commencer à alimenter l'historique
          du bénéficiaire.
        </p>
        <p v-else>Aucun résultat ne correspond aux filtres sélectionnés.</p>
      </template>
      <template v-else>
        <section>
          <h3 class="fr-sr-only">Liste des accompagnements</h3>
          <ul class="history-list">
            <BeneficiaryHistoryDetails
              v-for="item in items"
              :key="item.id"
              :item="item"
              :family-file-permissions="familyFilePermissions"
              :single-beneficiary="
                (familyFileIdentification || []).length === 1
              "
              @deleted="onHistoryItemDeleted"
            />
          </ul>
        </section>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import type { FamilyFilePermissions } from '~/server/security'
  import type { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import type { SocialSupportFilterInput } from '~/server/schema'
  import { apiRoutes } from '~/utils/routes'
  import { BeneficiaryHistoryAction, EventCategory } from '~/types/matomo'

  const trpcClient = useTrpcClient()
  const { application } = usePermissions()

  const { familyFileId, familyFilePermissions, familyFileIdentification } =
    defineProps<{
      familyFileId: string
      familyFilePermissions: FamilyFilePermissions
      familyFileIdentification: BeneficiaryFileIdentification[]
    }>()
  const socialSupportsFilters = ref<SocialSupportFilterInput>({})

  const { data: deviceNames } =
    await trpcClient.file.getDeviceNamesForFamilyFile.useQuery(
      computed(() => ({ familyFileId }))
    )

  const socialSupportsQueryInput = computed(() => ({
    familyFileId,
    filters: socialSupportsFilters.value
  }))
  const { data: socialSupports, error } =
    await trpcClient.file.getSocialSupports.useQuery(socialSupportsQueryInput, {
      queryKey: 'getFamilyFile.history'
    })
  const { data: rdvspAuthStatus } = application.value.module.rdv
    ? await trpcClient.rdvsp.getAuthStatus.useQuery()
    : { data: ref(null) }
  const isRdvspAlertHidden = ref(false)

  const emit = defineEmits<{ refresh: [] }>()

  const items = computed(() => socialSupports.value ?? [])

  const resultsLabel = computed(() => {
    const plural = items.value.length > 1 ? 's' : ''
    return `${items.value.length} accompagnement${plural}`
  })

  function onHistoryItemDeleted(socialSupportId: string) {
    if (!socialSupports.value) {
      return
    }
    socialSupports.value = socialSupports.value.filter(
      ({ id }) => id !== socialSupportId
    )
    emit('refresh')
  }

  function trackRdvspReconnection() {
    const matomo = useMatomo()
    matomo.trackEvent(
      EventCategory.History,
      BeneficiaryHistoryAction.ReconnectToRdsvp
    )
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/dsfr/core/index' as dsfr;

  .history-list {
    @include dsfr.disable-list-style;

    > *:not(:last-child) {
      margin-bottom: 2rem;
    }
  }

  .fr-alert {
    margin-bottom: 2rem;
  }

  .test {
    display: flex;
    place-content: center space-between;
  }
</style>
