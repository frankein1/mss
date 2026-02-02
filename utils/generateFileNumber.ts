import { customAlphabet } from 'nanoid'

export const generatorRegExp = /^[1-9ABCDEFGHJKLMNPQRSTUVWXYZ]{3,10}$/
const generator = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 10)

export const generateFileNumber = () => generator()
