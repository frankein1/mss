import type { Options } from '~/utils/options'

export function labelOrUnprovided(value: string, options: Options) {
  if (!value) {
    return 'Non renseigné'
  }
  return options.get(value)
}
