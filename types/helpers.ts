// Credits to https://stackoverflow.com/a/54178819/7916042
export type PartialOnly<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
