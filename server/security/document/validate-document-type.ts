import { filetypemime } from 'magic-bytes.js'
import { documentFileAllowedTypes } from '~/client/options'

export function validateDocumentType(data: Buffer) {
  const mimes = filetypemime(data)

  return mimes.some(mime =>
    documentFileAllowedTypes.some(accepted => mime.match(new RegExp(accepted)))
  )
}
