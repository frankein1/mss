const ALPHANUM = 'abcdefghijklmnopqrstuvwyz0123456789'
const RANDOM_ID_LENGTH = 5

/**
 * Generate a random ID made of a prefix and a random string of 5 alpha-numeric characters
 * @param prefix The prefix of the ID to generate
 * @returns The generated random ID
 */
export function getRandomId(prefix: string) {
  const randomString = Array.from({ length: RANDOM_ID_LENGTH })
    .map(() => ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)])
    .join('')

  return `${prefix}${randomString}`
}
