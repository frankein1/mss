<template>
  <client-only>
    <EditorContent
      ref="input"
      :editor="editor"
      :editable="false"
      class="tiptap-editor-reader"
    />
  </client-only>
</template>

<script setup lang="ts">
  import { Content, EditorContent, JSONContent, useEditor } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  import Link from '@tiptap/extension-link'

  const props = withDefaults(
    defineProps<{
      value: string | null
    }>(),
    {
      value: null
    }
  )

  const editor = useEditor({
    content: props.value ? JSON.parse(props.value) : '',
    enableContentCheck: true,
    onContentError({ error }) {
      console.error(error)
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
        class: 'custom-tiptap'
      }
    }
  })
</script>

<style lang="scss">
  .tiptap-editor-reader {
    .custom-tiptap {
      padding: 0;

      &:focus,
      &:focus-visible {
        outline: none;
      }

      ul {
        list-style-type: disc;
        padding-inline-start: 1.5rem;
      }

      ol {
        list-style: initial;
        counter-reset: li-counter;
        list-style-type: decimal;
        padding-inline-start: 1.5rem;
        --ol-content: initial;

        & > li {
          counter-increment: li-counter;
        }
      }

      p.text-editor-paragraph {
        margin-bottom: 0.75em;
      }

      .text-editor-heading {
        margin-bottom: 0.125em;
      }

      h3.text-editor-heading {
        font-size: 1.125rem;
        line-height: 1.5em;
      }

      h2.text-editor-heading {
        font-size: 1.375rem;
        line-height: 1.5em;
      }

      h1.text-editor-heading {
        font-size: 1.625rem;
        line-height: 1.5em;
      }

      .text-editor-list {
        margin-bottom: 0;
        padding-bottom: 0;
      }
    }
  }
</style>
