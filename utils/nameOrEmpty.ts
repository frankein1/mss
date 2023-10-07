export function nameOrEmpty(name: string | null | undefined): string {
  return name || '(non renseigné)'
}
