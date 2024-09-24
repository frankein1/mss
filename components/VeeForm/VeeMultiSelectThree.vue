<template>
  <div
    :ref="fieldset"
    class="fieldset"
  >
    <label
      id="labelId"
      for="displayInputId"
      class="fr-label"
    >
      Multiselect
    </label>
    <input
      class="fr-select"
      readonly
      value="Choisir une option"
      @click="onClickInput"
    />
    <ul
      v-show="opened"
      id="listboxId"
      class="fr-fieldset__element"
      role="listbox"
      aria-multiselectable="true"
    >
      <li
        v-for="({ value: optionValue, label: optionLabel }, index) in options"
        :key="index"
        role="option"
      >
        <VeeCheckbox
          :name="optionValue"
          :label="optionLabel"
          class="small-checkbox"
          @click="onToggleOption(optionValue, index)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    options: Options
    disabledOptions?: string[]
  }>()

  const opened = ref<boolean>(true)
  const fieldset = ref<HTMLElement | null>

  useClickOutside(fieldset as any, () => {
    // TODO fix
    // onClose()
  })

  function onToggleOption(value: string, optionIndex?: number) {
    // TODO
  }

  const onOpen = () => {
    opened.value = true
  }
  const onClose = () => {
    opened.value = false
  }

  const onClickInput = () => {
    if (!opened.value) {
      onOpen()
    } else {
      onClose()
    }
  }
</script>

<style lang="scss" scoped>
  .fieldset {
    margin: 0;
    display: block;
    position: relative;
  }
  // changer pour ul.menu
  ul {
    min-height: 1.5rem;
    max-height: 200px;
    overflow-y: auto;
    overscroll-behavior: contain;
    box-shadow: 0px 4px 12px 0px #00001229;
    border-width: 1px;
    padding: 1em;
    list-style-type: none;
    margin: 0;
    z-index: 600;
    position: absolute;
    width: 100%;
    animation: slide-down 0.15s ease 1;
    background: #fff;
    width: 100%;
    li {
      padding-bottom: 0.25rem;
    }
  }
</style>

<style lang="scss">
  .small-checkbox {
    .fr-label {
      margin-left: 0.5rem;
      &::before {
        width: 1rem !important;
        height: 1rem !important;
        top: 0.35rem !important;
        left: -1.5rem !important;
      }
    }
  }
</style>
