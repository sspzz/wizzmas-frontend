export function range(start: number = 0, length: number): Array<number> {
  return Array.from(Array(length).keys()).map((i) => i + start)
}
