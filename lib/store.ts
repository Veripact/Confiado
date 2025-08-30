import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Payment {
  id: string
  amount: number
  method: string
  date: string
  status: "pending" | "confirmed" | "rejected"
  notes?: string
}

export interface Debt {
  id: string
  creditorName: string
  debtorName: string
  debtorContact: string
  total: number
  paid: number
  remaining: number
  status: "pending" | "active" | "completed" | "disputed" | "overdue"
  dueDate: string
  createdDate: string
  currency: string
  description?: string
  payments: Payment[]
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  ensLabel?: string
}

interface AppState {
  // User data
  currentUser: User
  viewMode: "creditor" | "debtor"

  // Debts data
  debts: Debt[]

  // Settings
  theme: "system" | "light" | "dark"
  currency: string
  language: string
  notifications: {
    sms: boolean
    whatsapp: boolean
    email: boolean
  }

  // Actions
  setViewMode: (mode: "creditor" | "debtor") => void
  addDebt: (debt: Omit<Debt, "id" | "createdDate" | "payments">) => string
  updateDebt: (id: string, updates: Partial<Debt>) => void
  addPayment: (debtId: string, payment: Omit<Payment, "id">) => void
  confirmPayment: (debtId: string, paymentId: string) => void
  rejectPayment: (debtId: string, paymentId: string) => void
  updateUser: (updates: Partial<User>) => void
  updateSettings: (settings: Partial<Pick<AppState, "theme" | "currency" | "language" | "notifications">>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        avatar: "/diverse-user-avatars.png",
        ensLabel: "manolo.confiado.eth",
      },
      viewMode: "creditor",
      theme: "system",
      currency: "USD",
      language: "English",
      notifications: {
        sms: true,
        whatsapp: false,
        email: true,
      },
      debts: [
        {
          id: "1",
          creditorName: "John Doe",
          debtorName: "Alice Johnson",
          debtorContact: "alice@example.com",
          total: 2500.0,
          paid: 1000.0,
          remaining: 1500.0,
          status: "active",
          dueDate: "2024-02-15",
          createdDate: "2024-01-01",
          currency: "USD",
          description: "Loan for business equipment",
          payments: [
            {
              id: "1",
              amount: 500.0,
              method: "Bank Transfer",
              date: "2024-01-15",
              status: "confirmed",
              notes: "First installment",
            },
            {
              id: "2",
              amount: 500.0,
              method: "Cash",
              date: "2024-01-30",
              status: "confirmed",
            },
            {
              id: "3",
              amount: 300.0,
              method: "Bank Transfer",
              date: "2024-02-05",
              status: "pending",
              notes: "Partial payment",
            },
          ],
        },
        {
          id: "2",
          creditorName: "John Doe",
          debtorName: "Bob Smith",
          debtorContact: "bob@example.com",
          total: 5000.0,
          paid: 3000.0,
          remaining: 2000.0,
          status: "overdue",
          dueDate: "2024-01-30",
          createdDate: "2023-12-01",
          currency: "USD",
          description: "Personal loan",
          payments: [
            {
              id: "4",
              amount: 1500.0,
              method: "Check",
              date: "2023-12-15",
              status: "confirmed",
            },
            {
              id: "5",
              amount: 1500.0,
              method: "Bank Transfer",
              date: "2024-01-15",
              status: "confirmed",
            },
          ],
        },
        {
          id: "3",
          creditorName: "John Doe",
          debtorName: "Carol Davis",
          debtorContact: "carol@example.com",
          total: 1200.0,
          paid: 1200.0,
          remaining: 0.0,
          status: "active",
          dueDate: "2024-03-01",
          createdDate: "2024-01-10",
          currency: "USD",
          description: "Emergency loan",
          payments: [
            {
              id: "6",
              amount: 400.0,
              method: "Cash",
              date: "2024-01-20",
              status: "confirmed",
            },
            {
              id: "7",
              amount: 400.0,
              method: "Bank Transfer",
              date: "2024-02-01",
              status: "confirmed",
            },
            {
              id: "8",
              amount: 400.0,
              method: "Credit Card",
              date: "2024-02-15",
              status: "confirmed",
            },
          ],
        },
      ],

      // Actions
      setViewMode: (mode) => set({ viewMode: mode }),

      addDebt: (debtData) => {
        const id = Date.now().toString()
        const newDebt: Debt = {
          ...debtData,
          id,
          createdDate: new Date().toISOString().split("T")[0],
          payments: [],
          remaining: debtData.total,
          paid: 0,
          status: "pending",
        }
        set((state) => ({ debts: [...state.debts, newDebt] }))
        return id
      },

      updateDebt: (id, updates) => {
        set((state) => ({
          debts: state.debts.map((debt) => (debt.id === id ? { ...debt, ...updates } : debt)),
        }))
      },

      addPayment: (debtId, paymentData) => {
        const paymentId = Date.now().toString()
        const newPayment: Payment = {
          ...paymentData,
          id: paymentId,
          status: "pending",
        }

        set((state) => ({
          debts: state.debts.map((debt) => {
            if (debt.id === debtId) {
              return {
                ...debt,
                payments: [...debt.payments, newPayment],
              }
            }
            return debt
          }),
        }))
      },

      confirmPayment: (debtId, paymentId) => {
        set((state) => ({
          debts: state.debts.map((debt) => {
            if (debt.id === debtId) {
              const updatedPayments = debt.payments.map((payment) =>
                payment.id === paymentId ? { ...payment, status: "confirmed" as const } : payment,
              )
              const confirmedPayment = updatedPayments.find((p) => p.id === paymentId)
              const newPaid = debt.paid + (confirmedPayment?.amount || 0)
              const newRemaining = debt.total - newPaid
              const newStatus = newRemaining <= 0 ? "completed" : debt.status

              return {
                ...debt,
                payments: updatedPayments,
                paid: newPaid,
                remaining: newRemaining,
                status: newStatus,
              }
            }
            return debt
          }),
        }))
      },

      rejectPayment: (debtId, paymentId) => {
        set((state) => ({
          debts: state.debts.map((debt) => {
            if (debt.id === debtId) {
              return {
                ...debt,
                payments: debt.payments.map((payment) =>
                  payment.id === paymentId ? { ...payment, status: "rejected" as const } : payment,
                ),
              }
            }
            return debt
          }),
        }))
      },

      updateUser: (updates) => {
        set((state) => ({
          currentUser: { ...state.currentUser, ...updates },
        }))
      },

      updateSettings: (settings) => {
        set((state) => ({ ...state, ...settings }))
      },
    }),
    {
      name: "confiado-storage",
    },
  ),
)
