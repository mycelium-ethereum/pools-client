
// thankyou sushi

export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
