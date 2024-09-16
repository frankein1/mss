<template>
  <client-only>
    <div class="tiptap-editor-menubar fr-input">
      <ul role="navigation">
        <!-- Titles -->
        <li>
          <button
            v-if="editor"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
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
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
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
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
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
            @click="editor.chain().focus().toggleBold().run()"
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
            @click="editor.chain().focus().toggleItalic().run()"
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
            @click="editor.chain().focus().toggleBulletList().run()"
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
            @click="editor.chain().focus().toggleOrderedList().run()"
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
            @click="setLink"
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
            @click="unsetLink"
          >
            <img
              src="~/assets/icons/editor-link.svg"
              alt="Défaire le lien"
            />
          </button>
        </li>
      </ul>
    </div>
    <EditorContent
      :editor="editor"
      class="tiptap-editor-content fr-input"
    />
  </client-only>
</template>

<script setup lang="ts">
  import { EditorContent, JSONContent, useEditor } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  import Underline from '@tiptap/extension-underline'
  import Link from '@tiptap/extension-link'

  // TODO: create object + type for update payload
  const emit = defineEmits<{
    update: [
      html: string | undefined,
      json: JSONContent | undefined,
      rawText: string | undefined
    ]
  }>()

  const html = ref<string | undefined>('')
  const json = ref<JSONContent | undefined>()
  const rawText = ref<string | undefined>()

  const editor = useEditor({
    content: '',
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        defaultProtocol: 'https'
      })
    ],
    editorProps: {
      attributes: {
        class: 'custom-tiptap'
      }
    },
    onUpdate: () => {
      html.value = editor.value?.getHTML()
      json.value = editor.value?.getJSON()
      rawText.value = editor.value?.getText()
      emit('update', html.value, json.value, rawText.value)
    }
  })

  const improveUrl = (url: string) => {
    if (!/^https?:\/\//i.test(url)) {
      return 'https://' + url
    }
    return url // Retourne l'URL sans modification si elle est déjà correcte
  }

  const setLink = () => {
    // TODO: improve function, by adding 'https://'' prefix when not provided in url
    const previousUrl = editor.value?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.value
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: improveUrl(url) })
      .run()
  }

  const unsetLink = () => {
    editor.value?.chain().focus().unsetLink().run()
  }

  onMounted(() => {
    html.value = editor.value?.getHTML()
    json.value = editor.value?.getJSON()
  })
</script>

<style lang="scss" scoped>
  .tiptap-editor-menubar {
    box-shadow: inset 0 -1px 0 0 #cecece;
    padding: 0;
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
  }
  .tiptap-editor-content {
    min-height: 3.75rem;
    max-height: none;
    height: 30rem;
    border-radius: 0;
    padding: 0;
  }
  // Button
  .menubar__button {
    &:active {
      background: none;
    }
  }
  .is-active > img {
    filter: opacity(0.5);
  }
</style>

<style lang="scss">
  .custom-tiptap {
    padding: 0.5rem 1rem;
    min-height: 3.75rem;
    max-height: none;
    height: 30rem;
  }
</style>
