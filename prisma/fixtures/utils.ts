import { faker } from '@faker-js/faker'

export function equiRandomEnum<T>(enums: T[]) {
  const index = faker.number.int({ min: 0, max: enums.length - 1 })
  return enums[index] as T
}
