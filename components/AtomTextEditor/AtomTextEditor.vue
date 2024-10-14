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
      <div class="tiptap-editor-menubar fr-input">
        <AtomTextEditorMenubar :editor="editor" />
      </div>
      <EditorContent
        ref="input"
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
  import { Content, EditorContent, JSONContent, useEditor } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  import Link from '@tiptap/extension-link'

  const props = withDefaults(
    defineProps<{
      name: string
      label?: string | null
      initialValue?: string | null
      disabled?: boolean
      labelIcon?: string
      required?: boolean
      minHeight?: number | null
    }>(),
    {
      initialValue: null,
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

  const editor = useEditor({
    content: props.initialValue ? JSON.parse(props.initialValue) : '',
    enableContentCheck: true,
    onContentError({ editor, error, disableCollaboration }) {
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
    },
    onUpdate: () => {
      html.value = editor.value?.getHTML()
      json.value = editor.value?.getJSON()
      rawText.value = editor.value?.getText()
      emit('update', html.value, json.value, rawText.value)
    }
  })

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
    min-height: 3.75rem;
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
