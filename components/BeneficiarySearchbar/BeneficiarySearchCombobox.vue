<template>
  <div
    class="combobox-wrapper fr-input-group"
    :class="{ 'fr-select-group--error': error }"
  >
    <label
      :id="LABEL_ID"
      :for="INPUT_ID"
      class="fr-label fr-sr-only"
    >
      {{ label }}
    </label>
    <div>
      <input
        :id="INPUT_ID"
        ref="input"
        v-model="displayedValue"
        :placeholder="label"
        autocomplete="off"
        class="fr-select"
        type="search"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="results.length > 0"
        :aria-controls="GRID_ID"
        :aria-activedescendant="activeDescendant"
        @keydown="handleKeydown"
        @focus="onFocus"
        @blur="onBlur"
        @input="onSearch"
      />
      <ul
        v-if="results.length || loading"
        v-show="openList || loading"
        :id="GRID_ID"
        class="grid"
        role="grid"
        :aria-labelledby="LABEL_ID"
      >
        <AtomLoader
          v-if="loading"
          class="fr-mx-auto fr-my-5v"
        />
        <AtomAlert
          v-if="error"
          :alert-type="AlertType.Error"
          :message="error"
        />
        <li
          v-for="(result, rowIndex) in results"
          :id="'result-row-' + rowIndex"
          :key="rowIndex"
          class="result-row"
          role="row"
          :class="{ focused: rowIndex === activeRow }"
        >
          <div
            :id="'result-item-' + rowIndex"
            class="result-cell"
            role="gridcell"
            :class="{
              'focused-cell': rowIndex === activeRow && activeCol === 0
            }"
          >
            <BeneficiarySearchComboboxResult
              v-if="selectOnly"
              :id="`beneficiary-search-file-link-${rowIndex}`"
              :beneficiary="result"
              :search="displayedValue"
              @click="handleSelect(result)"
            />
            <NuxtLink
              v-else
              :to="
                routes.file.AppFile.path(result.familyFileId, {
                  originPage: routeName,
                  beneficiaryId: result.id
                })
              "
            >
              <BeneficiarySearchComboboxResult
                :id="`beneficiary-search-file-link-${rowIndex}`"
                :beneficiary="result"
                :search="displayedValue"
              />
            </NuxtLink>
          </div>
          <div
            v-if="!selectOnly"
            :id="'result-link-' + rowIndex"
            class="result-cell followup-cell"
            role="gridcell"
            :class="{
              'focused-cell': rowIndex === activeRow && activeCol === 1
            }"
          >
            <NuxtLink
              v-if="result.status !== BeneficiaryStatus.Archived"
              :id="`beneficiary-search-followup-link-${rowIndex}`"
              :to="
                routes.followup.AppBeneficiaryFollowupAdd.path(
                  result.familyFileId,
                  {
                    beneficiaryId: result.id
                  }
                )
              "
              class="create-btn fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-add-line fr-btn--sm"
              :title="`Créer une synthèse d'entretien pour ${formatBeneficiarySearchDisplayName(result)}`"
              @click="handleCreateFollowup()"
            >
              Créer une synthèse
            </NuxtLink>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useDebounceFn } from '@vueuse/core'
  import {
    SEARCH_DEFER_MS,
    SEARCH_NUMBER_CHARACTERS,
    UNKNOWN_ERROR_MESSAGE
  } from '~/utils/constants'
  import { AlertType } from '~/utils/constants/alert'
  import { BeneficiarySearchResult } from '~/types/beneficiary'
  import BeneficiarySearchComboboxResult from './BeneficiarySearchComboboxResult.vue'
  import { BeneficiaryStatus } from '@prisma/client'
  import { routes } from '~/utils/routes'
  import { EventCategory, FollowupAction } from '~/types/matomo'

  const props = withDefaults(
    defineProps<{
      label: string
      selectOnly?: boolean
      searchFn: (search: string) => Promise<any[]>
    }>(),
    {
      selectOnly: false
    }
  )
  const emit = defineEmits<{
    onSelect: [beneficiary: BeneficiarySearchResult]
  }>()

  const results = ref<BeneficiarySearchResult[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string>('')

  const LABEL_ID = computed(() => `beneficiary-search-label-${useId()}`)
  const INPUT_ID = computed(() => `beneficiary-search-input-${useId()}`)
  const GRID_ID = computed(() => `beneficiary-search-grid-${useId()}`)

  const openList = ref(false)
  const displayedValue = ref('')
  const activeRow = ref(-1)
  const activeCol = ref(0)
  const activeDescendant = computed(() => {
    if (activeRow.value >= 0) {
      return `result-item-${activeRow.value}x${activeCol.value}`
    }
    return ''
  })

  const handleSelect = (beneficiary: BeneficiarySearchResult) => {
    emit('onSelect', beneficiary)
    openList.value = false
    displayedValue.value = formatBeneficiarySearchDisplayName(beneficiary)
  }
  const handleCreateFollowup = () => {
    const matomo = useMatomo()
    matomo.trackEvent(
      EventCategory.CreateFollowup,
      FollowupAction.CreateFromBeneficiarySearch
    )
  }

  const onFocus = () => {
    if (displayedValue.value != null) {
      openList.value = true
    }
    updateResults()
  }

  const updateResults = () => {
    activeRow.value = -1
    activeCol.value = 0
  }

  const route = useRoute()
  type RouteName =
    | typeof routes.user.AppOverview.name
    | typeof routes.beneficiary.AppBeneficiaries.name
  const routeName = route.name as RouteName | undefined

  const onBlur = () => {
    // TODO: improve this.
    // If the mouse is not over the grid, close the list
    let gridisActive = false
    const listelements = document.getElementsByClassName('result-row')
    Array.from(listelements).forEach((element: Element) => {
      if (element.matches(':hover')) {
        gridisActive = true
      }
    })
    if (!gridisActive) {
      openList.value = false
      activeRow.value = -1
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    openList.value = true
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        activeRow.value = (activeRow.value + 1) % results.value.length
        break
      case 'ArrowUp':
        e.preventDefault()
        activeRow.value =
          activeRow.value <= 0 ? results.value.length - 1 : activeRow.value - 1
        break
      case 'ArrowLeft':
        e.preventDefault()
        activeCol.value = activeCol.value <= 0 ? 1 : activeCol.value - 1
        break
      case 'ArrowRight':
        e.preventDefault()
        activeCol.value = (activeCol.value + 1) % 2
        break
      case 'Enter':
        e.preventDefault()
        if (activeRow.value >= 0) {
          selectItem(results.value[activeRow.value])
          openList.value = false
        }
        break
      case ' ':
        if (activeRow.value >= 0) {
          selectItem(results.value[activeRow.value])
          openList.value = false
        }
        break
      case 'Escape':
        activeRow.value = -1
        openList.value = false
        break
      case 'Tab':
        openList.value = false
        activeRow.value = -1
        break
    }
  }

  function selectItem(value: any) {
    if (props.selectOnly) {
      handleSelect(value)
      return
    }
    // TODO: improve this
    // find a better way to simulate a click on child element
    if (activeCol.value === 0) {
      document
        .getElementById(`beneficiary-search-file-link-${activeRow.value}`)
        ?.click()
    } else if (activeCol.value === 1) {
      document
        .getElementById(`beneficiary-search-followup-link-${activeRow.value}`)
        ?.click()
    }
    displayedValue.value = value.label
    activeRow.value = -1
    openList.value = false
  }

  watch(activeRow, newIndex => {
    if (newIndex >= 0) {
      const el = document.getElementById(`result-row-${newIndex}`)
      el?.scrollIntoView({ block: 'nearest' })
    }
  })

  const debouncedSearchFn = useDebounceFn(async (search: string) => {
    try {
      results.value = await props.searchFn(search)
    } catch {
      error.value = UNKNOWN_ERROR_MESSAGE
    } finally {
      loading.value = false
    }
  }, SEARCH_DEFER_MS)

  function onSearch(event: Event) {
    const input = event.target as HTMLInputElement
    const search = input.value.trim()
    error.value = ''
    if (!search || search.length < SEARCH_NUMBER_CHARACTERS) {
      results.value = []
      return
    }
    loading.value = true
    debouncedSearchFn(search)
  }
</script>

<style lang="scss" scoped>
  /* stylelint-disable no-descending-specificity */
  @use '~/assets/style/variables' as *;
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  @include dsfr-media-query.respond-from('md') {
    .fr-search-bar--lg .fr-input {
      padding-top: 1rem;
      padding-bottom: 1rem;
      margin-top: 0;
    }
  }

  input[type='search'] {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(69,80,229,1)'%3E%3Cpath d='M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z'%3E%3C/path%3E%3C/svg%3E");
    background-position: 10px 12px;
    background-repeat: no-repeat;
    padding-left: 2.5rem;
  }

  /* clears the ‘X’ from Chrome */
  input[type='search']::-webkit-search-decoration,
  input[type='search']::-webkit-search-results-button,
  input[type='search']::-webkit-search-results-decoration {
    display: none;
  }

  /* Custom ‘X’ icon */
  input[type='search']::-webkit-search-cancel-button {
    /* stylelint-disable property-no-vendor-prefix */
    -webkit-appearance: none;
    cursor: pointer;
    height: 1rem;
    width: 1rem;
    margin-right: -1rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z'%3E%3C/path%3E%3C/svg%3E");
  }

  ul.grid {
    min-width: 230px;
    width: 100%;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 0 0 0.5rem 0.5rem;
    box-shadow: $shadow-dark;
    z-index: 600;
    position: absolute;
    animation: slide-down 0.15s ease 1;
    max-height: 18.75rem;
    overflow-y: scroll;
    min-height: 1.5rem;
    padding: 4px;
    margin: 0;
  }

  .result-row {
    display: flex;
    flex-direction: column;
    width: 100%;
    cursor: default;
    margin: 0;
    padding: 0 1rem;
    box-shadow: 0 17px 0 -16px var(--border-default-grey);

    > div:first-child {
      flex: 1;
    }

    > div:last-child {
      flex: 0;
    }

    @include dsfr-media-query.respond-from('lg') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .result-cell {
    display: inline-block;
    cursor: default;
    margin: 0;
    padding: 0.75rem 0;
    width: auto;
  }

  .followup-cell {
    min-width: fit-content;
  }

  .focused-cell {
    outline: dashed 1px rgb(0 0 0 / 100%);
  }

  .fr-select {
    box-shadow: inset 0 -2px 0 0 var(--primary);
  }
</style>

<style lang="scss">
  .result-row:hover,
  .result-row.focused {
    .result-name {
      text-decoration: underline;
    }
  }

  .result-cell:hover,
  .result-cell.focused,
  .focused-cell {
    .create-btn {
      background-color: var(--hover-tint);
    }
  }
</style>
