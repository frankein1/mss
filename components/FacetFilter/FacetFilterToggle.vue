<template>
  <div class="multiselect">
    <!-- input sectionnable -->
    <input
      ref="input"
      class="fr-select"
      :name="name"
      :placeholder="name"
      type="text"
      :value="selectedOptionInputValue"
      readonly
      :aria-describedby="ariaDescribedby"
      :aria-labelledby="ariaLabelledBy"
      @click="isOpen = !isOpen"
      @keydown.esc="isOpen = false"
    />
    <!-- dropdown -->
    <Transition name="fade-in">
      <div
        v-if="isOpen"
        v-click-outside="onClickOutside"
        :class="['multiselect-content', optionsClass]"
        @keydown.esc="isOpen = false"
      >
        <!-- bloc principal -->
        <div class="px-4 pt-4">
          <!-- Champ de recherche -->
          <FacetSearch
            ref="facetSearch"
            v-model="facetQuery"
            placeholder="Rechercher"
            :aria-labelledby="`label-search-${uuid}`"
            class="fr-mt-3"
            @update:model-value="handleChangeSearchFacetValues"
          />

          <!-- List des items -->
          <div
            ref="scrollContainer"
            class="scroll-container show-scrollbar"
          >
            <div class="content">
              <div
                v-if="options.length == 0"
                class=""
              >
                Aucun résultat avec les filtres actuels.
              </div>

              <fieldset
                class="fieldset"
                style="min-inline-size: auto"
              >
                <legend class="fr-sr-only">
                  {{ legend }}
                </legend>
                <div
                  v-for="option in options"
                  :key="option.value"
                  class="option-item"
                >
                  <VeeCheckbox
                    :name="option.value"
                    :label="option.label"
                    @change="handleFacetToggle(option)"
                  />
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import FacetSearch from './FacetSearch.vue'
  import type { Options } from '~/utils/options'

  const props = withDefaults(
    defineProps<{
      name: string
      options: Options
      legend?: string | null
      optionsClass?: string
      ariaDescribedby?: string
      ariaLabelledBy?: string
      facetValueResolver?: any
    }>(),
    {
      optionsClass: '',
      legend: null,
      facetValueResolver: null,
      ariaDescribedby: '',
      ariaLabelledBy: ''
    }
  )

  const isOpen = ref<boolean>(false)
  const facetHits = ref<any>(null)
  const facetQuery = ref<any>(null)
  const selectedOptions = ref<Options>([])
  const uuid = ref<string>('ldjvhekrgjfgeakjvh') // TODO

  // Computed
  const activeValuesCount = () => {
    return props.options.length
  }

  const selectedOptionInputValue = computed(() => {
    if (selectedOptions.value.length === 0) {
      return null
    }
    return selectedOptions.value.map(option => option.label).join(', ')
  })

  // functions
  const handleFacetToggle = (option: any) => {
    // TODO
    console.log(option)
    selectedOptions.value.push(option)
  }
  const firstValueSelected = () => {
    return props.options[0]
  }
  const resolveFacetValue = (value: any) => {
    return props.facetValueResolver ? props.facetValueResolver[value] : value
  }
  const deleteFacet = () => {
    // deleteFilter(props.name) // algolia function
    isOpen.value = false
  }
  const handleChangeSearchFacetValues = (facetQuery: string) => {
    if (!facetQuery || facetQuery === '') {
      facetHits.value = null
    }
  }
  const onClickOutside = (_e: Event) => {
    isOpen.value = false
  }

  onMounted(() => {
    //
  })
  onBeforeMount(() => {
    //
  })
</script>

<style lang="scss" scoped>
  .multiselect {
    position: relative;
    .multiselect-content {
      min-height: 1.5rem;
      box-shadow: 0px 4px 12px 0px #00001229;
      border-width: 1px;
      padding: 1em;
      list-style-type: none;
      margin: 0;
      z-index: 600;
      position: absolute;
      width: 100%;
      background: #fff;
      width: 100%;
    }
    .scroll-container {
      overflow-y: auto;
      overscroll-behavior: contain;
      max-height: 254px;
      padding-bottom: 0.75rem;
      margin: 0;
      margin-top: 1rem;
      .content {
        fieldset {
          position: relative;
          min-inline-size: auto;
          border: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .option-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
      }
    }
  }

  // Transition
  // TODO
  .fade-in-leave-active,
  .fade-in-enter-active {
    transition: all 0.15s ease;
  }

  .fade-in-enter-from,
  .fade-in-leave-to {
    transform: translateY(20px);
    opacity: 0;
  }
</style>

<style lang="scss">
  .option-item {
    input[type='checkbox'] + label {
      margin-left: 1rem;
    }
    input[type='checkbox'] + label:before {
      top: 0.3rem;
      width: 1rem;
      height: 1rem;
      left: -1.5rem;
    }
  }
</style>
