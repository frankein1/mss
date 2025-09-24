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
          v-if="errors.length > 0"
          :errors="errors"
        />

        <template
          v-if="familyFileIdentification && familyFileIdentification.length > 1"
        >
          <fieldset
            id="workshop-form-fieldset"
            class="fr-fieldset"
            :class="{ 'fr-fieldset--error': familyError }"
            aria-labelledby="workshop-form-fieldset-legend workshop-form-fieldset-messages"
          >
            <legend
              id="workshop-form-fieldset-legend"
              class="fr-fieldset__legend--regular fr-fieldset__legend"
            >
              Bénéficiaire(s) concerné(s) par l’inscription&nbsp;:
              <span class="color-red">*</span>
            </legend>
            <div
              v-for="beneficiary in beneficiaryOptions"
              :key="beneficiary.id"
              class="fr-fieldset__element"
            >
              <div class="fr-checkbox-group">
                <input
                  :id="'checkbox-id-' + beneficiary.id"
                  name="beneficiaryIds"
                  :value="beneficiary.id"
                  type="checkbox"
                  aria-describedby="checkbox-beneficiary-message"
                  @change="event => onBeneficiaryCheckboxChange(event)"
                />
                <label
                  class="fr-label"
                  :for="'checkbox-id-' + beneficiary.id"
                >
                  {{ beneficiary.label }}
                </label>
                <div
                  id="checkbox-beneficiary-message"
                  class="fr-messages-group"
                  aria-live="polite"
                ></div>
              </div>
            </div>

            <div
              v-if="familyError"
              id="workshop-form-fieldset-messages"
              class="fr-messages-group"
              aria-live="polite"
            >
              <p
                id="workshop-form-message-error"
                class="fr-message fr-message--error"
              >
                Veuillez sélectionner au moins un bénéficiaire.
              </p>
            </div>
          </fieldset>
        </template>
        <MultiSelect
          name="workshopIds"
          label="Sélectionnez les ateliers&nbsp;:"
          :options="workshopOptions"
          :disabled-options="workshopDisabledOptions"
        />
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
        {{
          waitingListAlert.beneficiaries.length > 1
            ? 'Un ou plusieurs bénéficiaires ont été ajoutés sur liste d’attente. Regardez dans l’historique pour plus de précisions.'
            : 'Le bénéficiaire a été ajouté sur liste d’attente. '
        }}
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
  import { WorkshopAttendeeListType } from '@prisma/client'
  import { AlertType } from '~/utils/constants/alert'
  import {
    registerBeneficiariesSchema,
    type RegisterBeneficiariesInput
  } from '~/server/schema'
  import { EventCategory, WorkshopAction } from '~/types/matomo'
  import { FilterWorkshopTimeDirection } from '~/utils/constants/filters'

  const props = defineProps<{
    beneficiaryId: string
    familyFileId: string
  }>()

  const modal = useModal()
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const form = ref<HTMLFormElement | null>(null)
  const familyError = ref<boolean>(false)
  const waitingListAlert = ref<{
    beneficiaries: string[]
    workshops: string[]
  } | null>(null)
  const matomo = useMatomo()

  // Get familyfile informations
  const { familyFileIdentification, error: fileError } =
    await useFamilyFileMinimalInfo(props.familyFileId)

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
      id: beneficiary.id
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

  const workshopDisabledOptions: Ref<string[]> = computed(() => {
    if (values.beneficiaryIds && futureWorkshops.value) {
      return futureWorkshops.value.items
        .filter(workshop =>
          workshop.workshopAttendees.some(attendee =>
            values.beneficiaryIds.includes(attendee.beneficiaryId as string)
          )
        )
        .map(workshop => workshop.id)
    }
    return []
  })

  // Form management
  const initialValues = computed(() => {
    if (
      familyFileIdentification.value &&
      familyFileIdentification.value.length === 1
    ) {
      return {
        beneficiaryIds: [props.beneficiaryId]
      }
    }
    return {}
  })

  const onBeneficiaryCheckboxChange = (event: Event) => {
    setFieldValue('workshopIds', []) // reset workshops selections

    const input = event.target as HTMLInputElement
    const initialBeneficiaryIds = values.beneficiaryIds || []

    if (input.checked === true) {
      setFieldValue('beneficiaryIds', [...initialBeneficiaryIds, input.value])
      return
    }
    const newBeneficiaryIds = initialBeneficiaryIds.filter(
      id => id !== input.value
    )
    if (newBeneficiaryIds.length === 0) {
      setFieldValue('beneficiaryIds', [])
      return
    }
    setFieldValue('beneficiaryIds', newBeneficiaryIds)
  }

  const { handleSubmit, setFieldValue, values } =
    useForm<RegisterBeneficiariesInput>({
      validationSchema: toTypedSchema(registerBeneficiariesSchema),
      initialValues: initialValues.value
    })
  const router = trpcClient.workshop
  const { mutate, error, status } = router.registerBeneficiaries.useMutation()

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
          beneficiaries: values.beneficiaryIds,
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
    beneficiaryIds: 'Bénéficiaire(s)',
    workshopIds: 'Atelier(s)'
  })

  watch(caughtErrors, () => {
    if (caughtErrors.value.beneficiaryIds != null) {
      familyError.value = true
      return
    }
    familyError.value = false
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
    position: relative;
  }
</style>
