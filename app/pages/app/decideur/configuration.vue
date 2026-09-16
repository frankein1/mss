<template>
  <PageContainer>
    <PageTitle :title="title" />

    <AtomLazyComponent
      :error="Boolean(organisationError)"
      message="Les informations de votre organisation n'ont pas pu être chargées."
      :pending="organisationStatus === 'pending'"
    >
      <section class="feature-section fr-p-5v fr-p-md-10v fr-mb-5w">
        <h2 class="fr-h4 section-title">Informations de mon organisation</h2>

        <ul class="information-list">
          <li>
            <span class="fr-text--bold">Organisation&nbsp;:</span>
            {{ organisation?.user.structure?.name ?? 'Non identifiée' }}
          </li>
          <li>
            <span class="fr-text--bold">SIRET&nbsp;:</span>
            {{ organisation?.user.structure?.siret ?? '—' }}
          </li>
          <li>
            <span class="fr-text--bold">Votre compte&nbsp;:</span>
            {{ organisation?.user.firstName }}
            {{ organisation?.user.lastName }} — {{ organisation?.user.email }}
          </li>
          <li v-if="organisation?.invitedBy">
            <span class="fr-text--bold"
              >Compte créé à l'invitation de&nbsp;:</span
            >
            {{ organisation.invitedBy.structure.name }}
            <template v-if="organisation.invitedBy.createdBy">
              par {{ organisation.invitedBy.createdBy.firstName }}
              {{ organisation.invitedBy.createdBy.lastName }}
            </template>
            le {{ formatDate(organisation.invitedBy.createdAt) }}
          </li>
        </ul>

        <p
          v-if="!organisation?.user.structure"
          class="fr-text--sm text--muted fr-mt-2w fr-mb-0"
        >
          Votre organisation n'a pas pu être identifiée lors de votre connexion.
          Cela n'empêche pas la consultation des statistiques qui vous sont
          partagées.
        </p>
      </section>
    </AtomLazyComponent>

    <AtomLazyComponent
      :error="Boolean(structuresError)"
      message="Les structures associées n'ont pas pu être chargées."
      :pending="structuresStatus === 'pending'"
    >
      <section class="feature-section fr-p-5v fr-p-md-10v">
        <h2 class="fr-h4 section-title">Structures associées</h2>

        <p v-if="!structures || structures.length === 0">
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
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="structure in structures"
                :key="structure.id"
              >
                <td>{{ structure.name }}</td>
                <td>{{ structureTypeKeys.value(structure.type) }}</td>
                <td>{{ structure.zipcode }} {{ structure.city }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </AtomLazyComponent>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { structureTypeKeys } from '~~/client/options'
  import { routes } from '~/utils/routes'

  const title = routes.decisionMaker.AppDecisionMakerConfiguration.title
  useHead({ title })

  const trpcClient = useTrpcClient()

  const {
    data: organisation,
    error: organisationError,
    status: organisationStatus
  } = await trpcClient.decisionMaker.getMyOrganisation.useQuery()

  const {
    data: structures,
    error: structuresError,
    status: structuresStatus
  } = await trpcClient.decisionMaker.getAuthorizedStructures.useQuery()

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('fr-FR')
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .section-title {
    color: var(--primary);
    font-size: 1.5rem;

    @include dsfr-media-query.respond-from('md') {
      font-size: 2.5rem;
    }
  }
</style>
