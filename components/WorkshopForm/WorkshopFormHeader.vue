<template>
  <div>
    <AtomBreadcrumb :links="breadcrumbs" />
    <div class="page-title-container fr-mb-4w">
      <div class="page-title-image fr-hidden fr-unhidden-sm">
        <img
          src="/pictograms/calendar.svg"
          alt=""
        />
      </div>
      <PageTitle
        class="title"
        :title
        no-margin
      >
      </PageTitle>
      <RequiredFields class="required" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const { title, breadcrumbs } = defineProps<{
    title: string
    breadcrumbs: {
      to?: string
      text: string
    }[]
  }>()
</script>

<style scoped lang="scss">
  .page-title-container {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(2, auto);
    grid-gap: 1rem;

    .page-title-image {
      grid-area: 1 / 1 / 3 / 2;
      border-radius: 0.5rem;
      background-color: #fff;
      width: 6rem;
      height: 6rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title {
      grid-area: 1 / 2 / 2 / 3;
    }

    .required {
      grid-area: 2 / 2 / 3 / 3;
    }
  }
</style>
