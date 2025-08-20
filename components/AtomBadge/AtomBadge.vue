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
        'fr-badge--info': color === 'bue',
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
  withDefaults(
    defineProps<{
      small?: boolean
      color?: 'green' | 'purple' | 'red' | 'yellow' | 'bue' | 'orange' | 'grey'
      label?: string
      icon?: string
    }>(),
    {
      small: false,
      color: 'grey',
      icon: undefined,
      label: undefined
    }
  )
</script>
