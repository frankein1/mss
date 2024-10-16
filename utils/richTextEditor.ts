import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

export const tiptapExtensions = [
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
]
