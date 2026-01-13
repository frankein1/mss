<!-- Inspired by Spectre.css Drowdown - https://github.com/picturepan2/spectre/blob/master/src/_dropdowns.scss -->

<template>
  <div
    :id="DROPDOWN_ID"
    class="dropdown"
    :class="{ 'dropdown-right': alignRight }"
    @focusout="onFocusOut"
  >
    <button
      ref="dropdownBtn"
      :disabled="loading"
      class="fr-btn fr-btn--sm fr-icon-arrow-down-s-line fr-btn--icon-right dropdown-btn"
      :class="dropdownBtnClass"
      :aria-expanded="expanded"
      :aria-controls="MENU_ID"
      @focus="expanded = true"
    >
      <AtomLoader
        v-if="loading"
        border-color="#DDDDDD"
        :diameter="20"
        class="fr-mr-1w"
      />
      <span
        v-else-if="icon"
        :class="icon"
        class="fr-mr-1w"
        aria-hidden="true"
      />

      {{ label }}
    </button>
    <ul
      v-show="expanded"
      :id="MENU_ID"
      class="menu"
    >
      <li
        v-for="menu in menus"
        :key="menu.label"
      >
        <NuxtLink
          v-if="menu.to || menu.href"
          :disabled="menu.disabled"
          :to="menu.to || menu.href"
          :class="menuClass(menu.icon)"
          :external="menu.href != null"
          :title="menu.title"
          @focus="expanded = true"
        >
          {{ menu.label }}
        </NuxtLink>
        <button
          v-else
          :disabled="menu.disabled"
          :class="menuClass(menu.icon)"
          :title="menu.title"
          @click.prevent="onMenuItemClick(menu)"
          @focus="expanded = true"
        >
          {{ menu.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import type { MenuItem } from '~/types/menu'

  withDefaults(
    defineProps<{
      label: string
      menus: MenuItem[]
      loading?: boolean
      dropdownBtnClass?: string
      alignRight?: boolean
      icon?: string
    }>(),
    {
      dropdownBtnClass: '',
      alignRight: false,
      icon: undefined,
      loading: false
    }
  )

  const MENU_ID = 'dropdown-' + useId()
  const DROPDOWN_ID = 'dropdown-menu-' + useId()

  const expanded = ref(false)
  const dropdownBtn = ref<HTMLButtonElement | null>(null)

  function onMenuItemClick(menu: MenuItem) {
    menu.onClick?.(menu)
    expanded.value = false
  }

  function menuClass(icon: string | undefined) {
    const base = 'fr-btn fr-btn--tertiary-no-outline'
    return icon ? `${base} fr-btn--icon-left ${icon}` : base
  }

  function onFocusOut({ relatedTarget }: FocusEvent) {
    if ((relatedTarget as HTMLElement | null)?.closest(`#${DROPDOWN_ID}`)) {
      return
    }
    expanded.value = false
  }
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  .dropdown {
    display: block;
    width: fit-content;
    position: relative;

    .menu {
      animation: slide-down 0.15s ease 1;
      left: 0;
      max-height: 50vh;
      overflow-y: auto;
      width: initial;
    }

    &.dropdown-right {
      margin-left: auto;

      .menu {
        right: 0;
        left: unset;
      }
    }
  }

  .menu .fr-btn {
    border-radius: 0;
    width: 100%;
    text-align: left;
    text-wrap: nowrap;
  }

  .dropdown-btn {
    border-radius: 2rem;

    span::before {
      --icon-size: 1.125rem;
    }
  }
</style>
