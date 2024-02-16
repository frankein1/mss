s
<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppPartners()" />
    <PageTitle :title="title" />
    <main>
      <div class="fr-h4 partner-subtitle fr-m-0">
        {{ `${data?.length} organismes partenaires de votre structure` }}
      </div>
      <div class="fr-m-0">
        Les personnes avec un rôle "responsable de structure" ou "travailleur
        social" peuvent ajouter, modifier ou supprimer des partenaires
      </div>
      <div class="fr-py-2w partner-search-container">
        <div class="partner-search-bar">
          <VeeSearchInput
            name="search"
            label="Rechercher"
          />
        </div>
        <template v-if="application.module.partner">
          <div class="partner-search-add">
            <button
              class="fr-btn fr-btn--icon-left fr-btn--sm fr-btn--secondary fr-icon-add-line"
            >
              Ajouter
            </button>
          </div>
        </template>
      </div>
      <div class="catalog">
        <div
          v-for="partner in data"
          :key="partner.id"
          class="catalog-item fr-p-2w fr-mb-2w"
        >
          <div class="fr-h6 fr-m-0">
            {{ partner.name }}
          </div>
          <div
            v-if="partner.address || partner.zipcode || partner.city"
            class="fr-icon-map-pin-2-line partner-info fr-text--sm fr-m-0"
          >
            {{
              `${partner.address || ''} ${partner.zipcode || ''} ${partner.city || ''}`
            }}
          </div>
          <div
            v-if="partner.phone1"
            class="fr-icon-phone-line partner-info fr-text--sm fr-m-0"
          >
            {{ partner.phone1 }}
          </div>
          <div
            v-if="partner.phone2"
            class="fr-icon-phone-line partner-info fr-text--sm fr-m-0"
          >
            {{ partner.phone2 }}
          </div>
          <div
            v-if="partner.email"
            class="fr-icon-mail-line partner-info fr-text--sm fr-m-0"
          >
            {{ partner.email }}
          </div>
          <div
            v-if="partner.workingHours"
            class="fr-text--sm fr-m-0 working-hours"
          >
            {{ partner.workingHours }}
          </div>
        </div>
      </div>
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { Breadcrumb, RouteTitle } from '~/utils/routing'

  const title = RouteTitle.AppPartners()

  useHead({ title })

  const { application } = usePermissions()
  const trpcClient = useTrpcClient()

  const { data } = await trpcClient.config.getPartnerOrganizations.useQuery()
</script>

<style lang="scss">
  .partner-subtitle {
    color: var(--primary);
  }

  .partner-search-container {
    display: flex;
    flex-wrap: wrap;
  }

  .partner-search-bar {
    flex: 0 0 calc(66.666% - 12px);
  }

  .partner-search-add {
    margin-left: auto;
  }

  .catalog {
    column-count: 3;
  }

  .catalog-item {
    margin: 0;
    display: grid;
    grid-template-rows: 1fr auto;
    break-inside: avoid;

    border: 1px solid;
    border-color: var(--border-default-grey);
    border-radius: 4px;

    background-color: white;
  }

  .partner-info {
    color: var(--text-default-grey);
  }

  .working-hours {
    color: var(--text-mention-grey);
  }
</style>
