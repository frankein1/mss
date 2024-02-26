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
          @edit="edit"
          @delete="remove"
        />
      </div>
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { z } from 'zod'
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

  const { data, refresh } = await trpcClient.partner.getAll.useQuery()

  const filter = ref('')

  const filterSchema = z.object({
    filter: z.string()
  })

  const { setFieldValue } = useForm<{ filter: string }>({
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

  function openCreateModal() {
    modal.open({
      title: 'Ajouter un organisme partenaire',
      contentComponent: PartnerOrganizationCreation,
      contentComponentProps: {
        isSubmitting: isSubmitting.value
      },
      contentComponentEvents: { onFinish: onCreate, onCancel }
    })
  }

  function remove(id: string) {
    modal.open({
      title: 'Supprimer un organisme partenaire',
      contentComponent: PartnerOrganizationRemoveAlert,
      contentComponentProps: {
        id
      },
      contentComponentEvents: { onFinish: onRemove, onCancel }
    })
  }

  function onRemove(id: string) {
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

  function edit(id: string) {
    modal.open({
      title: 'Modifier un organisme partenaire',
      contentComponent: PartnerOrganizationEdition,
      contentComponentProps: {
        id,
        isSubmitting: isSubmitting.value
      },
      contentComponentEvents: { onFinish: onEdit, onCancel }
    })
  }

  function onEdit(input: EditPartnerOrganizationInput) {
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

  function onCreate(input: AddPartnerOrganizationInput) {
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

  function onCancel(filter?: string) {
    if (filter?.length) {
      setFieldValue('filter', filter)
      onSearch(filter)
    }
    modal.close()
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
