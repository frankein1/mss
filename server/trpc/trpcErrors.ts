import { TRPCError } from '@trpc/server'
import type { MSS_ERROR_CODES } from '~/utils/error'

export const forbiddenError = (
  message?: string,
  mssErrorCode?: MSS_ERROR_CODES
) =>
  new TRPCError({
    code: 'FORBIDDEN',
    message:
      message ?? "Vous n'êtes pas autoriser a effectuer cette opération.",
    cause: { MSS_CODE: mssErrorCode }
  })

export const notfoundError = (
  message?: string,
  mssErrorCode?: MSS_ERROR_CODES
) =>
  new TRPCError({
    code: 'NOT_FOUND',
    message: message ?? 'Introuvable. Veuillez réessayer ultérieurement.',
    cause: { MSS_CODE: mssErrorCode }
  })

export const invalidError = (
  message?: string,
  mssErrorCode?: MSS_ERROR_CODES
) =>
  new TRPCError({
    code: 'BAD_REQUEST',
    message:
      message ?? 'Opération invalide. Veuillez réessayer ultérieurement.',
    cause: { MSS_CODE: mssErrorCode }
  })

export const unauthorizedError = (
  message?: string,
  mssErrorCode?: MSS_ERROR_CODES
) =>
  new TRPCError({
    code: 'UNAUTHORIZED',
    message: message ?? "Echec d'authentification.",
    cause: { MSS_CODE: mssErrorCode }
  })
