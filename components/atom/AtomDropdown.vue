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
      class="fr-btn fr-icon-arrow-down-s-line fr-btn--icon-right dropdown-btn"
      :class="dropdownBtnClass"
      aria-expanded="false"
      :aria-controls="MENU_ID"
      @focus="expanded = true"
      @click.prevent
    >
      {{ label }}
    </button>
    <ul
      :id="MENU_ID"
      class="menu"
    >
      <li
        v-for="menu in menus"
        :key="menu.label"
      >
        <NuxtLink
          v-if="menu.to"
          :to="menu.to"
          target="_self"
          :class="menuClass(menu.icon)"
          @focus="expanded = true"
        >
          {{ menu.label }}
        </NuxtLink>
        <button
          v-else
          :class="menuClass(menu.icon)"
          @click.prevent="menu.callback"
          @focus="expanded = true"
        >
          {{ menu.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { getRandomId } from '~/utils/random'
  import type { Menu } from '~/types/menu'

  withDefaults(
    defineProps<{
      label: string
      menus: Menu[]
      dropdownBtnClass?: string
      alignRight?: boolean
    }>(),
    { dropdownBtnClass: '', alignRight: false }
  )

  const MENU_ID = getRandomId('dropdown-menu-')
  const DROPDOWN_ID = getRandomId('dropdown-')

  const expanded = ref(false)
  const dropdownBtn = ref<HTMLButtonElement | null>(null)

  watch(expanded, _expanded => {
    dropdownBtn.value?.setAttribute('aria-expanded', `${expanded.value}`)
  })

  function menuClass(icon: string) {
    const base = 'fr-btn fr-btn--tertiary-no-outline'

    return icon ? `${base} fr-btn--icon-left ${icon}` : base
  }

  function onFocusOut({ relatedTarget }: FocusEvent) {
    if ((relatedTarget as HTMLElement).closest(`#${DROPDOWN_ID}`)) return
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
      display: none;
      left: 0;
      max-height: 50vh;
      overflow-y: auto;
      width: initial;
    }

    &.active .menu,
    &:focus-within .menu {
      display: block;
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
  }

  .dropdown-btn {
    border-radius: 2rem;
  }
</style>
