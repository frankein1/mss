import { createError } from 'h3'

export const unauthorized = (message: string) =>
  createError({ statusCode: 401, message })

export const forbidden = (message: string) =>
  createError({ statusCode: 403, message })

export const badrequest = (message: string) =>
  createError({ statusCode: 400, message })
