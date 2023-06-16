export interface MultiPartData {
  data: Buffer
  name?: string
  filename?: string
  type?: string
}

export interface S3Object {
  bucket: string
  key: string
  type?: string
  url: string
}
