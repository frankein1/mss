import { createError } from 'h3'

export const unauthorized = (message: string) =>
  createError({ statusCode: 401, message })

export const forbidden = (message: string, statusMessage?: string) =>
  createError({
    statusCode: 403,
    message,
    ...(Boolean(statusMessage) && { statusMessage })
  })

export const badrequest = (message: string) =>
  createError({ statusCode: 400, message })

export const internal = (message: string) =>
  createError({ statusCode: 500, message })
