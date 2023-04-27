export type Options = Map<string, string>

export const labelsToOptions = (object: Record<string, string>): Options =>
  new Map(Object.entries(object))

export const arrayToOptions = <T extends string>(
  values: readonly T[] | T[]
): Options => new Map(values.map(value => [value, value]))
