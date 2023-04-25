export type OpenSnackbar = (
  message: string,
  closeCallback?: () => void,
  duration?: number
) => void
