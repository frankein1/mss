import { nanoid } from 'nanoid'

/** Sanitize filename and deduplicate by adding a random string before the file extension */
export function generateFilenameForDocument(name: string) {
  const ext = name.split('.').pop()
  const fileroot = name.substring(0, name.length - (ext?.length || 0))
  return `${sanitizeFilename(fileroot)}_${nanoid(6)}${ext ? `.${ext}` : ''}`
}

export function generateFileRootForDocument(
  structureId: string,
  beneficiaryId: string
) {
  return `${structureId}/${beneficiaryId}`
}
