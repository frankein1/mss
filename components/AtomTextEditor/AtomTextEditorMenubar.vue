<template>
  <ul role="navigation">
    <!-- Titles -->
    <li>
      <button
        v-if="editor"
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
    <li>
      <button
        v-if="editor"
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
    <li class="break">
      <button
        v-if="editor"
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
    <li>
      <button
        v-if="editor"
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
    <li class="break">
      <button
        v-if="editor"
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
    <li>
      <button
        v-if="editor"
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
    <li class="break">
      <button
        v-if="editor"
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
    <li>
      <button
        v-if="editor"
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
    <li>
      <button
        v-if="editor"
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
  import { Editor } from '@tiptap/vue-3'

  const props = defineProps<{
    editor?: Editor
  }>()

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
      .setLink({ href: improveUrl(url) })
      .run()
  }

  const unsetLink = () => {
    props.editor?.chain().focus().unsetLink().run()
  }

  const improveUrl = (url: string) => {
    if (!/^https?:\/\//i.test(url)) {
      return 'https://' + url
    }
    return url
  }
</script>

<style lang="scss" scoped>
  // Button
  .menubar__button {
    width: 40px;
    height: 40px;

    &:active {
      background: none;
    }
  }

  .is-active {
    & > img {
      filter: opacity(0.5);
    }
  }

  ul {
    padding: 0;
    display: flex;
    align-items: center;
    list-style-type: none;
    margin: 0;
    height: 40px;

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

  button {
    margin: 0 0.5rem;

    img {
      margin-top: 2px;
    }
  }
</style>
