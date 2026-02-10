<template>
  <!-- Step 1: Form -->
  <AtomLazyComponent
    v-if="!waitingListAlert"
    :error="Boolean(fileError) || Boolean(workshopsError)"
    :message="
      fileError
        ? 'Le dossier n\'a pas pu être chargé'
        : 'Les ateliers n\'ont pas pu être chargés'
    "
  >
    <RequiredFields />
    <div class="workshop-add-beneficiary-modal-content">
      <form
        ref="form"
        novalidate
        @submit.prevent="onSubmit"
      >
        <FormErrors
          v-if="errors.length > 1"
          :errors="errors"
        />

        <template
          v-if="familyFileIdentification && familyFileIdentification.length > 1"
        >
          <VeeRadioButtons
            name="beneficiaryId"
            label="Bénéficiaire concerné(e) par l’inscription&nbsp;:"
            :options="beneficiaryOptions"
            :inline="false"
            required
          />
        </template>
        <MultiSelect
          name="workshopIds"
          label="Sélectionnez les ateliers&nbsp;:"
          :options="workshopOptions"
          :disabled-options="workshopDisabledOptions"
        >
          <template #checkbox-after-label="{ option }">
            <template v-if="workshopDisabledOptions.includes(option.value)">
              <span
                :aria-describedby="`tooltip-` + option.value"
                class="fr-icon--sm fr-icon-information-line"
                aria-hidden="true"
              >
              </span>
              <span class="fr-sr-only">Déjà ajouté à l'atelier</span>
              <span
                :id="`tooltip-` + option.value"
                class="fr-tooltip fr-placement"
                role="tooltip"
                >Déjà ajouté à l'atelier
              </span>
            </template>
          </template>
        </MultiSelect>
        <ul
          class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-2w"
        >
          <li>
            <button
              class="fr-btn fr-btn--secondary fr-mb-0"
              type="button"
              @click="modal.close"
            >
              Annuler
            </button>
          </li>
          <li>
            <button
              class="fr-btn"
              type="submit"
              :disabled="status === 'pending'"
            >
              Valider
            </button>
          </li>
        </ul>
      </form>
    </div>
  </AtomLazyComponent>

  <!-- Step 2: Display an alert if beneficiaries were added on waiting list -->
  <template v-if="waitingListAlert">
    <AtomAlert
      :alert-type="AlertType.Warning"
      :message="
        waitingListAlert.workshops.length > 1
          ? 'Un ou plusieurs ateliers étaient complets'
          : 'L’atelier était complet'
      "
      :closeable="false"
    >
      <template #detailedMessage>
        Le bénéficiaire a été ajouté sur liste d’attente. Regardez dans la page
        d'inscription de l'atelier pour plus de précisions.
      </template>
    </AtomAlert>
    <ul
      class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-2w"
    >
      <li>
        <button
          class="fr-btn fr-btn--secondary fr-mb-0"
          type="button"
          @click="modal.close"
        >
          Fermer
        </button>
      </li>
    </ul>
  </template>
</template>

<script setup lang="ts">
  import { WorkshopAttendeeListType } from '~/prisma/generated/browser'
  import { AlertType } from '~/utils/constants/alert'
  import {
    createBeneficiaryAttendeeSchema,
    type CreateBeneficiaryAttendeeInput
  } from '~/server/schema'
  import { EventCategory, WorkshopAction } from '~/types/matomo'
  import { FilterWorkshopTimeDirection } from '~/utils/constants/filters'

  const { beneficiaryId, familyFileId } = defineProps<{
    beneficiaryId: string
    familyFileId: string
  }>()

  const modal = useModal()
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const form = ref<HTMLFormElement | null>(null)
  const waitingListAlert = ref<{
    beneficiaryId: string
    workshops: string[]
  } | null>(null)
  const matomo = useMatomo()

  // Get familyfile informations
  const { familyFileIdentification, error: fileError } =
    await useFamilyFileMinimalInfo(familyFileId)

  // get workshop list
  const { data: futureWorkshops, error: workshopsError } =
    await trpcClient.workshop.getPage.useQuery({
      filter: { timeDirection: FilterWorkshopTimeDirection.Future },
      perPage: -1,
      page: 1
    })

  const beneficiaryOptions = computed(() =>
    (familyFileIdentification.value || []).map(beneficiary => ({
      label: formatBeneficiaryDisplayName(beneficiary),
      value: beneficiary.id
    }))
  )

  const workshopOptions = computed(() => {
    if (
      futureWorkshops.value == null ||
      futureWorkshops.value.items.length === 0
    ) {
      return []
    }
    return futureWorkshops.value.items.map(workshop => {
      return {
        label: `${workshop.workshopName.name} ${workshop.sessionName ? ' – ' + workshop.sessionName : ''} (${formatDate(workshop.date)}) ${workshop.isFull ? ' (complet)' : ''}`,
        value: workshop.id
      }
    })
  })

  const { handleSubmit, values } = useForm<CreateBeneficiaryAttendeeInput>({
    validationSchema: toTypedSchema(createBeneficiaryAttendeeSchema),
    initialValues: {
      beneficiaryId
    }
  })

  const workshopDisabledOptions: Ref<string[]> = computed(() => {
    if (values.beneficiaryId && futureWorkshops.value) {
      return futureWorkshops.value.items
        .filter(
          ({ workshopAttendees }) =>
            workshopAttendees.findIndex(
              attendee => values.beneficiaryId === attendee.beneficiaryId
            ) >= 0
        )
        .map(workshop => workshop.id)
    }
    return []
  })

  const { mutate, error, status } =
    trpcClient.workshop.createBeneficiaryAttendee.useMutation()

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    async values => {
      const attendeesRegistered = await mutate(values)
      if (error.value || attendeesRegistered === null) {
        snackbar.error(
          "L'inscription a échoué.",
          snackbar.focus('form', 'select')
        )
        return
      }
      if (
        attendeesRegistered.filter(
          attendee => attendee.listType === WorkshopAttendeeListType.Waiting
        ).length === 0
      ) {
        modal.close()
        snackbar.success(
          'Bénéficiaire inscrit à un ou plusieurs ateliers avec succès'
        )
      } else {
        waitingListAlert.value = {
          beneficiaryId: values.beneficiaryId,
          workshops: values.workshopIds
        }
      }
      matomo.trackEvent(
        EventCategory.Workshop,
        values.workshopIds.length === 1
          ? WorkshopAction.RegisterToOneWorkshop
          : WorkshopAction.RegisterToManyWorkshops
      )
    }
  )

  // Error management
  const { errors } = useDisplayFormErrors(form, caughtErrors, {
    beneficiaryId: 'Bénéficiaire',
    workshopIds: 'Atelier(s)'
  })
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .fr-btns-group {
    align-items: baseline;
    row-gap: 0.5rem;
  }

  input[type='checkbox'] {
    transform: scale(1.5);
  }

  .workshop-result-item {
    --checkbox-size: 1.5rem;

    display: grid;
    grid-template-columns: var(--checkbox-size) repeat(2, auto);
    grid-template-rows: repeat(2, auto);
    grid-gap: 0.5rem;
    align-items: center;

    .item-checkbox {
      grid-area: 1 / 1 / 2 / 2;
    }

    .item-info {
      grid-area: 1 / 2 / 2 / 4;
    }

    .item-availability {
      grid-area: 2 / 1 / 3 / 4;
    }

    @include dsfr-media-query.respond-from('md') {
      grid-template-columns: var(--checkbox-size) 2fr auto;

      .item-checkbox {
        grid-area: 1 / 1 / 3 / 2;
      }

      .item-info {
        grid-area: 1 / 2 / 3 / 3;
      }

      .item-availability {
        grid-area: 1 / 3 / 3 / 4;
      }
    }

    p {
      margin: 0;
    }
  }

  :deep(.multiselect .multiselect-content) {
    position: relative !important;
  }
</style>
