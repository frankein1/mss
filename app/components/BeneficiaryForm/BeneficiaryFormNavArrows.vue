<template>
  <div
    v-if="previousPage || nextPage"
    class="fr-mb-5w beneficiaryformnavarrows__container"
  >
    <button
      v-if="previousPage"
      class="fr-link fr-icon-arrow-left-line fr-link--icon-left"
      :to="previousPage.path"
      type="submit"
      @click="emit('save', previousPage.path)"
    >
      {{ previousPage.title }}
    </button>
    <button
      v-if="nextPage"
      class="fr-link fr-icon-arrow-right-line fr-link--icon-right beneficiaryformnavarrows__next-link"
      :to="nextPage.path"
      type="submit"
      @click="emit('save', nextPage.path)"
    >
      {{ nextPage.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    previousPage?: { title: string; path: string }
    nextPage?: { title: string; path: string }
  }>()

  const emit = defineEmits<{
    save: [target: string]
  }>()
</script>

<style lang="scss">
  .beneficiaryformnavarrows__container {
    display: flex;
  }

  .beneficiaryformnavarrows__next-link {
    margin-left: auto;
  }

  // Uses <a[href]> style from DSFR
  button.fr-link {
    background-image: var(--underline-img), var(--underline-img);
    background-position:
      var(--underline-x) 100%,
      var(--underline-x) calc(100% - var(--underline-thickness));
    background-repeat: no-repeat, no-repeat;
    background-size:
      var(--underline-hover-width) calc(var(--underline-thickness) * 2),
      var(--underline-idle-width) var(--underline-thickness);
    transition: background-size 0s;
  }

  @media (hover: hover) and (pointer: fine) {
    button.fr-link:active,
    button.fr-link:hover {
      --underline-hover-width: var(--underline-max-width);
    }
  }
</style>
