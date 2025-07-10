<template>
  <div class="add-attendee-container">
    <h3 class="text--uppercase">Ajouter des personnes partcipantes</h3>

    <div class="input-wrapper">
      <BeneficiarySearchCombobox
        :key="rerendervalue"
        class="beneficiary-search fr-mr-2w"
        label="Rechercher un dossier bénéficiaire"
        name="beneficiary-search"
        :select-only="true"
        :show-status="false"
        :show-age="true"
        :search-fn="searchBeneficiaries"
        @on-select="onSelect"
      />
      <p class="separator">ou</p>
      <button
        aria-describedby="add-attendee-tooltip"
        type="button"
        class="fr-btn fr-btn--primary fr-btn--icon-left fr-icon-add-line fr-mb-0"
        disabled
      >
        Ajouter une nouvelle personne
      </button>
      <span
        id="add-attendee-tooltip"
        class="fr-tooltip fr-placement"
        role="tooltip"
        >Fonctionnalité à venir</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BeneficiarySearchResult } from '~/types/beneficiary'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()
  const route = useRoute()

  const workshopId = route.params.id as string

  const rerendervalue = ref(0) // force rerender combobox

  async function searchBeneficiaries(query: string) {
    const beneficiaries = await trpcClient.beneficiary.search.query({
      query
    })
    return beneficiaries
  }

  const onSelect = async (beneficiary: BeneficiarySearchResult) => {
    const { mutate, error } = trpcClient.workshop.createAttendee.useMutation()

    const created = await mutate({
      beneficiaryId: beneficiary.id,
      workshopId: workshopId || ''
    })

    rerendervalue.value++

    if (error.value || !created) {
      snackbar.error(
        "L'ajout de la personne participante à échoué.",
        snackbar.focus('.input-wrapper', "input[type='search']" as FocusHTMLTag)
      )
      return
    }

    snackbar.success('Personne ajoutée avec succès')
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .fr-btn {
    min-width: max-content;
  }

  .add-attendee-container {
    padding: 1rem 2rem;
    color: white;
    background-color: var(--primary);
    border-radius: 0.5rem;

    .input-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      gap: 1rem;

      @include dsfr-media-query.respond-from('lg') {
        gap: 2rem;
        flex-direction: row;
      }
    }

    h3 {
      color: white;
      font-size: 0.75rem;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .separator {
      margin-bottom: 0.5rem;
      display: flex;
      flex-direction: row;
      align-items: baseline;

      &::before {
        content: '—';
        margin-right: 0.5rem;
      }

      &::after {
        content: '—';
        margin-left: 0.5rem;
      }

      @include dsfr-media-query.respond-from('lg') {
        flex-direction: column;
        align-items: center;

        &::before {
          content: '|';
          margin-right: 0;
          margin-bottom: 0.5rem;
        }

        &::after {
          content: '|';
          margin-top: 0.5rem;
          margin-left: 0;
        }
      }
    }

    :deep(.combobox-wrapper) {
      margin: 0 !important;
      width: 90%;

      @include dsfr-media-query.respond-from('lg') {
        max-width: 40rem;
      }
    }
  }
</style>
