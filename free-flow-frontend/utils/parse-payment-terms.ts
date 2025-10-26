import { Contract } from "@/types/contract"

// Define this utility
export function parsePaymentTerms(input: string | null | undefined): Contract["payment_terms"] {
  if (!input) {
    return {
      type: "fixed",
      currency: "KES",
      paymentSchedule: "Not specified",
    }
  }

  // Example formats to handle
  // "50 USD per hour on this task. No mistakes."
  // "type:hourly;rate:50;currency:USD;paymentSchedule:Per hour on this task"

  const lower = input.toLowerCase()

  // Simple heuristics — feel free to expand later
  let type: "hourly" | "fixed" | "milestone" = "fixed"
  if (lower.includes("hour")) type = "hourly"
  else if (lower.includes("milestone")) type = "milestone"

  const rateMatch = input.match(/(\d+(\.\d+)?)/)
  const amount = rateMatch ? parseFloat(rateMatch[1]) : undefined

  const currencyMatch = input.match(/\b[A-Z]{3}\b/)
  const currency = currencyMatch ? currencyMatch[0] : "KES"

  const paymentSchedule = input.replace(/type:[^;]+;?|rate:[^;]+;?|amount:[^;]+;?|currency:[^;]+;?/g, "").trim()

  return {
    type,
    amount,
    currency,
    paymentSchedule: paymentSchedule || "Not specified",
  }
}


// Usage
// const paymentTerms = parsePaymentTerms(contract.payment_terms);
// console.log(paymentTerms);
/*
{
  type: "fixed",
  amount: "1200",
  currency: "KES",
  paymentSchedule: "Upon project completion"
}
*/

export function serializePaymentTerms(terms: {
  type: string;
  rate?: number;
  amount?: number;
  currency: string;
  paymentSchedule: string;
}) {
  const entries = Object.entries(terms)
    .filter(([_, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}:${value}`);
  return entries.join(";");
}

// // Example usage:
// const payment_terms = serializePaymentTerms({
//   type: "fixed",
//   amount: 1200,
//   currency: "KES",
//   paymentSchedule: "Upon project completion",
// });

// console.log(payment_terms);
// // "type:fixed;amount:1200;currency:KES;paymentSchedule:Upon project completion"

export function validatePaymentTerms(input: string | undefined): boolean {
  if (!input) return true; // allow empty during editing

  const pattern = /type:(hourly|fixed|milestone);.*currency:[A-Z]{3};.*paymentSchedule:.+/i;
  return pattern.test(input);
}
