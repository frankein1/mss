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
    </div>
    <EditorContent
      :editor="editor"
      class="tiptap-editor-content fr-input"
    />
  </client-only>
</template>

<script setup lang="ts">
  import { Content, EditorContent, JSONContent, useEditor } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  import Link from '@tiptap/extension-link'

  const props = withDefaults(
    defineProps<{
      maxHeight?: number | null
      initialValue?: string | null
    }>(),
    {
      maxHeight: null,
      initialValue: null
    }
  )

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

  const getHeight = (): string => {
    if (!props.maxHeight) {
      return 'min-height: 30rem'
    }
    return 'min-height: ' + props.maxHeight + 'px'
  }

  const goodContent = props.initialValue ? JSON.parse(props.initialValue) : ''
  const badcontent = { truc: 'kjsvezkvgjh', machin: 'lzhvkf;dbvkefjbv zlkef' }

  const editor = useEditor({
    content: props.initialValue ? JSON.parse(props.initialValue) : '',
    enableContentCheck: true,
    onContentError({ editor, error, disableCollaboration }) {
      console.log(error)
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'text-editor-heading'
          }
        },
        paragraph: {
          HTMLAttributes: {
            class: 'text-editor-paragraph'
          }
        },
        listItem: {
          HTMLAttributes: {
            class: 'text-editor-list'
          }
        }
      }),
      Link.configure({
        openOnClick: false,
        defaultProtocol: 'https'
      })
    ],
    editorProps: {
      attributes: {
        class: 'custom-tiptap',
        style: getHeight()
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
    border-radius: 0;
    padding: 0;
  }
  // Button
  .menubar__button {
    width: 40px; // TODO: convert to em??
    height: 40px;
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

    p.text-editor-paragraph {
      margin-bottom: 0.75em;
    }
    .text-editor-heading {
      margin-bottom: 0.25em;
    }
    h3.text-editor-heading {
      font-size: 1.125rem;
    }
    h2.text-editor-heading {
      font-size: 1.25rem;
    }
    h1.text-editor-heading {
      font-size: 1.375rem;
    }
    .text-editor-list {
      margin-bottom: 0;
      padding-bottom: 0;
    }
  }
</style>
