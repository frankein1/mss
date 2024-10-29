import { Node } from 'prosemirror-model'
import { getSchema, JSONContent } from '@tiptap/core'
import { tiptapExtensions } from '~/utils/richTextEditor'

export const validateRichTextSchema = (richText: string): boolean => {
  const doc: JSONContent = JSON.parse(richText)
  try {
    const schema = getSchema(tiptapExtensions)
    const contentNode = Node.fromJSON(schema, doc)
    contentNode.check()
    return true
  } catch {
    return false
  }
}
