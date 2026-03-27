/** Algorithm format for webcrypto API */
export const ALGORITHMS = {
  aes_256_gcm: 'AES-GCM'
}

export interface DataForEncryptionContext {
  documentKey: string
  contentType: string
  contentLength: number
}
