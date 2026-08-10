/** Generic interface to Key Manager.
 * The implementation is delegated to adapters.
 */
export interface KmsClient {
  generateDataKey(params: {
    algorithm: string
    keyId: string
    withoutPlaintext: boolean
  }): Promise<{ plaintext?: string; ciphertext: string }>

  decrypt(params: {
    keyId: string
    ciphertext: string
  }): Promise<{ plaintext: string }>

  rewrap(params: {
    keyId: string
    ciphertext: string
  }): Promise<{ ciphertext: string }>

  getKeyLatestVersion(params: { keyId: string }): Promise<string>
}
