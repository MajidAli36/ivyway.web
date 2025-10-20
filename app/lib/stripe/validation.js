// Payment validation utilities
import { z } from "zod";

// Card validation schema
export const cardValidationSchema = z.object({
  number: z
    .string()
    .min(13, "Card number must be at least 13 digits")
    .max(19, "Card number must be at most 19 digits")
    .regex(/^\d+$/, "Card number must contain only digits"),
  exp_month: z.number().min(1, "Invalid month").max(12, "Invalid month"),
  exp_year: z
    .number()
    .min(new Date().getFullYear(), "Card has expired")
    .max(new Date().getFullYear() + 20, "Invalid year"),
  cvc: z
    .string()
    .min(3, "CVC must be at least 3 digits")
    .max(4, "CVC must be at most 4 digits")
    .regex(/^\d+$/, "CVC must contain only digits"),
});

// Payment amount validation
export const amountValidationSchema = z.object({
  amount: z
    .number()
    .min(50, "Minimum payment amount is $0.50")
    .max(1000000, "Maximum payment amount is $10,000"),
  currency: z.string().length(3, "Currency must be 3 characters").toLowerCase(),
});

// Booking validation schema
export const bookingValidationSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  tutorId: z.string().min(1, "Tutor ID is required"),
  studentId: z.string().min(1, "Student ID is required"),
  subject: z.string().min(1, "Subject is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z
    .number()
    .min(15, "Minimum session duration is 15 minutes")
    .max(480, "Maximum session duration is 8 hours"),
  amount: z.number().min(50, "Minimum amount is $0.50"),
});

// Validate card number using Luhn algorithm
export const validateCardNumber = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, "");

  if (!/^\d+$/.test(cleanNumber)) {
    return { isValid: false, error: "Card number must contain only digits" };
  }

  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return { isValid: false, error: "Invalid card number length" };
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return {
    isValid: sum % 10 === 0,
    error: sum % 10 === 0 ? null : "Invalid card number",
  };
};

// Validate expiry date
export const validateExpiryDate = (month, year) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (month < 1 || month > 12) {
    return { isValid: false, error: "Invalid month" };
  }

  if (year < currentYear) {
    return { isValid: false, error: "Card has expired" };
  }

  if (year === currentYear && month < currentMonth) {
    return { isValid: false, error: "Card has expired" };
  }

  if (year > currentYear + 20) {
    return { isValid: false, error: "Invalid year" };
  }

  return { isValid: true, error: null };
};

// Validate CVC
export const validateCVC = (cvc, cardType = "unknown") => {
  if (!/^\d+$/.test(cvc)) {
    return { isValid: false, error: "CVC must contain only digits" };
  }

  const cvcLength = cvc.length;

  // Different card types have different CVC lengths
  switch (cardType) {
    case "amex":
      if (cvcLength !== 4) {
        return {
          isValid: false,
          error: "American Express CVC must be 4 digits",
        };
      }
      break;
    case "visa":
    case "mastercard":
    case "discover":
    default:
      if (cvcLength !== 3) {
        return { isValid: false, error: "CVC must be 3 digits" };
      }
      break;
  }

  return { isValid: true, error: null };
};

// Detect card type from number
export const detectCardType = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, "");

  // Visa
  if (/^4/.test(cleanNumber)) {
    return "visa";
  }

  // Mastercard
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return "mastercard";
  }

  // American Express
  if (/^3[47]/.test(cleanNumber)) {
    return "amex";
  }

  // Discover
  if (/^6(?:011|5)/.test(cleanNumber)) {
    return "discover";
  }

  return "unknown";
};

// Format card number with spaces
export const formatCardNumber = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, "");
  const cardType = detectCardType(cleanNumber);

  switch (cardType) {
    case "amex":
      // Format: XXXX XXXXXX XXXXX
      return cleanNumber.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
    default:
      // Format: XXXX XXXX XXXX XXXX
      return cleanNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
  }
};

// Validate payment amount
export const validatePaymentAmount = (amount, currency = "usd") => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return { isValid: false, error: "Invalid amount" };
  }

  if (amount < 50) {
    // $0.50 in cents
    return { isValid: false, error: "Minimum payment amount is $0.50" };
  }

  if (amount > 1000000) {
    // $10,000 in cents
    return { isValid: false, error: "Maximum payment amount is $10,000" };
  }

  return { isValid: true, error: null };
};

// Validate currency
export const validateCurrency = (currency) => {
  const validCurrencies = ["usd", "eur", "gbp", "cad", "aud"];

  if (!validCurrencies.includes(currency.toLowerCase())) {
    return {
      isValid: false,
      error: `Unsupported currency. Supported currencies: ${validCurrencies.join(
        ", "
      )}`,
    };
  }

  return { isValid: true, error: null };
};

// Comprehensive payment validation
export const validatePayment = (paymentData) => {
  const errors = [];

  // Validate amount
  const amountValidation = validatePaymentAmount(
    paymentData.amount,
    paymentData.currency
  );
  if (!amountValidation.isValid) {
    errors.push(amountValidation.error);
  }

  // Validate currency
  const currencyValidation = validateCurrency(paymentData.currency);
  if (!currencyValidation.isValid) {
    errors.push(currencyValidation.error);
  }

  // Validate booking ID
  if (!paymentData.bookingId) {
    errors.push("Booking ID is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Sanitize payment data
export const sanitizePaymentData = (data) => {
  return {
    amount: parseInt(data.amount) || 0,
    currency: (data.currency || "usd").toLowerCase(),
    bookingId: data.bookingId?.trim(),
    description: data.description?.trim(),
    metadata: data.metadata || {},
  };
};

export default {
  cardValidationSchema,
  amountValidationSchema,
  bookingValidationSchema,
  validateCardNumber,
  validateExpiryDate,
  validateCVC,
  detectCardType,
  formatCardNumber,
  validatePaymentAmount,
  validateCurrency,
  validatePayment,
  sanitizePaymentData,
};
