<template>
  <PageContainer>
    <AtomBreadcrumb :links="breadcrumbs.structure.AppPartners()" />
    <PageTitle :title="title" />
    <section>
      <h2 class="fr-h4 partner-subtitle fr-m-0">
        {{ `${data?.length} organismes partenaires de votre structure` }}
      </h2>
      <div class="fr-mb-1w">
        Les personnes avec un rôle "responsable de structure" ou "travailleur
        social" peuvent ajouter ou supprimer des partenaires.
      </div>
      <div class="fr-m-0 fr-text--xs">
        Ces informations étant partagées avec l'ensemble des utilisateurs, il
        est fortement recommandé de ne stocker que les informations utiles à
        l'activité de votre structure et informer les contacts qui se trouvent
        dans cet annuaire.
      </div>
      <div class="fr-py-2w partner-search-bar">
        <div class="partner-search-bar__input">
          <form ref="form">
            <VeeSearchInput
              name="filter"
              label="Rechercher"
              placeholder="Rechercher un organisme"
              :label-visible="false"
              @on-input="onSearch"
            />
          </form>
        </div>
        <template v-if="application.partner.access">
          <div class="partner-search-bar__action">
            <button
              data-fr-opened="false"
              aria-controls="global-modal"
              type="button"
              class="fr-btn fr-btn--icon-left fr-btn--md fr-btn--secondary fr-icon-add-line"
              @click="openCreateModal"
            >
              Ajouter
            </button>
          </div>
        </template>
      </div>
      <div
        class="partner-catalog"
        aria-live="polite"
      >
        <PartnerOrganizationCard
          v-for="partner in partners"
          :key="partner.id"
          :partner="partner"
          class="partner-catalog-item"
          @edit="openEditModal"
          @delete="openRemoveModal"
        />
      </div>
    </section>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { z } from 'zod'
  import PartnerOrganizationEdition from '~/components/PartnerOrganization/PartnerOrganizationEdition.vue'
  import PartnerOrganizationCreation from '~/components/PartnerOrganization/PartnerOrganizationCreation.vue'
  import PartnerOrganizationRemoveAlert from '~/components/PartnerOrganization/PartnerOrganizationRemoveAlert.vue'
  import type { PartnerOrganizationData } from '~/components/PartnerOrganization/types'
  import type {
    EditPartnerOrganizationInput,
    AddPartnerOrganizationInput
  } from '~/server/schema'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.structure.AppPartners.title

  useHead({ title })

  const { application } = usePermissions()
  const trpcClient = useTrpcClient()
  const modal = useModal()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)

  const { data, refresh } = await trpcClient.partner.getAll.useQuery()

  const filter = ref('')

  const filterSchema = z.object({
    filter: z.string()
  })

  useForm<{ filter: string }>({
    validationSchema: toTypedSchema(filterSchema),
    initialValues: {
      filter: ''
    }
  })

  function onSearch(param: string) {
    filter.value = param
  }

  const partners = computed(() => {
    const res = [...(data?.value || [])]
    if (!filter.value.length) {
      return res
    }
    const filterValue = filter.value.toLowerCase()
    return res.filter(
      partner =>
        partner.name.toLowerCase().includes(filterValue) ||
        partner.siret?.includes(filterValue)
    )
  })

  const existingDataInclusionV1Ids = computed(() =>
    (data?.value || [])
      .map(p => p.dataInclusionIdV1)
      .filter((id): id is string => id !== null)
  )

  function openCreateModal() {
    modal.open(PartnerOrganizationCreation, {
      title: 'Ajouter un organisme partenaire',
      size: 'lg',
      isSubmitting: isSubmitting.value,
      existingDataInclusionV1Ids: existingDataInclusionV1Ids.value,
      finish: finishCreation,
      cancel,
      restore: restorePartner
    })
  }

  function openEditModal(id: string) {
    modal.open(PartnerOrganizationEdition, {
      title: 'Modifier un organisme partenaire',
      size: 'lg',
      id,
      isSubmitting: isSubmitting.value,
      existingDataInclusionV1Ids: existingDataInclusionV1Ids.value,
      finish: finishEdition,
      cancel,
      restore: restorePartner
    })
  }

  function openRemoveModal(partner: PartnerOrganizationData) {
    modal.open(PartnerOrganizationRemoveAlert, {
      title: `Etes-vous sûr·e de supprimer l’organisme partenaire ${partner.name}?`,
      partner,
      finish: finishDeletion,
      cancel
    })
  }

  function finishDeletion(id: string) {
    useTrpcMutation({
      isSubmitting,
      mutation: () => trpcClient.partner.remove.mutate({ id }),
      onSuccess: () => {
        snackbar.success('Organisme partenaire supprimé')
        modal.close()
        refresh()
      },
      onFailure: () => {
        snackbar.error(
          'La suppression a échoué',
          snackbar.focus('form', 'button[type="submit"]')
        )
      }
    })
  }

  function finishEdition(input: EditPartnerOrganizationInput) {
    useTrpcMutation({
      isSubmitting,
      mutation: () => trpcClient.partner.update.mutate(input),
      onSuccess: () => {
        snackbar.success('Organisme partenaire mis à jour')
        modal.close()
        refresh()
      },
      onFailure: () => {
        snackbar.error(
          'La mise à jour a échoué',
          snackbar.focus('form', 'button[type="submit"]')
        )
      }
    })
  }

  function finishCreation(input: AddPartnerOrganizationInput) {
    useTrpcMutation({
      isSubmitting,
      mutation: () => trpcClient.partner.create.mutate(input),
      onSuccess: () => {
        snackbar.success('Organisme partenaire ajouté')
        modal.close()
        refresh()
      },
      onFailure: () => {
        snackbar.error("L'ajout a échoué", snackbar.focus('form', 'button'))
      }
    })
  }

  function cancel() {
    modal.close()
  }

  async function restorePartner(partner: PartnerOrganizationData) {
    modal.close()
    await trpcClient.partner.makeActive.mutate({ id: partner.id })
    refresh()
  }
</script>

<style lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .partner-subtitle {
    color: var(--primary);
  }

  .partner-search-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
    align-items: baseline;
  }

  .partner-search-bar__input {
    width: 100%;
    flex-grow: 1;
  }

  .partner-search-bar__action {
    width: 100%;
    flex-grow: 1;
  }

  @include dsfr-media-query.respond-from('md') {
    .partner-search-bar__input {
      width: auto;
      flex-grow: 4;
    }

    .partner-search-bar__action {
      width: auto;
      flex-grow: 1;
    }
  }

  .partner__show-button {
    visibility: hidden;
  }

  .partner-catalog {
    column-count: 1;

    @include dsfr-media-query.respond-from('md') {
      column-count: 2;
    }

    @include dsfr-media-query.respond-from('lg') {
      column-count: 3;
    }
  }

  .partner-catalog-item {
    margin: 0 0 1rem;
    display: grid;
    break-inside: avoid;
    border: 1px solid;
    border-color: var(--border-default-grey);
    border-radius: 0.25rem;
    background-color: white;
  }
</style>
