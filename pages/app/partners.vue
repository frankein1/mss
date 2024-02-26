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
      <div class="fr-py-2w partner-search-bar">
        <div class="partner-search-bar__input">
          <form ref="form">
            <VeeSearchInput
              name="filter"
              label="Rechercher"
              @on-input="onSearch"
            />
          </form>
          <button
            id="openModalBtn"
            data-fr-opened="false"
            aria-controls="global-modal"
            type="button"
          ></button>
        </div>
        <template v-if="application.module.partner">
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
      <div class="partner-catalog">
        <PartnerOrganizationCard
          v-for="partner in partners"
          :key="partner.id"
          :partner="partner"
          class="partner-catalog-item"
          @edit="openEditModal"
          @delete="openRemoveModal"
        />
      </div>
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import PartnerOrganizationEdition from '~/components/PartnerOrganization/PartnerOrganizationEdition.vue'
  import PartnerOrganizationCreation from '~/components/PartnerOrganization/PartnerOrganizationCreation.vue'
  import PartnerOrganizationRemoveAlert from '~/components/PartnerOrganization/PartnerOrganizationRemoveAlert.vue'
  import {
    EditPartnerOrganizationInput,
    AddPartnerOrganizationInput
  } from '~/server/schema'
  import { Breadcrumb, RouteTitle } from '~/utils/routing'

  const title = RouteTitle.AppPartners()

  useHead({ title })

  const { application } = usePermissions()
  const trpcClient = useTrpcClient()
  const modal = useModal()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)

  const openModalBtn = ref<HTMLButtonElement>()

  const { data, refresh } = await trpcClient.partner.getAll.useQuery()

  const filter = ref('')

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

  function openCreateModal() {
    modal.open({
      title: 'Ajouter un organisme partenaire',
      contentComponent: PartnerOrganizationCreation,
      contentComponentProps: {
        isSubmitting: isSubmitting.value
      },
      contentComponentEvents: { finish: finishCreation, cancel, open: onOpen }
    })
  }

  function openRemoveModal(id: string) {
    modal.open({
      title: 'Supprimer un organisme partenaire',
      contentComponent: PartnerOrganizationRemoveAlert,
      contentComponentProps: {
        id
      },
      contentComponentEvents: { finish: finishDeletion, cancel, open: onOpen }
    })
  }

  function finishDeletion(id: string) {
    useTrpcMutation({
      isSubmitting,
      mutation: () => trpcClient.partner.remove.mutate({ id }),
      onSuccess: () => {
        snackbar.success('Organisme partenaire supprimée')
        modal.close()
        refresh()
      },
      onFailure: () => {
        snackbar.error('La suppression a échoué')
      }
    })
  }

  function openEditModal(id: string) {
    modal.open({
      title: 'Modifier un organisme partenaire',
      contentComponent: PartnerOrganizationEdition,
      contentComponentProps: {
        id,
        isSubmitting: isSubmitting.value
      },
      contentComponentEvents: {
        finish: finishEdition,
        cancel,
        open: onOpen
      }
    })
  }

  function finishEdition(input: EditPartnerOrganizationInput) {
    useTrpcMutation({
      isSubmitting,
      mutation: () => trpcClient.partner.update.mutate(input),
      onSuccess: () => {
        snackbar.success('Organisme partenaire mise à jour')
        modal.close()
        refresh()
      },
      onFailure: () => {
        snackbar.error('La mise à jour a échoué')
      }
    })
  }

  function finishCreation(input: AddPartnerOrganizationInput) {
    useTrpcMutation({
      isSubmitting,
      mutation: () => trpcClient.partner.create.mutate(input),
      onSuccess: () => {
        snackbar.success('Organisme partenaire ajoutée')
        modal.close()
        refresh()
      },
      onFailure: () => {
        snackbar.error('L"ajout" a échoué')
      }
    })
  }

  function cancel() {
    modal.close()
  }

  function onOpen(_partnerId: string) {
    modal.close()
    openModalBtn?.value?.click()
  }
</script>

<style lang="scss">
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .partner-subtitle {
    color: var(--primary);
  }

  .partner-search-bar {
    display: flex;
    flex-wrap: wrap;
  }

  .partner-search-bar__input {
    flex: 0 0 calc(66.666% - 0.75rem);
  }

  .partner-search-bar__action {
    margin-left: auto;
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
    margin: 0 0 1.5rem;
    display: grid;
    grid-template-rows: 1fr auto;
    break-inside: avoid;
    border: 1px solid;
    border-color: var(--border-default-grey);
    border-radius: 0.25rem;
    background-color: white;
  }
</style>
