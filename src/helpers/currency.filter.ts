export function currency(value: number) {
  if (!value) return ''
  return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(value)
}
