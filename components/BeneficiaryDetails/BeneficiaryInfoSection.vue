<template>
  <div class="section fr-p-4w fr-m-1w">
    <div
      v-if="title"
      class="fr-container"
    >
      <button
        class="accordeon__btn"
        @click="toggle"
      >
        <div class="accordeon__heading fr-h4">
          <div>{{ title }}</div>
          <div :class="arrowClass"></div>
        </div>
      </button>
    </div>
    <div
      v-if="openState"
      class="fr-py-2w"
    >
      <slot />
      <div
        v-if="beneficiaryId"
        class="button__container"
      >
        <div class="fr-pr-12w">
          <NuxtLink
            :to="`${RoutePath.AppBeneficiaryEdit(beneficiaryId)}`"
            class="fr-btn fr-btn--secondary"
            title="Modifier"
            target="_self"
          >
            Modifier
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { RoutePath } from '~/utils/routing'

  defineProps<{
    title?: string
    beneficiaryId?: string
  }>()

  const openState = ref(true)

  const toggle = () => {
    openState.value = !openState.value
  }

  const arrowClass = computed(() => {
    return openState.value
      ? 'fr-icon-arrow-down-s-line'
      : 'fr-icon-arrow-up-s-line'
  })
</script>

<style scoped>
  .section {
    border-radius: 8px;
    border: 1px solid var(--border-default-grey);
    background: white;
  }

  .accordeon__btn {
    width: 100%;
    text-align: left;
    color: var(--text-title-blue-france);
    border-bottom: 1px solid var(--border-default-grey);
    background: var(--background-default-grey);

    &:hover {
      background: white;
    }
  }

  .accordeon__heading {
    display: flex;
    justify-content: space-between;
    color: var(--text-title-blue-france);
  }

  .button__container {
    display: flex;
    justify-content: flex-end;
  }
</style>
