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
      options.forEach(o => {
        const isNew = !hasOption(prevOptions, o.value)
        if (isNew) {
          selectedValues.value.push(o.value)
        }
      })
      prevOptions.forEach(o => {
        const isRemoved = !hasOption(options, o.value)
        if (isRemoved) {
          selectedValues.value = selectedValues.value.filter(
            value => value !== o.value
          )
        }
      })
      changedValues()
    },
    { deep: true }
  )
}
