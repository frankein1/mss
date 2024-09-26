<template>
  <div>
    <!-- DSFR -->
    <div
      id="header-search"
      class="fr-search-bar"
      role="search"
    >
      <label
        class="fr-label"
        for="inputId"
      >
        Recherche
      </label>
      <input
        id="inputId"
        ref="input"
        v-model="inputValue"
        class="fr-input"
        :class="{ empty: modelValue === '' }"
        :placeholder="placeholder"
        type="search"
        :name="name"
        autocomplete="off"
        :aria-labelledby="ariaLabelledby"
        :aria-label="!ariaLabelledby && ariaLabel"
        @focus="$emit('focus')"
      />
    </div>
  </div>
</template>

<script>
  export default defineNuxtComponent({
    emits: ['update:modelValue', 'clear', 'focus'],
    props: {
      modelValue: { type: [String, Number], default: null },
      inputId: { type: String, default: 'id-1903' }, // TODO generate unique id
      name: { type: String, default: 'search' },
      placeholder: { type: String, default: 'Rechercher' },
      ariaLabelledby: { type: String, default: null },
      ariaLabel: { type: String, default: null }
    },
    data() {
      return {
        isFocus: false
      }
    },
    computed: {
      inputValue: {
        get() {
          return this.modelValue
        },
        set(newValue) {
          this.$emit('update:modelValue', newValue)
        }
      }
    },
    methods: {
      clear() {
        this.inputValue = ''
        this.$refs.input.focus()
        this.$emit('clear')
      }
    }
  })
</script>

<style lang="scss" scoped>
  .fr-input {
    border-radius: 0.25rem 0.25rem 0 0;
    box-shadow: inset 0 -2px 0 0 var(--border-plain-grey);
  }
  .fr-input.empty {
    background-image: url('@/assets/icons/search.svg');
    background-position: right 1rem top 50%;
    background-repeat: no-repeat;
  }
</style>
