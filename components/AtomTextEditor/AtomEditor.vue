<script setup lang="ts">
  import { HeadingNode, QuoteNode } from '@lexical/rich-text'
  import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
  import { ListItemNode, ListNode } from '@lexical/list'
  import { CodeHighlightNode, CodeNode } from '@lexical/code'
  import { AutoLinkNode, LinkNode } from '@lexical/link'
  import {
    LexicalListPlugin,
    LexicalContentEditable,
    LexicalRichTextPlugin,
    LexicalComposer
  } from 'lexical-vue'
  import { CreateEditorArgs } from 'lexical'

  const exampleTheme = {
    ltr: 'ltr',
    rtl: 'rtl',
    placeholder: 'editor-placeholder',
    paragraph: 'editor-paragraph',
    quote: 'editor-quote',
    heading: {
      h1: 'editor-heading-h1',
      h2: 'editor-heading-h2',
      h3: 'editor-heading-h3',
      h4: 'editor-heading-h4',
      h5: 'editor-heading-h5'
    },
    list: {
      nested: {
        listitem: 'editor-nested-listitem'
      },
      ol: 'editor-list-ol',
      ul: 'editor-list-ul',
      listitem: 'editor-listitem'
    },
    image: 'editor-image',
    link: 'editor-link',
    text: {
      bold: 'editor-text-bold',
      italic: 'editor-text-italic',
      overflowed: 'editor-text-overflowed',
      hashtag: 'editor-text-hashtag',
      underline: 'editor-text-underline',
      strikethrough: 'editor-text-strikethrough',
      underlineStrikethrough: 'editor-text-underlineStrikethrough',
      code: 'editor-text-code'
    },
    code: 'editor-code',
    codeHighlight: {
      'atrule': 'editor-tokenAttr',
      'attr': 'editor-tokenAttr',
      'boolean': 'editor-tokenProperty',
      'builtin': 'editor-tokenSelector',
      'cdata': 'editor-tokenComment',
      'char': 'editor-tokenSelector',
      'class': 'editor-tokenFunction',
      'class-name': 'editor-tokenFunction',
      'comment': 'editor-tokenComment',
      'constant': 'editor-tokenProperty',
      'deleted': 'editor-tokenProperty',
      'doctype': 'editor-tokenComment',
      'entity': 'editor-tokenOperator',
      'function': 'editor-tokenFunction',
      'important': 'editor-tokenVariable',
      'inserted': 'editor-tokenSelector',
      'keyword': 'editor-tokenAttr',
      'namespace': 'editor-tokenVariable',
      'number': 'editor-tokenProperty',
      'operator': 'editor-tokenOperator',
      'prolog': 'editor-tokenComment',
      'property': 'editor-tokenProperty',
      'punctuation': 'editor-tokenPunctuation',
      'regex': 'editor-tokenVariable',
      'selector': 'editor-tokenSelector',
      'string': 'editor-tokenSelector',
      'symbol': 'editor-tokenProperty',
      'tag': 'editor-tokenProperty',
      'url': 'editor-tokenOperator',
      'variable': 'editor-tokenVariable'
    }
  }

  const editorConfig: CreateEditorArgs = {
    // The editor theme
    theme: exampleTheme,
    // Handling of errors during update
    onError(error) {
      throw error
    },
    // Any custom nodes go here
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode
    ]
  }

  const editorState = ref()

  function onChange(editorState: any) {
    const editorStateJSON = editorState.toJSON()
    console.log(editorStateJSON)
    editorState.value = JSON.stringify(editorStateJSON)
  }
</script>

<template>
  <LexicalComposer :initial-config="editorConfig">
    <div class="editor-container">
      <ToolbarPlugin />
      <div class="editor-inner">
        <LexicalRichTextPlugin>
          <template #contentEditable>
            <LexicalContentEditable class="editor-input" />
          </template>
          <template #placeholder>
            <div class="editor-placeholder">Enter some rich text...</div>
          </template>
        </LexicalRichTextPlugin>

        <LexicalListPlugin />

        <OnChangePlugin @change="onChange" />
      </div>
    </div>
  </LexicalComposer>
</template>

<style scoped lang="scss">
  .editor-container {
    margin: 20px auto 20px auto;
    border-radius: 2px;
    width: 100%;
    color: #000;
    position: relative;
    line-height: 20px;
    font-weight: 400;
    text-align: left;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .editor-inner {
    background: #fff;
    position: relative;
    border: #999 solid 1px;
  }

  .editor-input {
    min-height: 150px;
    resize: none;
    font-size: 15px;
    caret-color: rgb(5, 5, 5);
    position: relative;
    tab-size: 1;
    outline: 0;
    padding: 15px 10px;
    caret-color: #444;
  }

  .editor-placeholder {
    color: #999;
    overflow: hidden;
    position: absolute;
    text-overflow: ellipsis;
    top: 15px;
    left: 10px;
    font-size: 15px;
    user-select: none;
    display: inline-block;
    pointer-events: none;
  }
</style>
