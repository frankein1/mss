import {
  FormErrors,
  SubmissionHandler,
  InvalidSubmissionHandler,
  GenericObject
} from 'vee-validate'

/**
 * Allow to catch form errors on submission
 * It does not uses the `errors` property returned by vee-validate `useForm` as its value is constantly updated by vee-validate
 */
export function useCatchFormErrors<T extends GenericObject, TReturn = unknown>(
  handleSubmit: (
    cb: SubmissionHandler<T, T, TReturn>,
    onSubmitValidationErrorCb?: InvalidSubmissionHandler<T>
  ) => (e?: Event) => Promise<TReturn | undefined>,
  submissionHandler: SubmissionHandler<T, T, TReturn>
) {
  const caughtErrors = ref<FormErrors<T>>({}) as Ref<FormErrors<T>>

  const onSubmit = handleSubmit(submissionHandler, ({ errors }) => {
    caughtErrors.value = errors
  })

  return { caughtErrors, onSubmit }
}
