import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  currentUser: User | null
  viewMode: "creditor" | "debtor"

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
  setCurrentUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
  updateSettings: (settings: Partial<Pick<AppState, "theme" | "currency" | "language" | "notifications">>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      viewMode: "creditor",
      theme: "system",
      currency: "USD",
      language: "English",
      notifications: {
        sms: true,
        whatsapp: false,
        email: true,
      },

      // Actions
      setViewMode: (mode) => set({ viewMode: mode }),

      setCurrentUser: (user) => set({ currentUser: user }),

      updateUser: (updates) => {
        set((state) => ({
          currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
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
