<template>
  <h3 class="fr-h4">Notes</h3>
  <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
    <div class="fr-col-12">
      <AtomTextEditor
        name="synthesis"
        :initial-value="synthesisRichTextValue || null"
        :initial-raw-value="synthesis"
        :label="helpRequestFieldLabels.synthesis"
        @update="onUpdateSynthesis"
      >
        <template #hint>
          {{ SENSITIVE_DATA_HINT }}
        </template>
      </AtomTextEditor>
    </div>

    <div
      v-if="canEditPrivateSynthesis"
      class="fr-col-12"
    >
      <AtomTextEditor
        name="privateSynthesis"
        :initial-value="privateSynthesisRichTextValue || null"
        :initial-raw-value="privateSynthesis"
        :label="helpRequestFieldLabels.privateSynthesis"
        label-icon="fr-icon-lock-line"
        :min-height="120"
        @update="onUpdatePrivateSynthesis"
      >
        <template #hint>
          Le compte rendu privé est uniquement visible et modifiable par l'agent
          qui instruit le dossier.<br />{{ SENSITIVE_DATA_HINT }}
        </template>
      </AtomTextEditor>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { JSONContent } from '@tiptap/vue-3'
  import { helpRequestFieldLabels } from '~/client/labels/helpRequest.labels'
  import { SENSITIVE_DATA_HINT } from '~/utils/constants'
  import { cleanEmptyParagraph } from '~/utils/text/cleanEmptyParagraph'

  defineProps<{
    canEditPrivateSynthesis: boolean
  }>()

  const { setValue: setSynthesis, value: synthesis } = useField<
    string | undefined
  >('synthesis')
  const { setValue: setSynthesisRichText, value: synthesisRichTextValue } =
    useField<string | undefined>('synthesisRichText')

  const onUpdateSynthesis = (
    html: string | undefined,
    json: JSONContent | undefined,
    rawText: string | undefined
  ) => {
    setSynthesis(cleanEmptyParagraph(rawText))
    setSynthesisRichText(JSON.stringify(json))
  }
  const { setValue: setPrivateSynthesis, value: privateSynthesis } = useField<
    string | undefined
  >('privateSynthesis')
  const {
    setValue: setPrivateSynthesisRichText,
    value: privateSynthesisRichTextValue
  } = useField<string | undefined>('privateSynthesisRichText')

  const onUpdatePrivateSynthesis = (
    html: string | undefined,
    json: JSONContent | undefined,
    rawText: string | undefined
  ) => {
    setPrivateSynthesis(cleanEmptyParagraph(rawText))
    setPrivateSynthesisRichText(JSON.stringify(json))
  }
</script>
