<template>
  <div
    class="pagetitle__container"
    :class="{ 'fr-mb-4w': !noMargin }"
  >
    <div
      v-if="icon"
      class="pagetitle__icon fr-mr-4w"
      :class="[iconColorClass, iconBackgroundClass]"
    >
      <span
        :class="[icon]"
        aria-hidden="true"
      ></span>
    </div>
    <div class="pagetitle__titles">
      <h1 class="pagetitle__title fr-mb-0">{{ title }}</h1>
      <h2
        v-if="subtitle"
        class="pagetitle__subtitle fr-h4 fr-mt-2w fr-mb-0"
      >
        <AtomPictogram
          v-if="subtitlePictoPath"
          :path="subtitlePictoPath"
          class="fr-mr-1w"
        />
        {{ subtitle }}
      </h2>
      <div
        v-if="hasSlot"
        class="pagetitle__slot fr-mt-2w"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      title: string
      noMargin?: boolean
      icon?: string
      iconColorClass?: string
      iconBackgroundClass?: string
      subtitle?: string
      subtitlePictoPath?: string
    }>(),
    {
      noMargin: false,
      icon: '',
      iconColorClass: '',
      iconBackgroundClass: '',
      subtitle: '',
      subtitlePictoPath: ''
    }
  )

  const slots = useSlots()

  const hasSlot = computed(() => slots.default)
</script>

<style lang="scss" scoped>
  .pagetitle__container {
    display: flex;
    align-items: center;
  }

  .pagetitle__icon {
    color: var(--primary);
    background-color: var(--primary-light);
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.75rem;
    height: fit-content;
    width: fit-content;

    span::before {
      --icon-size: 2rem;
    }
  }

  .pagetitle__titles {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .pagetitle__title,
  .pagetitle__subtitle {
    color: var(--blue-france-sun-113-625);
  }

  .pagetitle__subtitle {
    display: inline-flex;

    > .fr-artwork {
      width: 2rem;
      height: 2rem;
    }
  }

  .pagetitle__slot {
    font-size: small;
  }

  .pagetitle__required {
    color: red;
  }
</style>
