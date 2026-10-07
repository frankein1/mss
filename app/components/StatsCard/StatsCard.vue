<template>
  <div>
    <div
      :id="cardId"
      class="feature-section fr-p-2w"
    >
      <div class="fr-mb-3w">
        <div class="card-title fr-mb-2v">
          <h4
            :id="titleId"
            class="fr-h5 card-title-text fr-mb-0"
          >
            {{ cardName }}
          </h4>
          <button
            :id="buttonId"
            ref="copyButton"
            type="button"
            class="fr-btn fr-btn--tertiary-no-outline"
            name="Copier l'image"
            aria-label="Copier l'image"
            @click="handleOnCopy"
          >
            <svg
              v-if="imageCopied"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24px"
              height="24px"
              aria-hidden="true"
            >
              <path
                d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"
              ></path>
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24px"
              height="24px"
              aria-hidden="true"
            >
              <path
                d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"
              ></path>
            </svg>
          </button>
        </div>
        <p
          v-if="cardSubtitle"
          class="fr-text--xs text--muted fr-mb-0"
        >
          {{ cardSubtitle }}
        </p>
      </div>
      <slot>Contenu non chargé</slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { toBlob } from 'html-to-image'
  import { statsCardTitleIdInjectionKey } from '~/utils/constants/stats'

  const props = defineProps<{
    cardName: string
    cardSubtitle?: string
    cardId: string
  }>()

  const imageCopied = ref<boolean>(false)
  const copyButton = ref<HTMLElement | null>(null)

  const buttonId = useId()
  const titleId = useId()

  provide(statsCardTitleIdInjectionKey, titleId)

  const buttonFilter = (node: HTMLElement | Node) => {
    return (node as HTMLElement).tagName !== 'BUTTON'
  }

  const handleOnCopy = () => {
    const card = document.getElementById(props.cardId)
    const expandButton = card?.getElementsByClassName(
      'btn-unexpanded'
    )[0] as HTMLElement
    if (expandButton) {
      expandButton.click()
      setTimeout(() => {
        const width = document?.getElementById(props.cardId)?.clientWidth || 100
        const height =
          document?.getElementById(props.cardId)?.clientHeight || 100
        copyToCliboard({ width, height })
      }, 300)
    } else {
      const width = document?.getElementById(props.cardId)?.clientWidth || 100
      const height = document?.getElementById(props.cardId)?.clientHeight || 100
      copyToCliboard({ width, height })
    }
  }

  const copyToCliboard = async ({
    width,
    height
  }: {
    width: number
    height: number
  }) => {
    const node = document.getElementById(props.cardId)
    const onfail = () => useSnackbar().error("L'image n'a pas pu être copiée.")

    if (!node) {
      onfail()
      throw new Error('copyToCliboard: no node found')
    }
    const scale = 1
    let blob: Blob | null

    try {
      blob = await toBlob(node, {
        width: width,
        height: height,
        style: {
          transform: 'scale(' + scale + ')',
          transformOrigin: 'top left'
        },
        quality: 0.9,
        filter: buttonFilter
      })
      if (!blob) {
        throw new Error('no blob created')
      }
    } catch (e: unknown) {
      onfail()
      throw e
    }

    try {
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ])
    } catch (e: unknown) {
      onfail()
      throw e
    }

    imageCopied.value = true
    setTimeout(() => {
      imageCopied.value = false
    }, 2000)
    useSnackbar().success("L'image est copiée dans votre presse-papier.")
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
      text-wrap: balance;
    }
  }
</style>
