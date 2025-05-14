<template>
  <div class="beneficiary-toolbar toolbar-wrapper">
    <div class="toolbar-search">
      <BeneficiarySearchbarInput
        class="beneficiary-search fr-mr-2w"
        label="Rechercher un dossier bénéficiaire"
        name="beneficiary-search"
        :search-fn="searchBeneficiaries"
      >
        <template #result="{ result: beneficiary, search }">
          <div class="fr-grid-row fr-grid-row--middle fr-mx-3w fr-my-2w">
            <NuxtLink
              :to="
                r.AppFile.path(beneficiary.familyFileId, {
                  originPage: routeName,
                  beneficiaryId: beneficiary.id
                })
              "
              class="fr-col fr-mr-2w result"
            >
              <div class="fr-grid-col">
                <div class="fr-grid-row fr-grid-row--middle">
                  <BeneficiarySearchbarResultName
                    class="fr-text--regular fr-text--lg fr-mr-1w text--primary result-name"
                    :name="formatBeneficiarySearchDisplayName(beneficiary)"
                    :input="search"
                  />
                  <BeneficiaryStatusBadge
                    :status="beneficiary.status"
                    small
                  />
                </div>
                <div
                  v-if="beneficiary.birthDate || beneficiary.phone1"
                  class="fr-grid-row text--muted fr-text--regular fr-text--sm whitespace-pre-wrap fr-mt-1v"
                >
                  <span>{{ formatDate(beneficiary.birthDate) }}</span>
                  <span v-if="beneficiary.birthDate && beneficiary.phone1">
                    –
                  </span>
                  <span>{{ beneficiary.phone1 }}</span>
                </div>
              </div>
            </NuxtLink>
            <NuxtLink
              v-if="beneficiary.status !== BeneficiaryStatus.Archived"
              :to="
                routes.followup.AppBeneficiaryFollowupAdd.path(
                  beneficiary.familyFileId,
                  {
                    beneficiaryId: beneficiary.id
                  }
                )
              "
              class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-add-line fr-btn--sm"
              title="Ajouter une synthèse d'entretien"
            >
              Créer une synthèse
            </NuxtLink>
          </div>
          <hr class="separator" />
        </template>
      </BeneficiarySearchbarInput>
    </div>
    <div class="toolbar-create">
      <NuxtLink
        :to="r.AppFileAdd.path()"
        class="fr-btn fr-btn--lg fr-btn--icon-left fr-icon-user-add-line add-beneficiary-btn"
        @click="onAccessBeneficiaryAdd"
      >
        Créer un dossier bénéficiaire
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'

  import {
    AccessBeneficiaryAddEventAction,
    EventCategory
  } from '~/types/matomo'
  import { BeneficiaryStatus } from '@prisma/client'

  const route = useRoute()

  const r = routes.file
  type RouteName =
    | typeof routes.user.AppOverview.name
    | typeof routes.beneficiary.AppBeneficiaries.name
  const routeName = route.name as RouteName | undefined

  async function searchBeneficiaries(query: string) {
    const beneficiaries = await useTrpcClient().beneficiary.search.query({
      query
    })
    return beneficiaries
  }

  function onAccessBeneficiaryAdd() {
    const matomo = useMatomo()
    matomo.trackEvent(
      EventCategory.AccessBeneficiaryAdd,
      AccessBeneficiaryAddEventAction.FromOverview
    )
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .separator {
    padding: 0 24px;
    height: 1px;
    margin: 0 24px;
  }

  .beneficiary-toolbar {
    display: flex;
  }

  .add-beneficiary-btn {
    border-radius: 2.25rem;
  }

  .beneficiary-search {
    flex: 1 1 auto;
  }

  .result {
    background: none;
  }

  .result:hover .result-name {
    text-decoration: underline;
  }

  .toolbar-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    .toolbar-search {
      width: auto;
      flex: 2;
    }

    .toolbar-create {
      min-width: fit-content;
      max-width: fit-content;
      flex: 1;
    }

    @include dsfr-media-query.respond-from('md') {
      flex-direction: row;
      align-items: center;
    }
  }
</style>
