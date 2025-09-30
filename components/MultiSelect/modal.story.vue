<template>
  <div style="height: 450px">
    <MultiSelect
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
  defineProps<{ options: { value: string; label: string }[] }>()
</script>
