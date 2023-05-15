export function isNode(e: EventTarget | null): e is Node {
  return !e || !('nodeType' in e)
}
