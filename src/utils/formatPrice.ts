/**
 * Formats a number as a currency string.
 * @param amount - The numeric price value
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale string (default: 'en-US')
 */
export const formatPrice = (
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calculates discounted price.
 */
export const getDiscountedPrice = (price: number, discountPercent: number): number => {
  return price - (price * discountPercent) / 100;
};

/**
 * Calculates discount percentage between original and sale price.
 */
export const getDiscountPercent = (original: number, sale: number): number => {
  return Math.round(((original - sale) / original) * 100);
};
