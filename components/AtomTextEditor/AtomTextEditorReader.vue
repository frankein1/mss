<template>
  <EditorContent
    :editor="editor"
    :editable="false"
    class="tiptap-editor-reader"
  />
</template>

<script setup lang="ts">
  import { EditorContent, useEditor } from '@tiptap/vue-3'

  const { value = null, rawText = '' } = defineProps<{
    value?: string | null
    rawText?: string | null
  }>()

  const emit = defineEmits<{ onCreate: [] }>()

  const editor = useEditor({
    content: value ? JSON.parse(value) : rawText,
    editable: false,
    enableContentCheck: true,
    onContentError({ error }) {
      console.error(error)
    },
    extensions: tiptapExtensions,
    editorProps: {
      attributes: {
        class: 'custom-tiptap'
      }
    },
    onCreate() {
      emit('onCreate')
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
