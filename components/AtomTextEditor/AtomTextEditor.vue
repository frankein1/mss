<template>
  <div
    class="fr-input-group"
    :class="{
      'fr-input-group--error': error,
      'fr-input-group--disabled': disabled
    }"
  >
    <label
      v-if="label"
      class="fr-label"
      :class="[labelIcon]"
      :for="name"
    >
      {{ label }}
      <span
        v-if="required"
        class="color-red"
        >*</span
      >
      <span
        v-if="hasHint"
        class="fr-hint-text"
        ><slot name="hint"></slot
      ></span>
    </label>
    <client-only>
      <div class="tiptap-editor-menubar">
        <AtomTextEditorMenubar :editor="editor" />
      </div>
      <EditorContent
        :editor="editor"
        class="tiptap-editor-content fr-input"
      />
    </client-only>
    <p
      v-if="error"
      class="fr-message fr-message--error fr-mt-1w"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import { Fragment, Slice } from '@tiptap/pm/model'
  import type { Node } from '@tiptap/pm/model'
  import type { JSONContent } from '@tiptap/vue-3'
  import { EditorContent, useEditor } from '@tiptap/vue-3'

  const props = withDefaults(
    defineProps<{
      name: string
      label?: string | null
      initialValue?: string | null
      initialRawValue?: string | null
      disabled?: boolean
      labelIcon?: string
      required?: boolean
      minHeight?: number | null
    }>(),
    {
      initialValue: null,
      initialRawValue: '',
      required: false,
      disabled: false,
      label: null,
      labelIcon: '',
      minHeight: null
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
  const hasHint = computed(() => useSlots().hint)
  const contentHeight = computed(() => getHeight())

  const { errorMessage: error } = useField<string>(props.name)

  const getHeight = (): string => {
    if (!props.minHeight) {
      return '30rem'
    }
    return props.minHeight + 'px'
  }

  const displayedValue = computed((): string | JSON => {
    if (props.initialValue) {
      return JSON.parse(props.initialValue)
    }
    if (props.initialRawValue) {
      return props.initialRawValue
    }
    return ''
  })
  const editor = useEditor({
    content: displayedValue.value,
    enableContentCheck: true,
    onContentError({ error }) {
      console.error(error)
    },
    extensions: tiptapExtensions,
    editorProps: {
      attributes: {
        class: 'custom-tiptap'
      },
      // Transform plain text pasted
      transformPastedText(pasted: string) {
        return pasted.replace(/[<>]/g, '')
      },
      // Transform rich text pasted (from email for instance)
      transformPasted(slice) {
        const transformed: Node[] = []

        slice.content.forEach(node => {
          const updatedNode = removeAngleBrackets(node)
          if (updatedNode) {
            transformed.push(updatedNode)
          }
        })

        return new Slice(
          Fragment.fromArray(transformed),
          slice.openStart,
          slice.openEnd
        )
      }
    },
    onUpdate: () => {
      html.value = editor.value?.getHTML()
      json.value = editor.value?.getJSON()
      rawText.value = editor.value?.getText()
      emit('update', html.value, json.value, rawText.value)
    }
  })

  /** Create a copy of ProseMirror node with modified content
   * Recursively inspect the Node tree to find text nodes and
   * remove angle brackets from their content
   */
  function removeAngleBrackets(node: Node) {
    if (node.isText) {
      if (!node.text) {
        return null
      }

      const replaced = node.text.replace(/[<>]/g, '') || ''
      if (!replaced) {
        return null
      }

      return node.type.schema.text(replaced, node.marks)
    }

    const transformed: Node[] = []
    node.content.forEach(child => {
      const updatedChild = removeAngleBrackets(child)
      if (updatedChild) {
        transformed.push(updatedChild)
      }
    })
    return node.type.create(node.attrs, transformed, node.marks)
  }

  onMounted(() => {
    html.value = editor.value?.getHTML()
    json.value = editor.value?.getJSON()
  })
</script>

<style lang="scss" scoped>
  .fr-label::before {
    margin-right: 0.5rem;
  }

  .tiptap-editor-menubar {
    box-shadow: inset 0 -1px 0 0 #cecece;
    padding: 0;
    background-color: var(--background-contrast-grey);
  }

  .tiptap-editor-content {
    max-height: none;
    min-height: v-bind('contentHeight');
    border-radius: 0;
    padding: 0;
  }
</style>

<style lang="scss">
  .custom-tiptap {
    padding: 0.5rem 1rem;
    max-height: none;
    min-height: v-bind('contentHeight');

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
</style>
