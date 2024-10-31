<template>
  <div
    :id="cardId"
    class="main-container fr-p-2w"
  >
    <div class="card-title fr-mb-3w">
      <h4 class="fr-h5 card-title-text fr-mb-0">{{ cardName }}</h4>
      <button
        class="fr-btn fr-btn--tertiary-no-outline"
        name="Copier l'image"
        alt="Copier l'image"
        @click="copyToCliboard"
      >
        <Icon
          :icon="imageCopied ? 'ri-check-line' : 'ri-file-copy-line'"
          height="24px"
          :ssr="true"
        />
      </button>
    </div>
    <slot>Contenu non chargé</slot>
  </div>
</template>

<script lang="ts" setup>
  import domtoimage from 'dom-to-image-more'
  import { Icon } from '@iconify/vue'

  const props = defineProps<{
    cardName: string
    cardId: string
  }>()

  const imageCopied = ref<boolean>(false)

  const buttonFilter = (node: HTMLElement | Node) => {
    return (node as HTMLElement).tagName !== 'BUTTON'
  }

  const screenshotDefaultOptions = (element: HTMLElement) => ({
    // hack for Firefox */
    width: element.getBoundingClientRect().width,
    height: element.getBoundingClientRect().height
  })

  const copyToCliboard = async () => {
    const node = document.getElementById(props.cardId)
    if (node) {
      try {
        const blob = await domtoimage.toBlob(node, {
          ...screenshotDefaultOptions(node),
          filter: buttonFilter
        })
        navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ])

        imageCopied.value = true
        useSnackbar().success("L'image est copié dans votre presse papier.")
        setTimeout(() => {
          imageCopied.value = false
        }, 2000)
      } catch (error) {
        console.error(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  .card-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .card-title-text {
      color: var(--primary);
    }
  }
</style>
