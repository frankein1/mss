<template>
  <client-only>
    <div class="menubar">
      <button
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        [B]
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        [I]
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        [S]
      </button>
      <!-- Not working? -->
      <button
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('underline') }"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        [U]
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>

      <button
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        H3
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        [.]
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        [1]
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': editor.isActive('link') }"
        @click="setLink"
      >
        [set link]
      </button>
      <button
        :disabled="!editor.isActive('link')"
        @click="editor.chain().focus().unsetLink().run()"
      >
        Unset link
      </button>
    </div>
    <editor-content :editor="editor" />
    <p>{{ html }}</p>
    <p>{{ json }}</p>
  </client-only>
</template>

<script>
  import { Editor, EditorContent } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  import Underline from '@tiptap/extension-underline'
  import Link from '@tiptap/extension-link'

  export default {
    components: {
      EditorContent
    },
    emits: ['update'],

    data() {
      return {
        html: '',
        json: '',
        editor: null
      }
    },

    mounted() {
      this.editor = new Editor({
        content: '<p>I’m running Tiptap with Vue.js.</p>',
        extensions: [
          StarterKit,
          Underline,
          Link.configure({
            openOnClick: false,
            defaultProtocol: 'https'
          })
        ]
      })
      this.html = this.editor.getHTML()
      this.json = this.editor.getJSON()

      this.editor.on('update', () => {
        this.html = this.editor.getHTML()
        this.json = this.editor.getJSON()
        this.$emit('update', this.html)
      })
    },

    beforeUnmount() {
      this.editor.destroy()
    },

    methods: {
      setLink() {
        // TODO: improve function, by adding 'https://'' prefix when not provided in url
        const previousUrl = this.editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
          return
        }

        // empty
        if (url === '') {
          this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
          return
        }

        // update link
        this.editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url })
          .run()
      }
    }
  }
</script>
