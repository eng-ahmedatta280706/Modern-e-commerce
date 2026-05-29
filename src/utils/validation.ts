export interface ValidationError {
  field: string;
  message: string;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
}

export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateCardNumber = (num: string): boolean =>
  /^\d{16}$/.test(num.replace(/\s/g, ''));

export const validateExpiry = (expiry: string): boolean =>
  /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);

export const validateCVC = (cvc: string): boolean =>
  /^\d{3,4}$/.test(cvc);

export const validateCheckoutStep1 = (data: CheckoutFormData): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (!data.name.trim()) errors.push({ field: 'name', message: 'Full name is required' });
  if (!validateEmail(data.email)) errors.push({ field: 'email', message: 'Valid email is required' });
  if (!data.address.trim()) errors.push({ field: 'address', message: 'Address is required' });
  if (!data.city.trim()) errors.push({ field: 'city', message: 'City is required' });
  if (!data.country.trim()) errors.push({ field: 'country', message: 'Country is required' });
  return errors;
};

export const validateCardPayment = (data: CheckoutFormData): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (!validateCardNumber(data.cardNumber ?? ''))
    errors.push({ field: 'cardNumber', message: 'Valid 16-digit card number is required' });
  if (!validateExpiry(data.cardExpiry ?? ''))
    errors.push({ field: 'cardExpiry', message: 'Valid expiry date (MM/YY) is required' });
  if (!validateCVC(data.cardCVC ?? ''))
    errors.push({ field: 'cardCVC', message: 'Valid CVC is required' });
  return errors;
};
