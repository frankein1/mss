import { Ref } from 'vue'
import { Options } from '~/utils/options'

/**
 * Add a watcher that watches options.
 * When an option is added, it is also added to the selected values.
 * When an option is removed, it is removed from the selected values, if selected.
 * @param optionsSource The watcher source that provide options
 * @param selectedValues The list of selected values
 */
export function useWatchSelectOptions(
  optionsSource: () => Options,
  selectedValues: Ref<string[]>,
  changedValues: () => void
) {
  /**
   * When options list changes, the new options are added to selected values
   */
  watch(
    optionsSource,
    (options, prevOptions) => {
      options.forEach((_, value) => {
        const isNew = !prevOptions.has(value)
        if (isNew) {
          selectedValues.value.push(value)
        }
      })
      prevOptions.forEach((_, prevValue) => {
        const isRemoved = !options.has(prevValue)
        if (isRemoved) {
          selectedValues.value = selectedValues.value.filter(
            value => value !== prevValue
          )
        }
      })
      changedValues()
    },
    { deep: true }
  )
}
