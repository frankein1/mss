<script setup lang="ts">
  import type { CommandListenerPriority, RangeSelection } from 'lexical'
  import {
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    $isRootOrShadowRoot,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_NORMAL,
    FORMAT_TEXT_COMMAND,
    KEY_MODIFIER_COMMAND,
    SELECTION_CHANGE_COMMAND
  } from 'lexical'
  import {
    $getSelectionStyleValueForProperty,
    $isParentElementRTL,
    $isAtNodeEnd,
    $wrapNodes
  } from '@lexical/selection'
  import {
    $findMatchingParent,
    $getNearestNodeOfType,
    mergeRegister
  } from '@lexical/utils'
  import { useLexicalComposer } from 'lexical-vue'
  import { onMounted, onUnmounted, ref } from 'vue'
  import {
    $isListNode,
    ListNode,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND
  } from '@lexical/list'
  import { $isHeadingNode, $createHeadingNode } from '@lexical/rich-text'
  import { $isCodeNode, CODE_LANGUAGE_MAP } from '@lexical/code'
  import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'

  const LowPriority: CommandListenerPriority = 1
  const toolbarRef = ref<HTMLDivElement | null>(null)
  const editor = useLexicalComposer()

  function getSelectedNode(selection: RangeSelection) {
    const anchor = selection.anchor
    const focus = selection.focus
    const anchorNode = selection.anchor.getNode()
    const focusNode = selection.focus.getNode()
    if (anchorNode === focusNode) {
      return anchorNode
    }

    const isBackward = selection.isBackward()
    if (isBackward) {
      return $isAtNodeEnd(focus as any) ? anchorNode : focusNode
    }

    return $isAtNodeEnd(anchor as any) ? focusNode : anchorNode
  }

  const blockTypeToBlockName = {
    bullet: 'Bulleted List',
    check: 'Check List',
    code: 'Code Block',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    number: 'Numbered List',
    paragraph: 'Normal',
    quote: 'Quote',
    ul: 'ul',
    ol: 'ol'
  }

  const emit = defineEmits<{
    (event: 'isLinkEditMode', value: boolean): void
  }>()

  const fontSize = ref('15px')
  const fontColor = ref<string>('#000')
  const bgColor = ref<string>('#fff')
  const canUndo = ref(false)
  const canRedo = ref(false)
  const blockType = ref<keyof typeof blockTypeToBlockName>('paragraph')
  const selectedElementKey = ref()
  const codeLanguage = ref('')
  const isRTL = ref(false)
  const fontFamily = ref<string>('Arial')
  const isLink = ref(false)
  const isBold = ref(false)
  const isItalic = ref(false)
  const isUnderline = ref(false)
  const isStrikethrough = ref(false)

  const isCode = ref(false)

  function $updateToolbar() {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode: any = selection.anchor.getNode()
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, e => {
              const parent = e.getParent()
              return parent !== null && $isRootOrShadowRoot(parent as any)
            })

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow()
      }

      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)

      // Update text format
      isBold.value = selection.hasFormat('bold')
      isItalic.value = selection.hasFormat('italic')
      isUnderline.value = selection.hasFormat('underline')
      isStrikethrough.value = selection.hasFormat('strikethrough')
      isCode.value = selection.hasFormat('code')
      isRTL.value = $isParentElementRTL(selection as any)

      // Update links
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent as any) || $isLinkNode(node as any)) {
        isLink.value = true
      } else {
        isLink.value = false
      }

      if (elementDOM !== null) {
        selectedElementKey.value = elementKey
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          )
          const type = parentList
            ? parentList.getListType()
            : element.getListType()
          blockType.value = type
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType()
          if (type in blockTypeToBlockName) {
            blockType.value = type as keyof typeof blockTypeToBlockName
          }

          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP
            codeLanguage.value = language
              ? CODE_LANGUAGE_MAP[language] || language
              : ''
          }
        }
      }

      // Handle buttons
      fontSize.value = $getSelectionStyleValueForProperty(
        selection as any,
        'font-size',
        '15px'
      )
      fontColor.value = $getSelectionStyleValueForProperty(
        selection as any,
        'color',
        '#000'
      )
      bgColor.value = $getSelectionStyleValueForProperty(
        selection as any,
        'background-color',
        '#fff'
      )
      fontFamily.value = $getSelectionStyleValueForProperty(
        selection as any,
        'font-family',
        'Arial'
      )

      // let matchingParent
      if ($isLinkNode(parent as any)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        // matchingParent = $findMatchingParent(
        //   node,
        //   parentNode => $isElementNode(parentNode) && !parentNode.isInline(),
        // )
      }

      // If matchingParent is a valid node, pass it's format type
      // elementFormat.value = $isElementNode(matchingParent)
      //       ? matchingParent.getFormatType()
      //       : $isElementNode(node)
      //       ? node.getFormatType()
      //       : parent?.getFormatType() || 'left'
    }
  }

  // Format
  function formatParagraph() {
    if (blockType.value !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode())
        }
      })
    }
  }

  function formatLargeHeading() {
    console.log(editorStateToText())
    if (blockType.value !== 'h1') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode('h1'))
        }
      })
    }
  }
  function formatSmallHeading() {
    if (blockType.value !== 'h2') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode('h2'))
        }
      })
    }
  }

  function formatBulletList() {
    if (blockType.value !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  function formatNumberedList() {
    if (blockType.value !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  // get raw text
  function editorStateToText() {
    //
    const editorStateTextString: any = []
    const paragraphs = editor.getEditorState().toJSON().root.children
    paragraphs.forEach(paragraph => {
      const children = paragraph.children
      const paragraphText: any = []
      children.forEach((child: any) => {
        if (child.type === 'linebreak') {
          paragraphText.push('')
        } else if (child.text) {
          paragraphText.push(child.text)
        }
      })
      editorStateTextString.push(paragraphText.join(''))
    })
    return editorStateTextString.join('')
  }

  onMounted(() => {
    const unregisterMergeListener = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar()
          return false
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload: boolean) => {
          canUndo.value = payload
          return false
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload: boolean) => {
          canRedo.value = payload
          return false
        },
        LowPriority
      )
    )

    onUnmounted(() => {
      unregisterMergeListener()
    })
  })

  onMounted(() => {
    const unregister = editor.registerCommand(
      KEY_MODIFIER_COMMAND,
      payload => {
        const event: any = payload
        const { code, ctrlKey, metaKey } = event

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault()
          let url: string | null
          if (!isLink.value) {
            emit('isLinkEditMode', true)
            url = 'https://'
          } else {
            emit('isLinkEditMode', false)
            url = null
          }
          return editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
        }
        return false
      },
      COMMAND_PRIORITY_NORMAL
    )

    onUnmounted(() => {
      unregister()
    })
  })
</script>

<template>
  <div
    ref="toolbarRef"
    class="toolbar"
  >
    <button
      class="item"
      @click="formatParagraph"
    >
      <span class="icon paragraph" />
      <span class="text">Normal</span>
      <span
        v-if="blockType === 'paragraph'"
        class="active"
      />
    </button>
    <button
      class="item"
      @click="formatLargeHeading"
    >
      <span class="icon large-heading" />
      <span class="text">Large Heading</span>
      <span
        v-if="blockType === 'h1'"
        class="active"
      />
    </button>
    <button
      class="item"
      @click="formatSmallHeading"
    >
      <span class="icon small-heading" />
      <span class="text">Small Heading</span>
      <span
        v-if="blockType === 'h2'"
        class="active"
      />
    </button>
    <button
      class="item"
      @click="formatBulletList"
    >
      <span class="icon bullet-list" />
      <span class="text">Bullet List</span>
      <span
        v-if="blockType === 'ul'"
        class="active"
      />
    </button>
    <button
      class="item"
      @click="formatNumberedList"
    >
      <span class="icon numbered-list" />
      <span class="text">Numbered List</span>
      <span
        v-if="blockType === 'ol'"
        class="active"
      />
    </button>
    <button
      :class="`toolbar-item spaced ${isBold ? 'active' : ''}`"
      aria-label="Format Bold"
      type="button"
      @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')"
    >
      [B]
    </button>
    <button
      :class="`toolbar-item spaced ${isItalic ? 'active' : ''}`"
      type="button"
      aria-label="Format Italics"
      @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')"
    >
      [I]
    </button>
    <button
      :class="`toolbar-item spaced ${isUnderline ? 'active' : ''}`"
      type="button"
      aria-label="Format Underline"
      @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')"
    >
      [u]
    </button>
    <button
      :class="`toolbar-item spaced ${isStrikethrough ? 'active' : ''}`"
      type="button"
      aria-label="Format Strikethrough"
      @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')"
    >
      [s]
    </button>
  </div>
</template>
