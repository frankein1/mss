import StarterKit from '@tiptap/starter-kit'

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
    },
    link: {
      defaultProtocol: 'https'
    }
  })
]
