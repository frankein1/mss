<!-- Based on https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/ -->

<template>
  <div
    :id="CONTAINER_ID"
    class="disclosure"
    :class="{ 'disclosure-right': alignRight }"
  >
    <button
      ref="triggerBtn"
      :disabled="loading"
      class="fr-btn fr-btn--icon-right disclosure-btn"
      :class="[icon ?? 'fr-icon-arrow-down-s-line', dropdownBtnClass]"
      :aria-expanded="expanded"
      :aria-controls="MENU_ID"
      @click="toggle"
    >
      <AtomLoader
        v-if="loading"
        border-color="#DDDDDD"
        :diameter="20"
        class="fr-mr-1w"
      />
      {{ label }}
    </button>

    <ul
      v-show="expanded"
      :id="MENU_ID"
      class="menu"
      role="list"
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
          @click="close"
        >
          {{ menu.label }}
        </NuxtLink>
        <button
          v-else
          :disabled="menu.disabled"
          :class="menuClass(menu.icon)"
          :title="menu.title"
          @click.prevent="onMenuItemClick(menu)"
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

  const MENU_ID = 'disclosure-menu-' + useId()
  const CONTAINER_ID = 'disclosure-' + useId()

  const expanded = ref(false)
  const triggerBtn = ref<HTMLButtonElement | null>(null)

  function toggle() {
    expanded.value = !expanded.value
  }

  function close() {
    expanded.value = false
  }

  function onMenuItemClick(menu: MenuItem) {
    menu.onClick?.(menu)
    close()
  }

  function menuClass(icon: string | undefined) {
    const base = 'fr-btn fr-btn--tertiary-no-outline'
    return icon ? `${base} fr-btn--icon-left ${icon}` : base
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && expanded.value) {
      close()
      triggerBtn.value?.focus()
    }
  }

  function onClickOutside(event: MouseEvent) {
    const container = document.getElementById(CONTAINER_ID)
    if (container && !container.contains(event.target as Node)) {
      close()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
    document.addEventListener('click', onClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    document.removeEventListener('click', onClickOutside)
  })
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  .disclosure {
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

    &.disclosure-right {
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

  .disclosure-btn {
    span::before {
      --icon-size: 1.125rem;
    }
  }
</style>
