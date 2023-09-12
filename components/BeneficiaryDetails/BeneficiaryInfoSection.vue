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
        <div class="accordeon__heading fr-pb-2w">
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
    border: 1px solid #ddd;
    background: white;
  }

  .accordeon__btn {
    width: 100%;
    text-align: left;
    color: var(--light-text-title-blue-france, #000091);
    border-bottom: 1px solid var(--light-border-default-grey, #ddd);
    background: var(--light-background-default-grey, #fff);

    &:hover {
      background: white;
    }
  }

  .accordeon__heading {
    display: flex;
    justify-content: space-between;

    font-family: Marianne;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px;
  }

  .button__container {
    display: flex;
    justify-content: flex-end;
  }
</style>
