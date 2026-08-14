<template>
  <p
    class="fr-badge fr-badge--sm"
    :class="[
      {
        'fr-badge--sm': small,
        'fr-badge--success': color === 'green',
        'fr-badge--purple-glycine': color === 'purple',
        'fr-badge--error': color === 'red',
        'fr-badge--green-tilleul-verveine': color === 'yellow',
        'fr-badge fr-badge--orange-terre-battue': color === 'orange',
        'fr-badge--info': color === 'blue',
        '': color === 'grey',
        'fr-badge--icon-left': icon
      },
      icon
    ]"
  >
    <slot>
      <span>{{ label }}</span>
    </slot>
  </p>
</template>

<script setup lang="ts">
  import { BadgeColor } from '~~/types/badge'

  withDefaults(
    defineProps<{
      small?: boolean
      color?: BadgeColor
      label?: string
      icon?: string
    }>(),
    {
      small: false,
      color: BadgeColor.Grey,
      icon: undefined,
      label: undefined
    }
  )
</script>
