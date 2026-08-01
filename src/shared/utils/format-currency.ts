/** Format a number as currency (BDT by default). */
export function formatCurrency(
  amount: number,
  currency = 'BDT',
  locale = 'en-BD',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format a number with commas. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
