<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    class="fr-container--fluid"
    @submit.prevent="emit('submit', $event)"
  >
    <section
      v-if="!editionMode && familyFileIdentification.length > 1"
      class="feature-section fr-p-5w fr-mb-2w"
    >
      <div class="fr-grid-row">
        <VeeRadioButtons
          class="fr-col-12 fr-mb-0"
          name="beneficiaryId"
          label="Bénéficiaire concerné par le suivi :"
          :options="beneficiaryOptions"
          :inline="true"
          required
        />
      </div>
    </section>

    <section class="feature-section fr-p-5w">
      <h2 class="fr-h5">Informations générales</h2>
      <div
        class="fr-grid-row fr-grid-row--gutters form-grid fr-grid-row--bottom"
      >
        <!-- ROW -->
        <div class="fr-col-12">
          <VeeCheckbox
            :label="followupFieldLabels.firstFollowup"
            name="firstFollowup"
          />
        </div>

        <!-- ROW -->
        <div class="fr-col-6">
          <VeeInput
            name="date"
            :label="followupFieldLabels.date"
            type="date"
            required
          />
        </div>

        <div class="fr-col-6">
          <VeeSelect
            name="duration"
            :label="followupFieldLabels.duration"
            :options="withEmptyValue(followupDurationKeys.options)"
          />
        </div>

        <!-- ROW -->
        <template v-if="application.module.ministere">
          <div class="fr-col-6">
            <VeeInput
              name="numeroPegase"
              :label="followupFieldLabels.numeroPegase"
              hint="Format attendu : A-00-000000"
            />
          </div>

          <div class="fr-col-12">
            <ComboBox
              ref="comboboxRef"
              v-model="selectedMinister"
              :required="true"
              :label="followupFieldLabels.ministre"
              :options="ministers"
              :format-display-value="displayName"
              :on-focus-header="onFocusHeader"
              @input="onSearchMinister"
              @select="onSelect"
            >
              <!-- HEADER -->
              <template #header>
                <ul
                  ref="header"
                  class="fr-tabs__list"
                  :class="{
                    focused: activeRow === -1
                  }"
                  @keydown="onHeaderKeydown"
                >
                  <li role="presentation">
                    <button
                      id="header-button-01"
                      type="button"
                      tabindex="-1"
                      class="fr-tabs__tab"
                      :aria-selected="!former"
                      @click="former = false"
                    >
                      Ministres actuels
                    </button>
                  </li>
                  <li>
                    <button
                      id="header-button-02"
                      type="button"
                      tabindex="-1"
                      class="fr-tabs__tab"
                      :class="{ 'fr-tabs__tab--secondary': !former }"
                      :aria-selected="former"
                      @click="former = true"
                    >
                      Ministres anciens
                    </button>
                  </li>
                </ul>
              </template>

              <template #default="{ option }">
                {{ displayName(option) }}
              </template>
            </ComboBox>
          </div>
        </template>

        <!-- ROW -->
        <div class="fr-col-6">
          <VeeSelect
            name="medium"
            :label="followupFieldLabels.medium"
            :options="withEmptyValue(followupMediumKeys.options)"
            required
          />
        </div>

        <div
          v-if="medium === FollowupMedium.ExternalAppointment"
          class="fr-col-6"
        >
          <VeeInput
            name="place"
            :label="followupFieldLabels.place"
          />
        </div>
        <div
          v-else-if="medium === FollowupMedium.ThirdParty"
          class="fr-col-6"
        >
          <VeeInput
            name="thirdPersonName"
            :label="followupFieldLabels.thirdPersonName"
          />
        </div>
        <div
          v-else
          class="fr-col-6"
        ></div>

        <!-- ROW -->
        <div class="fr-col-12">
          <MultiSelect
            name="subjects"
            :label="followupFieldLabels.subjects"
            :options="socialSupportSubjectOptions"
            required
          />
        </div>

        <!-- ROW -->
        <div class="fr-col-12 fr-mt-0 fr-pt-0">
          <NuxtLink
            v-if="application.edit.structure"
            :to="routes.structure.AppStructure.path()"
            class="fr-link fr-icon-info-fill fr-fi--sm fr-link--icon-left"
            @click="
              matomo.trackEvent(
                EventCategory.FollowupForm,
                FollowupFormAction.SocialSupportSubjectLink
              )
            "
          >
            Je personnalise les objets d'accompagnement de ma structure
          </NuxtLink>
          <template v-else>
            Les responsables de votre structure peuvent personnaliser les objets
            d'accompagnement.
          </template>
        </div>

        <!-- ROW -->
        <div class="fr-col-6">
          <VeeSelect
            name="status"
            :label="followupFieldLabels.status"
            :options="followupStatusKeys.options"
            required
          />
        </div>

        <div class="fr-col-6">
          <VeeInput
            name="dueDate"
            :label="followupFieldLabels.dueDate"
            type="date"
          />
        </div>
        <!-- ROW -->
        <div class="fr-col-6">
          <VeeCombobox
            :label="followupFieldLabels.prescribingOrganizationId"
            placeholder="Saisir le nom de l'organisme"
            name="prescribingOrganizationId"
            :options="withEmptyValue(partnerOrganizationOptions)"
            @change-value="onPrescribingOrganization"
          />
        </div>
        <div class="fr-col-6">
          <VeeSelect
            name="prescribingOrganizationContactId"
            :disabled="organizationContactIsDisabled"
            :label="followupFieldLabels.prescribingOrganizationContactId"
            :options="withEmptyValue(prescribingOrganizationContactOptions)"
          />
        </div>

        <!-- ROW -->
        <div class="fr-col-6 fr-mt-0 fr-pt-0">
          <NuxtLink
            :to="routes.structure.AppPartners.path()"
            class="fr-link fr-icon-info-fill fr-link--icon-left"
            @click="
              matomo.trackEvent(
                EventCategory.FollowupForm,
                FollowupFormAction.PartnersLink
              )
            "
          >
            Données issues de l'annuaire de partenaires
          </NuxtLink>
        </div>
        <div class="fr-col-6 fr-mt-0 fr-pt-0"></div>

        <!-- ROW -->
        <div class="fr-col-12">
          <h2 class="fr-h5 fr-mt-3w fr-mb-2w">Compte rendu</h2>
          <AtomTextEditor
            name="synthesis"
            :initial-value="synthesisRichTextValue || null"
            :initial-raw-value="synthesis"
            :label="followupFieldLabels.synthesis"
            @update="onUpdateSynthesis"
          />
        </div>

        <!-- ROW -->
        <div
          v-if="canSetPrivateSynthesis"
          class="fr-col-12"
        >
          <AtomTextEditor
            name="privateSynthesis"
            :initial-value="privateSynthesisRichTextValue || null"
            :initial-raw-value="privateSynthesis"
            :label="followupFieldLabels.privateSynthesis"
            label-icon="fr-icon-lock-line"
            :min-height="120"
            @update="onUpdatePrivateSynthesis"
          >
            <template #hint>
              Le compte rendu privé est uniquement visible et modifiable par
              l'agent qui crée la synthèse d'entretien.<br />{{
                SENSITIVE_DATA_HINT
              }}
            </template>
          </AtomTextEditor>
        </div>

        <!-- ROW -->
        <div class="fr-col-12">
          <fieldset
            class="fr-fieldset fr-col-12"
            aria-labelledby="followup-actions-entreprises-legend"
          >
            <h2 class="fr-h5 fr-mt-3w">Actions entreprises</h2>

            <div class="fr-fieldset__element fr-mb-0">
              <fieldset
                class="fr-fieldset fr-mb-0"
                aria-labelledby="followup-reoriente-apres-entretien-legend"
              >
                <legend
                  id="followup-reoriente-apres-entretien-legend"
                  hidden
                >
                  {{ followupFieldLabels.redirected }}
                </legend>

                <div class="fr-fieldset__element fr-fieldset__element--inline">
                  <VeeCheckbox
                    name="redirected"
                    :label="followupFieldLabels.redirected"
                  />
                </div>
                <div class="fr-fieldset__element fr-fieldset__element--inline">
                  <VeeInput
                    v-if="isRedirected"
                    name="structureName"
                    :label="followupFieldLabels.structureName"
                  />
                </div>
              </fieldset>
            </div>

            <div class="fr-fieldset__element fr-fieldset__element--inline">
              <VeeCheckbox
                name="helpRequested"
                :label="followupFieldLabels.helpRequested"
              />
            </div>

            <template v-if="application.module.ministere">
              <div class="fr-fieldset__element fr-fieldset__element--inline">
                <VeeCheckbox
                  name="classified"
                  :label="followupFieldLabels.classified"
                />
              </div>

              <div class="fr-fieldset__element fr-fieldset__element--inline">
                <VeeCheckbox
                  name="forwardedToJustice"
                  :label="followupFieldLabels.forwardedToJustice"
                />
              </div>
            </template>
          </fieldset>
        </div>
      </div>

      <div class="fr-mb-4w">
        <h2 class="fr-h5 fr-mt-3w">Documents</h2>

        <BeneficiaryDocumentsSelect
          :family-file-id="familyFileId || ''"
          :beneficiary-id="beneficiaryId || ''"
          name="documents"
          snackbar-success-message="Le document a été ajouté à la fiche bénéficiaire. Enregistrez la synthèse d'entretien pour conserver le lien entre les deux."
        />
      </div>

      <ul
        class="fr-btns-group fr-btns-group--inline fr-btns-group--lg fr-btns-group--right"
      >
        <li>
          <button
            class="fr-btn submit-btn"
            type="submit"
            :data-submitting="isSubmitting"
            :disabled="isSubmitting"
          >
            Enregistrer
          </button>
        </li>
      </ul>
    </section>
  </form>
</template>

<script lang="ts" setup>
  import type { SocialSupportSubject } from '@prisma/client'
  import { FollowupMedium } from '@prisma/client'
  import type { FormErrors } from 'vee-validate'
  import type { JSONContent } from '@tiptap/vue-3'
  import {
    followupStatusKeys,
    followupMediumKeys,
    followupDurationKeys
  } from '~/client/options'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { SENSITIVE_DATA_HINT } from '~/utils/constants'
  import { routes } from '~/utils/routes'
  import { followupFieldLabels } from '~/client/labels'
  import type { AddFollowupInput, EditFollowupInput } from '~/server/schema'
  import type { PartnerOrganizationIdName } from '~/types/partner'
  import type { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import { formatBeneficiaryShortenedName } from '~/utils/beneficiary/formatBeneficiaryShortenedName'
  import { cleanEmptyParagraph } from '~/utils/text/cleanEmptyParagraph'
  import { EventCategory, FollowupFormAction } from '~/types/matomo'
  import type { MinisterOutput } from './types'
  import { formatMinisterName } from '~/utils/minister'

  const props = withDefaults(
    defineProps<{
      isSubmitting: boolean
      socialSupportSubjects: Array<SocialSupportSubject>
      partnerOrganizations: Array<PartnerOrganizationIdName>
      familyFileIdentification: BeneficiaryFileIdentification[]
      medium: FollowupMedium
      isRedirected: boolean
      canSetPrivateSynthesis?: boolean
      caughtErrors: FormErrors<AddFollowupInput | EditFollowupInput>
      editionMode?: boolean
    }>(),
    { canSetPrivateSynthesis: true, editionMode: false }
  )

  const { application } = usePermissions()
  const matomo = useMatomo()

  const emit = defineEmits<{
    submit: [payload: Event]
  }>()

  const form = ref<HTMLFormElement | null>(null)
  const comboboxRef = useTemplateRef('comboboxRef')

  const { value: beneficiaryId } = useField<string | null>('beneficiaryId')
  const { value: familyFileId } = useField<string | null>('familyFileId')
  const { value: prescribingOrganizationId } = useField<string | null>(
    'prescribingOrganizationId'
  )
  const { setValue: setPrescribingOrganizationContactId } = useField<
    string | null
  >('prescribingOrganizationContactId')
  const onPrescribingOrganization = (id: string[] | string) => {
    if (!id) {
      setPrescribingOrganizationContactId(null)
    }
  }
  const { setValue: setSynthesis, value: synthesis } = useField<
    string | undefined
  >('synthesis')
  const { setValue: setSynthesisRichText, value: synthesisRichTextValue } =
    useField<string | undefined>('synthesisRichText')
  const onUpdateSynthesis = (
    html: string | undefined,
    json: JSONContent | undefined,
    rawText: string | undefined
  ) => {
    setSynthesis(cleanEmptyParagraph(rawText))
    setSynthesisRichText(JSON.stringify(json))
  }
  const { setValue: setPrivateSynthesis, value: privateSynthesis } = useField<
    string | undefined
  >('privateSynthesis')
  const {
    setValue: setPrivateSynthesisRichText,
    value: privateSynthesisRichTextValue
  } = useField<string | undefined>('privateSynthesisRichText')

  const onUpdatePrivateSynthesis = (
    html: string | undefined,
    json: JSONContent | undefined,
    rawText: string | undefined
  ) => {
    setPrivateSynthesis(cleanEmptyParagraph(rawText))
    setPrivateSynthesisRichText(JSON.stringify(json))
  }

  const { errors } = useDisplayFormErrors(
    form,
    toRef(() => props.caughtErrors),
    followupFieldLabels
  )

  const beneficiaryOptions = computed(() =>
    props.familyFileIdentification.map(m => ({
      label: formatBeneficiaryShortenedName(m),
      value: m.id
    }))
  )

  const socialSupportSubjectOptions = computed(() =>
    toOptions(props.socialSupportSubjects, 'id', 'name')
  )

  const partnerOrganizationOptions = computed(() => {
    const partnerOrganizationsWithStringId = props.partnerOrganizations.map(
      ({ id, ...rest }) => ({
        id: String(id),
        ...rest
      })
    )
    return toOptions(partnerOrganizationsWithStringId, 'id', 'name')
  })

  const selectedPartnerOrganization = computed(() => {
    const partnerId = prescribingOrganizationId.value
    if (!partnerId) {
      return null
    }

    return (props.partnerOrganizations || []).find(
      partner => partner.id === partnerId
    )
  })

  const organizationContactIsDisabled = computed(() => {
    if (!selectedPartnerOrganization.value) {
      return true
    }
    if ((selectedPartnerOrganization.value.contacts || []).length === 0) {
      return true
    }
    return false
  })

  const prescribingOrganizationContactOptions = computed(() => {
    const partnerId = prescribingOrganizationId.value
    if (!partnerId) {
      return []
    }
    const partnerOrganization = (props.partnerOrganizations || []).find(
      partner => partner.id === partnerId
    )
    return toOptions(partnerOrganization?.contacts || [], 'id', 'name')
  })

  // Minister combobox
  const selectedMinister = ref<(MinisterOutput & { disabled: boolean }) | null>(
    null
  )

  const ministers = ref<(MinisterOutput & { disabled: boolean })[]>([])
  const former = ref(false)
  const inputQuery = ref<string | null>()
  const trpcClient = useTrpcClient()
  const { data, status, error } =
    await trpcClient.minister.getMinisters.useQuery()
  if (data) {
    ministers.value =
      data.value
        ?.filter(m => m.former === former.value)
        .map(minister => ({
          ...minister,
          disabled: false
        })) || []
  }

  const initialMinisterList = computed(() => {
    return (
      data.value
        ?.filter(m => m.former === former.value)
        .map(minister => ({
          ...minister,
          disabled: false
        })) || []
    )
  })

  const onSearchMinister = (query: string) => {
    inputQuery.value = query
    ministers.value = filter(query, initialMinisterList.value)
  }

  const filter = (
    query: string,
    initialMinisterList: (MinisterOutput & { disabled: boolean })[]
  ) => {
    return initialMinisterList.filter(
      minister =>
        formatSearchPattern(minister.lastName.toLocaleLowerCase()).includes(
          formatSearchPattern(query.toLocaleLowerCase())
        ) ||
        formatSearchPattern(minister.firstName.toLocaleLowerCase()).includes(
          formatSearchPattern(query.toLocaleLowerCase())
        )
    )
  }

  const {
    setValue: setMinisterId,
    value: initialMinisterId,
    errors: ministerErrors
  } = useField<string | undefined>('ministerId')
  const onSelect = (minister: MinisterOutput) => {
    ministers.value = []
    setMinisterId(minister.id, true)
  }

  const displayName = (minister: MinisterOutput): string => {
    return formatMinisterName(minister)
  }

  watch(former, v => {
    const newList = initialMinisterList.value.filter(m => m.former === v)
    if (!inputQuery.value) {
      ministers.value = newList
    } else {
      ministers.value = filter(inputQuery.value, newList)
    }
  })
  // focus
  const header = ref<HTMLElement | null>(null)
  const onFocusHeader = () => {
    if (!header.value) {
      return
    }
    const buttons = getHeaderButtons(header.value)
    buttons[0]?.focus()
  }

  function getHeaderButtons(container: HTMLElement) {
    return Array.from(
      container.querySelectorAll<HTMLButtonElement>(
        'button[id^="header-button-"]'
      )
    )
  }

  const activeRow = ref<number>(-1)
  function onHeaderKeydown(e: KeyboardEvent) {
    if (comboboxRef.value && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      const row = comboboxRef.value.selectActiveRow(e)
      activeRow.value = row
    }

    if (e.key === 'Enter' && comboboxRef.value && activeRow.value >= 0) {
      const row = comboboxRef.value.selectActiveRow(e)
      activeRow.value = row
    }

    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      return
    }
    // Focus on the next/previous button
    if (!header.value) {
      return
    }
    const buttons = getHeaderButtons(header.value)
    const currentIndex = buttons.indexOf(
      document.activeElement as HTMLButtonElement
    )
    if (currentIndex === -1) {
      return
    }
    e.preventDefault()
    const delta = e.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (currentIndex + delta + buttons.length) % buttons.length
    buttons[nextIndex]?.focus()
  }

  watch(activeRow, () => {
    if (activeRow.value === -1) {
      header.value?.scrollIntoView({ block: 'nearest' })
    }
  })
</script>

<style scoped lang="scss">
  .fr-tabs__list {
    list-style-type: none;
    gap: 0.5rem;
    margin: 0.25rem 0;
    padding: 0;
    border-bottom: 1px solid var(--border-default-grey);

    &.focused {
      outline: dashed 1px rgb(0 0 0 / 100%);
    }

    li {
      flex: 1 1 0;
      padding: 0;

      button {
        justify-content: center;
        width: 100%;
      }
    }
  }

  :deep(.combobox-wrapper) {
    input.fr-select {
      box-shadow: inset 0 -2px 0 0 var(--border-plain-grey);
    }
  }
</style>
