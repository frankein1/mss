<template>
  <ul
    ref="toolbar"
    role="toolbar"
    aria-label="Mise en forme du texte"
    @keydown="onKeydown"
    @focusin="onFocusin"
    @focusout="onFocusout"
  >
    <!-- Titles -->
    <li role="none">
      <button
        v-if="editor"
        type="button"
        :tabindex="focusedIndex === 0 ? 0 : -1"
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        @click.prevent="
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        "
      >
        <img
          src="~/assets/icons/editor-T1.svg"
          alt="Titre 1"
        />
      </button>
    </li>
    <li role="none">
      <button
        v-if="editor"
        type="button"
        :tabindex="focusedIndex === 1 ? 0 : -1"
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        @click.prevent="
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        "
      >
        <img
          src="~/assets/icons/editor-T2.svg"
          alt="Titre 2"
        />
      </button>
    </li>
    <li
      role="none"
      class="break"
    >
      <button
        v-if="editor"
        type="button"
        :tabindex="focusedIndex === 2 ? 0 : -1"
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        @click.prevent="
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        "
      >
        <img
          src="~/assets/icons/editor-T3.svg"
          alt="Titre 3"
        />
      </button>
    </li>

    <!-- emphasis -->
    <li role="none">
      <button
        v-if="editor"
        type="button"
        :tabindex="focusedIndex === 3 ? 0 : -1"
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('bold') }"
        title="Gras"
        @click.prevent="editor.chain().focus().toggleBold().run()"
      >
        <img
          src="~/assets/icons/editor-bold.svg"
          alt="Gras"
        />
      </button>
    </li>
    <li
      role="none"
      class="break"
    >
      <button
        v-if="editor"
        type="button"
        :tabindex="focusedIndex === 4 ? 0 : -1"
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('italic') }"
        @click.prevent="editor.chain().focus().toggleItalic().run()"
      >
        <img
          src="~/assets/icons/editor-ital.svg"
          alt="Italic"
        />
      </button>
    </li>

    <!-- List -->
    <li role="none">
      <button
        v-if="editor"
        type="button"
        :tabindex="focusedIndex === 5 ? 0 : -1"
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        @click.prevent="editor.chain().focus().toggleBulletList().run()"
      >
        <img
          src="~/assets/icons/editor-ul.svg"
          alt="Liste à point"
        />
      </button>
    </li>
    <li
      role="none"
      class="break"
    >
      <button
        v-if="editor"
        type="button"
        :tabindex="focusedIndex === 6 ? 0 : -1"
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        @click.prevent="editor.chain().focus().toggleOrderedList().run()"
      >
        <img
          src="~/assets/icons/editor-ol.svg"
          alt="Liste numéroté"
        />
      </button>
    </li>

    <!-- link -->
    <li role="none">
      <button
        v-if="editor"
        type="button"
        :tabindex="focusedIndex === 7 ? 0 : -1"
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('link') }"
        @click.prevent="setLink"
      >
        <img
          src="~/assets/icons/editor-link.svg"
          alt="Lien"
        />
      </button>
    </li>
    <li role="none">
      <button
        v-if="editor"
        type="button"
        :tabindex="focusedIndex === 8 ? 0 : -1"
        class="menubar__button"
        @click.prevent="unsetLink"
      >
        <img
          src="~/assets/icons/editor-unlink.svg"
          alt="Défaire le lien"
        />
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import type { Editor } from '@tiptap/vue-3'
  import { sanitizeUrl } from '@braintree/sanitize-url'

  const props = defineProps<{
    editor?: Editor
  }>()

  // Roving tabindex: only one button is reachable with Tab, arrows move between buttons
  const toolbar = useTemplateRef<HTMLUListElement>('toolbar')
  const focusedIndex = ref(0)

  function getButtons() {
    return Array.from(
      toolbar.value?.querySelectorAll<HTMLButtonElement>('button') ?? []
    )
  }

  function focusButton(index: number) {
    const buttons = getButtons()
    if (!buttons.length) {
      return
    }
    focusedIndex.value = (index + buttons.length) % buttons.length
    buttons[focusedIndex.value]?.focus()
  }

  function onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        focusButton(focusedIndex.value + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        focusButton(focusedIndex.value - 1)
        break
      case 'Home':
        focusButton(0)
        break
      case 'End':
        focusButton(getButtons().length - 1)
        break
      default:
        return
    }
    event.preventDefault()
  }

  // Keep the roving index in sync when a button gets focus by mouse click
  function onFocusin(event: FocusEvent) {
    const index = getButtons().indexOf(event.target as HTMLButtonElement)
    if (index !== -1) {
      focusedIndex.value = index
    }
  }

  // Tabbing back into the toolbar always lands on the first button
  function onFocusout(event: FocusEvent) {
    if (!toolbar.value?.contains(event.relatedTarget as Node | null)) {
      focusedIndex.value = 0
    }
  }

  const setLink = () => {
    const previousUrl = props.editor?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      props.editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    props.editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: formatLink(url) })
      .run()
  }

  function formatLink(url: string) {
    let formatted = url
    const hasHTTPProtocol = /^https?:\/\//i.test(url)
    const isMail = /[\w-.]+@([\w-]+\.)+[\w-]{2,4}/i.test(url)

    if (!isMail && !hasHTTPProtocol) {
      formatted = `https://${url}`
    } else if (isMail) {
      formatted = `mailto:${url}`
    }

    return sanitizeUrl(formatted)
  }

  const unsetLink = () => {
    props.editor?.chain().focus().unsetLink().run()
  }
</script>

<style lang="scss" scoped>
  ul {
    padding: 0;
    display: flex;
    align-items: center;
    list-style-type: none;
    margin: 0;
    flex-wrap: wrap;

    li {
      height: 40px;
      padding: 0;
      display: flex;
      align-items: center;

      &.break {
        border-right: 1px #cecece solid;
      }
    }
  }

  button,
  .menubar__button {
    margin: 0;
    width: 46px;

    img {
      margin-top: 2px;
    }

    &.is-active {
      background-color: var(--primary-active);

      & > img {
        filter: invert(1);
      }
    }
  }

  .menubar__button {
    width: 40px;
    height: 40px;

    &:active {
      background: none;
    }
  }
</style>
