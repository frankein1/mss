<template>
  <svg
    v-if="imagePath"
    class="fr-artwork"
    aria-hidden="true"
    viewBox="0 0 80 80"
    :width="length"
    :height="length"
  >
    <use
      class="fr-artwork-decorative"
      :xlink:href="`${imagePath}#artwork-decorative`"
    ></use>
    <use
      class="fr-artwork-minor"
      :xlink:href="`${imagePath}#artwork-minor`"
    ></use>
    <use
      class="fr-artwork-major"
      :xlink:href="`${imagePath}#artwork-major`"
    ></use>
  </svg>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      path: string
      length?: string
    }>(),
    { length: '5rem' }
  )

  // Nuxt/Vite do not handle dynamic assets path. Cheers to danielroe for this workaround - https://github.com/nuxt/nuxt/issues/14766#issuecomment-1397365205
  const glob = import.meta.glob('~/assets/pictograms/*.svg')

  console.debug(glob)

  for (const path in glob) {
    glob[path]().then(mod => {
      console.log(path, mod)
    })
  }

  const imagePath = computed(() => props.path)

  // const imagePath = computed(async () => {
  //   const mod = glob[props.path.replace('~', '')]
  //   const {default} = await mod()
  // return default})
</script>
