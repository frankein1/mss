<template>
  <div style="height: 200px">
    <MultiSelect
      ref="ms"
      name="county"
      label="Rechercher un département"
      is-searchable
      :options
      :disabled-options="['d02', 'd07', 'd09']"
    />
  </div>
  <DsfrButtonGroup
    class="fr-mt-2w"
    equisized
    inline-layout-when="always"
    align="right"
  >
    <li>
      <DsfrButton
        label="Annuler"
        type="button"
        secondary
        @click="useModal().close()"
      ></DsfrButton>
    </li>

    <li>
      <DsfrButton
        label="Confirmer"
        type="submit"
      ></DsfrButton>
    </li>
  </DsfrButtonGroup>
</template>

<script setup lang="ts">
  import type { MultiSelect } from '#components'

  defineProps<{ options: { value: string; label: string }[] }>()

  const ms = ref<typeof MultiSelect | null>(null)
  /** When the dropdown is shown, scroll down the modal to display it fully */
  watch(
    () => ms.value?.dropdown,
    el => {
      el?.scrollIntoView({
        block: 'start',
        inline: 'nearest',
        behavior: 'smooth'
      })
    }
  )
</script>
