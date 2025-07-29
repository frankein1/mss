<template>
  <div class="add-attendee-container">
    <h3 class="text--uppercase">Ajouter des personnes partcipantes</h3>

    <div class="input-wrapper">
      <ComboBox
        ref="attendee-combobox"
        v-slot="{ option, input }"
        v-model="selectedBeneficiary"
        label="Rechercher parmi vos bénéficiaires enregistrés"
        :options="results"
        :format-display-value="formatBeneficiarySearchDisplayName"
        @input="searchBeneficiaries"
        @select="onSelect"
      >
        <div class="beneficiary">
          <div class="beneficiary-info">
            <span class="beneficiary-name">
              <AtomTextEmphasis
                :name="formatBeneficiarySearchDisplayName(option)"
                :input="input"
              ></AtomTextEmphasis>
            </span>
            <span
              v-if="option.birthDate"
              class="beneficiary-age"
            >
              {{ calculateAge(option.birthDate) + ' ans' }}</span
            >
          </div>

          <div
            v-if="beneficiaryAttendeeIds.includes(option.id)"
            class="beneficiary-already-invited"
          >
            <span class="fr-icon-check-line"></span>
            <span>Déjà ajouté</span>
          </div>
        </div>
      </ComboBox>
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
  import { WorkshopAttendee } from '~/types/workshop'

  const { attendees } = defineProps<{ attendees: WorkshopAttendee[] }>()
  const emit = defineEmits<{ refresh: [] }>()

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()
  const route = useRoute()
  const selectedBeneficiary = ref<BeneficiarySearchResult | null>(null)
  const results = ref<BeneficiarySearchResult[]>([])
  const comboboxRef = useTemplateRef('attendee-combobox')
  const beneficiaryAttendeeIds = computed(() => {
    return attendees.map(attendee => attendee.beneficiaryId)
  })
  const { mutate, error } = trpcClient.workshop.createAttendee.useMutation()

  const workshopId = route.params.id as string

  async function searchBeneficiaries(query: string) {
    const beneficiaries = await trpcClient.beneficiary.search.query({
      query
    })
    results.value = beneficiaries
  }

  const onSelect = async (beneficiary: BeneficiarySearchResult) => {
    comboboxRef.value?.reset()
    results.value = []

    const created = await mutate({
      beneficiaryId: beneficiary.id,
      workshopId: workshopId
    })

    if (error.value || !created) {
      snackbar.error(
        "L'ajout de la personne participante à échoué.",
        snackbar.focus('.combobox-wrapper')
      )
      return
    }
    emit('refresh')
    snackbar.success(
      'Personne ajoutée avec succès',
      snackbar.focus('.combobox-wrapper')
    )
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

      .fr-label {
        color: white;
      }

      .fr-select {
        background-color: white;
      }

      .beneficiary {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .beneficiary-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        font-size: 0.875rem;
      }

      .beneficiary-age {
        color: var(--text-mention-grey);
      }

      .beneficiary-already-invited {
        font-size: 0.875rem;
        color: green;
      }

      @include dsfr-media-query.respond-from('lg') {
        max-width: 40rem;
      }
    }
  }
</style>
