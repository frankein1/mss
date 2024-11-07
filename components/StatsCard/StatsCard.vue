<template>
  <div>
    <div
      :id="cardId"
      class="feature-section fr-p-2w"
    >
      <div class="card-title fr-mb-3w">
        <h4 class="fr-h5 card-title-text fr-mb-0">{{ cardName }}</h4>
        <button
          ref="copyButton"
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
  const copyButton = ref<HTMLElement | null>(null)

  const buttonFilter = (node: HTMLElement | Node) => {
    return (node as HTMLElement).tagName !== 'BUTTON'
  }

  const copyToCliboard = async () => {
    const node = document.getElementById(props.cardId)
    if (node) {
      try {
        const scale = 1
        const blob = await domtoimage.toBlob(node, {
          width: node.clientWidth * scale,
          height: node.clientHeight * scale,
          style: {
            transform: 'scale(' + scale + ')',
            transformOrigin: 'top left'
          },
          quality: 0.9,

          filter: buttonFilter
        })
        navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ])

        imageCopied.value = true
        useSnackbar().success("L'image est copiée dans votre presse papier.")
        setTimeout(() => {
          imageCopied.value = false
        }, 2000)
      } catch (_error) {
        useSnackbar().error("L'image n'a pas pu être copié.", () =>
          copyButton.value?.focus()
        )
      }
    }
  }
</script>

<style scoped lang="scss">
  .feature-section {
    height: 100%;
  }

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
