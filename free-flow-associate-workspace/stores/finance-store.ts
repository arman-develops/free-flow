import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { Payment, Earnings, Invoice } from "@/types/associate"

interface FinanceState {
  // Earnings
  earnings: Earnings | null
  setEarnings: (earnings: Earnings) => void

  // Payments
  payments: Payment[]
  pendingPayments: Payment[]
  paidPayments: Payment[]
  setPayments: (payments: Payment[]) => void
  addPayment: (payment: Payment) => void
  updatePayment: (id: string, updates: Partial<Payment>) => void

  // Invoices
  invoices: Invoice[]
  setInvoices: (invoices: Invoice[]) => void
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void

  // Filters
  paymentStatusFilter: string[]
  dateRangeFilter: { start?: string; end?: string }
  setPaymentStatusFilter: (filter: string[]) => void
  setDateRangeFilter: (range: { start?: string; end?: string }) => void
  clearFilters: () => void
}

export const useFinanceStore = create<FinanceState>()(
  devtools((set) => ({
    // Earnings
    earnings: null,
    setEarnings: (earnings) => set({ earnings }),

    // Payments
    payments: [],
    pendingPayments: [],
    paidPayments: [],
    setPayments: (payments) =>
      set({
        payments,
        pendingPayments: payments.filter((p) => p.status === "pending" || p.status === "processing"),
        paidPayments: payments.filter((p) => p.status === "paid"),
      }),
    addPayment: (payment) =>
      set((state) => {
        const payments = [payment, ...state.payments]
        return {
          payments,
          pendingPayments: payments.filter((p) => p.status === "pending" || p.status === "processing"),
          paidPayments: payments.filter((p) => p.status === "paid"),
        }
      }),
    updatePayment: (id, updates) =>
      set((state) => {
        const payments = state.payments.map((p) => (p.id === id ? { ...p, ...updates } : p))
        return {
          payments,
          pendingPayments: payments.filter((p) => p.status === "pending" || p.status === "processing"),
          paidPayments: payments.filter((p) => p.status === "paid"),
        }
      }),

    // Invoices
    invoices: [],
    setInvoices: (invoices) => set({ invoices }),
    addInvoice: (invoice) =>
      set((state) => ({
        invoices: [invoice, ...state.invoices],
      })),
    updateInvoice: (id, updates) =>
      set((state) => ({
        invoices: state.invoices.map((i) => (i.id === id ? { ...i, ...updates } : i)),
      })),

    // Filters
    paymentStatusFilter: [],
    dateRangeFilter: {},
    setPaymentStatusFilter: (filter) => set({ paymentStatusFilter: filter }),
    setDateRangeFilter: (range) => set({ dateRangeFilter: range }),
    clearFilters: () => set({ paymentStatusFilter: [], dateRangeFilter: {} }),
  })),
)
